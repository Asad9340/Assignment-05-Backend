import { EventVisibility } from '../../../generated/prisma/enums';

export type ICreateEventPayload = {
  title: string;
  description: string;
  eventDate: string;
  eventTime: string;
  venue?: string;
  eventLink?: string;
  visibility: EventVisibility;
  registrationFee?: number;
  ownerId: string;
};

export type IUpdateEventPayload = Partial<ICreateEventPayload>;
