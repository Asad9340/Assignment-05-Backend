import { Request, Response } from 'express';
import status from 'http-status';
import { UserService } from './user.service';
import { IRequestUser } from '../../interfaces/requestUser.interface';
import { sendResponse } from '../../shared/sendResponse';
import catchAsync from '../../shared/catchAsync';

const getMe = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getMe(req.user as IRequestUser);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Profile retrieved successfully',
    data: result,
  });
});

const updateMe = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.updateMe(req.user as IRequestUser, req.body);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Profile updated successfully',
    data: result,
  });
});

const deleteMe = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.deleteMe(req.user as IRequestUser);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Account deleted successfully',
    data: result,
  });
});

export const UserController = {
  getMe,
  updateMe,
  deleteMe,
};
