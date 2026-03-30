import { Request, Response } from 'express';
import status from 'http-status';
import { ParticipationService } from './participation.service';
import catchAsync from '../../shared/catchAsync';
import { IRequestUser } from '../../interfaces/requestUser.interface';
import { sendResponse } from '../../shared/sendResponse';

const joinEvent = catchAsync(async (req: Request, res: Response) => {
  const result = await ParticipationService.joinEvent(
    req.user as IRequestUser,
    req.params.eventId as string,
  );

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: 'Participation request created successfully',
    data: result,
  });
});

const getMyParticipations = catchAsync(async (req: Request, res: Response) => {
  const result = await ParticipationService.getMyParticipations(
    req.user as IRequestUser,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'My participations retrieved successfully',
    data: result,
  });
});

const getEventParticipants = catchAsync(async (req: Request, res: Response) => {
  const result = await ParticipationService.getEventParticipants(
    req.user as IRequestUser,
    req.params.eventId as string,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Event participants retrieved successfully',
    data: result,
  });
});

const getMyPendingApprovals = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ParticipationService.getMyPendingApprovals(
      req.user as IRequestUser,
    );

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: 'My pending approvals retrieved successfully',
      data: result,
    });
  },
);

const approveParticipant = catchAsync(async (req: Request, res: Response) => {
  const result = await ParticipationService.approveParticipant(
    req.user as IRequestUser,
    req.params.participantId as string,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Participant accepted and joined successfully',
    data: result,
  });
});

const acceptParticipant = catchAsync(async (req: Request, res: Response) => {
  const result = await ParticipationService.approveParticipant(
    req.user as IRequestUser,
    req.params.participantId as string,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Participant accepted and joined successfully',
    data: result,
  });
});

const rejectParticipant = catchAsync(async (req: Request, res: Response) => {
  const result = await ParticipationService.rejectParticipant(
    req.user as IRequestUser,
    req.params.participantId as string,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Participant rejected successfully',
    data: result,
  });
});

const banParticipant = catchAsync(async (req: Request, res: Response) => {
  const result = await ParticipationService.banParticipant(
    req.user as IRequestUser,
    req.params.participantId as string,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Participant banned successfully',
    data: result,
  });
});

export const ParticipationController = {
  joinEvent,
  getMyParticipations,
  getEventParticipants,
  getMyPendingApprovals,
  acceptParticipant,
  approveParticipant,
  rejectParticipant,
  banParticipant,
};
