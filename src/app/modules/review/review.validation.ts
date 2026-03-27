import { z } from 'zod';

export const createReviewValidationSchema = z.object({
  body: z.object({
    rating: z.coerce.number().int().min(1).max(5),
    review: z.string().max(1000).optional(),
  }),
});

export const updateReviewValidationSchema = z.object({
  body: z.object({
    rating: z.coerce.number().int().min(1).max(5).optional(),
    review: z.string().max(1000).optional(),
  }),
});
