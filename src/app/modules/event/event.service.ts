/* eslint-disable @typescript-eslint/no-explicit-any */
import status from 'http-status';
import {
  EventStatus,
  EventVisibility,
  FeeType,
  Role,
} from '../../../generated/prisma/enums';
import { Event, Prisma } from '../../../generated/prisma/client';
import { ICreateEventPayload, IUpdateEventPayload } from './event.interface';
import { IQueryParams } from '../../interfaces/query.interface';
import { QueryBuilder } from '../../utils/QueryBuilder';
import {
  eventFilterableFields,
  eventSearchableFields,
  eventIncludeConfig,
} from './event.constant';
import { IRequestUser } from '../../interfaces/requestUser.interface';
import { prisma } from '../../lib/prisma';
import AppError from '../../errorHelpers/AppError';

const buildEventDateTime = (eventDate: string, eventTime: string) => {
  const dateTime = new Date(`${eventDate}T${eventTime}:00`);

  if (Number.isNaN(dateTime.getTime())) {
    throw new AppError(status.BAD_REQUEST, 'Invalid event date or time');
  }

  return dateTime;
};

const getFeeType = (registrationFee?: number) => {
  return registrationFee && registrationFee > 0 ? FeeType.PAID : FeeType.FREE;
};

const createEvent = async (
  user: IRequestUser,
  payload: ICreateEventPayload,
) => {
  const eventDateTime = buildEventDateTime(
    payload.eventDate,
    payload.eventTime,
  );
  const registrationFee = payload.registrationFee ?? 0;
  const feeType = getFeeType(registrationFee);

  const event = await prisma.event.create({
    data: {
      title: payload.title,
      description: payload.description,
      eventDateTime,
      venue: payload.venue,
      eventLink: payload.eventLink,
      visibility: payload.visibility,
      status: payload.status ?? EventStatus.ACTIVE,
      registrationFee,
      feeType,
      ownerId: user.userId,
    },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  return event;
};

const getAllEvents = async (query: IQueryParams) => {
  const queryBuilder = new QueryBuilder<
    Event,
    Prisma.EventWhereInput,
    Prisma.EventInclude
  >(prisma.event, query, {
    searchableFields: eventSearchableFields,
    filterableFields: eventFilterableFields,
  });

  const result = await queryBuilder
    .search()
    .filter()
    .where({
      isDeleted: false,
    })
    .include({
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      _count: {
        select: {
          participants: true,
          reviews: true,
        },
      },
    })
    .dynamicInclude(eventIncludeConfig)
    .paginate()
    .sort()
    .fields()
    .execute();

  return result;
};

const getMyEvents = async (user: IRequestUser) => {
  const events = await prisma.event.findMany({
    where: {
      ownerId: user.userId,
      isDeleted: false,
    },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      _count: {
        select: {
          participants: true,
          reviews: true,
          eventInvitations: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return events;
};

const getUpcomingPublicEvents = async () => {
  const events = await prisma.event.findMany({
    where: {
      isDeleted: false,
      visibility: EventVisibility.PUBLIC,
      eventDateTime: {
        gt: new Date(),
      },
    },
    orderBy: {
      eventDateTime: 'asc',
    },
    take: 9,
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  return events;
};

const getSingleEvent = async (eventId: string) => {
  const event = await prisma.event.findFirst({
    where: {
      id: eventId,
      isDeleted: false,
    },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      reviews: {
        where: {
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
      },
      _count: {
        select: {
          participants: true,
          reviews: true,
          eventInvitations: true,
        },
      },
    },
  });

  if (!event) {
    throw new AppError(status.NOT_FOUND, 'Event not found');
  }

  return event;
};

const updateEvent = async (
  user: IRequestUser,
  eventId: string,
  payload: IUpdateEventPayload,
) => {
  const existingEvent = await prisma.event.findFirst({
    where: {
      id: eventId,
      isDeleted: false,
    },
  });

  if (!existingEvent) {
    throw new AppError(status.NOT_FOUND, 'Event not found');
  }

  if (existingEvent.ownerId !== user.userId && user.role !== Role.ADMIN) {
    throw new AppError(
      status.FORBIDDEN,
      'You are not allowed to update this event',
    );
  }

  const updateData: any = {
    title: payload.title,
    description: payload.description,
    venue: payload.venue,
    eventLink: payload.eventLink,
    visibility: payload.visibility,
    status: payload.status,
  };

  if (payload.registrationFee !== undefined) {
    updateData.registrationFee = payload.registrationFee;
    updateData.feeType = getFeeType(payload.registrationFee);
  }

  if (payload.eventDate || payload.eventTime) {
    const currentDate = existingEvent.eventDateTime.toISOString().slice(0, 10);
    const currentTime = existingEvent.eventDateTime.toTimeString().slice(0, 5);

    updateData.eventDateTime = buildEventDateTime(
      payload.eventDate ?? currentDate,
      payload.eventTime ?? currentTime,
    );
  }

  const event = await prisma.event.update({
    where: {
      id: eventId,
    },
    data: updateData,
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  return event;
};

const deleteEvent = async (user: IRequestUser, eventId: string) => {
  const existingEvent = await prisma.event.findFirst({
    where: {
      id: eventId,
      isDeleted: false,
    },
  });

  if (!existingEvent) {
    throw new AppError(status.NOT_FOUND, 'Event not found');
  }

  if (existingEvent.ownerId !== user.userId && user.role !== Role.ADMIN) {
    throw new AppError(
      status.FORBIDDEN,
      'You are not allowed to delete this event',
    );
  }

  const deletedEvent = await prisma.event.update({
    where: {
      id: eventId,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });

  return deletedEvent;
};

export const EventService = {
  createEvent,
  getAllEvents,
  getMyEvents,
  getUpcomingPublicEvents,
  getSingleEvent,
  updateEvent,
  deleteEvent,
};
