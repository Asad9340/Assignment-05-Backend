import { Request, Response } from 'express';
import status from 'http-status';
import { ReviewService } from './review.service';
import catchAsync from '../../shared/catchAsync';
import { IRequestUser } from '../../interfaces/requestUser.interface';
import { sendResponse } from '../../shared/sendResponse';

const createReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.createReview(
    req.user as IRequestUser,
    req.params.eventId as string,
    req.body,
  );

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: 'Review created successfully',
    data: result,
  });
});

const getEventReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.getEventReviews(
    req.params.eventId as string,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Event reviews retrieved successfully',
    data: result,
  });
});

const getMyReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.getMyReviews(req.user as IRequestUser);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'My reviews retrieved successfully',
    data: result,
  });
});

const updateReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.updateReview(
    req.user as IRequestUser,
    req.params.reviewId as string,
    req.body,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Review updated successfully',
    data: result,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.deleteReview(
    req.user as IRequestUser,
    req.params.reviewId as string,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Review deleted successfully',
    data: result,
  });
});

export const ReviewController = {
  createReview,
  getEventReviews,
  getMyReviews,
  updateReview,
  deleteReview,
};
