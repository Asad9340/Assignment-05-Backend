import { Router } from 'express';
import { Role } from '../../../generated/prisma/enums';
import { ReviewController } from './review.controller';
import {
  createReviewValidationSchema,
  updateReviewValidationSchema,
} from './review.validation';
import { checkAuth } from '../../middleware/checkAuth';
import { validateRequest } from '../../middleware/validateRequest';

const router = Router();

router.get('/events/:eventId', ReviewController.getEventReviews);
router.get(
  '/me',
  checkAuth(Role.ADMIN, Role.USER),
  ReviewController.getMyReviews,
);

router.post(
  '/events/:eventId',
  checkAuth(Role.ADMIN, Role.USER),
  validateRequest(createReviewValidationSchema),
  ReviewController.createReview,
);

router.patch(
  '/:reviewId',
  checkAuth(Role.ADMIN, Role.USER),
  validateRequest(updateReviewValidationSchema),
  ReviewController.updateReview,
);

router.delete(
  '/:reviewId',
  checkAuth(Role.ADMIN, Role.USER),
  ReviewController.deleteReview,
);

export const ReviewRoutes = router;
