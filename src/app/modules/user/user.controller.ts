import { Request, Response } from 'express';
import status from 'http-status';
import { UserService } from './user.service';
import { IRequestUser } from '../../interfaces/requestUser.interface';
import { sendResponse } from '../../shared/sendResponse';
import catchAsync from '../../shared/catchAsync';
import AppError from '../../errorHelpers/AppError';

const getMe = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getMe(req.user as IRequestUser);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Profile retrieved successfully',
    data: result,
  });
});

const searchUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.searchUsers(
    req.user as IRequestUser,
    req.query as Record<string, string | undefined>,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Users retrieved successfully',
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

const uploadAvatar = catchAsync(async (req: Request, res: Response) => {
  const file = req.file as
    | (Express.Multer.File & { path?: string })
    | undefined;
  if (!file) {
    throw new AppError(status.BAD_REQUEST, 'No image file provided');
  }
  const imageUrl = file.path;
  const result = await UserService.updateMe(req.user as IRequestUser, {
    image: imageUrl,
  });
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Profile image updated successfully',
    data: { imageUrl: result.image },
  });
});

export const UserController = {
  searchUsers,
  getMe,
  updateMe,
  deleteMe,
  uploadAvatar,
};
