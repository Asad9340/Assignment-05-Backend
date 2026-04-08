/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import status from 'http-status';
import { EventService } from './event.service';
import catchAsync from '../../shared/catchAsync';
import { IRequestUser } from '../../interfaces/requestUser.interface';
import { sendResponse } from '../../shared/sendResponse';

const createEvent = catchAsync(async (req: Request, res: Response) => {
  const imageUrl = req.file?.path;

  const result = await EventService.createEvent(req.user as IRequestUser, {
    ...req.body,
    ...(imageUrl ? { image: imageUrl } : {}),
  });

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: 'Event created successfully',
    data: result,
  });
});

const getAllEvents = catchAsync(async (req: Request, res: Response) => {
  const result = await EventService.getAllEvents(req.query as any);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Events retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});

const getMyEvents = catchAsync(async (req: Request, res: Response) => {
  const result = await EventService.getMyEvents(req.user as IRequestUser);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'My events retrieved successfully',
    data: result,
  });
});

const getUpcomingPublicEvents = catchAsync(
  async (_req: Request, res: Response) => {
    const result = await EventService.getUpcomingPublicEvents();

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: 'Upcoming public events retrieved successfully',
      data: result,
    });
  },
);

const getSearchSuggestions = catchAsync(async (req: Request, res: Response) => {
  let result: {
    keyword: string;
    suggestions: Array<{
      text: string;
      type: 'TITLE' | 'VENUE' | 'ORGANIZER';
      hint: string;
      score: number;
    }>;
    trending: Array<{
      id: string;
      title: string;
      popularity: number;
      visibility: string;
      feeType: string;
      eventDateTime: Date;
    }>;
  };

  try {
    result = await EventService.getSearchSuggestions(req.query as any);
  } catch {
    result = {
      keyword:
        typeof req.query.q === 'string'
          ? req.query.q.trim().toLowerCase().slice(0, 60)
          : '',
      suggestions: [],
      trending: [],
    };
  }

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Event search suggestions retrieved successfully',
    data: result,
  });
});

const getPersonalizedRecommendations = catchAsync(
  async (req: Request, res: Response) => {
    const result = await EventService.getPersonalizedRecommendations(
      req.user as IRequestUser,
      req.query as any,
    );

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: 'Personalized recommendations retrieved successfully',
      data: result,
    });
  },
);

const getSingleEvent = catchAsync(async (req: Request, res: Response) => {
  const result = await EventService.getSingleEvent(
    req.params.eventId as string,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Event retrieved successfully',
    data: result,
  });
});

const updateEvent = catchAsync(async (req: Request, res: Response) => {
  const imageUrl = req.file?.path;

  const result = await EventService.updateEvent(
    req.user as IRequestUser,
    req.params.eventId as string,
    {
      ...req.body,
      ...(imageUrl ? { image: imageUrl } : {}),
    },
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Event updated successfully',
    data: result,
  });
});

const deleteEvent = catchAsync(async (req: Request, res: Response) => {
  const result = await EventService.deleteEvent(
    req.user as IRequestUser,
    req.params.eventId as string,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Event deleted successfully',
    data: result,
  });
});

export const EventController = {
  createEvent,
  getAllEvents,
  getMyEvents,
  getUpcomingPublicEvents,
  getSearchSuggestions,
  getPersonalizedRecommendations,
  getSingleEvent,
  updateEvent,
  deleteEvent,
};
