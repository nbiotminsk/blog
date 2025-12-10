import carbone from 'carbone';
import path from 'path';
import { config } from '../config';
import { logger } from '../utils/logger';
import { getMimeType, getFileExtension } from '../utils/fileOps';

carbone.set({
  tempPath: config.carboneTempDir,
});

function carboneRenderAsync(
  templatePath: string,
  data: Record<string, unknown>,
  options: { convertTo?: string }
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    carbone.render(
      templatePath,
      data,
      options,
      (err: Error | null, result: Buffer) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
}

export interface RenderOptions {
  convertTo?: string;
}

export interface RenderedDocument {
  buffer: Buffer;
  base64: string;
  filename: string;
  mimeType: string;
}

export async function renderDocument(
  templatePath: string,
  data: Record<string, unknown>,
  originalFilename: string,
  options?: RenderOptions
): Promise<RenderedDocument> {
  logger.debug(
    { templatePath, originalFilename, options },
    'Rendering document'
  );

  const carboneOptions: { convertTo?: string } = {};
  if (options?.convertTo) {
    carboneOptions.convertTo = options.convertTo;
  }

  try {
    const buffer = await carboneRenderAsync(templatePath, data, carboneOptions);

    const outputExtension = options?.convertTo
      ? `.${options.convertTo}`
      : getFileExtension(originalFilename);
    const baseFilename = path.basename(
      originalFilename,
      getFileExtension(originalFilename)
    );
    const outputFilename = `${baseFilename}_generated${outputExtension}`;
    const mimeType = getMimeType(outputExtension);

    const base64 = buffer.toString('base64');

    logger.info(
      { originalFilename, outputFilename, size: buffer.length },
      'Document rendered successfully'
    );

    return {
      buffer,
      base64,
      filename: outputFilename,
      mimeType,
    };
  } catch (error) {
    logger.error({ error, templatePath }, 'Failed to render document');
    throw new Error(
      `Document rendering failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
