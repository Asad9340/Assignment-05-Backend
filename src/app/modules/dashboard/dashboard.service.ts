import { ParticipationStatus } from '../../../generated/prisma/enums';
import { IRequestUser } from '../../interfaces/requestUser.interface';
import { prisma } from '../../lib/prisma';
import { InvitationStatus } from '../invitation/invitation.constant';

const getSummary = async (user: IRequestUser) => {
  const [
    myEventsCount,
    myRequestsCount,
    pendingInvitationsCount,
    myReviewsCount,
    pendingApprovalsCount,
  ] = await Promise.all([
    prisma.event.count({
      where: {
        ownerId: user.userId,
        isDeleted: false,
      },
    }),
    prisma.eventParticipant.count({
      where: {
        userId: user.userId,
        isDeleted: false,
      },
    }),
    prisma.eventInvitation.count({
      where: {
        userId: user.userId,
        isDeleted: false,
        status: InvitationStatus.PENDING,
      },
    }),
    prisma.eventReview.count({
      where: {
        userId: user.userId,
        isDeleted: false,
      },
    }),
    prisma.eventParticipant.count({
      where: {
        isDeleted: false,
        status: ParticipationStatus.PENDING,
        event: {
          ownerId: user.userId,
          isDeleted: false,
        },
      },
    }),
  ]);

  return {
    myEventsCount,
    myRequestsCount,
    pendingInvitationsCount,
    myReviewsCount,
    pendingApprovalsCount,
  };
};

const getMyEvents = async (user: IRequestUser) => {
  return prisma.event.findMany({
    where: {
      ownerId: user.userId,
      isDeleted: false,
    },
    include: {
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
};

const getPendingInvitations = async (user: IRequestUser) => {
  return prisma.eventInvitation.findMany({
    where: {
      userId: user.userId,
      isDeleted: false,
      status: InvitationStatus.PENDING,
    },
    include: {
      event: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

const getMyReviews = async (user: IRequestUser) => {
  return prisma.eventReview.findMany({
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
};

const getMyRequests = async (user: IRequestUser) => {
  return prisma.eventParticipant.findMany({
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
};

const getPendingApprovals = async (user: IRequestUser) => {
  return prisma.eventParticipant.findMany({
    where: {
      isDeleted: false,
      status: ParticipationStatus.PENDING,
      event: {
        ownerId: user.userId,
        isDeleted: false,
      },
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
    orderBy: {
      createdAt: 'desc',
    },
  });
};

const getMyEventStatusSummary = async (user: IRequestUser) => {
  const baseWhere = {
    isDeleted: false,
    event: {
      ownerId: user.userId,
      isDeleted: false,
    },
  };

  const [pending, approved, rejected, joined, banned, recentPending] =
    await Promise.all([
      prisma.eventParticipant.count({
        where: {
          ...baseWhere,
          status: ParticipationStatus.PENDING,
        },
      }),
      prisma.eventParticipant.count({
        where: {
          ...baseWhere,
          status: ParticipationStatus.APPROVED,
        },
      }),
      prisma.eventParticipant.count({
        where: {
          ...baseWhere,
          status: ParticipationStatus.REJECTED,
        },
      }),
      prisma.eventParticipant.count({
        where: {
          ...baseWhere,
          status: ParticipationStatus.JOINED,
        },
      }),
      prisma.eventParticipant.count({
        where: {
          ...baseWhere,
          status: ParticipationStatus.BANNED,
        },
      }),
      prisma.eventParticipant.findMany({
        where: {
          ...baseWhere,
          status: ParticipationStatus.PENDING,
        },
        include: {
          event: {
            select: {
              id: true,
              title: true,
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
        take: 8,
      }),
    ]);

  return {
    total: pending + approved + rejected + joined + banned,
    pending,
    approved,
    rejected,
    joined,
    banned,
    recentPending,
  };
};

export const DashboardService = {
  getSummary,
  getMyEvents,
  getPendingInvitations,
  getMyReviews,
  getMyRequests,
  getPendingApprovals,
  getMyEventStatusSummary,
};
