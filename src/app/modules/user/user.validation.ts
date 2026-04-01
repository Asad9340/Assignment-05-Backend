import { z } from 'zod';

export const updateUserValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    image: z.string().url().optional(),
  }),
});
