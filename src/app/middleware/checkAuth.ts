/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import { Role, UserStatus } from '../../generated/prisma/enums';
import { envVars } from '../config/env.config';
import AppError from '../errorHelpers/AppError';
import { prisma } from '../lib/prisma';
import { CookieUtils } from '../utils/cookie';
import { jwtUtils } from '../utils/jwt';

const hasRoleAccess = (authRoles: Role[], userRole: Role) => {
  if (authRoles.includes(userRole)) {
    return true;
  }

  // SUPER_ADMIN should have ADMIN-level access across protected admin routes.
  if (userRole === Role.SUPER_ADMIN && authRoles.includes(Role.ADMIN)) {
    return true;
  }

  return false;
};

export const checkAuth =
  (...authRoles: Role[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //Session Token Verification
      const sessionToken =
        CookieUtils.getCookie(req, 'better-auth.session_token') ||
        CookieUtils.getCookie(req, 'better-auth.session-token');

      if (sessionToken) {
        const sessionExists = await prisma.session.findFirst({
          where: {
            token: sessionToken,
            expiresAt: {
              gt: new Date(),
            },
          },
          include: {
            user: true,
          },
        });

        if (sessionExists && sessionExists.user) {
          const user = sessionExists.user;

          const now = new Date();
          const expiresAt = new Date(sessionExists.expiresAt);
          const createdAt = new Date(sessionExists.createdAt);

          const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
          const timeRemaining = expiresAt.getTime() - now.getTime();
          const percentRemaining = (timeRemaining / sessionLifeTime) * 100;

          if (percentRemaining < 20) {
            res.setHeader('X-Session-Refresh', 'true');
            res.setHeader('X-Session-Expires-At', expiresAt.toISOString());
            res.setHeader('X-Time-Remaining', timeRemaining.toString());

            console.log('Session Expiring Soon!!');
          }

          if (
            user.status === UserStatus.BLOCKED ||
            user.status === UserStatus.DELETED
          ) {
            throw new AppError(
              status.UNAUTHORIZED,
              'Unauthorized access! User is not active.',
            );
          }

          if (user.isDeleted) {
            throw new AppError(
              status.UNAUTHORIZED,
              'Unauthorized access! User is deleted.',
            );
          }

          if (authRoles.length > 0 && !hasRoleAccess(authRoles, user.role)) {
            throw new AppError(
              status.FORBIDDEN,
              'Forbidden access! You do not have permission to access this resource.',
            );
          }

          req.user = {
            userId: user.id,
            name: user.name,
            role: user.role,
            email: user.email,
            status: user.status,
            isDeleted: user.isDeleted,
            emailVerified: user.emailVerified,
          };
        }
      }

      //Access Token Verification
      const accessToken = CookieUtils.getCookie(req, 'accessToken');

      if (!accessToken) {
        throw new AppError(
          status.UNAUTHORIZED,
          'Unauthorized access! No access token provided.',
        );
      }

      const verifiedToken = jwtUtils.verifyToken(
        accessToken,
        envVars.ACCESS_TOKEN_SECRET,
      );
      if (!verifiedToken.success) {
        throw new AppError(
          status.UNAUTHORIZED,
          'Unauthorized access! Invalid access token.',
        );
      }

      if (!req.user) {
        const tokenData = verifiedToken.data as {
          userId?: string;
          role?: Role;
        };

        if (!tokenData?.userId) {
          throw new AppError(
            status.UNAUTHORIZED,
            'Unauthorized access! Invalid token payload.',
          );
        }

        const user = await prisma.user.findFirst({
          where: {
            id: tokenData.userId,
            isDeleted: false,
          },
        });

        if (
          !user ||
          user.status === UserStatus.BLOCKED ||
          user.status === UserStatus.DELETED
        ) {
          throw new AppError(
            status.UNAUTHORIZED,
            'Unauthorized access! User is not active.',
          );
        }

        req.user = {
          userId: user.id,
          name: user.name,
          role: user.role,
          email: user.email,
          status: user.status,
          isDeleted: user.isDeleted,
          emailVerified: user.emailVerified,
        };
      }

      if (authRoles.length > 0 && !hasRoleAccess(authRoles, req.user.role)) {
        throw new AppError(
          status.FORBIDDEN,
          'Forbidden access! You do not have permission to access this resource.',
        );
      }

      next();
    } catch (error: any) {
      next(error);
    }
  };
