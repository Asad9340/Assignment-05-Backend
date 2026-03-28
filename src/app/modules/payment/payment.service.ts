import httpStatus from 'http-status';
import {
  sslCommerzInitPayment,
  sslCommerzValidatePayment,
} from './payment.utils';
import { TInitiatePaymentPayload } from './payment.interface';
import { prisma } from '../../lib/prisma';
import AppError from '../../errorHelpers/AppError';
import {
  FeeType,
  ParticipationStatus,
  PaymentStatus,
  Role,
  TransactionStatus,
  UserStatus,
} from '../../../generated/prisma/enums';
import { PaymentTransaction, Prisma } from '../../../generated/prisma/client';
import { envVars } from '../../config/env.config';
import { IQueryParams } from '../../interfaces/query.interface';
import { IRequestUser } from '../../interfaces/requestUser.interface';
import { QueryBuilder } from '../../utils/QueryBuilder';
import {
  paymentFilterableFields,
  paymentIncludeConfig,
  paymentSearchableFields,
} from './payment.constant';

const getBackendBaseUrl = () => {
  try {
    return new URL(envVars.BETTER_AUTH_URL).origin;
  } catch {
    return envVars.BETTER_AUTH_URL;
  }
};

const toJsonValue = (payload: unknown): Prisma.InputJsonValue | undefined => {
  if (payload === undefined) {
    return undefined;
  }

  return payload as Prisma.InputJsonValue;
};

const initiateEventPayment = async (
  userId: string,
  payload: TInitiatePaymentPayload,
) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      isDeleted: false,
      status: 'ACTIVE',
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const event = await prisma.event.findFirst({
    where: {
      id: payload.eventId,
      isDeleted: false,
    },
    include: {
      owner: true,
    },
  });

  if (!event) {
    throw new AppError(httpStatus.NOT_FOUND, 'Event not found');
  }

  if (event.ownerId === userId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Owner cannot join own event');
  }

  if (event.feeType !== FeeType.PAID || event.registrationFee <= 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This event does not require payment',
    );
  }

  const existingParticipant = await prisma.eventParticipant.findUnique({
    where: {
      eventId_userId: {
        eventId: event.id,
        userId,
      },
    },
  });

  if (
    existingParticipant?.status === ParticipationStatus.APPROVED ||
    existingParticipant?.status === ParticipationStatus.JOINED
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, 'You already joined this event');
  }

  if (existingParticipant?.status === ParticipationStatus.BANNED) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are banned from this event');
  }

  const participant = existingParticipant
    ? await prisma.eventParticipant.update({
        where: { id: existingParticipant.id },
        data: {
          status: ParticipationStatus.PENDING,
          paymentStatus: PaymentStatus.PENDING,
          paidAmount: null,
        },
      })
    : await prisma.eventParticipant.create({
        data: {
          eventId: event.id,
          userId,
          status: ParticipationStatus.PENDING,
          paymentStatus: PaymentStatus.PENDING,
        },
      });

  const trxId = `planora_${Date.now()}_${participant.id.slice(0, 8)}`;

  const backendBaseUrl = getBackendBaseUrl();
  const successUrl = `${backendBaseUrl}/api/v1/payments/success?trxId=${trxId}`;
  const failUrl = `${backendBaseUrl}/api/v1/payments/fail?trxId=${trxId}`;
  const cancelUrl = `${backendBaseUrl}/api/v1/payments/cancel?trxId=${trxId}`;
  const ipnUrl = `${backendBaseUrl}/api/v1/payments/ipn`;

  await prisma.paymentTransaction.create({
    data: {
      trxId,
      userId,
      eventId: event.id,
      eventParticipantId: participant.id,
      amount: event.registrationFee,
      currency: 'BDT',
      status: TransactionStatus.INITIATED,
      successUrl,
      failUrl,
      cancelUrl,
    },
  });

  const sslPayload = {
    store_id: envVars.SSLCOMMERZ.SSL_STORE_ID,
    store_passwd: envVars.SSLCOMMERZ.SSL_STORE_PASSWORD,
    total_amount: Number(event.registrationFee),
    currency: 'BDT',
    tran_id: trxId,
    success_url: successUrl,
    fail_url: failUrl,
    cancel_url: cancelUrl,
    ipn_url: ipnUrl,
    shipping_method: 'NO',
    product_name: event.title,
    product_category: 'Event Registration',
    product_profile: 'general',
    cus_name: user.name,
    cus_email: user.email,
    cus_add1: 'Dhaka',
    cus_city: 'Dhaka',
    cus_country: 'Bangladesh',
    cus_phone: '01700000000',
  };

  const sslResponse = await sslCommerzInitPayment(sslPayload);

  if (!sslResponse?.GatewayPageURL && !sslResponse?.gatewayPageURL) {
    await prisma.paymentTransaction.update({
      where: { trxId },
      data: {
        status: TransactionStatus.FAILED,
        gatewayResponse: toJsonValue(sslResponse),
      },
    });

    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to initialize payment session',
    );
  }

  await prisma.paymentTransaction.update({
    where: { trxId },
    data: {
      gatewayResponse: toJsonValue(sslResponse),
    },
  });

  return {
    paymentUrl: sslResponse.GatewayPageURL || sslResponse.gatewayPageURL,
    trxId,
    participantId: participant.id,
  };
};

