import { z } from 'zod';

const chatRoleSchema = z.enum(['user', 'assistant']);

export const chatbotMessageValidationSchema = z.object({
  body: z.object({
    message: z.string().trim().min(1).max(1200),
    history: z
      .array(
        z.object({
          role: chatRoleSchema,
          content: z.string().trim().min(1).max(1200),
        }),
      )
      .max(12)
      .optional(),
  }),
});
