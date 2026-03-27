import { Prisma } from '../../../generated/prisma/client';

export const eventSearchableFields = ['title', 'description'];

export const eventFilterableFields = [
  'visibility',
  'feeType',
  'ownerId',
  'venue',
];

export const eventIncludeConfig: Record<string, Prisma.EventInclude> = {
  owner: {
    owner: {
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    },
  },
  reviews: {
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
    },
  },
  participants: {
    participants: true,
  },
  eventInvitations: {
    eventInvitations: true,
  },
};
