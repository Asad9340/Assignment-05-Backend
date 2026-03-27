import { z } from 'zod';

export const createInvitationValidationSchema = z.object({
  body: z.object({
    userId: z.string().min(1),
  }),
});
