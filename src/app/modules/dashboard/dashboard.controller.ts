import { Request, Response } from 'express';
import status from 'http-status';
import { DashboardService } from './dashboard.service';
import catchAsync from '../../shared/catchAsync';
import { sendResponse } from '../../shared/sendResponse';
import { IRequestUser } from '../../interfaces/requestUser.interface';

const getSummary = catchAsync(async (req: Request, res: Response) => {
  const result = await DashboardService.getSummary(req.user as IRequestUser);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Dashboard summary retrieved successfully',
    data: result,
  });
});

const getMyEvents = catchAsync(async (req: Request, res: Response) => {
  const result = await DashboardService.getMyEvents(req.user as IRequestUser);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'My events retrieved successfully',
    data: result,
  });
});

const getPendingInvitations = catchAsync(
  async (req: Request, res: Response) => {
    const result = await DashboardService.getPendingInvitations(
      req.user as IRequestUser,
    );

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: 'Pending invitations retrieved successfully',
      data: result,
    });
  },
);

const getMyReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await DashboardService.getMyReviews(req.user as IRequestUser);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'My reviews retrieved successfully',
    data: result,
  });
});

const getMyRequests = catchAsync(async (req: Request, res: Response) => {
  const result = await DashboardService.getMyRequests(req.user as IRequestUser);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'My participation requests retrieved successfully',
    data: result,
  });
});

const getPendingApprovals = catchAsync(async (req: Request, res: Response) => {
  const result = await DashboardService.getPendingApprovals(
    req.user as IRequestUser,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Pending approvals retrieved successfully',
    data: result,
  });
});

const getMyEventStatusSummary = catchAsync(
  async (req: Request, res: Response) => {
    const result = await DashboardService.getMyEventStatusSummary(
      req.user as IRequestUser,
    );

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: 'My event participation status summary retrieved successfully',
      data: result,
    });
  },
);

export const DashboardController = {
  getSummary,
  getMyEvents,
  getPendingInvitations,
  getMyReviews,
  getMyRequests,
  getPendingApprovals,
  getMyEventStatusSummary,
};
