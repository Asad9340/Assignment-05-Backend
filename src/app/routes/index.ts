import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { UserRoutes } from '../modules/user/user.route';
import { EventRoutes } from '../modules/event/event.route';
import { ParticipationRoutes } from '../modules/participation/participation.route';
import { InvitationRoutes } from '../modules/invitation/invitation.route';
import { ReviewRoutes } from '../modules/review/review.route';

const router = Router();

router.use('/auth', AuthRoutes);
router.use('/users', UserRoutes);
router.use('/events', EventRoutes);
router.use('/participations', ParticipationRoutes);
router.use('/invitations', InvitationRoutes);
router.use('/reviews', ReviewRoutes);

export const IndexRoutes = router;
