import status from 'http-status';
import { EventInvitation, Prisma } from '../../../generated/prisma/client';
import {
  EventStatus,
  FeeType,
  ParticipationStatus,
  PaymentStatus,
  Role,
  UserStatus,
} from '../../../generated/prisma/enums';
import { ICreateInvitationPayload } from './invitation.interface';
import { InvitationStatus } from './invitation.constant';
import { IQueryParams } from '../../interfaces/query.interface';
import { IRequestUser } from '../../interfaces/requestUser.interface';
import { prisma } from '../../lib/prisma';
import { QueryBuilder } from '../../utils/QueryBuilder';
import AppError from '../../errorHelpers/AppError';

const invitationSearchableFields = ['event.title', 'event.venue'];
const invitationFilterableFields = ['status', 'eventId', 'invitedById'];

const inviteUser = async (
  user: IRequestUser,
  eventId: string,
  payload: ICreateInvitationPayload,
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

  if (event.status !== EventStatus.ACTIVE) {
    throw new AppError(
      status.BAD_REQUEST,
      'Cannot invite users to a non-active event',
    );
  }

  if (
    event.ownerId !== user.userId &&
    user.role !== Role.ADMIN &&
    user.role !== Role.SUPER_ADMIN
  ) {
    throw new AppError(status.FORBIDDEN, 'You are not allowed to invite users');
  }

  if (payload.userId === event.ownerId) {
    throw new AppError(status.BAD_REQUEST, 'Event owner cannot be invited');
  }

  const invitedUser = await prisma.user.findUnique({
    where: {
      id: payload.userId,
    },
  });

  if (
    !invitedUser ||
    invitedUser.isDeleted ||
    invitedUser.status === UserStatus.DELETED
  ) {
    throw new AppError(status.NOT_FOUND, 'Invited user not found');
  }

  const existingInvitation = await prisma.eventInvitation.findFirst({
    where: {
      eventId,
      userId: payload.userId,
      isDeleted: false,
    },
  });

  if (existingInvitation) {
    throw new AppError(status.CONFLICT, 'Invitation already exists');
  }

  const existingParticipant = await prisma.eventParticipant.findFirst({
    where: {
      eventId,
      userId: payload.userId,
      isDeleted: false,
    },
  });

  if (existingParticipant) {
    throw new AppError(
      status.CONFLICT,
      'User already joined or requested this event',
    );
  }

  const invitation = await prisma.eventInvitation.create({
    data: {
      eventId,
      userId: payload.userId,
      invitedById: user.userId,
      status: InvitationStatus.PENDING,
    },
    include: {
      event: true,
    },
  });

  return invitation;
};

const getMyInvitations = async (
  user: IRequestUser,
  query: IQueryParams = {},
) => {
  const queryBuilder = new QueryBuilder<
    EventInvitation,
    Prisma.EventInvitationWhereInput,
    Prisma.EventInvitationInclude
  >(prisma.eventInvitation, query, {
    searchableFields: invitationSearchableFields,
    filterableFields: invitationFilterableFields,
  });

  const result = await queryBuilder
    .search()
    .filter()
    .where({
      userId: user.userId,
      isDeleted: false,
    })
    .include({
      event: true,
    })
    .paginate()
    .sort()
    .fields()
    .execute();

  const invitations = result.data;
  const inviterIds = [...new Set(invitations.map(item => item.invitedById))];

  const inviters = inviterIds.length
    ? await prisma.user.findMany({
        where: {
          id: {
            in: inviterIds,
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      })
    : [];

  const inviterMap = new Map(inviters.map(item => [item.id, item]));

  return {
    data: invitations.map(item => ({
      ...item,
      invitedByUser: inviterMap.get(item.invitedById) || null,
    })),
    meta: result.meta,
  };
};

const acceptInvitation = async (user: IRequestUser, invitationId: string) => {
  const invitation = await prisma.eventInvitation.findFirst({
    where: {
      id: invitationId,
      userId: user.userId,
      isDeleted: false,
    },
    include: {
      event: true,
    },
  });

  if (!invitation) {
    throw new AppError(status.NOT_FOUND, 'Invitation not found');
  }

  if (invitation.status !== InvitationStatus.PENDING) {
    throw new AppError(
      status.BAD_REQUEST,
      'Only pending invitations can be accepted',
    );
  }

  if (invitation.event.status !== EventStatus.ACTIVE) {
    throw new AppError(
      status.BAD_REQUEST,
      'This event is not accepting new participants',
    );
  }

  const existingParticipant = await prisma.eventParticipant.findFirst({
    where: {
      eventId: invitation.eventId,
      userId: user.userId,
      isDeleted: false,
    },
  });

  if (existingParticipant) {
    throw new AppError(status.CONFLICT, 'Participant already exists');
  }

  const result = await prisma.$transaction(async tx => {
    await tx.eventInvitation.update({
      where: {
        id: invitation.id,
      },
      data: {
        status: InvitationStatus.ACCEPTED,
      },
    });

    const participant = await tx.eventParticipant.create({
      data: {
        eventId: invitation.eventId,
        userId: user.userId,
        status: ParticipationStatus.PENDING,
        paymentStatus:
          invitation.event.feeType === FeeType.PAID
            ? PaymentStatus.PENDING
            : PaymentStatus.PAID,
        paidAmount: invitation.event.feeType === FeeType.PAID ? null : 0,
      },
      include: {
        event: true,
      },
    });

    return participant;
  });

  return result;
};

const rejectInvitation = async (user: IRequestUser, invitationId: string) => {
  const invitation = await prisma.eventInvitation.findFirst({
    where: {
      id: invitationId,
      userId: user.userId,
      isDeleted: false,
    },
  });

  if (!invitation) {
    throw new AppError(status.NOT_FOUND, 'Invitation not found');
  }

  if (invitation.status !== InvitationStatus.PENDING) {
    throw new AppError(
      status.BAD_REQUEST,
      'Only pending invitations can be rejected',
    );
  }

  const updatedInvitation = await prisma.eventInvitation.update({
    where: {
      id: invitationId,
    },
    data: {
      status: InvitationStatus.REJECTED,
    },
  });

  return updatedInvitation;
};

export const InvitationService = {
  inviteUser,
  getMyInvitations,
  acceptInvitation,
  rejectInvitation,
};
