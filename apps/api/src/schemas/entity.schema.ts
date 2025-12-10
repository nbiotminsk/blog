import { z } from 'zod';

export const createEntitySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  external_reference: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional().default({}),
  categoryIds: z.array(z.string().uuid()).optional(),
});

export const updateEntitySchema = createEntitySchema.partial();

export const searchEntitySchema = z.object({
  q: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  limit: z.coerce.number().min(1).default(20),
  offset: z.coerce.number().min(0).default(0),
});
