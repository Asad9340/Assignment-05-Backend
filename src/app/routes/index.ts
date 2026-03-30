import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { UserRoutes } from '../modules/user/user.route';
import { EventRoutes } from '../modules/event/event.route';
import { ParticipationRoutes } from '../modules/participation/participation.route';
import { InvitationRoutes } from '../modules/invitation/invitation.route';
import { ReviewRoutes } from '../modules/review/review.route';
import { PaymentRoutes } from '../modules/payment/payment.route';
import { DashboardRoutes } from '../modules/dashboard/dashboard.route';
import { AdminRoutes } from '../modules/admin/admin.route';

const router = Router();

router.use('/auth', AuthRoutes);
router.use('/users', UserRoutes);
router.use('/events', EventRoutes);
router.use('/participations', ParticipationRoutes);
router.use('/invitations', InvitationRoutes);
router.use('/reviews', ReviewRoutes);
router.use('/payments', PaymentRoutes);
router.use('/dashboard', DashboardRoutes);
router.use('/admin', AdminRoutes);

export const IndexRoutes = router;
