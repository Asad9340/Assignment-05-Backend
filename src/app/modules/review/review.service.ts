import status from 'http-status';
import {
  EventStatus,
  ParticipationStatus,
} from '../../../generated/prisma/enums';
import { ICreateReviewPayload, IUpdateReviewPayload } from './review.interface';
import { IRequestUser } from '../../interfaces/requestUser.interface';
import { prisma } from '../../lib/prisma';
import AppError from '../../errorHelpers/AppError';

const REVIEW_EDIT_WINDOW_DAYS = 7;

const createReview = async (
  user: IRequestUser,
  eventId: string,
  payload: ICreateReviewPayload,
) => {
  const event = await prisma.event.findFirst({
    where: {
      id: eventId,
      isDeleted: false,
    },
  });

  if (!event) {
    throw new AppError(status.NOT_FOUND, 'Event not found');
  }

  if (event.status !== EventStatus.COMPLETED) {
    throw new AppError(
      status.BAD_REQUEST,
      'You can review only after the event is completed by the owner',
    );
  }

  const participant = await prisma.eventParticipant.findFirst({
    where: {
      eventId,
      userId: user.userId,
      isDeleted: false,
      status: {
        in: [ParticipationStatus.JOINED, ParticipationStatus.APPROVED],
      },
    },
  });

  if (!participant) {
    throw new AppError(
      status.FORBIDDEN,
      'You are not allowed to review this event',
    );
  }

  const existingReview = await prisma.eventReview.findFirst({
    where: {
      eventId,
      userId: user.userId,
      isDeleted: false,
    },
  });

  if (existingReview) {
    throw new AppError(status.CONFLICT, 'You already reviewed this event');
  }

  const review = await prisma.eventReview.create({
    data: {
      eventId,
      userId: user.userId,
      rating: payload.rating,
      review: payload.review,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      event: true,
    },
  });

  return review;
};

const getEventReviews = async (eventId: string) => {
  const reviews = await prisma.eventReview.findMany({
    where: {
      eventId,
      isDeleted: false,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return reviews;
};

const getMyReviews = async (user: IRequestUser) => {
  const reviews = await prisma.eventReview.findMany({
    where: {
      userId: user.userId,
      isDeleted: false,
    },
    include: {
      event: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return reviews;
};

const updateReview = async (
  user: IRequestUser,
  reviewId: string,
  payload: IUpdateReviewPayload,
) => {
  const review = await prisma.eventReview.findFirst({
    where: {
      id: reviewId,
      isDeleted: false,
    },
    include: {
      event: true,
    },
  });

  if (!review) {
    throw new AppError(status.NOT_FOUND, 'Review not found');
  }

  if (review.userId !== user.userId) {
    throw new AppError(
      status.FORBIDDEN,
      'You are not allowed to update this review',
    );
  }

  const reviewDeadline = new Date(review.event.eventDateTime);
  reviewDeadline.setDate(reviewDeadline.getDate() + REVIEW_EDIT_WINDOW_DAYS);

  if (new Date() > reviewDeadline) {
    throw new AppError(status.BAD_REQUEST, 'Review edit period expired');
  }

  const updatedReview = await prisma.eventReview.update({
    where: {
      id: reviewId,
    },
    data: payload,
    include: {
      event: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  return updatedReview;
};

const deleteReview = async (user: IRequestUser, reviewId: string) => {
  const review = await prisma.eventReview.findFirst({
    where: {
      id: reviewId,
      isDeleted: false,
    },
    include: {
      event: true,
    },
  });

  if (!review) {
    throw new AppError(status.NOT_FOUND, 'Review not found');
  }

  if (review.userId !== user.userId) {
    throw new AppError(
      status.FORBIDDEN,
      'You are not allowed to delete this review',
    );
  }

  const reviewDeadline = new Date(review.event.eventDateTime);
  reviewDeadline.setDate(reviewDeadline.getDate() + REVIEW_EDIT_WINDOW_DAYS);

  if (new Date() > reviewDeadline) {
    throw new AppError(status.BAD_REQUEST, 'Review delete period expired');
  }

  const deletedReview = await prisma.eventReview.update({
    where: {
      id: reviewId,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });

  return deletedReview;
};

export const ReviewService = {
  createReview,
  getEventReviews,
  getMyReviews,
  updateReview,
  deleteReview,
};
