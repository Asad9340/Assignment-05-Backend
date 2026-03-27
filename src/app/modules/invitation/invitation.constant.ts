export const InvitationStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
} as const;

export type TInvitationStatus =
  (typeof InvitationStatus)[keyof typeof InvitationStatus];
