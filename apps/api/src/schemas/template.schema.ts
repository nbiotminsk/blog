import { z } from 'zod';

export const createTemplateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  format: z.enum(['docx', 'html']),
  metadata: z.record(z.string(), z.any()).optional().default({}),
});
