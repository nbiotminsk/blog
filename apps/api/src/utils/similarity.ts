/**
 * Normalize phone number for comparison
 * Removes all non-digit characters except leading +
 */
export function normalizePhone(phone: string | null | undefined): string {
  if (!phone) return '';
  return phone.replace(/[^\d+]/g, '');
}

/**
 * Calculate similarity score between 0 and 1 using levenshtein distance
 */
export function calculateSimilarity(str1: string, str2: string): number {
  if (!str1 || !str2) return 0;
  
  str1 = str1.toLowerCase();
  str2 = str2.toLowerCase();
  
  if (str1 === str2) return 1;
  
  const maxLength = Math.max(str1.length, str2.length);
  if (maxLength === 0) return 1;
  
  const distance = levenshteinDistance(str1, str2);
  return 1 - distance / maxLength;
}

/**
 * Calculate levenshtein distance between two strings
 */
export function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));
  
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  
  return dp[m][n];
}

export interface DuplicatePair {
  id1: string;
  name1: string;
  email1: string;
  phone1?: string;
  id2: string;
  name2: string;
  email2: string;
  phone2?: string;
  nameSimilarity: number;
  emailMatch: boolean;
  phoneMatch: boolean;
  compositeScore: number;
}

/**
 * Calculate duplicate score for a pair of entities
 * Factors: name similarity (40%), email match (35%), phone match (25%)
 */
export function calculateDuplicateScore(
  name1: string,
  email1: string,
  phone1: string | undefined,
  name2: string,
  email2: string,
  phone2: string | undefined,
): number {
  const nameSimilarity = calculateSimilarity(name1, name2);
  const emailMatch = email1.toLowerCase() === email2.toLowerCase();
  
  const normalizedPhone1 = normalizePhone(phone1);
  const normalizedPhone2 = normalizePhone(phone2);
  const phoneMatch = normalizedPhone1 !== '' && normalizedPhone1 === normalizedPhone2;
  
  // Weighted scoring: name 40%, email 35%, phone 25%
  let score = nameSimilarity * 0.4;
  score += (emailMatch ? 1 : 0) * 0.35;
  score += (phoneMatch ? 1 : 0) * 0.25;
  
  return score;
}
