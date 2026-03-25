import status from 'http-status';
import { UserStatus } from '../../../generated/prisma/enums';
import { IUpdateUserPayload } from './user.interface';
import { IRequestUser } from '../../interfaces/requestUser.interface';
import { prisma } from '../../lib/prisma';
import AppError from '../../errorHelpers/AppError';

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

  if (Object.keys(payload).length === 0) {
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
  getMe,
  updateMe,
  deleteMe,
};
