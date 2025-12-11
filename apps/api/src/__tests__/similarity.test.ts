import { calculateSimilarity, calculateDuplicateScore, levenshteinDistance, normalizePhone } from '../utils/similarity';

describe('Similarity Utils', () => {
  describe('normalizePhone', () => {
    it('should remove non-digit characters except +', () => {
      expect(normalizePhone('+1-555-0123')).toBe('+15550123');
      expect(normalizePhone('(555) 012-3456')).toBe('5550123456');
      expect(normalizePhone(null)).toBe('');
      expect(normalizePhone(undefined)).toBe('');
    });
  });

  describe('levenshteinDistance', () => {
    it('should calculate correct distance', () => {
      expect(levenshteinDistance('kitten', 'sitting')).toBe(3);
      expect(levenshteinDistance('saturday', 'sunday')).toBe(3);
      expect(levenshteinDistance('abc', 'abc')).toBe(0);
    });
  });

  describe('calculateSimilarity', () => {
    it('should return 1 for identical strings', () => {
      expect(calculateSimilarity('john', 'john')).toBe(1);
    });

    it('should return 0 for empty strings', () => {
      expect(calculateSimilarity('', '')).toBe(1);
      expect(calculateSimilarity('a', '')).toBe(0);
    });

    it('should be case insensitive', () => {
      expect(calculateSimilarity('John', 'john')).toBe(1);
    });
  });

  describe('calculateDuplicateScore', () => {
    it('should return 1 for identical entities', () => {
      const score = calculateDuplicateScore(
        'John Doe',
        'john@example.com',
        '+1-555-0123',
        'John Doe',
        'john@example.com',
        '+1-555-0123'
      );
      expect(score).toBe(1);
    });

    it('should return 0.35 for email-only match', () => {
      const score = calculateDuplicateScore(
        'John Doe',
        'john@example.com',
        undefined,
        'Jane Smith',
        'john@example.com',
        undefined
      );
      expect(score).toBe(0.35);
    });

    it('should consider multiple factors', () => {
      const score = calculateDuplicateScore(
        'John Doe',
        'john@example.com',
        '+1-555-0123',
        'John Doe',
        'jane@example.com',
        '+1-555-0123'
      );
      expect(score).toBeGreaterThan(0.5);
      expect(score).toBeLessThan(1);
    });
  });
});
