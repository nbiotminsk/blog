import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import fs from 'fs/promises';
import { logger } from '../utils/logger';

export interface ParsedTemplate {
  placeholders: string[];
  metadata: {
    filename: string;
    size: number;
    mimeType: string;
  };
}

export async function parseDocxTemplate(
  filePath: string,
  filename: string,
  mimeType: string
): Promise<ParsedTemplate> {
  logger.debug({ filePath, filename }, 'Parsing DOCX template');

  const content = await fs.readFile(filePath);
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  const placeholders = extractPlaceholders(doc.getFullText());
  const stats = await fs.stat(filePath);

  logger.info(
    { filename, placeholderCount: placeholders.length },
    'DOCX template parsed'
  );

  return {
    placeholders,
    metadata: {
      filename,
      size: stats.size,
      mimeType,
    },
  };
}

export async function parseHtmlTemplate(
  filePath: string,
  filename: string,
  mimeType: string
): Promise<ParsedTemplate> {
  logger.debug({ filePath, filename }, 'Parsing HTML template');

  const content = await fs.readFile(filePath, 'utf-8');
  const placeholders = extractPlaceholders(content);
  const stats = await fs.stat(filePath);

  logger.info(
    { filename, placeholderCount: placeholders.length },
    'HTML template parsed'
  );

  return {
    placeholders,
    metadata: {
      filename,
      size: stats.size,
      mimeType,
    },
  };
}

function extractPlaceholders(text: string): string[] {
  const matches = new Set<string>();
  
  const doubleRegex = /\{\{([^}]+)\}\}/g;
  let match;
  while ((match = doubleRegex.exec(text)) !== null) {
    const placeholder = match[1].trim();
    if (placeholder) {
      matches.add(placeholder);
    }
  }
  
  const carboneRegex = /\{d\.([^}]+)\}/g;
  while ((match = carboneRegex.exec(text)) !== null) {
    const placeholder = match[1].trim();
    if (placeholder) {
      matches.add(placeholder);
    }
  }

  return Array.from(matches).sort();
}

export async function parseTemplate(
  filePath: string,
  filename: string,
  mimeType: string
): Promise<ParsedTemplate> {
  const lowerFilename = filename.toLowerCase();

  if (
    lowerFilename.endsWith('.docx') ||
    mimeType ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return parseDocxTemplate(filePath, filename, mimeType);
  } else if (
    lowerFilename.endsWith('.html') ||
    lowerFilename.endsWith('.htm') ||
    mimeType === 'text/html'
  ) {
    return parseHtmlTemplate(filePath, filename, mimeType);
  } else {
    throw new Error(
      `Unsupported template format: ${filename}. Supported formats are DOCX and HTML.`
    );
  }
}