const handlePaymentSuccess = async (
  trxId: string,
  valId?: string,
  payload?: Record<string, unknown>,
) => {
  const transaction = await prisma.paymentTransaction.findUnique({
    where: { trxId },
    include: {
      eventParticipant: true,
      event: true,
    },
  });

  if (!transaction) {
    throw new AppError(httpStatus.NOT_FOUND, 'Transaction not found');
  }

  if (!valId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'val_id is missing');
  }

  const validationResponse = await sslCommerzValidatePayment(valId);

  const validatedStatus = validationResponse?.status;

  if (validatedStatus !== 'VALID' && validatedStatus !== 'VALIDATED') {
    await prisma.paymentTransaction.update({
      where: { trxId },
      data: {
        status: TransactionStatus.FAILED,
        verifyPayload: toJsonValue(validationResponse),
      },
    });

    if (transaction.eventParticipantId) {
      await prisma.eventParticipant.update({
        where: { id: transaction.eventParticipantId },
        data: {
          paymentStatus: PaymentStatus.FAILED,
        },
      });
    }

    throw new AppError(httpStatus.BAD_REQUEST, 'Payment validation failed');
  }

  await prisma.$transaction(async tx => {
    await tx.paymentTransaction.update({
      where: { trxId },
      data: {
        status: TransactionStatus.VALID,
        valId,
        gatewayTransactionId: validationResponse.tran_id || trxId,
        bankTransactionId: validationResponse.bank_tran_id,
        cardType: validationResponse.card_type,
        storeAmount: validationResponse.store_amount
          ? Number(validationResponse.store_amount)
          : null,
        verifyPayload: toJsonValue(validationResponse),
        gatewayResponse: toJsonValue(payload),
      },
    });

    if (transaction.eventParticipantId) {
      await tx.eventParticipant.update({
        where: { id: transaction.eventParticipantId },
        data: {
          paymentStatus: PaymentStatus.PAID,
          paidAmount: transaction.amount,
          status: ParticipationStatus.PENDING,
        },
      });
    }
  });

  return transaction;
};

const handlePaymentFail = async (
  trxId: string,
  payload?: Record<string, unknown>,
) => {
  const transaction = await prisma.paymentTransaction.findUnique({
    where: { trxId },
  });

  if (!transaction) {
    throw new AppError(httpStatus.NOT_FOUND, 'Transaction not found');
  }

  await prisma.$transaction(async tx => {
    await tx.paymentTransaction.update({
      where: { trxId },
      data: {
        status: TransactionStatus.FAILED,
        gatewayResponse: toJsonValue(payload),
      },
    });

    if (transaction.eventParticipantId) {
      await tx.eventParticipant.update({
        where: { id: transaction.eventParticipantId },
        data: {
          paymentStatus: PaymentStatus.FAILED,
        },
      });
    }
  });

  return null;
};

