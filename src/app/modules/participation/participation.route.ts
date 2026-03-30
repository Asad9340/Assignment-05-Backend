import { Router } from 'express';
import { Role } from '../../../generated/prisma/enums';
import { ParticipationController } from './participation.controller';
import { checkAuth } from '../../middleware/checkAuth';

const router = Router();

router.post(
  '/events/:eventId/join',
  checkAuth(Role.ADMIN, Role.USER),
  ParticipationController.joinEvent,
);

router.get(
  '/me',
  checkAuth(Role.ADMIN, Role.USER),
  ParticipationController.getMyParticipations,
);
router.get(
  '/approvals/me',
  checkAuth(Role.ADMIN, Role.USER),
  ParticipationController.getMyPendingApprovals,
);
router.get(
  '/events/:eventId',
  checkAuth(Role.ADMIN, Role.USER),
  ParticipationController.getEventParticipants,
);

router.patch(
  '/:participantId/accept',
  checkAuth(Role.ADMIN, Role.USER),
  ParticipationController.acceptParticipant,
);

router.patch(
  '/:participantId/approve',
  checkAuth(Role.ADMIN, Role.USER),
  ParticipationController.approveParticipant,
);

router.patch(
  '/:participantId/reject',
  checkAuth(Role.ADMIN, Role.USER),
  ParticipationController.rejectParticipant,
);

router.patch(
  '/:participantId/ban',
  checkAuth(Role.ADMIN, Role.USER),
  ParticipationController.banParticipant,
);

export const ParticipationRoutes = router;
