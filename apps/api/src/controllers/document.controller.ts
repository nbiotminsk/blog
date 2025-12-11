import { Request, Response } from 'express';
import { DocumentService } from '../services/document.service';

const documentService = new DocumentService();

export const generateDocument = async (req: Request, res: Response) => {
  try {
    const { template_id, entity_id, payload } = req.body;
    const { record, stream } = await documentService.generate(template_id, entity_id, payload);
    
    // Set headers
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${record.generated_file_path?.split('/').pop()}"`);
    
    stream.pipe(res);
  } catch (error: unknown) {
    if (!res.headersSent) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ message });
    }
  }
};

export const listDocumentRecords = async (req: Request, res: Response) => {
  try {
    const { entity_id, template_id, status } = req.query;
    const records = await documentService.listRecords({
      entity_id: entity_id as string,
      template_id: template_id as string,
      status: status as string,
    });
    res.json(records);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};

export const getDocumentRecord = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const record = await documentService.getRecord(id);
    
    if (!record) {
      return res.status(404).json({ message: 'Document record not found' });
    }
    
    res.json(record);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message });
  }
};
