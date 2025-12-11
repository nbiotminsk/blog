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

export const listDuplicatesSchema = z.object({
  threshold: z.coerce.number().min(0).max(1).default(0.5),
  limit: z.coerce.number().min(1).default(20),
  page: z.coerce.number().min(1).default(1),
});

export const checkDuplicatesSchema = z.object({
  id: z.string().uuid(),
  threshold: z.coerce.number().min(0).max(1).default(0.5),
});

export const mergeEntitiesSchema = z.object({
  primaryEntityId: z.string().uuid(),
  duplicateEntityId: z.string().uuid(),
  mergedFields: z.record(z.string(), z.any()),
  categoryIds: z.array(z.string().uuid()).optional(),
  note: z.string().optional(),
}).refine(data => data.primaryEntityId !== data.duplicateEntityId, {
  message: 'Cannot merge an entity with itself',
  path: ['duplicateEntityId'],
});
