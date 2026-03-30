import { Request, Response } from 'express';
import status from 'http-status';
import { AdminService } from './admin.service';
import catchAsync from '../../shared/catchAsync';
import { sendResponse } from '../../shared/sendResponse';
import { IRequestUser } from '../../interfaces/requestUser.interface';

const getStats = catchAsync(async (_req: Request, res: Response) => {
  const result = await AdminService.getStats();

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Admin stats retrieved successfully',
    data: result,
  });
});

const getReportsSummary = catchAsync(async (_req: Request, res: Response) => {
  const result = await AdminService.getReportsSummary();

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Admin report summary retrieved successfully',
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAllUsers(req.query);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Users retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getUserById(req.params.userId as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'User retrieved successfully',
    data: result,
  });
});

const getAllEvents = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAllEvents(req.query);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Events retrieved successfully',
    data: result.data,
    meta: result.meta,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.updateUser(
    req.user as IRequestUser,
    req.params.userId as string,
    req.body,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'User updated successfully',
    data: result,
  });
});

const blockUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.blockUser(req.params.userId as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'User blocked successfully',
    data: result,
  });
});

const unblockUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.unblockUser(req.params.userId as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'User unblocked successfully',
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.deleteUser(req.params.userId as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'User deleted successfully',
    data: result,
  });
});

const deleteEvent = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.deleteEvent(req.params.eventId as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Event deleted successfully',
    data: result,
  });
});

export const AdminController = {
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
