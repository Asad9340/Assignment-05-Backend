/* eslint-disable @typescript-eslint/no-explicit-any */
import status from 'http-status';
import {
  EventStatus,
  EventVisibility,
  FeeType,
  InvitationStatus,
  ParticipationStatus,
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

const normalizeText = (value: string) => value.trim().toLowerCase();

const getPopularityScore = (participants: number, reviews: number) => {
  return participants * 2 + reviews * 3;
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

const getSearchSuggestions = async (query: { q?: string; limit?: string }) => {
  const keyword =
    typeof query.q === 'string' ? normalizeText(query.q).slice(0, 60) : '';
  const requestedLimit = Number(query.limit || 8);
  const limit = Number.isFinite(requestedLimit)
    ? Math.max(3, Math.min(12, requestedLimit))
    : 8;

  const events = await prisma.event.findMany({
    where: {
      isDeleted: false,
      status: EventStatus.ACTIVE,
    },
    orderBy: [{ eventDateTime: 'asc' }, { createdAt: 'desc' }],
    take: 80,
    include: {
      owner: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          participants: true,
          reviews: true,
        },
      },
    },
  });

  const suggestionsMap = new Map<
    string,
    {
      text: string;
      type: 'TITLE' | 'VENUE' | 'ORGANIZER';
      hint: string;
      score: number;
    }
  >();

  const registerSuggestion = (
    rawText: string | null | undefined,
    type: 'TITLE' | 'VENUE' | 'ORGANIZER',
    hint: string,
    baseScore: number,
  ) => {
    if (!rawText) {
      return;
    }

    const text = rawText.trim();
    if (!text) {
      return;
    }

    const normalized = normalizeText(text);
    const startsWith = keyword ? normalized.startsWith(keyword) : false;
    const includes = keyword ? normalized.includes(keyword) : false;
    const hasWordPrefix = keyword
      ? normalized.split(/\s+/).some(word => word.startsWith(keyword))
      : false;

    if (keyword && !startsWith && !includes && !hasWordPrefix) {
      return;
    }

    let relevance = baseScore;

    if (startsWith) {
      relevance += 14;
    }

    if (hasWordPrefix) {
      relevance += 9;
    }

    if (includes) {
      relevance += 5;
    }

    const existing = suggestionsMap.get(normalized);
    if (!existing || relevance > existing.score) {
      suggestionsMap.set(normalized, {
        text,
        type,
        hint,
        score: relevance,
      });
    }
  };

  for (const event of events) {
    const popularity = getPopularityScore(
      event._count.participants,
      event._count.reviews,
    );

    registerSuggestion(event.title, 'TITLE', 'Event title', popularity + 4);
    registerSuggestion(event.venue, 'VENUE', 'Event venue', popularity + 2);
    registerSuggestion(
      event.owner?.name,
      'ORGANIZER',
      'Organizer name',
      popularity + 1,
    );
  }

  const suggestions = Array.from(suggestionsMap.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  const trending = events
    .map(event => ({
      id: event.id,
      title: event.title,
      popularity: getPopularityScore(
        event._count.participants,
        event._count.reviews,
      ),
      visibility: event.visibility,
      feeType: event.feeType,
      eventDateTime: event.eventDateTime,
    }))
    .sort((a, b) => {
      if (b.popularity !== a.popularity) {
        return b.popularity - a.popularity;
      }

      return a.eventDateTime.getTime() - b.eventDateTime.getTime();
    })
    .slice(0, 5);

  return {
    keyword,
    suggestions,
    trending,
  };
};

const getPersonalizedRecommendations = async (
  user: IRequestUser,
  query: { limit?: string },
) => {
  const requestedLimit = Number(query.limit || 6);
  const limit = Number.isFinite(requestedLimit)
    ? Math.max(3, Math.min(12, requestedLimit))
    : 6;

  const [participations, invitations, reviews] = await Promise.all([
    prisma.eventParticipant.findMany({
      where: {
        userId: user.userId,
        isDeleted: false,
      },
      include: {
        event: {
          select: {
            id: true,
            visibility: true,
            feeType: true,
          },
        },
      },
    }),
    prisma.eventInvitation.findMany({
      where: {
        userId: user.userId,
        isDeleted: false,
      },
      include: {
        event: {
          select: {
            id: true,
            visibility: true,
            feeType: true,
          },
        },
      },
    }),
    prisma.eventReview.findMany({
      where: {
        userId: user.userId,
        isDeleted: false,
      },
      include: {
        event: {
          select: {
            id: true,
            visibility: true,
            feeType: true,
          },
        },
      },
    }),
  ]);

  const visibilityScores: Record<EventVisibility, number> = {
    PUBLIC: 1,
    PRIVATE: 1,
  };

  const feeTypeScores: Record<FeeType, number> = {
    FREE: 1,
    PAID: 1,
  };

  const excludedEventIds = new Set<string>();

  for (const item of participations) {
    excludedEventIds.add(item.eventId);

    const signalWeight =
      item.status === ParticipationStatus.JOINED ||
      item.status === ParticipationStatus.APPROVED
        ? 3
        : item.status === ParticipationStatus.PENDING
          ? 1
          : 0;

    visibilityScores[item.event.visibility] += signalWeight;
    feeTypeScores[item.event.feeType] += signalWeight;
  }

  for (const item of invitations) {
    excludedEventIds.add(item.eventId);

    const signalWeight =
      item.status === InvitationStatus.ACCEPTED
        ? 2
        : item.status === InvitationStatus.PENDING
          ? 1
          : 0;

    visibilityScores[item.event.visibility] += signalWeight;
    feeTypeScores[item.event.feeType] += signalWeight;
  }

  for (const item of reviews) {
    excludedEventIds.add(item.eventId);

    visibilityScores[item.event.visibility] += 2;
    feeTypeScores[item.event.feeType] += 2;
  }

  const preferredVisibility =
    visibilityScores.PRIVATE > visibilityScores.PUBLIC ? 'PRIVATE' : 'PUBLIC';

  const preferredFeeType =
    feeTypeScores.PAID > feeTypeScores.FREE ? 'PAID' : 'FREE';

  const candidateEvents = await prisma.event.findMany({
    where: {
      isDeleted: false,
      status: EventStatus.ACTIVE,
      ownerId: {
        not: user.userId,
      },
      eventDateTime: {
        gt: new Date(),
      },
      ...(excludedEventIds.size
        ? {
            id: {
              notIn: Array.from(excludedEventIds),
            },
          }
        : {}),
    },
    orderBy: [{ eventDateTime: 'asc' }, { createdAt: 'desc' }],
    take: 60,
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
        },
      },
    },
  });

  const recommendations = candidateEvents
    .map(event => {
      const popularityScore = getPopularityScore(
        event._count.participants,
        event._count.reviews,
      );
      const preferenceScore =
        visibilityScores[event.visibility] + feeTypeScores[event.feeType];

      const daysUntilEvent = Math.floor(
        (event.eventDateTime.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
      );

      const freshnessScore =
        daysUntilEvent <= 14 ? 3 : daysUntilEvent <= 45 ? 2 : 1;

      const aiScore = preferenceScore * 3 + popularityScore + freshnessScore;

      return {
        ...event,
        aiScore,
        aiReason: `Matches your ${event.visibility.toLowerCase()} and ${event.feeType.toLowerCase()} activity pattern.`,
      };
    })
    .sort((a, b) => b.aiScore - a.aiScore)
    .slice(0, limit);

  return {
    insights: {
      preferredVisibility,
      preferredFeeType,
      signalStrength: {
        participations: participations.length,
        invitations: invitations.length,
        reviews: reviews.length,
      },
    },
    recommendations,
  };
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
  getSearchSuggestions,
  getPersonalizedRecommendations,
  getSingleEvent,
  updateEvent,
  deleteEvent,
};
