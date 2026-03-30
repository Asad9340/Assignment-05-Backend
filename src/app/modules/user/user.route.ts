import { Router } from 'express';
import { Role } from '../../../generated/prisma/enums';
import { UserController } from './user.controller';
import { updateUserValidationSchema } from './user.validation';
import { validateRequest } from '../../middleware/validateRequest';
import { checkAuth } from '../../middleware/checkAuth';

const router = Router();

router.get(
  '/search',
  checkAuth(Role.ADMIN, Role.USER),
  UserController.searchUsers,
);
router.get('/me', checkAuth(Role.ADMIN, Role.USER), UserController.getMe);
router.patch(
  '/me',
  checkAuth(Role.ADMIN, Role.USER),
  validateRequest(updateUserValidationSchema),
  UserController.updateMe,
);
router.delete('/me', checkAuth(Role.ADMIN, Role.USER), UserController.deleteMe);

export const UserRoutes = router;
