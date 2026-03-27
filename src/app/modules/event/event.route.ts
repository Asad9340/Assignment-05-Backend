import { Router } from 'express';
import { Role } from '../../../generated/prisma/enums';
import { EventController } from './event.controller';
import { checkAuth } from '../../middleware/checkAuth';
import { validateRequest } from '../../middleware/validateRequest';
import {
  createEventValidationSchema,
  updateEventValidationSchema,
} from './event.validation';

const router = Router();

router.get('/', EventController.getAllEvents);
router.get('/upcoming', EventController.getUpcomingPublicEvents);
router.get('/:eventId', EventController.getSingleEvent);

router.post(
  '/',
  checkAuth(Role.ADMIN, Role.USER),
  validateRequest(createEventValidationSchema),
  EventController.createEvent,
);

router.patch(
  '/:eventId',
  checkAuth(Role.ADMIN, Role.USER),
  validateRequest(updateEventValidationSchema),
  EventController.updateEvent,
);

router.delete(
  '/:eventId',
  checkAuth(Role.ADMIN, Role.USER),
  EventController.deleteEvent,
);

export const EventRoutes = router;
