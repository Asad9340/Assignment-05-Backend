/* eslint-disable @typescript-eslint/no-explicit-any */
import status from 'http-status';
import { UserStatus } from '../../../generated/prisma/enums';
import AppError from '../../errorHelpers/AppError';
import { auth } from '../../lib/auth';
import { prisma } from '../../lib/prisma';
import { tokenUtils } from '../../utils/token';
import { jwtUtils } from '../../utils/jwt';
import { envVars } from '../../config/env.config';
import { JwtPayload } from 'jsonwebtoken';
import {
  IChangePasswordPayload,
  ILoginUserPayload,
  IRegisterUserPayload,
} from './auth.interface';

const registerUser = async (payload: IRegisterUserPayload) => {
  try {
    const { name, email, password } = payload;

    const data = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });

    if (!data?.user) {
      throw new AppError(status.BAD_REQUEST, 'Failed to register user');
    }

    const jwtPayload = {
      userId: data.user.id,
      name: data.user.name,
      role: data.user.role,
      email: data.user.email,
      isDeleted: data.user.isDeleted,
      emailVerified: data.user.emailVerified,
    };

    const accessToken = tokenUtils.getAccessToken(jwtPayload);
    const refreshToken = tokenUtils.getRefreshToken(jwtPayload);

    return {
      ...data,
      accessToken,
      refreshToken,
    };
  } catch (error: any) {
    throw new AppError(
      error?.status || status.BAD_REQUEST,
      error?.message || 'Failed to register user',
    );
  }
};

const loginUser = async (payload: ILoginUserPayload) => {
  const { email, password } = payload;

  const data = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  if (!data?.user) {
    throw new AppError(status.UNAUTHORIZED, 'Invalid credentials');
  }

  if (data.user.isDeleted) {
    throw new AppError(status.NOT_FOUND, 'User is deleted');
  }

  const jwtPayload = {
    userId: data.user.id,
    name: data.user.name,
    role: data.user.role,
    email: data.user.email,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified,
  };

  const accessToken = tokenUtils.getAccessToken(jwtPayload);
  const refreshToken = tokenUtils.getRefreshToken(jwtPayload);

  return {
    ...data,
    accessToken,
    refreshToken,
  };
};


const getNewToken = async (refreshToken: string, sessionToken: string) => {
  const isSessionTokenExists = await prisma.session.findUnique({
    where: {
      token: sessionToken,
    },
    include: {
      user: true,
    },
  });

  if (!isSessionTokenExists) {
    throw new AppError(status.UNAUTHORIZED, 'Invalid session token');
  }

  const verifiedRefreshToken = jwtUtils.verifyToken(
    refreshToken,
    envVars.REFRESH_TOKEN_SECRET,
  );
  if (!verifiedRefreshToken.success && verifiedRefreshToken.error) {
    throw new AppError(status.UNAUTHORIZED, 'Invalid refresh token');
  }
  const data = verifiedRefreshToken.data as JwtPayload;
  const jwtPayload = {
    userId: data.userId,
    name: data.name,
    role: data.role,
    email: data.email,
    status: data.status,
    isDeleted: data.isDeleted,
    emailVerified: data.emailVerified,
  };
  const newAccessToken = tokenUtils.getAccessToken(jwtPayload);
  const newRefreshToken = tokenUtils.getRefreshToken(jwtPayload);

  const { token } = await prisma.session.update({
    where: {
      token: sessionToken,
    },
    data: {
      token: sessionToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1000),
      updatedAt: new Date(),
    },
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    sessionToken: token,
  };
};

const changePassword = async (
  payload: IChangePasswordPayload,
  sessionToken: string,
) => {
  const session = await auth.api.getSession({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`,
    }),
  });

  if (!session) {
    throw new AppError(status.UNAUTHORIZED, 'Invalid session token');
  }
  const { currentPassword, newPassword } = payload;

  const result = await auth.api.changePassword({
    body: {
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    },
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`,
    }),
  });

  const jwtPayload = {
    userId: session.user.id,
    name: session.user.name,
    role: session.user.role,
    email: session.user.email,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVerified: session.user.emailVerified,
  };
  const accessToken = tokenUtils.getAccessToken(jwtPayload);
  const refreshToken = tokenUtils.getRefreshToken(jwtPayload);

  return {
    ...result,
    accessToken,
    refreshToken,
  };
};

const logoutUser = async (sessionToken: string) => {
  const result = await auth.api.signOut({
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
  });

  return result;
};

const verifyEmail = async (email: string, otp: string) => {
  const result = await auth.api.verifyEmailOTP({
    body: {
      email,
      otp,
    },
  });
  if (result.status && !result.user.emailVerified) {
    await prisma.user.update({
      where: { email },
      data: { emailVerified: true },
    });
  }
};

const forgetPassword = async (email: string) => {
  const isUserExists = await prisma.user.findUnique({
    where: { email },
  });
  if (!isUserExists) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  }
  if (!isUserExists.emailVerified) {
    throw new AppError(status.BAD_REQUEST, 'Email not verified');
  }
  if (isUserExists.isDeleted || isUserExists.status === UserStatus.DELETED) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  }
  await auth.api.requestPasswordResetEmailOTP({
    body: {
      email,
    },
  });
};

const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string,
) => {
  const isUserExists = await prisma.user.findUnique({
    where: { email },
  });
  if (!isUserExists) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  }
  if (!isUserExists.emailVerified) {
    throw new AppError(status.BAD_REQUEST, 'Email not verified');
  }
  if (isUserExists.isDeleted || isUserExists.status === UserStatus.DELETED) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  }
  await auth.api.resetPasswordEmailOTP({
    body: {
      email,
      otp,
      password: newPassword,
    },
  });
  await prisma.session.deleteMany({
    where: {
      userId: isUserExists.id,
    },
  });
};

const googleLoginSuccess = async (session: Record<string, any>) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!isUserExists) {
    await prisma.user.create({
      data: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: 'USER',
      },
    });
  }

  const payload = {
    userId: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: 'USER',
  };

  const accessToken = tokenUtils.getAccessToken(payload);
  const refreshToken = tokenUtils.getRefreshToken(payload);

  return {
    accessToken,
    refreshToken,
  };
};

export const authService = {
  registerUser,
  loginUser,
  getNewToken,
  changePassword,
  logoutUser,
  verifyEmail,
  forgetPassword,
  resetPassword,
  googleLoginSuccess,
};
