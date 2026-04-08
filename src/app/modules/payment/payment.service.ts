import httpStatus from 'http-status';
import {
  sslCommerzInitPayment,
  sslCommerzQueryTransactionByTransactionId,
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
  const rawBaseUrl =
    process.env.BACKEND_URL ||
    envVars.BETTER_AUTH_URL ||
    `http://localhost:${envVars.PORT}`;

  try {
    return new URL(rawBaseUrl).origin;
  } catch {
    return rawBaseUrl;
  }
};

const getSafeFrontendBaseUrl = (requestedOrigin?: string) => {
  const defaultOrigin = (() => {
    try {
      return new URL(envVars.FRONTEND_URL).origin;
    } catch {
      return envVars.FRONTEND_URL.replace(/\/$/, '');
    }
  })();

  if (!requestedOrigin) {
    return defaultOrigin;
  }

  const allowedOrigins = new Set([defaultOrigin, 'http://localhost:3000']);

  return allowedOrigins.has(requestedOrigin) ? requestedOrigin : defaultOrigin;
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
  requestedFrontendOrigin?: string,
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
  const frontendBaseUrl = getSafeFrontendBaseUrl(requestedFrontendOrigin);
  const encodedFrontend = encodeURIComponent(frontendBaseUrl);
  const successUrl = `${backendBaseUrl}/api/v1/payments/success?trxId=${trxId}&frontend=${encodedFrontend}`;
  const failUrl = `${backendBaseUrl}/api/v1/payments/fail?trxId=${trxId}&frontend=${encodedFrontend}`;
  const cancelUrl = `${backendBaseUrl}/api/v1/payments/cancel?trxId=${trxId}&frontend=${encodedFrontend}`;
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
    productcategory: 'Events',
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
    cus_add2: 'Dhaka',
    cus_city: 'Dhaka',
    cus_state: 'Dhaka',
    cus_postcode: '1207',
    cus_country: 'Bangladesh',
    cus_phone: '01700000000',
    num_of_item: 1,
    ship_name: user.name,
    ship_add1: 'Dhaka',
    ship_add2: 'Dhaka',
    ship_city: 'Dhaka',
    ship_state: 'Dhaka',
    ship_postcode: '1207',
    ship_country: 'Bangladesh',
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

    const failureReason = sslResponse?.failedreason || sslResponse?.status;

    throw new AppError(
      httpStatus.BAD_REQUEST,
      failureReason
        ? `Failed to initialize payment session: ${failureReason}`
        : 'Failed to initialize payment session',
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

  if (transaction.status === TransactionStatus.VALID) {
    return transaction;
  }

  const validationResponse = valId
    ? await sslCommerzValidatePayment(valId)
    : await sslCommerzQueryTransactionByTransactionId(trxId);

  if (validationResponse?.tran_id && validationResponse.tran_id !== trxId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Transaction mismatch detected');
  }

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
        valId: validationResponse.val_id || valId || null,
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

  await prisma.$transaction(async tx => {
    await tx.paymentTransaction.update({
      where: { trxId },
      data: {
        status: TransactionStatus.CANCELLED,
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

  await handlePaymentSuccess(trxId, valId, payload);

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
  if (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN) {
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
