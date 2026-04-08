import { Router } from 'express';
import { Role } from '../../../generated/prisma/enums';
import { EventController } from './event.controller';
import { checkAuth } from '../../middleware/checkAuth';
import { validateRequest } from '../../middleware/validateRequest';
import { multerUpload } from '../../config/multer.config';
import {
  createEventValidationSchema,
  updateEventValidationSchema,
} from './event.validation';

const router = Router();

router.get('/', EventController.getAllEvents);
router.get(
  '/my-events',
  checkAuth(Role.ADMIN, Role.USER),
  EventController.getMyEvents,
);
router.get('/upcoming', EventController.getUpcomingPublicEvents);
router.get('/search-suggestions', EventController.getSearchSuggestions);
router.get(
  '/recommendations',
  checkAuth(Role.ADMIN, Role.USER),
  EventController.getPersonalizedRecommendations,
);
router.get('/:eventId', EventController.getSingleEvent);

router.post(
  '/',
  checkAuth(Role.ADMIN, Role.USER),
  multerUpload.single('image'),
  validateRequest(createEventValidationSchema),
  EventController.createEvent,
);

router.patch(
  '/:eventId',
  checkAuth(Role.ADMIN, Role.USER),
  multerUpload.single('image'),
  validateRequest(updateEventValidationSchema),
  EventController.updateEvent,
);

router.delete(
  '/:eventId',
  checkAuth(Role.ADMIN, Role.USER),
  EventController.deleteEvent,
);

export const EventRoutes = router;
