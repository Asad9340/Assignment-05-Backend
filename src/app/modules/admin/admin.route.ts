import { Router } from 'express';
import { Role } from '../../../generated/prisma/enums';
import { AdminController } from './admin.controller';
import { checkAuth } from '../../middleware/checkAuth';

const router = Router();

router.get('/stats', checkAuth(Role.ADMIN), AdminController.getStats);
router.get('/users', checkAuth(Role.ADMIN), AdminController.getAllUsers);
router.get('/events', checkAuth(Role.ADMIN), AdminController.getAllEvents);

router.patch(
  '/users/:userId/block',
  checkAuth(Role.ADMIN),
  AdminController.blockUser,
);
router.patch(
  '/users/:userId/unblock',
  checkAuth(Role.ADMIN),
  AdminController.unblockUser,
);
router.delete(
  '/users/:userId',
  checkAuth(Role.ADMIN),
  AdminController.deleteUser,
);
router.delete(
  '/events/:eventId',
  checkAuth(Role.ADMIN),
  AdminController.deleteEvent,
);

export const AdminRoutes = router;
