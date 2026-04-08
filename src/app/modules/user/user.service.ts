import status from 'http-status';
import { Role } from '../../../generated/prisma/enums';
import { UserStatus } from '../../../generated/prisma/enums';
import { IUpdateUserPayload } from './user.interface';
import { IRequestUser } from '../../interfaces/requestUser.interface';
import { prisma } from '../../lib/prisma';
import AppError from '../../errorHelpers/AppError';

const searchUsers = async (
  user: IRequestUser,
  query: Record<string, string | undefined>,
) => {
  const searchTerm = query.searchTerm?.trim();
  const eventId = query.eventId?.trim();

  const parsedLimit = Number(query.limit ?? '10');
  const limit = Number.isFinite(parsedLimit)
    ? Math.max(1, Math.min(30, parsedLimit))
    : 10;

  const excludedUserIds = new Set<string>([user.userId]);

  if (eventId) {
    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        isDeleted: false,
      },
      select: {
        ownerId: true,
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
        'You are not allowed to invite users for this event',
      );
    }

    excludedUserIds.add(event.ownerId);

    const [existingInvitations, existingParticipants] = await Promise.all([
      prisma.eventInvitation.findMany({
        where: {
          eventId,
          isDeleted: false,
        },
        select: {
          userId: true,
        },
      }),
      prisma.eventParticipant.findMany({
        where: {
          eventId,
          isDeleted: false,
        },
        select: {
          userId: true,
        },
      }),
    ]);

    existingInvitations.forEach(item => excludedUserIds.add(item.userId));
    existingParticipants.forEach(item => excludedUserIds.add(item.userId));
  }

  const users = await prisma.user.findMany({
    where: {
      isDeleted: false,
      status: UserStatus.ACTIVE,
      id: {
        notIn: [...excludedUserIds],
      },
      ...(searchTerm
        ? {
            OR: [
              {
                name: {
                  contains: searchTerm,
                  mode: 'insensitive',
                },
              },
              {
                email: {
                  contains: searchTerm,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : {}),
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  });

  return users;
};

const getMe = async (user: IRequestUser) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id: user.userId,
    },
    include: {
      events: {
        where: {
          isDeleted: false,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      eventParticipants: {
        where: {
          isDeleted: false,
        },
        include: {
          event: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      eventReviews: {
        where: {
          isDeleted: false,
        },
        include: {
          event: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (
    !existingUser ||
    existingUser.isDeleted ||
    existingUser.status === UserStatus.DELETED
  ) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  }

  return existingUser;
};

const updateMe = async (user: IRequestUser, payload: IUpdateUserPayload) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id: user.userId,
    },
  });

  if (
    !existingUser ||
    existingUser.isDeleted ||
    existingUser.status === UserStatus.DELETED
  ) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  }

  if (!payload || Object.keys(payload).length === 0) {
    throw new AppError(status.BAD_REQUEST, 'No data provided');
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: user.userId,
    },
    data: payload,
  });

  return updatedUser;
};

const deleteMe = async (user: IRequestUser) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id: user.userId,
    },
  });

  if (
    !existingUser ||
    existingUser.isDeleted ||
    existingUser.status === UserStatus.DELETED
  ) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  }

  const deletedUser = await prisma.user.update({
    where: {
      id: user.userId,
    },
    data: {
      status: UserStatus.DELETED,
      isDeleted: true,
      deletedAt: new Date(),
    },
  });

  return deletedUser;
};

export const UserService = {
  searchUsers,
  getMe,
  updateMe,
  deleteMe,
};
