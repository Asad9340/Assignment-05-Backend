import { EventStatus, EventVisibility } from '../../../generated/prisma/enums';

export type ICreateEventPayload = {
  title: string;
  description: string;
  image?: string;
  eventDate: string;
  eventTime: string;
  venue?: string;
  eventLink?: string;
  visibility: EventVisibility;
  status?: EventStatus;
  registrationFee?: number;
  ownerId: string;
};

export type IUpdateEventPayload = Partial<ICreateEventPayload>;
