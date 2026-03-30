import { Router } from 'express';
import { Role } from '../../../generated/prisma/enums';
import { DashboardController } from './dashboard.controller';
import { checkAuth } from '../../middleware/checkAuth';

const router = Router();

router.get(
  '/summary',
  checkAuth(Role.ADMIN, Role.USER),
  DashboardController.getSummary,
);
router.get(
  '/my-events',
  checkAuth(Role.ADMIN, Role.USER),
  DashboardController.getMyEvents,
);
router.get(
  '/pending-invitations',
  checkAuth(Role.ADMIN, Role.USER),
  DashboardController.getPendingInvitations,
);
router.get(
  '/my-reviews',
  checkAuth(Role.ADMIN, Role.USER),
  DashboardController.getMyReviews,
);
router.get(
  '/my-requests',
  checkAuth(Role.ADMIN, Role.USER),
  DashboardController.getMyRequests,
);
router.get(
  '/pending-approvals',
  checkAuth(Role.ADMIN, Role.USER),
  DashboardController.getPendingApprovals,
);
router.get(
  '/my-event-status-summary',
  checkAuth(Role.ADMIN, Role.USER),
  DashboardController.getMyEventStatusSummary,
);

export const DashboardRoutes = router;
