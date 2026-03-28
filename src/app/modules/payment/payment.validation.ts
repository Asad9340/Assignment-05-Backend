import { z } from 'zod';
import {
  PaymentGateway,
  TransactionStatus,
} from '../../../generated/prisma/enums';

const initiatePaymentSchema = z.object({
  body: z.object({
    eventId: z
      .string()
      .min(1, 'eventId is required')
      .uuid('eventId must be a valid uuid'),
  }),
});

const transactionQuerySchema = z.object({
  query: z.object({
    trxId: z.string().min(1, 'trxId is required'),
  }),
});

const transactionListQuerySchema = z.object({
  query: z
    .object({
      searchTerm: z.string().optional(),
      page: z.string().optional(),
      limit: z.string().optional(),
      sortBy: z.string().optional(),
      sortOrder: z.enum(['asc', 'desc']).optional(),
      fields: z.string().optional(),
      include: z.string().optional(),
      trxId: z.string().optional(),
      userId: z.string().uuid('userId must be a valid uuid').optional(),
      eventId: z.string().uuid('eventId must be a valid uuid').optional(),
      eventParticipantId: z
        .string()
        .uuid('eventParticipantId must be a valid uuid')
        .optional(),
      status: z.nativeEnum(TransactionStatus).optional(),
      gateway: z.nativeEnum(PaymentGateway).optional(),
      currency: z.string().optional(),
    })
    .passthrough(),
});

export const PaymentValidation = {
  initiatePaymentSchema,
  transactionQuerySchema,
  transactionListQuerySchema,
};
