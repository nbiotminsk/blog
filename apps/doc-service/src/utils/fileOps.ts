import fs from 'fs/promises';
import path from 'path';
import { logger } from './logger';

export async function ensureDir(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
    logger.debug({ dirPath }, 'Created directory');
  }
}

export async function cleanupFile(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath);
    logger.debug({ filePath }, 'Cleaned up file');
  } catch (error) {
    logger.warn({ filePath, error }, 'Failed to cleanup file');
  }
}

export async function cleanupFiles(filePaths: string[]): Promise<void> {
  await Promise.all(filePaths.map((fp) => cleanupFile(fp)));
}

export function generateTempFilename(
  prefix: string,
  extension: string
): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `${prefix}_${timestamp}_${random}${extension}`;
}

export async function readFileBuffer(filePath: string): Promise<Buffer> {
  return await fs.readFile(filePath);
}

export async function writeFileBuffer(
  filePath: string,
  buffer: Buffer
): Promise<void> {
  await fs.writeFile(filePath, buffer);
}

export function getFileExtension(filename: string): string {
  return path.extname(filename).toLowerCase();
}

export function getMimeType(extension: string): string {
  const mimeTypes: Record<string, string> = {
    '.docx':
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.pdf': 'application/pdf',
    '.html': 'text/html',
    '.txt': 'text/plain',
    '.odt': 'application/vnd.oasis.opendocument.text',
  };
  return mimeTypes[extension] || 'application/octet-stream';
}
