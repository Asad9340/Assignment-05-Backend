/* eslint-disable @typescript-eslint/no-explicit-any */
import status from 'http-status';
import {
  EventStatus,
  FeeType,
  EventVisibility,
  ParticipationStatus,
  PaymentStatus,
  Role,
} from '../../../generated/prisma/enums';
import { EventParticipant, Prisma } from '../../../generated/prisma/client';
import { IQueryParams } from '../../interfaces/query.interface';
import { IRequestUser } from '../../interfaces/requestUser.interface';
import { prisma } from '../../lib/prisma';
import { QueryBuilder } from '../../utils/QueryBuilder';
import AppError from '../../errorHelpers/AppError';

const participationSearchableFields = ['event.title', 'event.venue'];
const participationFilterableFields = ['status', 'paymentStatus'];

const joinEvent = async (user: IRequestUser, eventId: string) => {
  const event = await prisma.event.findFirst({
    where: {
      id: eventId,
      isDeleted: false,
    },
  });

  if (!event) {
    throw new AppError(status.NOT_FOUND, 'Event not found');
  }

  if (event.status !== EventStatus.ACTIVE) {
    throw new AppError(
      status.BAD_REQUEST,
      'This event is not accepting new participants',
    );
  }

  if (event.ownerId === user.userId) {
    throw new AppError(status.BAD_REQUEST, 'Event owner cannot join own event');
  }

  const existingParticipant = await prisma.eventParticipant.findFirst({
    where: {
      eventId,
      userId: user.userId,
      isDeleted: false,
    },
  });

  if (existingParticipant) {
    throw new AppError(
      status.CONFLICT,
      'You already requested or joined this event',
    );
  }

  const participantData: any = {
    eventId,
    userId: user.userId,
    status: ParticipationStatus.PENDING,
  };

  if (
    event.visibility === EventVisibility.PUBLIC &&
    event.feeType === FeeType.PAID
  ) {
    participantData.paymentStatus = PaymentStatus.PENDING;
  }

  if (
    event.visibility === EventVisibility.PRIVATE &&
    event.feeType === FeeType.FREE
  ) {
    participantData.paymentStatus = PaymentStatus.PAID;
    participantData.paidAmount = 0;
  }

  if (
    event.visibility === EventVisibility.PRIVATE &&
    event.feeType === FeeType.PAID
  ) {
    participantData.paymentStatus = PaymentStatus.PENDING;
  }

  if (
    event.visibility === EventVisibility.PUBLIC &&
    event.feeType === FeeType.FREE
  ) {
    participantData.paymentStatus = PaymentStatus.PAID;
    participantData.paidAmount = 0;
  }

  const participant = await prisma.eventParticipant.create({
    data: participantData,
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

  return participant;
};

const getMyParticipations = async (
  user: IRequestUser,
  query: IQueryParams = {},
) => {
  const queryBuilder = new QueryBuilder<
    EventParticipant,
    Prisma.EventParticipantWhereInput,
    Prisma.EventParticipantInclude
  >(prisma.eventParticipant, query, {
    searchableFields: participationSearchableFields,
    filterableFields: participationFilterableFields,
  });

  const result = await queryBuilder
    .search()
    .filter()
    .where({
      userId: user.userId,
      isDeleted: false,
    })
    .include({
      event: {
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
      },
    })
    .paginate()
    .sort()
    .fields()
    .execute();

  return result;
};

const getEventParticipants = async (
  user: IRequestUser,
  eventId: string,
  query: IQueryParams = {},
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

  if (
    event.ownerId !== user.userId &&
    user.role !== Role.ADMIN &&
    user.role !== Role.SUPER_ADMIN
  ) {
    throw new AppError(
      status.FORBIDDEN,
      'You are not allowed to view participants',
    );
  }

  const queryBuilder = new QueryBuilder<
    EventParticipant,
    Prisma.EventParticipantWhereInput,
    Prisma.EventParticipantInclude
  >(prisma.eventParticipant, query, {
    searchableFields: ['user.name', 'user.email'],
    filterableFields: participationFilterableFields,
  });

  const result = await queryBuilder
    .search()
    .filter()
    .where({
      eventId,
      isDeleted: false,
    })
    .include({
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          status: true,
        },
      },
    })
    .paginate()
    .sort()
    .fields()
    .execute();

  return result;
};

