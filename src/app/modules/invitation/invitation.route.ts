import { Router } from 'express';
import { Role } from '../../../generated/prisma/enums';
import { InvitationController } from './invitation.controller';
import { createInvitationValidationSchema } from './invitation.validation';
import { checkAuth } from '../../middleware/checkAuth';
import { validateRequest } from '../../middleware/validateRequest';

const router = Router();

router.post(
  '/events/:eventId',
  checkAuth(Role.ADMIN, Role.USER),
  validateRequest(createInvitationValidationSchema),
  InvitationController.inviteUser,
);

router.get(
  '/me',
  checkAuth(Role.ADMIN, Role.USER),
  InvitationController.getMyInvitations,
);
router.patch(
  '/:invitationId/accept',
  checkAuth(Role.ADMIN, Role.USER),
  InvitationController.acceptInvitation,
);
router.patch(
  '/:invitationId/reject',
  checkAuth(Role.ADMIN, Role.USER),
  InvitationController.rejectInvitation,
);

export const InvitationRoutes = router;