const handlePaymentCancel = async (
  trxId: string,
  payload?: Record<string, unknown>,
) => {
  const transaction = await prisma.paymentTransaction.findUnique({
    where: { trxId },
  });

  if (!transaction) {
    throw new AppError(httpStatus.NOT_FOUND, 'Transaction not found');
  }

  await prisma.paymentTransaction.update({
    where: { trxId },
    data: {
      status: TransactionStatus.CANCELLED,
      gatewayResponse: toJsonValue(payload),
    },
  });

  return null;
};

const handlePaymentIPN = async (payload: Record<string, unknown>) => {
  const trxId = payload.tran_id as string;
  const valId = payload.val_id as string | undefined;

  if (!trxId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'tran_id is missing in IPN');
  }

  const transaction = await prisma.paymentTransaction.findUnique({
    where: { trxId },
  });

  if (!transaction) {
    throw new AppError(httpStatus.NOT_FOUND, 'Transaction not found');
  }

  if (transaction.status === TransactionStatus.VALID) {
    return null;
  }

  if (valId) {
    await handlePaymentSuccess(trxId, valId, payload);
  }

  return null;
};

const validateExistingTransaction = async (trxId: string) => {
  const transaction = await prisma.paymentTransaction.findUnique({
    where: { trxId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      event: {
        select: {
          id: true,
          title: true,
          eventDateTime: true,
          ownerId: true,
          feeType: true,
          registrationFee: true,
        },
      },
      eventParticipant: {
        select: {
          id: true,
          status: true,
          paymentStatus: true,
          paidAmount: true,
        },
      },
    },
  });

  if (!transaction) {
    throw new AppError(httpStatus.NOT_FOUND, 'Transaction not found');
  }

  return transaction;
};

const getMyPayments = async (user: IRequestUser, query: IQueryParams = {}) => {
  const queryBuilder = new QueryBuilder<
    PaymentTransaction,
    Prisma.PaymentTransactionWhereInput,
    Prisma.PaymentTransactionInclude
  >(prisma.paymentTransaction, query, {
    searchableFields: paymentSearchableFields,
    filterableFields: paymentFilterableFields,
  });

  const result = await queryBuilder
    .search()
    .filter()
    .where({
      userId: user.userId,
    })
    .include({
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      event: {
        select: {
          id: true,
          title: true,
          eventDateTime: true,
          ownerId: true,
          feeType: true,
          registrationFee: true,
        },
      },
      eventParticipant: {
        select: {
          id: true,
          status: true,
          paymentStatus: true,
          paidAmount: true,
        },
      },
    })
    .dynamicInclude(paymentIncludeConfig)
    .paginate()
    .sort()
    .fields()
    .execute();

  return result;
};

const getAllPayments = async (user: IRequestUser, query: IQueryParams = {}) => {
  if (user.role !== Role.ADMIN) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Only admin can access all payments',
    );
  }

  const queryBuilder = new QueryBuilder<
    PaymentTransaction,
    Prisma.PaymentTransactionWhereInput,
    Prisma.PaymentTransactionInclude
  >(prisma.paymentTransaction, query, {
    searchableFields: paymentSearchableFields,
    filterableFields: paymentFilterableFields,
  });

  const result = await queryBuilder
    .search()
    .filter()
    .where({
      user: {
        isDeleted: false,
        status: {
          not: UserStatus.DELETED,
        },
      },
      event: {
        isDeleted: false,
      },
    })
    .include({
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          status: true,
        },
      },
      event: {
        select: {
          id: true,
          title: true,
          eventDateTime: true,
          ownerId: true,
          visibility: true,
          feeType: true,
          registrationFee: true,
        },
      },
      eventParticipant: {
        select: {
          id: true,
          status: true,
          paymentStatus: true,
          paidAmount: true,
        },
      },
    })
    .dynamicInclude(paymentIncludeConfig)
    .paginate()
    .sort()
    .fields()
    .execute();

  return result;
};

export const PaymentService = {
  initiateEventPayment,
  handlePaymentSuccess,
  handlePaymentFail,
  handlePaymentCancel,
  handlePaymentIPN,
  validateExistingTransaction,
  getMyPayments,
  getAllPayments,
};
