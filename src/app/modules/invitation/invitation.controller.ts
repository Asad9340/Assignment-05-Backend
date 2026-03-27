import { Request, Response } from 'express';
import status from 'http-status';
import { InvitationService } from './invitation.service';
import { IRequestUser } from '../../interfaces/requestUser.interface';
import { IQueryParams } from '../../interfaces/query.interface';
import catchAsync from '../../shared/catchAsync';
import { sendResponse } from '../../shared/sendResponse';

const inviteUser = catchAsync(async (req: Request, res: Response) => {
  const result = await InvitationService.inviteUser(
    req.user as IRequestUser,
    req.params.eventId as string,
    req.body,
  );

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: 'Invitation sent successfully',
    data: result,
  });
});

const getMyInvitations = catchAsync(async (req: Request, res: Response) => {
  const result = await InvitationService.getMyInvitations(
    req.user as IRequestUser,
    req.query as IQueryParams,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Invitations retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});

const acceptInvitation = catchAsync(async (req: Request, res: Response) => {
  const result = await InvitationService.acceptInvitation(
    req.user as IRequestUser,
    req.params.invitationId as string,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Invitation accepted successfully',
    data: result,
  });
});

const rejectInvitation = catchAsync(async (req: Request, res: Response) => {
  const result = await InvitationService.rejectInvitation(
    req.user as IRequestUser,
    req.params.invitationId as string,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Invitation rejected successfully',
    data: result,
  });
});

export const InvitationController = {
  inviteUser,
  getMyInvitations,
  acceptInvitation,
  rejectInvitation,
};
