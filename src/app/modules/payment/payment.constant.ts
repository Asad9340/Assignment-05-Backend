export const PAYMENT_MESSAGE = {
  INITIATED: 'Payment session initiated successfully',
  VERIFIED: 'Payment verified successfully',
  FAILED: 'Payment failed',
  CANCELLED: 'Payment cancelled',
  IPN_RECEIVED: 'IPN received successfully',
};

export const paymentSearchableFields = [
  'trxId',
  'bankTransactionId',
  'gatewayTransactionId',
  'valId',
  'user.name',
  'user.email',
  'event.title',
];

export const paymentFilterableFields = [
  'trxId',
  'status',
  'gateway',
  'currency',
  'userId',
  'eventId',
  'eventParticipantId',
];

export const paymentIncludeConfig = {
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
      feeType: true,
      registrationFee: true,
      ownerId: true,
    },
  },
  eventParticipant: {
    select: {
      id: true,
      status: true,
      paymentStatus: true,
      paidAmount: true,
      requestedAt: true,
    },
  },
};