const getMyPendingApprovals = async (user: IRequestUser) => {
  const approvals = await prisma.eventParticipant.findMany({
    where: {
      isDeleted: false,
      status: ParticipationStatus.PENDING,
      event: {
        ownerId: user.userId,
        isDeleted: false,
      },
    },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          feeType: true,
          status: true,
        },
      },
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

  return approvals;
};

const approveParticipant = async (
  user: IRequestUser,
  participantId: string,
) => {
  const participant = await prisma.eventParticipant.findFirst({
    where: {
      id: participantId,
      isDeleted: false,
    },
    include: {
      event: true,
    },
  });

  if (!participant) {
    throw new AppError(status.NOT_FOUND, 'Participant not found');
  }

  if (participant.event.status !== EventStatus.ACTIVE) {
    throw new AppError(
      status.BAD_REQUEST,
      'You cannot update participation on a non-active event',
    );
  }

  if (
    participant.event.ownerId !== user.userId &&
    user.role !== Role.ADMIN &&
    user.role !== Role.SUPER_ADMIN
  ) {
    throw new AppError(
      status.FORBIDDEN,
      'You are not allowed to approve this participant',
    );
  }

  if (participant.status !== ParticipationStatus.PENDING) {
    throw new AppError(
      status.BAD_REQUEST,
      'Only pending requests can be approved',
    );
  }

  if (
    participant.event.feeType === FeeType.PAID &&
    participant.paymentStatus !== PaymentStatus.PAID
  ) {
    throw new AppError(
      status.BAD_REQUEST,
      'Payment is required before approval',
    );
  }

  const updatedParticipant = await prisma.eventParticipant.update({
    where: {
      id: participantId,
    },
    data: {
      status: ParticipationStatus.JOINED,
      approvedAt: new Date(),
    },
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

  return updatedParticipant;
};

const rejectParticipant = async (user: IRequestUser, participantId: string) => {
  const participant = await prisma.eventParticipant.findFirst({
    where: {
      id: participantId,
      isDeleted: false,
    },
    include: {
      event: true,
    },
  });

  if (!participant) {
    throw new AppError(status.NOT_FOUND, 'Participant not found');
  }

  if (
    participant.event.ownerId !== user.userId &&
    user.role !== Role.ADMIN &&
    user.role !== Role.SUPER_ADMIN
  ) {
    throw new AppError(
      status.FORBIDDEN,
      'You are not allowed to reject this participant',
    );
  }

  const updatedParticipant = await prisma.eventParticipant.update({
    where: {
      id: participantId,
    },
    data: {
      status: ParticipationStatus.REJECTED,
      rejectedAt: new Date(),
    },
  });

  return updatedParticipant;
};

const banParticipant = async (user: IRequestUser, participantId: string) => {
  const participant = await prisma.eventParticipant.findFirst({
    where: {
      id: participantId,
      isDeleted: false,
    },
    include: {
      event: true,
    },
  });

  if (!participant) {
    throw new AppError(status.NOT_FOUND, 'Participant not found');
  }

  if (
    participant.event.ownerId !== user.userId &&
    user.role !== Role.ADMIN &&
    user.role !== Role.SUPER_ADMIN
  ) {
    throw new AppError(
      status.FORBIDDEN,
      'You are not allowed to ban this participant',
    );
  }

  const updatedParticipant = await prisma.eventParticipant.update({
    where: {
      id: participantId,
    },
    data: {
      status: ParticipationStatus.BANNED,
      bannedAt: new Date(),
    },
  });

  return updatedParticipant;
};

export const ParticipationService = {
  joinEvent,
  getMyParticipations,
  getEventParticipants,
  getMyPendingApprovals,
  approveParticipant,
  rejectParticipant,
  banParticipant,
};
