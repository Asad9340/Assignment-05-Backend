import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './prisma';
import { bearer, emailOTP } from 'better-auth/plugins';
import { sendEmail } from '../utils/email';
import { envVars } from '../config/env.config';
import { Role, UserStatus } from '../../generated/prisma/enums';

export const auth = betterAuth({
  baseURL: envVars.BETTER_AUTH_URL,
  secret: envVars.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  socialProviders: {
    google: {
      clientId: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      mapProfileToUser: () => {
        return {
          role: Role.USER,
          stats: UserStatus.ACTIVE,
          emailVerified: true,
          isDeleted: false,
          deletedAt: null,
        };
      },
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
  },

  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: true,
        defaultValue: Role.USER,
      },

      status: {
        type: 'string',
        required: true,
        defaultValue: UserStatus.ACTIVE,
      },
      isDeleted: {
        type: 'boolean',
        required: true,
        defaultValue: false,
      },

      deletedAt: {
        type: 'date',
        required: false,
        defaultValue: null,
      },
    },
  },
  plugins: [
    bearer(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === 'email-verification') {
          const user = await prisma.user.findUnique({
            where: {
              email,
            },
          });
          if (user && !user.emailVerified) {
            sendEmail({
              to: email,
              subject: 'Verify your email',
              templateName: 'otp',
              templateData: {
                name: user.name,
                otp,
              },
            });
          }
        } else if (type === 'forget-password') {
          const user = await prisma.user.findUnique({
            where: { email },
          });
          if (user) {
            sendEmail({
              to: email,
              subject: 'Password Reset OTP',
              templateName: 'otp',
              templateData: {
                name: user.name,
                otp,
              },
            });
          }
        }
      },
      expiresIn: 2 * 60,
      otpLength: 6,
    }),
  ],
  session: {
    expiresIn: 60 * 60 * 60 * 24,
    updateAge: 60 * 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 60 * 24,
    },
  },
  redirectURLs: {
    signIn: `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success`,
  },
  trustedOrigins: [envVars.BETTER_AUTH_URL, envVars.FRONTEND_URL],
  advanced: {
    useSecureCookies: false,
    cookies: {
      state: {
        attributes: {
          sameSite: 'none',
          secure: true,
          httpOnly: true,
          path: '/',
        },
      },
      sessionToken: {
        attributes: {
          sameSite: 'none',
          secure: true,
          httpOnly: true,
          path: '/',
        },
      },
    },
  },
});
