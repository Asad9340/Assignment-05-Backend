import { z } from 'zod';
import { EventStatus, EventVisibility } from '../../../generated/prisma/enums';

export const createEventValidationSchema = z.object({
  body: z
    .object({
      title: z.string().min(3).max(255),
      description: z.string().min(10),
      eventDate: z.string().min(1),
      eventTime: z.string().min(1),
      venue: z.string().optional(),
      eventLink: z.string().url().optional(),
      visibility: z.nativeEnum(EventVisibility),
      status: z.nativeEnum(EventStatus).optional(),
      registrationFee: z.coerce.number().min(0).optional(),
    })
    .refine(data => data.venue || data.eventLink, {
      message: 'Either venue or eventLink is required',
      path: ['venue'],
    }),
});

export const updateEventValidationSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(255).optional(),
    description: z.string().min(10).optional(),
    eventDate: z.string().optional(),
    eventTime: z.string().optional(),
    venue: z.string().optional(),
    eventLink: z.string().url().optional(),
    visibility: z.nativeEnum(EventVisibility).optional(),
    status: z.nativeEnum(EventStatus).optional(),
    registrationFee: z.coerce.number().min(0).optional(),
  }),
});
