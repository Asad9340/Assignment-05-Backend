/* eslint-disable @typescript-eslint/no-explicit-any */
import status from 'http-status';
import { UserStatus } from '../../../generated/prisma/enums';
import { prisma } from '../../lib/prisma';
import AppError from '../../errorHelpers/AppError';

const getStats = async () => {
  const [totalUsers, totalEvents, totalReviews, totalParticipants] =
    await Promise.all([
      prisma.user.count({
        where: {
          isDeleted: false,
        },
      }),
      prisma.event.count({
        where: {
          isDeleted: false,
        },
      }),
      prisma.eventReview.count({
        where: {
          isDeleted: false,
        },
      }),
      prisma.eventParticipant.count({
        where: {
          isDeleted: false,
        },
      }),
    ]);

  return {
    totalUsers,
    totalEvents,
    totalReviews,
    totalParticipants,
  };
};

const getAllUsers = async (query: any) => {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 10);
  const skip = (page - 1) * limit;
  const searchTerm = query.searchTerm || '';

  const where: any = {
    isDeleted: false,
  };

  if (searchTerm) {
    where.OR = [
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
    ];
  }

  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: {
            events: true,
            eventParticipants: true,
            eventReviews: true,
          },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data,
  };
};

const getAllEvents = async (query: any) => {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 10);
  const skip = (page - 1) * limit;
  const searchTerm = query.searchTerm || '';

  const where: any = {
    isDeleted: false,
  };

  if (searchTerm) {
    where.OR = [
      {
        title: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
      {
        owner: {
          name: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
      },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.event.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
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
    }),
    prisma.event.count({ where }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data,
  };
};

const blockUser = async (userId: string) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!existingUser || existingUser.isDeleted) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status: UserStatus.BLOCKED,
    },
  });

  return updatedUser;
};

const unblockUser = async (userId: string) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!existingUser || existingUser.isDeleted) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status: UserStatus.ACTIVE,
    },
  });

  return updatedUser;
};

const deleteUser = async (userId: string) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!existingUser || existingUser.isDeleted) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status: UserStatus.DELETED,
      isDeleted: true,
      deletedAt: new Date(),
    },
  });

  return updatedUser;
};

const deleteEvent = async (eventId: string) => {
  const existingEvent = await prisma.event.findFirst({
    where: {
      id: eventId,
      isDeleted: false,
    },
  });

  if (!existingEvent) {
    throw new AppError(status.NOT_FOUND, 'Event not found');
  }

  const updatedEvent = await prisma.event.update({
    where: {
      id: eventId,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });

  return updatedEvent;
};

export const AdminService = {
  getStats,
  getAllUsers,
  getAllEvents,
  blockUser,
  unblockUser,
  deleteUser,
  deleteEvent,
};
