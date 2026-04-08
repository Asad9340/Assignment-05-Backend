import { Request, Response } from 'express';
import status from 'http-status';
import { Role } from '../../../generated/prisma/enums';
import { envVars } from '../../config/env.config';
import AppError from '../../errorHelpers/AppError';
import { IQueryParams } from '../../interfaces/query.interface';
import { IRequestUser } from '../../interfaces/requestUser.interface';
import { sendResponse } from '../../shared/sendResponse';
import catchAsync from '../../shared/catchAsync';
import { PAYMENT_MESSAGE } from './payment.constant';
import { PaymentService } from './payment.service';

const buildFrontendRedirectUrl = (
  path: '/payment/success' | '/payment/fail' | '/payment/cancel' | '/dashboard',
  trxId?: string,
  frontendBaseUrl?: string,
) => {
  const frontendUrl = (frontendBaseUrl || envVars.FRONTEND_URL).replace(
    /\/$/,
    '',
  );
  const url = new URL(path, frontendUrl);

  if (trxId) {
    url.searchParams.set('trxId', trxId);
  }

  return url.toString();
};

const getSafeFrontendBaseUrl = (requestedUrl?: string) => {
  const defaultOrigin = (() => {
    try {
      return new URL(envVars.FRONTEND_URL).origin;
    } catch {
      return envVars.FRONTEND_URL.replace(/\/$/, '');
    }
  })();

  if (!requestedUrl) {
    return defaultOrigin;
  }

  try {
    const origin = new URL(requestedUrl).origin;
    const allowedOrigins = new Set([defaultOrigin, 'http://localhost:3000']);

    return allowedOrigins.has(origin) ? origin : defaultOrigin;
  } catch {
    return defaultOrigin;
  }
};

const resolveFrontendBaseUrlFromRequest = (req: Request) => {
  const callbackFrontend = req.query.frontend as string | undefined;

  if (callbackFrontend) {
    return getSafeFrontendBaseUrl(callbackFrontend);
  }

  const headerOrigin = req.get('origin') || undefined;
  const headerReferer = req.get('referer') || undefined;

  return getSafeFrontendBaseUrl(headerOrigin || headerReferer);
};

const getTrxIdFromCallback = (req: Request) => {
  return (req.query.trxId ||
    req.query.tran_id ||
    req.body?.trxId ||
    req.body?.tran_id) as string | undefined;
};

const initiatePayment = catchAsync(async (req: Request, res: Response) => {
  const frontendBaseUrl = resolveFrontendBaseUrlFromRequest(req);

  const result = await PaymentService.initiateEventPayment(
    (req.user as IRequestUser).userId,
    req.body,
    frontendBaseUrl,
  );

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: PAYMENT_MESSAGE.INITIATED,
    data: result,
  });
});

const paymentSuccess = async (req: Request, res: Response) => {
  const trxId = getTrxIdFromCallback(req);
  const valId = (req.query.val_id || req.body?.val_id) as string | undefined;
  const frontendBaseUrl = resolveFrontendBaseUrlFromRequest(req);

  try {
    if (!trxId) {
      throw new AppError(status.BAD_REQUEST, 'trxId is required');
    }

    await PaymentService.handlePaymentSuccess(trxId, valId, {
      ...(req.query as Record<string, unknown>),
      ...(req.body as Record<string, unknown>),
    });

    return res.redirect(
      buildFrontendRedirectUrl('/dashboard', trxId, frontendBaseUrl),
    );
  } catch {
    return res.redirect(
      buildFrontendRedirectUrl('/payment/fail', trxId, frontendBaseUrl),
    );
  }
};

const paymentFail = async (req: Request, res: Response) => {
  const trxId = getTrxIdFromCallback(req);
  const frontendBaseUrl = resolveFrontendBaseUrlFromRequest(req);

  try {
    if (!trxId) {
      throw new AppError(status.BAD_REQUEST, 'trxId is required');
    }

    await PaymentService.handlePaymentFail(trxId, {
      ...(req.query as Record<string, unknown>),
      ...(req.body as Record<string, unknown>),
    });
  } catch {
    // Fall through to frontend redirect.
  }

  return res.redirect(
    buildFrontendRedirectUrl('/payment/fail', trxId, frontendBaseUrl),
  );
};

const paymentCancel = async (req: Request, res: Response) => {
  const trxId = getTrxIdFromCallback(req);
  const frontendBaseUrl = resolveFrontendBaseUrlFromRequest(req);

  try {
    if (!trxId) {
      throw new AppError(status.BAD_REQUEST, 'trxId is required');
    }

    await PaymentService.handlePaymentCancel(trxId, {
      ...(req.query as Record<string, unknown>),
      ...(req.body as Record<string, unknown>),
    });
  } catch {
    // Fall through to frontend redirect.
  }

  return res.redirect(
    buildFrontendRedirectUrl('/payment/cancel', trxId, frontendBaseUrl),
  );
};

const paymentIPN = catchAsync(async (req: Request, res: Response) => {
  await PaymentService.handlePaymentIPN(req.body as Record<string, unknown>);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: PAYMENT_MESSAGE.IPN_RECEIVED,
    data: null,
  });
});

const validateTransaction = catchAsync(async (req: Request, res: Response) => {
  const trxId = req.query.trxId as string;
  const user = req.user as IRequestUser;

  const result = await PaymentService.validateExistingTransaction(trxId);

  if (
    user.role !== Role.ADMIN &&
    user.role !== Role.SUPER_ADMIN &&
    result.userId !== user.userId
  ) {
    throw new AppError(
      status.FORBIDDEN,
      'You are not allowed to view this transaction',
    );
  }

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: PAYMENT_MESSAGE.VERIFIED,
    data: result,
  });
});

const getMyPayments = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.getMyPayments(
    req.user as IRequestUser,
    req.query as IQueryParams,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'My payments retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});

const getAllPayments = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.getAllPayments(
    req.user as IRequestUser,
    req.query as IQueryParams,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'All payments retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});

export const PaymentController = {
  initiatePayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  paymentIPN,
  validateTransaction,
  getMyPayments,
  getAllPayments,
};
