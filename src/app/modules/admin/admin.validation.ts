import { Role, UserStatus } from '../../../generated/prisma/enums';
import { z } from 'zod';

export const updateUserByAdminValidationSchema = z.object({
  body: z
    .object({
      name: z.string().min(2).max(100).optional(),
      image: z.string().url().optional(),
      role: z.nativeEnum(Role).optional(),
      status: z.nativeEnum(UserStatus).optional(),
    })
    .refine(data => Object.keys(data).length > 0, {
      message: 'No data provided',
    }),
});
