/* eslint-disable @typescript-eslint/no-explicit-any */
import status from 'http-status';
import { Role, UserStatus } from '../../../generated/prisma/enums';
import { prisma } from '../../lib/prisma';
import AppError from '../../errorHelpers/AppError';
import { IRequestUser } from '../../interfaces/requestUser.interface';

type TAdminUpdateUserPayload = {
  name?: string;
  image?: string;
  role?: Role;
  status?: UserStatus;
};

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

const getReportsSummary = async () => {
  const [
    totalUsers,
    activeUsers,
    blockedUsers,
    deletedUsers,
    totalEvents,
    privateEvents,
    publicEvents,
    paidEvents,
    freeEvents,
    totalReviews,
    totalParticipants,
  ] = await Promise.all([
    prisma.user.count({
      where: {
        isDeleted: false,
      },
    }),
    prisma.user.count({
      where: {
        isDeleted: false,
        status: UserStatus.ACTIVE,
      },
    }),
    prisma.user.count({
      where: {
        isDeleted: false,
        status: UserStatus.BLOCKED,
      },
    }),
    prisma.user.count({
      where: {
        OR: [
          {
            isDeleted: true,
          },
          {
            status: UserStatus.DELETED,
          },
        ],
      },
    }),
    prisma.event.count({
      where: {
        isDeleted: false,
      },
    }),
    prisma.event.count({
      where: {
        isDeleted: false,
        visibility: 'PRIVATE',
      },
    }),
    prisma.event.count({
      where: {
        isDeleted: false,
        visibility: 'PUBLIC',
      },
    }),
    prisma.event.count({
      where: {
        isDeleted: false,
        feeType: 'PAID',
      },
    }),
    prisma.event.count({
      where: {
        isDeleted: false,
        feeType: 'FREE',
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
    users: {
      totalUsers,
      activeUsers,
      blockedUsers,
      deletedUsers,
    },
    events: {
      totalEvents,
      privateEvents,
      publicEvents,
      paidEvents,
      freeEvents,
    },
    engagement: {
      totalReviews,
      totalParticipants,
    },
  };
};

const getAllUsers = async (query: any) => {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 10);
  const skip = (page - 1) * limit;
  const searchTerm = query.searchTerm || '';
  const statusFilter = query.status;
  const roleFilter = query.role;

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

  if (statusFilter && ['ACTIVE', 'BLOCKED', 'DELETED'].includes(statusFilter)) {
    where.status = statusFilter;
  }

  if (roleFilter && ['ADMIN', 'USER'].includes(roleFilter)) {
    where.role = roleFilter;
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

const getUserById = async (userId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      isDeleted: false,
    },
    include: {
      _count: {
        select: {
          events: true,
          eventParticipants: true,
          eventReviews: true,
          eventInvitations: true,
          sentInvitations: true,
        },
      },
      events: {
        where: {
          isDeleted: false,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
        select: {
          id: true,
          title: true,
          createdAt: true,
          visibility: true,
          feeType: true,
        },
      },
      eventParticipants: {
        where: {
          isDeleted: false,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
        select: {
          id: true,
          status: true,
          paymentStatus: true,
          createdAt: true,
          event: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
      eventReviews: {
        where: {
          isDeleted: false,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
        select: {
          id: true,
          rating: true,
          review: true,
          createdAt: true,
          event: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  }

  return user;
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

const updateUser = async (
  adminUser: IRequestUser,
  userId: string,
  payload: TAdminUpdateUserPayload,
) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!existingUser || existingUser.isDeleted) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  }

  if (Object.keys(payload).length === 0) {
    throw new AppError(status.BAD_REQUEST, 'No data provided');
  }

  if (
    adminUser.userId === userId &&
    (payload.role !== undefined || payload.status !== undefined)
  ) {
    throw new AppError(
      status.BAD_REQUEST,
      'You cannot change your own role or status from this endpoint',
    );
  }

  if (
    existingUser.role === Role.ADMIN &&
    (payload.role !== undefined || payload.status !== undefined)
  ) {
    throw new AppError(
      status.BAD_REQUEST,
      'Admin account role or status cannot be changed from this endpoint',
    );
  }

  const updateData: {
    name?: string;
    image?: string;
    role?: Role;
    status?: UserStatus;
    isDeleted?: boolean;
    deletedAt?: Date | null;
  } = {
    ...(payload.name !== undefined ? { name: payload.name } : {}),
    ...(payload.image !== undefined ? { image: payload.image } : {}),
    ...(payload.role !== undefined ? { role: payload.role } : {}),
    ...(payload.status !== undefined ? { status: payload.status } : {}),
  };

  if (payload.status === UserStatus.DELETED) {
    updateData.isDeleted = true;
    updateData.deletedAt = new Date();
  }

  if (
    payload.status === UserStatus.ACTIVE ||
    payload.status === UserStatus.BLOCKED
  ) {
    updateData.isDeleted = false;
    updateData.deletedAt = null;
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: updateData,
  });

  return updatedUser;
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

  if (existingUser.role === 'ADMIN') {
    throw new AppError(
      status.BAD_REQUEST,
      'Admin accounts cannot be blocked from this endpoint',
    );
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

  if (existingUser.role === 'ADMIN') {
    throw new AppError(
      status.BAD_REQUEST,
      'Admin accounts cannot be deleted from this endpoint',
    );
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
  getReportsSummary,
  getAllUsers,
  getUserById,
  getAllEvents,
  updateUser,
  blockUser,
  unblockUser,
  deleteUser,
  deleteEvent,
};
