import { Router } from 'express';
import { Role } from '../../../generated/prisma/enums';
import { checkAuth } from '../../middleware/checkAuth';
import { validateRequest } from '../../middleware/validateRequest';
import { PaymentController } from './payment.controller';
import { PaymentValidation } from './payment.validation';

const router = Router();

router.post(
  '/initiate',
  checkAuth(Role.ADMIN, Role.USER),
  validateRequest(PaymentValidation.initiatePaymentSchema),
  PaymentController.initiatePayment,
);

router.get(
  '/validate',
  checkAuth(Role.ADMIN, Role.USER),
  validateRequest(PaymentValidation.transactionQuerySchema),
  PaymentController.validateTransaction,
);

router.get('/success', PaymentController.paymentSuccess);
router.post('/success', PaymentController.paymentSuccess);
router.get('/fail', PaymentController.paymentFail);
router.post('/fail', PaymentController.paymentFail);
router.get('/cancel', PaymentController.paymentCancel);
router.post('/cancel', PaymentController.paymentCancel);
router.post('/ipn', PaymentController.paymentIPN);

router.get(
  '/me',
  checkAuth(Role.ADMIN, Role.USER),
  validateRequest(PaymentValidation.transactionListQuerySchema),
  PaymentController.getMyPayments,
);

router.get(
  '/',
  checkAuth(Role.ADMIN),
  validateRequest(PaymentValidation.transactionListQuerySchema),
  PaymentController.getAllPayments,
);

export const PaymentRoutes = router;
