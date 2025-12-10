import { z } from 'zod';

export const generateDocumentSchema = z.object({
  template_id: z.string().uuid(),
  entity_id: z.string().uuid(),
  payload: z.record(z.string(), z.any()).default({}),
});
