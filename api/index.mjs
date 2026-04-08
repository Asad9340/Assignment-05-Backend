// src/app.ts
import express from "express";
import dotenv2 from "dotenv";

// src/app/routes/index.ts
import { Router as Router10 } from "express";

// src/app/modules/auth/auth.route.ts
import { Router } from "express";

// src/app/shared/sendResponse.ts
var sendResponse = (res, responseData) => {
  const { httpStatusCode, success, message, data, meta } = responseData;
  res.status(httpStatusCode).json({
    success,
    message,
    meta,
    data
  });
};

// src/app/shared/catchAsync.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
var catchAsync_default = catchAsync;

// src/app/modules/auth/auth.service.ts
import status3 from "http-status";

// src/generated/prisma/enums.ts
var Role = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  USER: "USER"
};
var EventVisibility = {
  PUBLIC: "PUBLIC",
  PRIVATE: "PRIVATE"
};
var FeeType = {
  FREE: "FREE",
  PAID: "PAID"
};
var EventStatus = {
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED"
};
var ParticipationStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  JOINED: "JOINED",
  BANNED: "BANNED"
};
var PaymentStatus = {
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED"
};
var UserStatus = {
  ACTIVE: "ACTIVE",
  BLOCKED: "BLOCKED",
  DELETED: "DELETED"
};
var InvitationStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED"
};
var PaymentGateway = {
  SSLCOMMERZ: "SSLCOMMERZ"
};
var TransactionStatus = {
  INITIATED: "INITIATED",
  VALID: "VALID",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED"
};

// src/app/errorHelpers/AppError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};
var AppError_default = AppError;

// src/app/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/app/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// src/app/config/env.config.ts
import dotenv from "dotenv";
import status from "http-status";
dotenv.config();
var loadEnvVariables = () => {
  const requireEnvVariable = [
    "NODE_ENV",
    "PORT",
    "DATABASE_URL",
    "FRONTEND_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRES_IN",
    "REFRESH_TOKEN_EXPIRES_IN",
    "BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN",
    "BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE",
    "EMAIL_SENDER_SMTP_USER",
    "EMAIL_SENDER_SMTP_PASS",
    "EMAIL_SENDER_SMTP_HOST",
    "EMAIL_SENDER_SMTP_PORT",
    "EMAIL_SENDER_SMTP_FROM",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CALLBACK_URL",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "SSL_STORE_ID",
    "SSL_STORE_PASSWORD",
    "SSL_IS_LIVE"
  ];
  requireEnvVariable.forEach((variable) => {
    if (!process.env[variable]) {
      throw new AppError_default(
        status.INTERNAL_SERVER_ERROR,
        `Environment variable ${variable} is required but not set in .env file.`
      );
    }
  });
  return {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    FRONTEND_URL: process.env.FRONTEND_URL?.trim(),
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL?.trim(),
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
    BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN: process.env.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN,
    BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: process.env.BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE,
    EMAIL_SENDER: {
      SMTP_USER: process.env.EMAIL_SENDER_SMTP_USER,
      SMTP_PASS: process.env.EMAIL_SENDER_SMTP_PASS,
      SMTP_HOST: process.env.EMAIL_SENDER_SMTP_HOST,
      SMTP_PORT: process.env.EMAIL_SENDER_SMTP_PORT,
      SMTP_FROM: process.env.EMAIL_SENDER_SMTP_FROM
    },
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    CLOUDINARY: {
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
    },
    SSLCOMMERZ: {
      SSL_STORE_ID: process.env.SSL_STORE_ID?.trim(),
      SSL_STORE_PASSWORD: process.env.SSL_STORE_PASSWORD?.trim(),
      SSL_IS_LIVE: process.env.SSL_IS_LIVE?.trim()
    }
  };
};
var envVars = loadEnvVariables();

// src/generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// src/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.5.0",
  "engineVersion": "280c870be64f457428992c43c1f6d557fab6e29e",
  "activeProvider": "postgresql",
  "inlineSchema": 'model User {\n  id                  String               @id @default(uuid())\n  name                String\n  email               String\n  emailVerified       Boolean              @default(false)\n  role                Role                 @default(USER)\n  status              UserStatus           @default(ACTIVE)\n  isDeleted           Boolean              @default(false)\n  deletedAt           DateTime?\n  image               String?\n  createdAt           DateTime             @default(now())\n  updatedAt           DateTime             @updatedAt\n  sessions            Session[]\n  accounts            Account[]\n  events              Event[]\n  eventParticipants   EventParticipant[]\n  eventReviews        EventReview[]\n  eventInvitations    EventInvitation[]    @relation("EventInvitationUser")\n  sentInvitations     EventInvitation[]    @relation("EventInvitationInvitedBy")\n  paymentTransactions PaymentTransaction[]\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id @default(uuid())\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id @default(uuid())\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id @default(uuid())\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nenum Role {\n  SUPER_ADMIN\n  ADMIN\n  USER\n}\n\nenum EventVisibility {\n  PUBLIC\n  PRIVATE\n}\n\nenum FeeType {\n  FREE\n  PAID\n}\n\nenum EventStatus {\n  ACTIVE\n  COMPLETED\n  CANCELLED\n}\n\nenum ParticipationStatus {\n  PENDING\n  APPROVED\n  REJECTED\n  JOINED\n  BANNED\n}\n\nenum PaymentStatus {\n  PENDING\n  PAID\n  FAILED\n}\n\nenum UserStatus {\n  ACTIVE\n  BLOCKED\n  DELETED\n}\n\nenum InvitationStatus {\n  PENDING\n  ACCEPTED\n  REJECTED\n}\n\nenum PaymentGateway {\n  SSLCOMMERZ\n}\n\nenum TransactionStatus {\n  INITIATED\n  VALID\n  FAILED\n  CANCELLED\n}\n\nmodel Event {\n  id            String   @id @default(uuid())\n  title         String\n  description   String\n  image         String?\n  eventDateTime DateTime\n  venue         String?\n  eventLink     String?\n\n  visibility      EventVisibility\n  feeType         FeeType         @default(FREE)\n  status          EventStatus     @default(ACTIVE)\n  registrationFee Float           @default(0)\n\n  ownerId String\n  owner   User   @relation(fields: [ownerId], references: [id])\n\n  participants     EventParticipant[]\n  reviews          EventReview[]\n  eventInvitations EventInvitation[]\n\n  createdAt           DateTime             @default(now())\n  updatedAt           DateTime             @updatedAt\n  isDeleted           Boolean              @default(false)\n  deletedAt           DateTime?\n  paymentTransactions PaymentTransaction[]\n\n  @@index([visibility, feeType])\n  @@index([isDeleted])\n  @@index([eventDateTime])\n  @@index([ownerId])\n  @@index([status])\n  @@index([isDeleted, visibility, eventDateTime])\n}\n\nmodel EventParticipant {\n  id      String @id @default(uuid())\n  eventId String\n  userId  String\n\n  status ParticipationStatus @default(PENDING)\n\n  paymentStatus PaymentStatus @default(PENDING)\n  paidAmount    Float?\n\n  requestedAt DateTime  @default(now())\n  approvedAt  DateTime?\n  rejectedAt  DateTime?\n  bannedAt    DateTime?\n\n  event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)\n  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  createdAt           DateTime             @default(now())\n  updatedAt           DateTime             @updatedAt\n  isDeleted           Boolean              @default(false)\n  deletedAt           DateTime?\n  paymentTransactions PaymentTransaction[]\n\n  @@unique([eventId, userId])\n}\n\nmodel EventInvitation {\n  id          String @id @default(uuid())\n  eventId     String\n  userId      String\n  invitedById String\n\n  status InvitationStatus\n\n  event     Event @relation(fields: [eventId], references: [id], onDelete: Cascade)\n  user      User  @relation("EventInvitationUser", fields: [userId], references: [id], onDelete: Cascade)\n  invitedBy User  @relation("EventInvitationInvitedBy", fields: [invitedById], references: [id], onDelete: Cascade)\n\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n\n  @@unique([eventId, userId])\n}\n\nmodel EventReview {\n  id      String @id @default(uuid())\n  eventId String\n  userId  String\n\n  rating Int\n  review String?\n\n  event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)\n  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n\n  @@unique([eventId, userId])\n}\n\nmodel PaymentTransaction {\n  id      String         @id @default(uuid())\n  trxId   String         @unique\n  gateway PaymentGateway @default(SSLCOMMERZ)\n\n  userId             String\n  eventId            String\n  eventParticipantId String?\n\n  amount   Float\n  currency String @default("BDT")\n\n  status TransactionStatus @default(INITIATED)\n\n  gatewayTransactionId String?\n  bankTransactionId    String?\n  valId                String?\n  cardType             String?\n  storeAmount          Float?\n  verifyPayload        Json?\n\n  successUrl      String?\n  failUrl         String?\n  cancelUrl       String?\n  gatewayResponse Json?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  user             User              @relation(fields: [userId], references: [id], onDelete: Cascade)\n  event            Event             @relation(fields: [eventId], references: [id], onDelete: Cascade)\n  eventParticipant EventParticipant? @relation(fields: [eventParticipantId], references: [id], onDelete: SetNull)\n\n  @@index([userId])\n  @@index([eventId])\n  @@index([eventParticipantId])\n}\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"events","kind":"object","type":"Event","relationName":"EventToUser"},{"name":"eventParticipants","kind":"object","type":"EventParticipant","relationName":"EventParticipantToUser"},{"name":"eventReviews","kind":"object","type":"EventReview","relationName":"EventReviewToUser"},{"name":"eventInvitations","kind":"object","type":"EventInvitation","relationName":"EventInvitationUser"},{"name":"sentInvitations","kind":"object","type":"EventInvitation","relationName":"EventInvitationInvitedBy"},{"name":"paymentTransactions","kind":"object","type":"PaymentTransaction","relationName":"PaymentTransactionToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Event":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"eventDateTime","kind":"scalar","type":"DateTime"},{"name":"venue","kind":"scalar","type":"String"},{"name":"eventLink","kind":"scalar","type":"String"},{"name":"visibility","kind":"enum","type":"EventVisibility"},{"name":"feeType","kind":"enum","type":"FeeType"},{"name":"status","kind":"enum","type":"EventStatus"},{"name":"registrationFee","kind":"scalar","type":"Float"},{"name":"ownerId","kind":"scalar","type":"String"},{"name":"owner","kind":"object","type":"User","relationName":"EventToUser"},{"name":"participants","kind":"object","type":"EventParticipant","relationName":"EventToEventParticipant"},{"name":"reviews","kind":"object","type":"EventReview","relationName":"EventToEventReview"},{"name":"eventInvitations","kind":"object","type":"EventInvitation","relationName":"EventToEventInvitation"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"paymentTransactions","kind":"object","type":"PaymentTransaction","relationName":"EventToPaymentTransaction"}],"dbName":null},"EventParticipant":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"eventId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"ParticipationStatus"},{"name":"paymentStatus","kind":"enum","type":"PaymentStatus"},{"name":"paidAmount","kind":"scalar","type":"Float"},{"name":"requestedAt","kind":"scalar","type":"DateTime"},{"name":"approvedAt","kind":"scalar","type":"DateTime"},{"name":"rejectedAt","kind":"scalar","type":"DateTime"},{"name":"bannedAt","kind":"scalar","type":"DateTime"},{"name":"event","kind":"object","type":"Event","relationName":"EventToEventParticipant"},{"name":"user","kind":"object","type":"User","relationName":"EventParticipantToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"paymentTransactions","kind":"object","type":"PaymentTransaction","relationName":"EventParticipantToPaymentTransaction"}],"dbName":null},"EventInvitation":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"eventId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"invitedById","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"InvitationStatus"},{"name":"event","kind":"object","type":"Event","relationName":"EventToEventInvitation"},{"name":"user","kind":"object","type":"User","relationName":"EventInvitationUser"},{"name":"invitedBy","kind":"object","type":"User","relationName":"EventInvitationInvitedBy"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"EventReview":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"eventId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"review","kind":"scalar","type":"String"},{"name":"event","kind":"object","type":"Event","relationName":"EventToEventReview"},{"name":"user","kind":"object","type":"User","relationName":"EventReviewToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"PaymentTransaction":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"trxId","kind":"scalar","type":"String"},{"name":"gateway","kind":"enum","type":"PaymentGateway"},{"name":"userId","kind":"scalar","type":"String"},{"name":"eventId","kind":"scalar","type":"String"},{"name":"eventParticipantId","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"currency","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TransactionStatus"},{"name":"gatewayTransactionId","kind":"scalar","type":"String"},{"name":"bankTransactionId","kind":"scalar","type":"String"},{"name":"valId","kind":"scalar","type":"String"},{"name":"cardType","kind":"scalar","type":"String"},{"name":"storeAmount","kind":"scalar","type":"Float"},{"name":"verifyPayload","kind":"scalar","type":"Json"},{"name":"successUrl","kind":"scalar","type":"String"},{"name":"failUrl","kind":"scalar","type":"String"},{"name":"cancelUrl","kind":"scalar","type":"String"},{"name":"gatewayResponse","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"PaymentTransactionToUser"},{"name":"event","kind":"object","type":"Event","relationName":"EventToPaymentTransaction"},{"name":"eventParticipant","kind":"object","type":"EventParticipant","relationName":"EventParticipantToPaymentTransaction"}],"dbName":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","owner","event","eventParticipant","paymentTransactions","_count","participants","reviews","invitedBy","eventInvitations","events","eventParticipants","eventReviews","sentInvitations","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","data","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","create","update","User.upsertOne","User.deleteOne","User.deleteMany","having","_min","_max","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Event.findUnique","Event.findUniqueOrThrow","Event.findFirst","Event.findFirstOrThrow","Event.findMany","Event.createOne","Event.createMany","Event.createManyAndReturn","Event.updateOne","Event.updateMany","Event.updateManyAndReturn","Event.upsertOne","Event.deleteOne","Event.deleteMany","_avg","_sum","Event.groupBy","Event.aggregate","EventParticipant.findUnique","EventParticipant.findUniqueOrThrow","EventParticipant.findFirst","EventParticipant.findFirstOrThrow","EventParticipant.findMany","EventParticipant.createOne","EventParticipant.createMany","EventParticipant.createManyAndReturn","EventParticipant.updateOne","EventParticipant.updateMany","EventParticipant.updateManyAndReturn","EventParticipant.upsertOne","EventParticipant.deleteOne","EventParticipant.deleteMany","EventParticipant.groupBy","EventParticipant.aggregate","EventInvitation.findUnique","EventInvitation.findUniqueOrThrow","EventInvitation.findFirst","EventInvitation.findFirstOrThrow","EventInvitation.findMany","EventInvitation.createOne","EventInvitation.createMany","EventInvitation.createManyAndReturn","EventInvitation.updateOne","EventInvitation.updateMany","EventInvitation.updateManyAndReturn","EventInvitation.upsertOne","EventInvitation.deleteOne","EventInvitation.deleteMany","EventInvitation.groupBy","EventInvitation.aggregate","EventReview.findUnique","EventReview.findUniqueOrThrow","EventReview.findFirst","EventReview.findFirstOrThrow","EventReview.findMany","EventReview.createOne","EventReview.createMany","EventReview.createManyAndReturn","EventReview.updateOne","EventReview.updateMany","EventReview.updateManyAndReturn","EventReview.upsertOne","EventReview.deleteOne","EventReview.deleteMany","EventReview.groupBy","EventReview.aggregate","PaymentTransaction.findUnique","PaymentTransaction.findUniqueOrThrow","PaymentTransaction.findFirst","PaymentTransaction.findFirstOrThrow","PaymentTransaction.findMany","PaymentTransaction.createOne","PaymentTransaction.createMany","PaymentTransaction.createManyAndReturn","PaymentTransaction.updateOne","PaymentTransaction.updateMany","PaymentTransaction.updateManyAndReturn","PaymentTransaction.upsertOne","PaymentTransaction.deleteOne","PaymentTransaction.deleteMany","PaymentTransaction.groupBy","PaymentTransaction.aggregate","AND","OR","NOT","id","trxId","PaymentGateway","gateway","userId","eventId","eventParticipantId","amount","currency","TransactionStatus","status","gatewayTransactionId","bankTransactionId","valId","cardType","storeAmount","verifyPayload","successUrl","failUrl","cancelUrl","gatewayResponse","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","contains","startsWith","endsWith","rating","review","isDeleted","deletedAt","invitedById","InvitationStatus","ParticipationStatus","PaymentStatus","paymentStatus","paidAmount","requestedAt","approvedAt","rejectedAt","bannedAt","title","description","image","eventDateTime","venue","eventLink","EventVisibility","visibility","FeeType","feeType","EventStatus","registrationFee","ownerId","identifier","value","expiresAt","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","name","email","emailVerified","Role","role","UserStatus","every","some","none","eventId_userId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "tQVUkAEWBAAAygIAIAUAAMsCACAJAADQAgAgDgAAzwIAIA8AAMwCACAQAADNAgAgEQAAzgIAIBIAAM8CACCrAQAAxAIAMKwBAAA0ABCtAQAAxAIAMK4BAQAAAAG4AQAAxwKGAiLDAUAAugIAIcQBQAC6AgAh2AEgAMUCACHZAUAAyAIAIeYBAQDJAgAhgAIBALkCACGBAgEAAAABggIgAMUCACGEAgAAxgKEAiIBAAAAAQAgDAMAANUCACCrAQAA6QIAMKwBAAADABCtAQAA6QIAMK4BAQC5AgAhsgEBALkCACHDAUAAugIAIcQBQAC6AgAh8wFAALoCACH9AQEAuQIAIf4BAQDJAgAh_wEBAMkCACEDAwAA5gQAIP4BAADqAgAg_wEAAOoCACAMAwAA1QIAIKsBAADpAgAwrAEAAAMAEK0BAADpAgAwrgEBAAAAAbIBAQC5AgAhwwFAALoCACHEAUAAugIAIfMBQAC6AgAh_QEBAAAAAf4BAQDJAgAh_wEBAMkCACEDAAAAAwAgAQAABAAwAgAABQAgEQMAANUCACCrAQAA6AIAMKwBAAAHABCtAQAA6AIAMK4BAQC5AgAhsgEBALkCACHDAUAAugIAIcQBQAC6AgAh9AEBALkCACH1AQEAuQIAIfYBAQDJAgAh9wEBAMkCACH4AQEAyQIAIfkBQADIAgAh-gFAAMgCACH7AQEAyQIAIfwBAQDJAgAhCAMAAOYEACD2AQAA6gIAIPcBAADqAgAg-AEAAOoCACD5AQAA6gIAIPoBAADqAgAg-wEAAOoCACD8AQAA6gIAIBEDAADVAgAgqwEAAOgCADCsAQAABwAQrQEAAOgCADCuAQEAAAABsgEBALkCACHDAUAAugIAIcQBQAC6AgAh9AEBALkCACH1AQEAuQIAIfYBAQDJAgAh9wEBAMkCACH4AQEAyQIAIfkBQADIAgAh-gFAAMgCACH7AQEAyQIAIfwBAQDJAgAhAwAAAAcAIAEAAAgAMAIAAAkAIBgGAADVAgAgCQAA0AIAIAsAAM0CACAMAADOAgAgDgAAzwIAIKsBAADkAgAwrAEAAAsAEK0BAADkAgAwrgEBALkCACG4AQAA5wLvASLDAUAAugIAIcQBQAC6AgAh2AEgAMUCACHZAUAAyAIAIeQBAQC5AgAh5QEBALkCACHmAQEAyQIAIecBQAC6AgAh6AEBAMkCACHpAQEAyQIAIesBAADlAusBIu0BAADmAu0BIu8BCADbAgAh8AEBALkCACEJBgAA5gQAIAkAAOQEACALAADhBAAgDAAA4gQAIA4AAOMEACDZAQAA6gIAIOYBAADqAgAg6AEAAOoCACDpAQAA6gIAIBgGAADVAgAgCQAA0AIAIAsAAM0CACAMAADOAgAgDgAAzwIAIKsBAADkAgAwrAEAAAsAEK0BAADkAgAwrgEBAAAAAbgBAADnAu8BIsMBQAC6AgAhxAFAALoCACHYASAAxQIAIdkBQADIAgAh5AEBALkCACHlAQEAuQIAIeYBAQDJAgAh5wFAALoCACHoAQEAyQIAIekBAQDJAgAh6wEAAOUC6wEi7QEAAOYC7QEi7wEIANsCACHwAQEAuQIAIQMAAAALACABAAAMADACAAANACAUAwAA1QIAIAcAANQCACAJAADQAgAgqwEAAOECADCsAQAADwAQrQEAAOECADCuAQEAuQIAIbIBAQC5AgAhswEBALkCACG4AQAA4gLdASLDAUAAugIAIcQBQAC6AgAh2AEgAMUCACHZAUAAyAIAId4BAADjAt4BIt8BCADdAgAh4AFAALoCACHhAUAAyAIAIeIBQADIAgAh4wFAAMgCACEIAwAA5gQAIAcAAOUEACAJAADkBAAg2QEAAOoCACDfAQAA6gIAIOEBAADqAgAg4gEAAOoCACDjAQAA6gIAIBUDAADVAgAgBwAA1AIAIAkAANACACCrAQAA4QIAMKwBAAAPABCtAQAA4QIAMK4BAQAAAAGyAQEAuQIAIbMBAQC5AgAhuAEAAOIC3QEiwwFAALoCACHEAUAAugIAIdgBIADFAgAh2QFAAMgCACHeAQAA4wLeASLfAQgA3QIAIeABQAC6AgAh4QFAAMgCACHiAUAAyAIAIeMBQADIAgAhiQIAAOACACADAAAADwAgAQAAEAAwAgAAEQAgGwMAANUCACAHAADUAgAgCAAA3wIAIKsBAADZAgAwrAEAABMAEK0BAADZAgAwrgEBALkCACGvAQEAuQIAIbEBAADaArEBIrIBAQC5AgAhswEBALkCACG0AQEAyQIAIbUBCADbAgAhtgEBALkCACG4AQAA3AK4ASK5AQEAyQIAIboBAQDJAgAhuwEBAMkCACG8AQEAyQIAIb0BCADdAgAhvgEAAN4CACC_AQEAyQIAIcABAQDJAgAhwQEBAMkCACHCAQAA3gIAIMMBQAC6AgAhxAFAALoCACEOAwAA5gQAIAcAAOUEACAIAADnBAAgtAEAAOoCACC5AQAA6gIAILoBAADqAgAguwEAAOoCACC8AQAA6gIAIL0BAADqAgAgvgEAAOoCACC_AQAA6gIAIMABAADqAgAgwQEAAOoCACDCAQAA6gIAIBsDAADVAgAgBwAA1AIAIAgAAN8CACCrAQAA2QIAMKwBAAATABCtAQAA2QIAMK4BAQAAAAGvAQEAAAABsQEAANoCsQEisgEBALkCACGzAQEAuQIAIbQBAQDJAgAhtQEIANsCACG2AQEAuQIAIbgBAADcArgBIrkBAQDJAgAhugEBAMkCACG7AQEAyQIAIbwBAQDJAgAhvQEIAN0CACG-AQAA3gIAIL8BAQDJAgAhwAEBAMkCACHBAQEAyQIAIcIBAADeAgAgwwFAALoCACHEAUAAugIAIQMAAAATACABAAAUADACAAAVACABAAAADwAgAQAAABMAIA4DAADVAgAgBwAA1AIAIKsBAADXAgAwrAEAABkAEK0BAADXAgAwrgEBALkCACGyAQEAuQIAIbMBAQC5AgAhwwFAALoCACHEAUAAugIAIdYBAgDYAgAh1wEBAMkCACHYASAAxQIAIdkBQADIAgAhBAMAAOYEACAHAADlBAAg1wEAAOoCACDZAQAA6gIAIA8DAADVAgAgBwAA1AIAIKsBAADXAgAwrAEAABkAEK0BAADXAgAwrgEBAAAAAbIBAQC5AgAhswEBALkCACHDAUAAugIAIcQBQAC6AgAh1gECANgCACHXAQEAyQIAIdgBIADFAgAh2QFAAMgCACGJAgAA1gIAIAMAAAAZACABAAAaADACAAAbACAPAwAA1QIAIAcAANQCACANAADVAgAgqwEAANICADCsAQAAHQAQrQEAANICADCuAQEAuQIAIbIBAQC5AgAhswEBALkCACG4AQAA0wLcASLDAUAAugIAIcQBQAC6AgAh2AEgAMUCACHZAUAAyAIAIdoBAQC5AgAhBAMAAOYEACAHAADlBAAgDQAA5gQAINkBAADqAgAgEAMAANUCACAHAADUAgAgDQAA1QIAIKsBAADSAgAwrAEAAB0AEK0BAADSAgAwrgEBAAAAAbIBAQC5AgAhswEBALkCACG4AQAA0wLcASLDAUAAugIAIcQBQAC6AgAh2AEgAMUCACHZAUAAyAIAIdoBAQC5AgAhiQIAANECACADAAAAHQAgAQAAHgAwAgAAHwAgAwAAABMAIAEAABQAMAIAABUAIAEAAAAPACABAAAAGQAgAQAAAB0AIAEAAAATACADAAAADwAgAQAAEAAwAgAAEQAgAwAAABkAIAEAABoAMAIAABsAIAMAAAAdACABAAAeADACAAAfACADAAAAHQAgAQAAHgAwAgAAHwAgAwAAABMAIAEAABQAMAIAABUAIAEAAAADACABAAAABwAgAQAAAAsAIAEAAAAPACABAAAAGQAgAQAAAB0AIAEAAAAdACABAAAAEwAgAQAAAAEAIBYEAADKAgAgBQAAywIAIAkAANACACAOAADPAgAgDwAAzAIAIBAAAM0CACARAADOAgAgEgAAzwIAIKsBAADEAgAwrAEAADQAEK0BAADEAgAwrgEBALkCACG4AQAAxwKGAiLDAUAAugIAIcQBQAC6AgAh2AEgAMUCACHZAUAAyAIAIeYBAQDJAgAhgAIBALkCACGBAgEAuQIAIYICIADFAgAhhAIAAMYChAIiCgQAAN4EACAFAADfBAAgCQAA5AQAIA4AAOMEACAPAADgBAAgEAAA4QQAIBEAAOIEACASAADjBAAg2QEAAOoCACDmAQAA6gIAIAMAAAA0ACABAAA1ADACAAABACADAAAANAAgAQAANQAwAgAAAQAgAwAAADQAIAEAADUAMAIAAAEAIBMEAADWBAAgBQAA1wQAIAkAAN0EACAOAADbBAAgDwAA2AQAIBAAANkEACARAADaBAAgEgAA3AQAIK4BAQAAAAG4AQAAAIYCAsMBQAAAAAHEAUAAAAAB2AEgAAAAAdkBQAAAAAHmAQEAAAABgAIBAAAAAYECAQAAAAGCAiAAAAABhAIAAACEAgIBGAAAOQAgC64BAQAAAAG4AQAAAIYCAsMBQAAAAAHEAUAAAAAB2AEgAAAAAdkBQAAAAAHmAQEAAAABgAIBAAAAAYECAQAAAAGCAiAAAAABhAIAAACEAgIBGAAAOwAwARgAADsAMBMEAAD9AwAgBQAA_gMAIAkAAIQEACAOAACCBAAgDwAA_wMAIBAAAIAEACARAACBBAAgEgAAgwQAIK4BAQDwAgAhuAEAAPwDhgIiwwFAAPYCACHEAUAA9gIAIdgBIACDAwAh2QFAAIQDACHmAQEA9AIAIYACAQDwAgAhgQIBAPACACGCAiAAgwMAIYQCAAD7A4QCIgIAAAABACAYAAA-ACALrgEBAPACACG4AQAA_AOGAiLDAUAA9gIAIcQBQAD2AgAh2AEgAIMDACHZAUAAhAMAIeYBAQD0AgAhgAIBAPACACGBAgEA8AIAIYICIACDAwAhhAIAAPsDhAIiAgAAADQAIBgAAEAAIAIAAAA0ACAYAABAACADAAAAAQAgHwAAOQAgIAAAPgAgAQAAAAEAIAEAAAA0ACAFCgAA-AMAICUAAPoDACAmAAD5AwAg2QEAAOoCACDmAQAA6gIAIA6rAQAAvQIAMKwBAABHABCtAQAAvQIAMK4BAQCAAgAhuAEAAL8ChgIiwwFAAIcCACHEAUAAhwIAIdgBIACbAgAh2QFAAJwCACHmAQEAggIAIYACAQCAAgAhgQIBAIACACGCAiAAmwIAIYQCAAC-AoQCIgMAAAA0ACABAABGADAkAABHACADAAAANAAgAQAANQAwAgAAAQAgAQAAAAUAIAEAAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACAJAwAA9wMAIK4BAQAAAAGyAQEAAAABwwFAAAAAAcQBQAAAAAHzAUAAAAAB_QEBAAAAAf4BAQAAAAH_AQEAAAABARgAAE8AIAiuAQEAAAABsgEBAAAAAcMBQAAAAAHEAUAAAAAB8wFAAAAAAf0BAQAAAAH-AQEAAAAB_wEBAAAAAQEYAABRADABGAAAUQAwCQMAAPYDACCuAQEA8AIAIbIBAQDwAgAhwwFAAPYCACHEAUAA9gIAIfMBQAD2AgAh_QEBAPACACH-AQEA9AIAIf8BAQD0AgAhAgAAAAUAIBgAAFQAIAiuAQEA8AIAIbIBAQDwAgAhwwFAAPYCACHEAUAA9gIAIfMBQAD2AgAh_QEBAPACACH-AQEA9AIAIf8BAQD0AgAhAgAAAAMAIBgAAFYAIAIAAAADACAYAABWACADAAAABQAgHwAATwAgIAAAVAAgAQAAAAUAIAEAAAADACAFCgAA8wMAICUAAPUDACAmAAD0AwAg_gEAAOoCACD_AQAA6gIAIAurAQAAvAIAMKwBAABdABCtAQAAvAIAMK4BAQCAAgAhsgEBAIACACHDAUAAhwIAIcQBQACHAgAh8wFAAIcCACH9AQEAgAIAIf4BAQCCAgAh_wEBAIICACEDAAAAAwAgAQAAXAAwJAAAXQAgAwAAAAMAIAEAAAQAMAIAAAUAIAEAAAAJACABAAAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIAMAAAAHACABAAAIADACAAAJACADAAAABwAgAQAACAAwAgAACQAgDgMAAPIDACCuAQEAAAABsgEBAAAAAcMBQAAAAAHEAUAAAAAB9AEBAAAAAfUBAQAAAAH2AQEAAAAB9wEBAAAAAfgBAQAAAAH5AUAAAAAB-gFAAAAAAfsBAQAAAAH8AQEAAAABARgAAGUAIA2uAQEAAAABsgEBAAAAAcMBQAAAAAHEAUAAAAAB9AEBAAAAAfUBAQAAAAH2AQEAAAAB9wEBAAAAAfgBAQAAAAH5AUAAAAAB-gFAAAAAAfsBAQAAAAH8AQEAAAABARgAAGcAMAEYAABnADAOAwAA8QMAIK4BAQDwAgAhsgEBAPACACHDAUAA9gIAIcQBQAD2AgAh9AEBAPACACH1AQEA8AIAIfYBAQD0AgAh9wEBAPQCACH4AQEA9AIAIfkBQACEAwAh-gFAAIQDACH7AQEA9AIAIfwBAQD0AgAhAgAAAAkAIBgAAGoAIA2uAQEA8AIAIbIBAQDwAgAhwwFAAPYCACHEAUAA9gIAIfQBAQDwAgAh9QEBAPACACH2AQEA9AIAIfcBAQD0AgAh-AEBAPQCACH5AUAAhAMAIfoBQACEAwAh-wEBAPQCACH8AQEA9AIAIQIAAAAHACAYAABsACACAAAABwAgGAAAbAAgAwAAAAkAIB8AAGUAICAAAGoAIAEAAAAJACABAAAABwAgCgoAAO4DACAlAADwAwAgJgAA7wMAIPYBAADqAgAg9wEAAOoCACD4AQAA6gIAIPkBAADqAgAg-gEAAOoCACD7AQAA6gIAIPwBAADqAgAgEKsBAAC7AgAwrAEAAHMAEK0BAAC7AgAwrgEBAIACACGyAQEAgAIAIcMBQACHAgAhxAFAAIcCACH0AQEAgAIAIfUBAQCAAgAh9gEBAIICACH3AQEAggIAIfgBAQCCAgAh-QFAAJwCACH6AUAAnAIAIfsBAQCCAgAh_AEBAIICACEDAAAABwAgAQAAcgAwJAAAcwAgAwAAAAcAIAEAAAgAMAIAAAkAIAmrAQAAuAIAMKwBAAB5ABCtAQAAuAIAMK4BAQAAAAHDAUAAugIAIcQBQAC6AgAh8QEBALkCACHyAQEAuQIAIfMBQAC6AgAhAQAAAHYAIAEAAAB2ACAJqwEAALgCADCsAQAAeQAQrQEAALgCADCuAQEAuQIAIcMBQAC6AgAhxAFAALoCACHxAQEAuQIAIfIBAQC5AgAh8wFAALoCACEAAwAAAHkAIAEAAHoAMAIAAHYAIAMAAAB5ACABAAB6ADACAAB2ACADAAAAeQAgAQAAegAwAgAAdgAgBq4BAQAAAAHDAUAAAAABxAFAAAAAAfEBAQAAAAHyAQEAAAAB8wFAAAAAAQEYAAB-ACAGrgEBAAAAAcMBQAAAAAHEAUAAAAAB8QEBAAAAAfIBAQAAAAHzAUAAAAABARgAAIABADABGAAAgAEAMAauAQEA8AIAIcMBQAD2AgAhxAFAAPYCACHxAQEA8AIAIfIBAQDwAgAh8wFAAPYCACECAAAAdgAgGAAAgwEAIAauAQEA8AIAIcMBQAD2AgAhxAFAAPYCACHxAQEA8AIAIfIBAQDwAgAh8wFAAPYCACECAAAAeQAgGAAAhQEAIAIAAAB5ACAYAACFAQAgAwAAAHYAIB8AAH4AICAAAIMBACABAAAAdgAgAQAAAHkAIAMKAADrAwAgJQAA7QMAICYAAOwDACAJqwEAALcCADCsAQAAjAEAEK0BAAC3AgAwrgEBAIACACHDAUAAhwIAIcQBQACHAgAh8QEBAIACACHyAQEAgAIAIfMBQACHAgAhAwAAAHkAIAEAAIsBADAkAACMAQAgAwAAAHkAIAEAAHoAMAIAAHYAIAEAAAANACABAAAADQAgAwAAAAsAIAEAAAwAMAIAAA0AIAMAAAALACABAAAMADACAAANACADAAAACwAgAQAADAAwAgAADQAgFQYAAOYDACAJAADqAwAgCwAA5wMAIAwAAOgDACAOAADpAwAgrgEBAAAAAbgBAAAA7wECwwFAAAAAAcQBQAAAAAHYASAAAAAB2QFAAAAAAeQBAQAAAAHlAQEAAAAB5gEBAAAAAecBQAAAAAHoAQEAAAAB6QEBAAAAAesBAAAA6wEC7QEAAADtAQLvAQgAAAAB8AEBAAAAAQEYAACUAQAgEK4BAQAAAAG4AQAAAO8BAsMBQAAAAAHEAUAAAAAB2AEgAAAAAdkBQAAAAAHkAQEAAAAB5QEBAAAAAeYBAQAAAAHnAUAAAAAB6AEBAAAAAekBAQAAAAHrAQAAAOsBAu0BAAAA7QEC7wEIAAAAAfABAQAAAAEBGAAAlgEAMAEYAACWAQAwFQYAALQDACAJAAC4AwAgCwAAtQMAIAwAALYDACAOAAC3AwAgrgEBAPACACG4AQAAswPvASLDAUAA9gIAIcQBQAD2AgAh2AEgAIMDACHZAUAAhAMAIeQBAQDwAgAh5QEBAPACACHmAQEA9AIAIecBQAD2AgAh6AEBAPQCACHpAQEA9AIAIesBAACxA-sBIu0BAACyA-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_QIAICUAAIADACAmAAD_AgAgZwAA_gIAIGgAAIEDACDXAQAA6gIAINkBAADqAgAgDKsBAACZAgAwrAEAAOQBABCtAQAAmQIAMK4BAQCAAgAhsgEBAIACACGzAQEAgAIAIcMBQACHAgAhxAFAAIcCACHWAQIAmgIAIdcBAQCCAgAh2AEgAJsCACHZAUAAnAIAIQMAAAAZACABAADjAQAwJAAA5AEAIAMAAAAZACABAAAaADACAAAbACABAAAAFQAgAQAAABUAIAMAAAATACABAAAUADACAAAVACADAAAAEwAgAQAAFAAwAgAAFQAgAwAAABMAIAEAABQAMAIAABUAIBgDAAD6AgAgBwAA-wIAIAgAAPwCACCuAQEAAAABrwEBAAAAAbEBAAAAsQECsgEBAAAAAbMBAQAAAAG0AQEAAAABtQEIAAAAAbYBAQAAAAG4AQAAALgBArkBAQAAAAG6AQEAAAABuwEBAAAAAbwBAQAAAAG9AQgAAAABvgGAAAAAAb8BAQAAAAHAAQEAAAABwQEBAAAAAcIBgAAAAAHDAUAAAAABxAFAAAAAAQEYAADsAQAgFa4BAQAAAAGvAQEAAAABsQEAAACxAQKyAQEAAAABswEBAAAAAbQBAQAAAAG1AQgAAAABtgEBAAAAAbgBAAAAuAECuQEBAAAAAboBAQAAAAG7AQEAAAABvAEBAAAAAb0BCAAAAAG-AYAAAAABvwEBAAAAAcABAQAAAAHBAQEAAAABwgGAAAAAAcMBQAAAAAHEAUAAAAABARgAAO4BADABGAAA7gEAMAEAAAAPACAYAwAA9wIAIAcAAPgCACAIAAD5AgAgrgEBAPACACGvAQEA8AIAIbEBAADxArEBIrIBAQDwAgAhswEBAPACACG0AQEA9AIAIbUBCADyAgAhtgEBAPACACG4AQAA8wK4ASK5AQEA9AIAIboBAQD0AgAhuwEBAPQCACG8AQEA9AIAIb0BCAD1AgAhvgGAAAAAAb8BAQD0AgAhwAEBAPQCACHBAQEA9AIAIcIBgAAAAAHDAUAA9gIAIcQBQAD2AgAhAgAAABUAIBgAAPIBACAVrgEBAPACACGvAQEA8AIAIbEBAADxArEBIrIBAQDwAgAhswEBAPACACG0AQEA9AIAIbUBCADyAgAhtgEBAPACACG4AQAA8wK4ASK5AQEA9AIAIboBAQD0AgAhuwEBAPQCACG8AQEA9AIAIb0BCAD1AgAhvgGAAAAAAb8BAQD0AgAhwAEBAPQCACHBAQEA9AIAIcIBgAAAAAHDAUAA9gIAIcQBQAD2AgAhAgAAABMAIBgAAPQBACACAAAAEwAgGAAA9AEAIAEAAAAPACADAAAAFQAgHwAA7AEAICAAAPIBACABAAAAFQAgAQAAABMAIBAKAADrAgAgJQAA7gIAICYAAO0CACBnAADsAgAgaAAA7wIAILQBAADqAgAguQEAAOoCACC6AQAA6gIAILsBAADqAgAgvAEAAOoCACC9AQAA6gIAIL4BAADqAgAgvwEAAOoCACDAAQAA6gIAIMEBAADqAgAgwgEAAOoCACAYqwEAAP8BADCsAQAA_AEAEK0BAAD_AQAwrgEBAIACACGvAQEAgAIAIbEBAACBArEBIrIBAQCAAgAhswEBAIACACG0AQEAggIAIbUBCACDAgAhtgEBAIACACG4AQAAhAK4ASK5AQEAggIAIboBAQCCAgAhuwEBAIICACG8AQEAggIAIb0BCACFAgAhvgEAAIYCACC_AQEAggIAIcABAQCCAgAhwQEBAIICACHCAQAAhgIAIMMBQACHAgAhxAFAAIcCACEDAAAAEwAgAQAA-wEAMCQAAPwBACADAAAAEwAgAQAAFAAwAgAAFQAgGKsBAAD_AQAwrAEAAPwBABCtAQAA_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_gEBAIICACH_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_AQEAyQIAIcABAQDJAgAhwQEBAMkCACHCAQAA3gIAIMMBQAC6AgAhxAFAALoCACEExQEAAACxAQLGAQAAALEBCMcBAAAAsQEIzAEAAJYCsQEiCMUBCAAAAAHGAQgAAAAExwEIAAAABMgBCAAAAAHJAQgAAAABygEIAAAAAcsBCAAAAAHMAQgAkgIAIQTFAQAAALgBAsYBAAAAuAEIxwEAAAC4AQjMAQAAkAK4ASIIxQEIAAAAAcYBCAAAAAXHAQgAAAAFyAEIAAAAAckBCAAAAAHKAQgAAAABywEIAAAAAcwBCACOAgAhDMUBgAAAAAHIAYAAAAAByQGAAAAAAcoBgAAAAAHLAYAAAAABzAGAAAAAAc0BAQAAAAHOAQEAAAABzwEBAAAAAdABgAAAAAHRAYAAAAAB0gGAAAAAARYDAADVAgAgBwAA1AIAIAkAANACACCrAQAA4QIAMKwBAAAPABCtAQAA4QIAMK4BAQC5AgAhsgEBALkCACGzAQEAuQIAIbgBAADiAt0BIsMBQAC6AgAhxAFAALoCACHYASAAxQIAIdkBQADIAgAh3gEAAOMC3gEi3wEIAN0CACHgAUAAugIAIeEBQADIAgAh4gFAAMgCACHjAUAAyAIAIYoCAAAPACCLAgAADwAgArIBAQAAAAGzAQEAAAABFAMAANUCACAHAADUAgAgCQAA0AIAIKsBAADhAgAwrAEAAA8AEK0BAADhAgAwrgEBALkCACGyAQEAuQIAIbMBAQC5AgAhuAEAAOIC3QEiwwFAALoCACHEAUAAugIAIdgBIADFAgAh2QFAAMgCACHeAQAA4wLeASLfAQgA3QIAIeABQAC6AgAh4QFAAMgCACHiAUAAyAIAIeMBQADIAgAhBMUBAAAA3QECxgEAAADdAQjHAQAAAN0BCMwBAACsAt0BIgTFAQAAAN4BAsYBAAAA3gEIxwEAAADeAQjMAQAAqgLeASIYBgAA1QIAIAkAANACACALAADNAgAgDAAAzgIAIA4AAM8CACCrAQAA5AIAMKwBAAALABCtAQAA5AIAMK4BAQC5AgAhuAEAAOcC7wEiwwFAALoCACHEAUAAugIAIdgBIADFAgAh2QFAAMgCACHkAQEAuQIAIeUBAQC5AgAh5gEBAMkCACHnAUAAugIAIegBAQDJAgAh6QEBAMkCACHrAQAA5QLrASLtAQAA5gLtASLvAQgA2wIAIfABAQC5AgAhBMUBAAAA6wECxgEAAADrAQjHAQAAAOsBCMwBAAC2AusBIgTFAQAAAO0BAsYBAAAA7QEIxwEAAADtAQjMAQAAtALtASIExQEAAADvAQLGAQAAAO8BCMcBAAAA7wEIzAEAALIC7wEiEQMAANUCACCrAQAA6AIAMKwBAAAHABCtAQAA6AIAMK4BAQC5AgAhsgEBALkCACHDAUAAugIAIcQBQAC6AgAh9AEBALkCACH1AQEAuQIAIfYBAQDJAgAh9wEBAMkCACH4AQEAyQIAIfkBQADIAgAh-gFAAMgCACH7AQEAyQIAIfwBAQDJAgAhDAMAANUCACCrAQAA6QIAMKwBAAADABCtAQAA6QIAMK4BAQC5AgAhsgEBALkCACHDAUAAugIAIcQBQAC6AgAh8wFAALoCACH9AQEAuQIAIf4BAQDJAgAh_wEBAMkCACEAAAAAAAABjwIBAAAAAQGPAgAAALEBAgWPAggAAAABlQIIAAAAAZYCCAAAAAGXAggAAAABmAIIAAAAAQGPAgAAALgBAgGPAgEAAAABBY8CCAAAAAGVAggAAAABlgIIAAAAAZcCCAAAAAGYAggAAAABAY8CQAAAAAEFHwAAqwUAICAAALQFACCMAgAArAUAII0CAACzBQAgkgIAAAEAIAUfAACpBQAgIAAAsQUAIIwCAACqBQAgjQIAALAFACCSAgAADQAgBx8AAKcFACAgAACuBQAgjAIAAKgFACCNAgAArQUAIJACAAAPACCRAgAADwAgkgIAABEAIAMfAACrBQAgjAIAAKwFACCSAgAAAQAgAx8AAKkFACCMAgAAqgUAIJICAAANACADHwAApwUAIIwCAACoBQAgkgIAABEAIAAAAAAABY8CAgAAAAGVAgIAAAABlgICAAAAAZcCAgAAAAGYAgIAAAABAY8CIAAAAAEBjwJAAAAAAQUfAACfBQAgIAAApQUAIIwCAACgBQAgjQIAAKQFACCSAgAADQAgBR8AAJ0FACAgAACiBQAgjAIAAJ4FACCNAgAAoQUAIJICAAABACADHwAAnwUAIIwCAACgBQAgkgIAAA0AIAMfAACdBQAgjAIAAJ4FACCSAgAAAQAgAAAAAY8CAAAA3AECBR8AAJIFACAgAACbBQAgjAIAAJMFACCNAgAAmgUAIJICAAANACAFHwAAkAUAICAAAJgFACCMAgAAkQUAII0CAACXBQAgkgIAAAEAIAUfAACOBQAgIAAAlQUAIIwCAACPBQAgjQIAAJQFACCSAgAAAQAgAx8AAJIFACCMAgAAkwUAIJICAAANACADHwAAkAUAIIwCAACRBQAgkgIAAAEAIAMfAACOBQAgjAIAAI8FACCSAgAAAQAgAAAAAAABjwIAAADdAQIBjwIAAADeAQIFHwAAhQUAICAAAIwFACCMAgAAhgUAII0CAACLBQAgkgIAAA0AIAUfAACDBQAgIAAAiQUAIIwCAACEBQAgjQIAAIgFACCSAgAAAQAgCx8AAJ0DADAgAACiAwAwjAIAAJ4DADCNAgAAnwMAMI4CAACgAwAgjwIAAKEDADCQAgAAoQMAMJECAAChAwAwkgIAAKEDADCTAgAAowMAMJQCAACkAwAwFgMAAPoCACAHAAD7AgAgrgEBAAAAAa8BAQAAAAGxAQAAALEBArIBAQAAAAGzAQEAAAABtQEIAAAAAbYBAQAAAAG4AQAAALgBArkBAQAAAAG6AQEAAAABuwEBAAAAAbwBAQAAAAG9AQgAAAABvgGAAAAAAb8BAQAAAAHAAQEAAAABwQEBAAAAAcIBgAAAAAHDAUAAAAABxAFAAAAAAQIAAAAVACAfAACoAwAgAwAAABUAIB8AAKgDACAgAACnAwAgARgAAIcFADAbAwAA1QIAIAcAANQCACAIAADfAgAgqwEAANkCADCsAQAAEwAQrQEAANkCADCuAQEAAAABrwEBAAAAAbEBAADaArEBIrIBAQC5AgAhswEBALkCACG0AQEAyQIAIbUBCADbAgAhtgEBALkCACG4AQAA3AK4ASK5AQEAyQIAIboBAQDJAgAhuwEBAMkCACG8AQEAyQIAIb0BCADdAgAhvgEAAN4CACC_AQEAyQIAIcABAQDJAgAhwQEBAMkCACHCAQAA3gIAIMMBQAC6AgAhxAFAALoCACECAAAAFQAgGAAApwMAIAIAAAClAwAgGAAApgMAIBirAQAApAMAMKwBAAClAwAQrQEAAKQDADCuAQEAuQIAIa8BAQC5AgAhsQEAANoCsQEisgEBALkCACGzAQEAuQIAIbQBAQDJAgAhtQEIANsCACG2AQEAuQIAIbgBAADcArgBIrkBAQDJAgAhugEBAMkCACG7AQEAyQIAIbwBAQDJAgAhvQEIAN0CACG-AQAA3gIAIL8BAQDJAgAhwAEBAMkCACHBAQEAyQIAIcIBAADeAgAgwwFAALoCACHEAUAAugIAIRirAQAApAMAMKwBAAClAwAQrQEAAKQDADCuAQEAuQIAIa8BAQC5AgAhsQEAANoCsQEisgEBALkCACGzAQEAuQIAIbQBAQDJAgAhtQEIANsCACG2AQEAuQIAIbgBAADcArgBIrkBAQDJAgAhugEBAMkCACG7AQEAyQIAIbwBAQDJAgAhvQEIAN0CACG-AQAA3gIAIL8BAQDJAgAhwAEBAMkCACHBAQEAyQIAIcIBAADeAgAgwwFAALoCACHEAUAAugIAIRSuAQEA8AIAIa8BAQDwAgAhsQEAAPECsQEisgEBAPACACGzAQEA8AIAIbUBCADyAgAhtgEBAPACACG4AQAA8wK4ASK5AQEA9AIAIboBAQD0AgAhuwEBAPQCACG8AQEA9AIAIb0BCAD1AgAhvgGAAAAAAb8BAQD0AgAhwAEBAPQCACHBAQEA9AIAIcIBgAAAAAHDAUAA9gIAIcQBQAD2AgAhFgMAAPcCACAHAAD4AgAgrgEBAPACACGvAQEA8AIAIbEBAADxArEBIrIBAQDwAgAhswEBAPACACG1AQgA8gIAIbYBAQDwAgAhuAEAAPMCuAEiuQEBAPQCACG6AQEA9AIAIbsBAQD0AgAhvAEBAPQCACG9AQgA9QIAIb4BgAAAAAG_AQEA9AIAIcABAQD0AgAhwQEBAPQCACHCAYAAAAABwwFAAPYCACHEAUAA9gIAIRYDAAD6AgAgBwAA-wIAIK4BAQAAAAGvAQEAAAABsQEAAACxAQKyAQEAAAABswEBAAAAAbUBCAAAAAG2AQEAAAABuAEAAAC4AQK5AQEAAAABugEBAAAAAbsBAQAAAAG8AQEAAAABvQEIAAAAAb4BgAAAAAG_AQEAAAABwAEBAAAAAcEBAQAAAAHCAYAAAAABwwFAAAAAAcQBQAAAAAEDHwAAhQUAIIwCAACGBQAgkgIAAA0AIAMfAACDBQAgjAIAAIQFACCSAgAAAQAgBB8AAJ0DADCMAgAAngMAMI4CAACgAwAgkgIAAKEDADAAAAAAAAGPAgAAAOsBAgGPAgAAAO0BAgGPAgAAAO8BAgUfAAD6BAAgIAAAgQUAIIwCAAD7BAAgjQIAAIAFACCSAgAAAQAgCx8AANoDADAgAADfAwAwjAIAANsDADCNAgAA3AMAMI4CAADdAwAgjwIAAN4DADCQAgAA3gMAMJECAADeAwAwkgIAAN4DADCTAgAA4AMAMJQCAADhAwAwCx8AAM4DADAgAADTAwAwjAIAAM8DADCNAgAA0AMAMI4CAADRAwAgjwIAANIDADCQAgAA0gMAMJECAADSAwAwkgIAANIDADCTAgAA1AMAMJQCAADVAwAwCx8AAMIDADAgAADHAwAwjAIAAMMDADCNAgAAxAMAMI4CAADFAwAgjwIAAMYDADCQAgAAxgMAMJECAADGAwAwkgIAAMYDADCTAgAAyAMAMJQCAADJAwAwCx8AALkDADAgAAC9AwAwjAIAALoDADCNAgAAuwMAMI4CAAC8AwAgjwIAAKEDADCQAgAAoQMAMJECAAChAwAwkgIAAKEDADCTAgAAvgMAMJQCAACkAwAwFgMAAPoCACAIAAD8AgAgrgEBAAAAAa8BAQAAAAGxAQAAALEBArIBAQAAAAG0AQEAAAABtQEIAAAAAbYBAQAAAAG4AQAAALgBArkBAQAAAAG6AQEAAAABuwEBAAAAAbwBAQAAAAG9AQgAAAABvgGAAAAAAb8BAQAAAAHAAQEAAAABwQEBAAAAAcIBgAAAAAHDAUAAAAABxAFAAAAAAQIAAAAVACAfAADBAwAgAwAAABUAIB8AAMEDACAgAADAAwAgARgAAP8EADACAAAAFQAgGAAAwAMAIAIAAAClAwAgGAAAvwMAIBSuAQEA8AIAIa8BAQDwAgAhsQEAAPECsQEisgEBAPACACG0AQEA9AIAIbUBCADyAgAhtgEBAPACACG4AQAA8wK4ASK5AQEA9AIAIboBAQD0AgAhuwEBAPQCACG8AQEA9AIAIb0BCAD1AgAhvgGAAAAAAb8BAQD0AgAhwAEBAPQCACHBAQEA9AIAIcIBgAAAAAHDAUAA9gIAIcQBQAD2AgAhFgMAAPcCACAIAAD5AgAgrgEBAPACACGvAQEA8AIAIbEBAADxArEBIrIBAQDwAgAhtAEBAPQCACG1AQgA8gIAIbYBAQDwAgAhuAEAAPMCuAEiuQEBAPQCACG6AQEA9AIAIbsBAQD0AgAhvAEBAPQCACG9AQgA9QIAIb4BgAAAAAG_AQEA9AIAIcABAQD0AgAhwQEBAPQCACHCAYAAAAABwwFAAPYCACHEAUAA9gIAIRYDAAD6AgAgCAAA_AIAIK4BAQAAAAGvAQEAAAABsQEAAACxAQKyAQEAAAABtAEBAAAAAbUBCAAAAAG2AQEAAAABuAEAAAC4AQK5AQEAAAABugEBAAAAAbsBAQAAAAG8AQEAAAABvQEIAAAAAb4BgAAAAAG_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-BAAwIAAAwwQAMIwCAAC_BAAwjQIAAMAEADCOAgAAwQQAII8CAADCBAAwkAIAAMIEADCRAgAAwgQAMJICAADCBAAwkwIAAMQEADCUAgAAxQQAMAsfAACyBAAwIAAAtwQAMIwCAACzBAAwjQIAALQEADCOAgAAtQQAII8CAAC2BAAwkAIAALYEADCRAgAAtgQAMJICAAC2BAAwkwIAALgEADCUAgAAuQQAMAsfAACpBAAwIAAArQQAMIwCAACqBAAwjQIAAKsEADCOAgAArAQAII8CAADeAwAwkAIAAN4DADCRAgAA3gMAMJICAADeAwAwkwIAAK4EADCUAgAA4QMAMAsfAACgBAAwIAAApAQAMIwCAAChBAAwjQIAAKIEADCOAgAAowQAII8CAADSAwAwkAIAANIDADCRAgAA0gMAMJICAADSAwAwkwIAAKUEADCUAgAA1QMAMAsfAACXBAAwIAAAmwQAMIwCAACYBAAwjQIAAJkEADCOAgAAmgQAII8CAADGAwAwkAIAAMYDADCRAgAAxgMAMJICAADGAwAwkwIAAJwEADCUAgAAyQMAMAsfAACOBAAwIAAAkgQAMIwCAACPBAAwjQIAAJAEADCOAgAAkQQAII8CAADGAwAwkAIAAMYDADCRAgAAxgMAMJICAADGAwAwkwIAAJMEADCUAgAAyQMAMAsfAACFBAAwIAAAiQQAMIwCAACGBAAwjQIAAIcEADCOAgAAiAQAII8CAAChAwAwkAIAAKEDADCRAgAAoQMAMJICAAChAwAwkwIAAIoEADCUAgAApAMAMBYHAAD7AgAgCAAA_AIAIK4BAQAAAAGvAQEAAAABsQEAAACxAQKzAQEAAAABtAEBAAAAAbUBCAAAAAG2AQEAAAABuAEAAAC4AQK5AQEAAAABugEBAAAAAbsBAQAAAAG8AQEAAAABvQEIAAAAAb4BgAAAAAG_AQEAAAABwAEBAAAAAcEBAQAAAAHCAYAAAAABwwFAAAAAAcQBQAAAAAECAAAAFQAgHwAAjQQAIAMAAAAVACAfAACNBAAgIAAAjAQAIAEYAADvBAAwAgAAABUAIBgAAIwEACACAAAApQMAIBgAAIsEACAUrgEBAPACACGvAQEA8AIAIbEBAADxArEBIrMBAQDwAgAhtAEBAPQCACG1AQgA8gIAIbYBAQDwAgAhuAEAAPMCuAEiuQEBAPQCACG6AQEA9AIAIbsBAQD0AgAhvAEBAPQCACG9AQgA9QIAIb4BgAAAAAG_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-uAQEA8AIAIbgBAACzA-8BIsMBQAD2AgAhxAFAAPYCACHYASAAgwMAIdkBQACEAwAh5AEBAPACACHlAQEA8AIAIeYBAQD0AgAh5wFAAPYCACHoAQEA9AIAIekBAQD0AgAh6wEAALED6wEi7QEAALID7QEi7wEIAPICACETCQAAuAMAIAsAALUDACAMAAC2AwAgDgAAtwMAIK4BAQDwAgAhuAEAALMD7wEiwwFAAPYCACHEAUAA9gIAIdgBIACDAwAh2QFAAIQDACHkAQEA8AIAIeUBAQDwAgAh5gEBAPQCACHnAUAA9gIAIegBAQD0AgAh6QEBAPQCACHrAQAAsQPrASLtAQAAsgPtASLvAQgA8gIAIRMJAADqAwAgCwAA5wMAIAwAAOgDACAOAADpAwAgrgEBAAAAAbgBAAAA7wECwwFAAAAAAcQBQAAAAAHYASAAAAAB2QFAAAAAAeQBAQAAAAHlAQEAAAAB5gEBAAAAAecBQAAAAAHoAQEAAAAB6QEBAAAAAesBAAAA6wEC7QEAAADtAQLvAQgAAAABDK4BAQAAAAHDAUAAAAABxAFAAAAAAfQBAQAAAAH1AQEAAAAB9gEBAAAAAfcBAQAAAAH4AQEAAAAB-QFAAAAAAfoBQAAAAAH7AQEAAAAB_AEBAAAAAQIAAAAJACAfAADJBAAgAwAAAAkAIB8AAMkEACAgAADIBAAgARgAAOkEADARAwAA1QIAIKsBAADoAgAwrAEAAAcAEK0BAADoAgAwrgEBAAAAAbIBAQC5AgAhwwFAALoCACHEAUAAugIAIfQBAQC5AgAh9QEBALkCACH2AQEAyQIAIfcBAQDJAgAh-AEBAMkCACH5AUAAyAIAIfoBQADIAgAh-wEBAMkCACH8AQEAyQIAIQIAAAAJACAYAADIBAAgAgAAAMYEACAYAADHBAAgEKsBAADFBAAwrAEAAMYEABCtAQAAxQQAMK4BAQC5AgAhsgEBALkCACHDAUAAugIAIcQBQAC6AgAh9AEBALkCACH1AQEAuQIAIfYBAQDJAgAh9wEBAMkCACH4AQEAyQIAIfkBQADIAgAh-gFAAMgCACH7AQEAyQIAIfwBAQDJAgAhEKsBAADFBAAwrAEAAMYEABCtAQAAxQQAMK4BAQC5AgAhsgEBALkCACHDAUAAugIAIcQBQAC6AgAh9AEBALkCACH1AQEAuQIAIfYBAQDJAgAh9wEBAMkCACH4AQEAyQIAIfkBQADIAgAh-gFAAMgCACH7AQEAyQIAIfwBAQDJAgAhDK4BAQDwAgAhwwFAAPYCACHEAUAA9gIAIfQBAQDwAgAh9QEBAPACACH2AQEA9AIAIfcBAQD0AgAh-AEBAPQCACH5AUAAhAMAIfoBQACEAwAh-wEBAPQCACH8AQEA9AIAIQyuAQEA8AIAIcMBQAD2AgAhxAFAAPYCACH0AQEA8AIAIfUBAQDwAgAh9gEBAPQCACH3AQEA9AIAIfgBAQD0AgAh-QFAAIQDACH6AUAAhAMAIfsBAQD0AgAh_AEBAPQCACEMrgEBAAAAAcMBQAAAAAHEAUAAAAAB9AEBAAAAAfUBAQAAAAH2AQEAAAAB9wEBAAAAAfgBAQAAAAH5AUAAAAAB-gFAAAAAAfsBAQAAAAH8AQEAAAABB64BAQAAAAHDAUAAAAABxAFAAAAAAfMBQAAAAAH9AQEAAAAB_gEBAAAAAf8BAQAAAAECAAAABQAgHwAA1QQAIAMAAAAFACAfAADVBAAgIAAA1AQAIAEYAADoBAAwDAMAANUCACCrAQAA6QIAMKwBAAADABCtAQAA6QIAMK4BAQAAAAGyAQEAuQIAIcMBQAC6AgAhxAFAALoCACHzAUAAugIAIf0BAQAAAAH-AQEAyQIAIf8BAQDJAgAhAgAAAAUAIBgAANQEACACAAAA0gQAIBgAANMEACALqwEAANEEADCsAQAA0gQAEK0BAADRBAAwrgEBALkCACGyAQEAuQIAIcMBQAC6AgAhxAFAALoCACHzAUAAugIAIf0BAQC5AgAh_gEBAMkCACH_AQEAyQIAIQurAQAA0QQAMKwBAADSBAAQrQEAANEEADCuAQEAuQIAIbIBAQC5AgAhwwFAALoCACHEAUAAugIAIfMBQAC6AgAh_QEBALkCACH-AQEAyQIAIf8BAQDJAgAhB64BAQDwAgAhwwFAAPYCACHEAUAA9gIAIfMBQAD2AgAh_QEBAPACACH-AQEA9AIAIf8BAQD0AgAhB64BAQDwAgAhwwFAAPYCACHEAUAA9gIAIfMBQAD2AgAh_QEBAPACACH-AQEA9AIAIf8BAQD0AgAhB64BAQAAAAHDAUAAAAABxAFAAAAAAfMBQAAAAAH9AQEAAAAB_gEBAAAAAf8BAQAAAAEEHwAAygQAMIwCAADLBAAwjgIAAM0EACCSAgAAzgQAMAQfAAC-BAAwjAIAAL8EADCOAgAAwQQAIJICAADCBAAwBB8AALIEADCMAgAAswQAMI4CAAC1BAAgkgIAALYEADAEHwAAqQQAMIwCAACqBAAwjgIAAKwEACCSAgAA3gMAMAQfAACgBAAwjAIAAKEEADCOAgAAowQAIJICAADSAwAwBB8AAJcEADCMAgAAmAQAMI4CAACaBAAgkgIAAMYDADAEHwAAjgQAMIwCAACPBAAwjgIAAJEEACCSAgAAxgMAMAQfAACFBAAwjAIAAIYEADCOAgAAiAQAIJICAAChAwAwAAAAAAAAAAkGAADmBAAgCQAA5AQAIAsAAOEEACAMAADiBAAgDgAA4wQAINkBAADqAgAg5gEAAOoCACDoAQAA6gIAIOkBAADqAgAgCgQAAN4EACAFAADfBAAgCQAA5AQAIA4AAOMEACAPAADgBAAgEAAA4QQAIBEAAOIEACASAADjBAAg2QEAAOoCACDmAQAA6gIAIAgDAADmBAAgBwAA5QQAIAkAAOQEACDZAQAA6gIAIN8BAADqAgAg4QEAAOoCACDiAQAA6gIAIOMBAADqAgAgB64BAQAAAAHDAUAAAAABxAFAAAAAAfMBQAAAAAH9AQEAAAAB_gEBAAAAAf8BAQAAAAEMrgEBAAAAAcMBQAAAAAHEAUAAAAAB9AEBAAAAAfUBAQAAAAH2AQEAAAAB9wEBAAAAAfgBAQAAAAH5AUAAAAAB-gFAAAAAAfsBAQAAAAH8AQEAAAABD64BAQAAAAG4AQAAAO8BAsMBQAAAAAHEAUAAAAAB2AEgAAAAAdkBQAAAAAHkAQEAAAAB5QEBAAAAAeYBAQAAAAHnAUAAAAAB6AEBAAAAAekBAQAAAAHrAQAAAOsBAu0BAAAA7QEC7wEIAAAAAQ2uAQEAAAABswEBAAAAAbgBAAAA3QECwwFAAAAAAcQBQAAAAAHYASAAAAAB2QFAAAAAAd4BAAAA3gEC3wEIAAAAAeABQAAAAAHhAUAAAAAB4gFAAAAAAeMBQAAAAAEIrgEBAAAAAbMBAQAAAAHDAUAAAAABxAFAAAAAAdYBAgAAAAHXAQEAAAAB2AEgAAAAAdkBQAAAAAEIrgEBAAAAAbMBAQAAAAG4AQAAANwBAsMBQAAAAAHEAUAAAAAB2AEgAAAAAdkBQAAAAAHaAQEAAAABCK4BAQAAAAGyAQEAAAABswEBAAAAAbgBAAAA3AECwwFAAAAAAcQBQAAAAAHYASAAAAAB2QFAAAAAARSuAQEAAAABrwEBAAAAAbEBAAAAsQECswEBAAAAAbQBAQAAAAG1AQgAAAABtgEBAAAAAbgBAAAAuAECuQEBAAAAAboBAQAAAAG7AQEAAAABvAEBAAAAAb0BCAAAAAG-AYAAAAABvwEBAAAAAcABAQAAAAHBAQEAAAABwgGAAAAAAcMBQAAAAAHEAUAAAAABEgUAANcEACAJAADdBAAgDgAA2wQAIA8AANgEACAQAADZBAAgEQAA2gQAIBIAANwEACCuAQEAAAABuAEAAACGAgLDAUAAAAABxAFAAAAAAdgBIAAAAAHZAUAAAAAB5gEBAAAAAYACAQAAAAGBAgEAAAABggIgAAAAAYQCAAAAhAICAgAAAAEAIB8AAPAEACADAAAANAAgHwAA8AQAICAAAPQEACAUAAAANAAgBQAA_gMAIAkAAIQEACAOAACCBAAgDwAA_wMAIBAAAIAEACARAACBBAAgEgAAgwQAIBgAAPQEACCuAQEA8AIAIbgBAAD8A4YCIsMBQAD2AgAhxAFAAPYCACHYASAAgwMAIdkBQACEAwAh5gEBAPQCACGAAgEA8AIAIYECAQDwAgAhggIgAIMDACGEAgAA-wOEAiISBQAA_gMAIAkAAIQEACAOAACCBAAgDwAA_wMAIBAAAIAEACARAACBBAAgEgAAgwQAIK4BAQDwAgAhuAEAAPwDhgIiwwFAAPYCACHEAUAA9gIAIdgBIACDAwAh2QFAAIQDACHmAQEA9AIAIYACAQDwAgAhgQIBAPACACGCAiAAgwMAIYQCAAD7A4QCIhIEAADWBAAgCQAA3QQAIA4AANsEACAPAADYBAAgEAAA2QQAIBEAANoEACASAADcBAAgrgEBAAAAAbgBAAAAhgICwwFAAAAAAcQBQAAAAAHYASAAAAAB2QFAAAAAAeYBAQAAAAGAAgEAAAABgQIBAAAAAYICIAAAAAGEAgAAAIQCAgIAAAABACAfAAD1BAAgAwAAADQAIB8AAPUEACAgAAD5BAAgFAAAADQAIAQAAP0DACAJAACEBAAgDgAAggQAIA8AAP8DACAQAACABAAgEQAAgQQAIBIAAIMEACAYAAD5BAAgrgEBAPACACG4AQAA_AOGAiLDAUAA9gIAIcQBQAD2AgAh2AEgAIMDACHZAUAAhAMAIeYBAQD0AgAhgAIBAPACACGBAgEA8AIAIYICIACDAwAhhAIAAPsDhAIiEgQAAP0DACAJAACEBAAgDgAAggQAIA8AAP8DACAQAACABAAgEQAAgQQAIBIAAIMEACCuAQEA8AIAIbgBAAD8A4YCIsMBQAD2AgAhxAFAAPYCACHYASAAgwMAIdkBQACEAwAh5gEBAPQCACGAAgEA8AIAIYECAQDwAgAhggIgAIMDACGEAgAA-wOEAiISBAAA1gQAIAUAANcEACAJAADdBAAgDgAA2wQAIBAAANkEACARAADaBAAgEgAA3AQAIK4BAQAAAAG4AQAAAIYCAsMBQAAAAAHEAUAAAAAB2AEgAAAAAdkBQAAAAAHmAQEAAAABgAIBAAAAAYECAQAAAAGCAiAAAAABhAIAAACEAgICAAAAAQAgHwAA-gQAIA2uAQEAAAABsgEBAAAAAbgBAAAA3QECwwFAAAAAAcQBQAAAAAHYASAAAAAB2QFAAAAAAd4BAAAA3gEC3wEIAAAAAeABQAAAAAHhAUAAAAAB4gFAAAAAAeMBQAAAAAEIrgEBAAAAAbIBAQAAAAHDAUAAAAABxAFAAAAAAdYBAgAAAAHXAQEAAAAB2AEgAAAAAdkBQAAAAAEIrgEBAAAAAbIBAQAAAAG4AQAAANwBAsMBQAAAAAHEAUAAAAAB2AEgAAAAAdkBQAAAAAHaAQEAAAABFK4BAQAAAAGvAQEAAAABsQEAAACxAQKyAQEAAAABtAEBAAAAAbUBCAAAAAG2AQEAAAABuAEAAAC4AQK5AQEAAAABugEBAAAAAbsBAQAAAAG8AQEAAAABvQEIAAAAAb4BgAAAAAG_AQEAAAABwAEBAAAAAcEBAQAAAAHCAYAAAAABwwFAAAAAAcQBQAAAAAEDAAAANAAgHwAA-gQAICAAAIIFACAUAAAANAAgBAAA_QMAIAUAAP4DACAJAACEBAAgDgAAggQAIBAAAIAEACARAACBBAAgEgAAgwQAIBgAAIIFACCuAQEA8AIAIbgBAAD8A4YCIsMBQAD2AgAhxAFAAPYCACHYASAAgwMAIdkBQACEAwAh5gEBAPQCACGAAgEA8AIAIYECAQDwAgAhggIgAIMDACGEAgAA-wOEAiISBAAA_QMAIAUAAP4DACAJAACEBAAgDgAAggQAIBAAAIAEACARAACBBAAgEgAAgwQAIK4BAQDwAgAhuAEAAPwDhgIiwwFAAPYCACHEAUAA9gIAIdgBIACDAwAh2QFAAIQDACHmAQEA9AIAIYACAQDwAgAhgQIBAPACACGCAiAAgwMAIYQCAAD7A4QCIhIEAADWBAAgBQAA1wQAIAkAAN0EACAOAADbBAAgDwAA2AQAIBEAANoEACASAADcBAAgrgEBAAAAAbgBAAAAhgICwwFAAAAAAcQBQAAAAAHYASAAAAAB2QFAAAAAAeYBAQAAAAGAAgEAAAABgQIBAAAAAYICIAAAAAGEAgAAAIQCAgIAAAABACAfAACDBQAgFAYAAOYDACAJAADqAwAgDAAA6AMAIA4AAOkDACCuAQEAAAABuAEAAADvAQLDAUAAAAABxAFAAAAAAdgBIAAAAAHZAUAAAAAB5AEBAAAAAeUBAQAAAAHmAQEAAAAB5wFAAAAAAegBAQAAAAHpAQEAAAAB6wEAAADrAQLtAQAAAO0BAu8BCAAAAAHwAQEAAAABAgAAAA0AIB8AAIUFACAUrgEBAAAAAa8BAQAAAAGxAQAAALEBArIBAQAAAAGzAQEAAAABtQEIAAAAAbYBAQAAAAG4AQAAALgBArkBAQAAAAG6AQEAAAABuwEBAAAAAbwBAQAAAAG9AQgAAAABvgGAAAAAAb8BAQAAAAHAAQEAAAABwQEBAAAAAcIBgAAAAAHDAUAAAAABxAFAAAAAAQMAAAA0ACAfAACDBQAgIAAAigUAIBQAAAA0ACAEAAD9AwAgBQAA_gMAIAkAAIQEACAOAACCBAAgDwAA_wMAIBEAAIEEACASAACDBAAgGAAAigUAIK4BAQDwAgAhuAEAAPwDhgIiwwFAAPYCACHEAUAA9gIAIdgBIACDAwAh2QFAAIQDACHmAQEA9AIAIYACAQDwAgAhgQIBAPACACGCAiAAgwMAIYQCAAD7A4QCIhIEAAD9AwAgBQAA_gMAIAkAAIQEACAOAACCBAAgDwAA_wMAIBEAAIEEACASAACDBAAgrgEBAPACACG4AQAA_AOGAiLDAUAA9gIAIcQBQAD2AgAh2AEgAIMDACHZAUAAhAMAIeYBAQD0AgAhgAIBAPACACGBAgEA8AIAIYICIACDAwAhhAIAAPsDhAIiAwAAAAsAIB8AAIUFACAgAACNBQAgFgAAAAsAIAYAALQDACAJAAC4AwAgDAAAtgMAIA4AALcDACAYAACNBQAgrgEBAPACACG4AQAAswPvASLDAUAA9gIAIcQBQAD2AgAh2AEgAIMDACHZAUAAhAMAIeQBAQDwAgAh5QEBAPACACHmAQEA9AIAIecBQAD2AgAh6AEBAPQCACHpAQEA9AIAIesBAACxA-sBIu0BAACyA-0BIu8BCADyAgAh8AEBAPACACEUBgAAtAMAIAkAALgDACAMAAC2AwAgDgAAtwMAIK4BAQDwAgAhuAEAALMD7wEiwwFAAPYCACHEAUAA9gIAIdgBIACDAwAh2QFAAIQDACHkAQEA8AIAIeUBAQDwAgAh5gEBAPQCACHnAUAA9gIAIegBAQD0AgAh6QEBAPQCACHrAQAAsQPrASLtAQAAsgPtASLvAQgA8gIAIfABAQDwAgAhEgQAANYEACAFAADXBAAgCQAA3QQAIA4AANsEACAPAADYBAAgEAAA2QQAIBEAANoEACCuAQEAAAABuAEAAACGAgLDAUAAAAABxAFAAAAAAdgBIAAAAAHZAUAAAAAB5gEBAAAAAYACAQAAAAGBAgEAAAABggIgAAAAAYQCAAAAhAICAgAAAAEAIB8AAI4FACASBAAA1gQAIAUAANcEACAJAADdBAAgDwAA2AQAIBAAANkEACARAADaBAAgEgAA3AQAIK4BAQAAAAG4AQAAAIYCAsMBQAAAAAHEAUAAAAAB2AEgAAAAAdkBQAAAAAHmAQEAAAABgAIBAAAAAYECAQAAAAGCAiAAAAABhAIAAACEAgICAAAAAQAgHwAAkAUAIBQGAADmAwAgCQAA6gMAIAsAAOcDACAMAADoAwAgrgEBAAAAAbgBAAAA7wECwwFAAAAAAcQBQAAAAAHYASAAAAAB2QFAAAAAAeQBAQAAAAHlAQEAAAAB5gEBAAAAAecBQAAAAAHoAQEAAAAB6QEBAAAAAesBAAAA6wEC7QEAAADtAQLvAQgAAAAB8AEBAAAAAQIAAAANACAfAACSBQAgAwAAADQAIB8AAI4FACAgAACWBQAgFAAAADQAIAQAAP0DACAFAAD-AwAgCQAAhAQAIA4AAIIEACAPAAD_AwAgEAAAgAQAIBEAAIEEACAYAACWBQAgrgEBAPACACG4AQAA_AOGAiLDAUAA9gIAIcQBQAD2AgAh2AEgAIMDACHZAUAAhAMAIeYBAQD0AgAhgAIBAPACACGBAgEA8AIAIYICIACDAwAhhAIAAPsDhAIiEgQAAP0DACAFAAD-AwAgCQAAhAQAIA4AAIIEACAPAAD_AwAgEAAAgAQAIBEAAIEEACCuAQEA8AIAIbgBAAD8A4YCIsMBQAD2AgAhxAFAAPYCACHYASAAgwMAIdkBQACEAwAh5gEBAPQCACGAAgEA8AIAIYECAQDwAgAhggIgAIMDACGEAgAA-wOEAiIDAAAANAAgHwAAkAUAICAAAJkFACAUAAAANAAgBAAA_QMAIAUAAP4DACAJAACEBAAgDwAA_wMAIBAAAIAEACARAACBBAAgEgAAgwQAIBgAAJkFACCuAQEA8AIAIbgBAAD8A4YCIsMBQAD2AgAhxAFAAPYCACHYASAAgwMAIdkBQACEAwAh5gEBAPQCACGAAgEA8AIAIYECAQDwAgAhggIgAIMDACGEAgAA-wOEAiISBAAA_QMAIAUAAP4DACAJAACEBAAgDwAA_wMAIBAAAIAEACARAACBBAAgEgAAgwQAIK4BAQDwAgAhuAEAAPwDhgIiwwFAAPYCACHEAUAA9gIAIdgBIACDAwAh2QFAAIQDACHmAQEA9AIAIYACAQDwAgAhgQIBAPACACGCAiAAgwMAIYQCAAD7A4QCIgMAAAALACAfAACSBQAgIAAAnAUAIBYAAAALACAGAAC0AwAgCQAAuAMAIAsAALUDACAMAAC2AwAgGAAAnAUAIK4BAQDwAgAhuAEAALMD7wEiwwFAAPYCACHEAUAA9gIAIdgBIACDAwAh2QFAAIQDACHkAQEA8AIAIeUBAQDwAgAh5gEBAPQCACHnAUAA9gIAIegBAQD0AgAh6QEBAPQCACHrAQAAsQPrASLtAQAAsgPtASLvAQgA8gIAIfABAQDwAgAhFAYAALQDACAJAAC4AwAgCwAAtQMAIAwAALYDACCuAQEA8AIAIbgBAACzA-8BIsMBQAD2AgAhxAFAAPYCACHYASAAgwMAIdkBQACEAwAh5AEBAPACACHlAQEA8AIAIeYBAQD0AgAh5wFAAPYCACHoAQEA9AIAIekBAQD0AgAh6wEAALED6wEi7QEAALID7QEi7wEIAPICACHwAQEA8AIAIRIEAADWBAAgBQAA1wQAIAkAAN0EACAOAADbBAAgDwAA2AQAIBAAANkEACASAADcBAAgrgEBAAAAAbgBAAAAhgICwwFAAAAAAcQBQAAAAAHYASAAAAAB2QFAAAAAAeYBAQAAAAGAAgEAAAABgQIBAAAAAYICIAAAAAGEAgAAAIQCAgIAAAABACAfAACdBQAgFAYAAOYDACAJAADqAwAgCwAA5wMAIA4AAOkDACCuAQEAAAABuAEAAADvAQLDAUAAAAABxAFAAAAAAdgBIAAAAAHZAUAAAAAB5AEBAAAAAeUBAQAAAAHmAQEAAAAB5wFAAAAAAegBAQAAAAHpAQEAAAAB6wEAAADrAQLtAQAAAO0BAu8BCAAAAAHwAQEAAAABAgAAAA0AIB8AAJ8FACADAAAANAAgHwAAnQUAICAAAKMFACAUAAAANAAgBAAA_QMAIAUAAP4DACAJAACEBAAgDgAAggQAIA8AAP8DACAQAACABAAgEgAAgwQAIBgAAKMFACCuAQEA8AIAIbgBAAD8A4YCIsMBQAD2AgAhxAFAAPYCACHYASAAgwMAIdkBQACEAwAh5gEBAPQCACGAAgEA8AIAIYECAQDwAgAhggIgAIMDACGEAgAA-wOEAiISBAAA_QMAIAUAAP4DACAJAACEBAAgDgAAggQAIA8AAP8DACAQAACABAAgEgAAgwQAIK4BAQDwAgAhuAEAAPwDhgIiwwFAAPYCACHEAUAA9gIAIdgBIACDAwAh2QFAAIQDACHmAQEA9AIAIYACAQDwAgAhgQIBAPACACGCAiAAgwMAIYQCAAD7A4QCIgMAAAALACAfAACfBQAgIAAApgUAIBYAAAALACAGAAC0AwAgCQAAuAMAIAsAALUDACAOAAC3AwAgGAAApgUAIK4BAQDwAgAhuAEAALMD7wEiwwFAAPYCACHEAUAA9gIAIdgBIACDAwAh2QFAAIQDACHkAQEA8AIAIeUBAQDwAgAh5gEBAPQCACHnAUAA9gIAIegBAQD0AgAh6QEBAPQCACHrAQAAsQPrASLtAQAAsgPtASLvAQgA8gIAIfABAQDwAgAhFAYAALQDACAJAAC4AwAgCwAAtQMAIA4AALcDACCuAQEA8AIAIbgBAACzA-8BIsMBQAD2AgAhxAFAAPYCACHYASAAgwMAIdkBQACEAwAh5AEBAPACACHlAQEA8AIAIeYBAQD0AgAh5wFAAPYCACHoAQEA9AIAIekBAQD0AgAh6wEAALED6wEi7QEAALID7QEi7wEIAPICACHwAQEA8AIAIRADAACqAwAgBwAAqQMAIK4BAQAAAAGyAQEAAAABswEBAAAAAbgBAAAA3QECwwFAAAAAAcQBQAAAAAHYASAAAAAB2QFAAAAAAd4BAAAA3gEC3wEIAAAAAeABQAAAAAHhAUAAAAAB4gFAAAAAAeMBQAAAAAECAAAAEQAgHwAApwUAIBQGAADmAwAgCwAA5wMAIAwAAOgDACAOAADpAwAgrgEBAAAAAbgBAAAA7wECwwFAAAAAAcQBQAAAAAHYASAAAAAB2QFAAAAAAeQBAQAAAAHlAQEAAAAB5gEBAAAAAecBQAAAAAHoAQEAAAAB6QEBAAAAAesBAAAA6wEC7QEAAADtAQLvAQgAAAAB8AEBAAAAAQIAAAANACAfAACpBQAgEgQAANYEACAFAADXBAAgDgAA2wQAIA8AANgEACAQAADZBAAgEQAA2gQAIBIAANwEACCuAQEAAAABuAEAAACGAgLDAUAAAAABxAFAAAAAAdgBIAAAAAHZAUAAAAAB5gEBAAAAAYACAQAAAAGBAgEAAAABggIgAAAAAYQCAAAAhAICAgAAAAEAIB8AAKsFACADAAAADwAgHwAApwUAICAAAK8FACASAAAADwAgAwAAmwMAIAcAAJoDACAYAACvBQAgrgEBAPACACGyAQEA8AIAIbMBAQDwAgAhuAEAAJgD3QEiwwFAAPYCACHEAUAA9gIAIdgBIACDAwAh2QFAAIQDACHeAQAAmQPeASLfAQgA9QIAIeABQAD2AgAh4QFAAIQDACHiAUAAhAMAIeMBQACEAwAhEAMAAJsDACAHAACaAwAgrgEBAPACACGyAQEA8AIAIbMBAQDwAgAhuAEAAJgD3QEiwwFAAPYCACHEAUAA9gIAIdgBIACDAwAh2QFAAIQDACHeAQAAmQPeASLfAQgA9QIAIeABQAD2AgAh4QFAAIQDACHiAUAAhAMAIeMBQACEAwAhAwAAAAsAIB8AAKkFACAgAACyBQAgFgAAAAsAIAYAALQDACALAAC1AwAgDAAAtgMAIA4AALcDACAYAACyBQAgrgEBAPACACG4AQAAswPvASLDAUAA9gIAIcQBQAD2AgAh2AEgAIMDACHZAUAAhAMAIeQBAQDwAgAh5QEBAPACACHmAQEA9AIAIecBQAD2AgAh6AEBAPQCACHpAQEA9AIAIesBAACxA-sBIu0BAACyA-0BIu8BCADyAgAh8AEBAPACACEUBgAAtAMAIAsAALUDACAMAAC2AwAgDgAAtwMAIK4BAQDwAgAhuAEAALMD7wEiwwFAAPYCACHEAUAA9gIAIdgBIACDAwAh2QFAAIQDACHkAQEA8AIAIeUBAQDwAgAh5gEBAPQCACHnAUAA9gIAIegBAQD0AgAh6QEBAPQCACHrAQAAsQPrASLtAQAAsgPtASLvAQgA8gIAIfABAQDwAgAhAwAAADQAIB8AAKsFACAgAAC1BQAgFAAAADQAIAQAAP0DACAFAAD-AwAgDgAAggQAIA8AAP8DACAQAACABAAgEQAAgQQAIBIAAIMEACAYAAC1BQAgrgEBAPACACG4AQAA_AOGAiLDAUAA9gIAIcQBQAD2AgAh2AEgAIMDACHZAUAAhAMAIeYBAQD0AgAhgAIBAPACACGBAgEA8AIAIYICIACDAwAhhAIAAPsDhAIiEgQAAP0DACAFAAD-AwAgDgAAggQAIA8AAP8DACAQAACABAAgEQAAgQQAIBIAAIMEACCuAQEA8AIAIbgBAAD8A4YCIsMBQAD2AgAhxAFAAPYCACHYASAAgwMAIdkBQACEAwAh5gEBAPQCACGAAgEA8AIAIYECAQDwAgAhggIgAIMDACGEAgAA-wOEAiIJBAYCBQoDCSoGCgALDigJDw4EECYFEScIEikJAQMAAQEDAAEGBgABCSEGCgAKCxIFDBwIDiAJBAMAAQcABAkWBgoABwMDAAEHAAQIFwUBCRgAAgMAAQcABAMDAAEHAAQNAAEECSUACyIADCMADiQACAQrAAUsAAkyAA4wAA8tABAuABEvABIxAAAAAAMKABAlABEmABIAAAADCgAQJQARJgASAQMAAQEDAAEDCgAXJQAYJgAZAAAAAwoAFyUAGCYAGQEDAAEBAwABAwoAHiUAHyYAIAAAAAMKAB4lAB8mACAAAAADCgAmJQAnJgAoAAAAAwoAJiUAJyYAKAEGAAEBBgABBQoALSUAMCYAMWcALmgALwAAAAAABQoALSUAMCYAMWcALmgALwIDAAEHAAQCAwABBwAEBQoANiUAOSYAOmcAN2gAOAAAAAAABQoANiUAOSYAOmcAN2gAOAMDAAEHAAQNAAEDAwABBwAEDQABAwoAPyUAQCYAQQAAAAMKAD8lAEAmAEECAwABBwAEAgMAAQcABAUKAEYlAEkmAEpnAEdoAEgAAAAAAAUKAEYlAEkmAEpnAEdoAEgDAwABBwAECPEBBQMDAAEHAAQI9wEFBQoATyUAUiYAU2cAUGgAUQAAAAAABQoATyUAUiYAU2cAUGgAURMCARQzARU2ARY3ARc4ARk6ARo8DBs9DRw_AR1BDB5CDiFDASJEASNFDCdIDyhJEylKAipLAitMAixNAi1OAi5QAi9SDDBTFDFVAjJXDDNYFTRZAjVaAjZbDDdeFjhfGjlgAzphAztiAzxjAz1kAz5mAz9oDEBpG0FrA0JtDENuHERvA0VwA0ZxDEd0HUh1IUl3Ikp4Ikt7Ikx8Ik19Ik5_Ik-BAQxQggEjUYQBIlKGAQxThwEkVIgBIlWJASJWigEMV40BJViOASlZjwEEWpABBFuRAQRckgEEXZMBBF6VAQRflwEMYJgBKmGaAQRinAEMY50BK2SeAQRlnwEEZqABDGmjASxqpAEya6UBBWymAQVtpwEFbqgBBW-pAQVwqwEFca0BDHKuATNzsAEFdLIBDHWzATR2tAEFd7UBBXi2AQx5uQE1eroBO3u7AQl8vAEJfb0BCX6-AQl_vwEJgAHBAQmBAcMBDIIBxAE8gwHGAQmEAcgBDIUByQE9hgHKAQmHAcsBCYgBzAEMiQHPAT6KAdABQosB0QEIjAHSAQiNAdMBCI4B1AEIjwHVAQiQAdcBCJEB2QEMkgHaAUOTAdwBCJQB3gEMlQHfAUSWAeABCJcB4QEImAHiAQyZAeUBRZoB5gFLmwHnAQacAegBBp0B6QEGngHqAQafAesBBqAB7QEGoQHvAQyiAfABTKMB8wEGpAH1AQylAfYBTaYB-AEGpwH5AQaoAfoBDKkB_QFOqgH-AVQ"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/app/lib/prisma.ts
var connectionString = envVars.DATABASE_URL;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });
var ensureEventStatusSchema = async () => {
  await prisma.$executeRawUnsafe(`
DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'EventStatus') THEN
		CREATE TYPE "EventStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');
	END IF;
END
$$;
	`);
  await prisma.$executeRawUnsafe(`
ALTER TABLE "Event"
ADD COLUMN IF NOT EXISTS "status" "EventStatus" NOT NULL DEFAULT 'ACTIVE';
	`);
  await prisma.$executeRawUnsafe(`
CREATE INDEX IF NOT EXISTS "Event_status_idx" ON "Event" ("status");
	`);
};
var prismaSchemaReady = ensureEventStatusSchema().catch((error) => {
  console.error("Failed to ensure Event.status schema compatibility:", error);
  throw error;
});

// src/app/lib/auth.ts
import { bearer, emailOTP } from "better-auth/plugins";

// src/app/utils/email.ts
import nodemailer from "nodemailer";
import status2 from "http-status";
import path2 from "path";
import ejs from "ejs";
var transporter = nodemailer.createTransport({
  host: envVars.EMAIL_SENDER.SMTP_HOST,
  secure: true,
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASS
  },
  port: parseInt(envVars.EMAIL_SENDER.SMTP_PORT)
});
var sendEmail = async ({
  subject,
  templateData,
  templateName,
  to,
  attachments
}) => {
  try {
    const templatePath = path2.resolve(
      process.cwd(),
      `src/app/templates/${templateName}.ejs`
    );
    const html = await ejs.renderFile(templatePath, templateData);
    const info = await transporter.sendMail({
      from: envVars.EMAIL_SENDER.SMTP_FROM,
      to,
      subject,
      html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType
      }))
    });
    console.log(`Email send to ${to} :${info.messageId}`);
  } catch (error) {
    console.log("Email sending error ", error.message);
    throw new AppError_default(status2.INTERNAL_SERVER_ERROR, "Failed to send email");
  }
};

// src/app/lib/auth.ts
var auth = betterAuth({
  baseURL: envVars.BETTER_AUTH_URL,
  secret: envVars.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true
  },
  socialProviders: {
    google: {
      clientId: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      mapProfileToUser: () => {
        return {
          role: Role.USER,
          status: UserStatus.ACTIVE,
          emailVerified: true,
          isDeleted: false,
          deletedAt: null
        };
      }
    }
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: Role.USER
      },
      status: {
        type: "string",
        required: true,
        defaultValue: UserStatus.ACTIVE
      },
      isDeleted: {
        type: "boolean",
        required: true,
        defaultValue: false
      },
      deletedAt: {
        type: "date",
        required: false,
        defaultValue: null
      }
    }
  },
  plugins: [
    bearer(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "email-verification") {
          const user = await prisma.user.findUnique({
            where: {
              email
            }
          });
          if (user && !user.emailVerified) {
            await sendEmail({
              to: email,
              subject: "Verify your email",
              templateName: "otp",
              templateData: {
                name: user.name,
                otp
              }
            });
          }
        } else if (type === "forget-password") {
          const user = await prisma.user.findUnique({
            where: { email }
          });
          if (user) {
            await sendEmail({
              to: email,
              subject: "Password Reset OTP",
              templateName: "otp",
              templateData: {
                name: user.name,
                otp
              }
            });
          }
        }
      },
      expiresIn: 2 * 60,
      otpLength: 6
    })
  ],
  session: {
    expiresIn: 60 * 60 * 60 * 24,
    updateAge: 60 * 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 60 * 24
    }
  },
  trustedOrigins: [envVars.BETTER_AUTH_URL, envVars.FRONTEND_URL],
  advanced: {
    useSecureCookies: envVars.NODE_ENV === "production",
    cookies: {
      state: {
        attributes: {
          sameSite: envVars.NODE_ENV === "production" ? "none" : "lax",
          secure: envVars.NODE_ENV === "production",
          httpOnly: true,
          path: "/"
        }
      },
      sessionToken: {
        attributes: {
          sameSite: envVars.NODE_ENV === "production" ? "none" : "lax",
          secure: envVars.NODE_ENV === "production",
          httpOnly: true,
          path: "/"
        }
      }
    }
  }
});

// src/app/utils/cookie.ts
var setCookie = (res, key, value, options) => {
  res.cookie(key, value, options);
};
var getCookie = (req, key) => {
  return req.cookies[key];
};
var clearCookie = (res, key, options) => {
  res.clearCookie(key, options);
};
var CookieUtils = {
  setCookie,
  getCookie,
  clearCookie
};

// src/app/utils/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secret, { expiresIn }) => {
  const token = jwt.sign(payload, secret, { expiresIn });
  return token;
};
var verifyToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return {
      success: true,
      data: decoded
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error
    };
  }
};
var decodeToken = (token) => {
  const decoded = jwt.decode(token);
  return decoded;
};
var jwtUtils = {
  createToken,
  verifyToken,
  decodeToken
};

// src/app/utils/token.ts
var getAccessToken = (payload) => {
  const accessToken = jwtUtils.createToken(
    payload,
    envVars.ACCESS_TOKEN_SECRET,
    { expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN }
  );
  return accessToken;
};
var getRefreshToken = (payload) => {
  const refreshToken = jwtUtils.createToken(
    payload,
    envVars.REFRESH_TOKEN_SECRET,
    { expiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN }
  );
  return refreshToken;
};
var setAccessTokenCookie = (res, token) => {
  CookieUtils.setCookie(res, "accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 60 * 60 * 60 * 24
  });
};
var setRefreshTokenCookie = (res, token) => {
  CookieUtils.setCookie(res, "refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 60 * 60 * 60 * 24 * 7
  });
};
var setBetterAuthSessionCookie = (res, token) => {
  CookieUtils.setCookie(res, "better-auth.session_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 60 * 60 * 60 * 24
  });
};
var tokenUtils = {
  getAccessToken,
  getRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setBetterAuthSessionCookie
};

// src/app/modules/auth/auth.service.ts
var registerUser = async (payload) => {
  try {
    const { name, email, password } = payload;
    const data = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password
      }
    });
    if (!data?.user) {
      throw new AppError_default(status3.BAD_REQUEST, "Failed to register user");
    }
    const jwtPayload = {
      userId: data.user.id,
      name: data.user.name,
      role: data.user.role,
      email: data.user.email,
      isDeleted: data.user.isDeleted,
      emailVerified: data.user.emailVerified
    };
    const accessToken = tokenUtils.getAccessToken(jwtPayload);
    const refreshToken = tokenUtils.getRefreshToken(jwtPayload);
    return {
      ...data,
      accessToken,
      refreshToken
    };
  } catch (error) {
    throw new AppError_default(
      error?.status || status3.BAD_REQUEST,
      error?.message || "Failed to register user"
    );
  }
};
var loginUser = async (payload) => {
  const { email, password } = payload;
  const data = await auth.api.signInEmail({
    body: {
      email,
      password
    }
  });
  if (!data?.user) {
    throw new AppError_default(status3.UNAUTHORIZED, "Invalid credentials");
  }
  if (data.user.isDeleted) {
    throw new AppError_default(status3.NOT_FOUND, "User is deleted");
  }
  const jwtPayload = {
    userId: data.user.id,
    name: data.user.name,
    role: data.user.role,
    email: data.user.email,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified
  };
  const accessToken = tokenUtils.getAccessToken(jwtPayload);
  const refreshToken = tokenUtils.getRefreshToken(jwtPayload);
  return {
    ...data,
    accessToken,
    refreshToken
  };
};
var getMe = async (user) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id: user.userId
    },
    include: {
      events: {
        where: {
          isDeleted: false
        },
        orderBy: {
          createdAt: "desc"
        }
      },
      eventParticipants: {
        where: {
          isDeleted: false
        },
        include: {
          event: true
        },
        orderBy: {
          createdAt: "desc"
        }
      },
      eventReviews: {
        where: {
          isDeleted: false
        },
        include: {
          event: true
        },
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });
  if (!existingUser || existingUser.isDeleted || existingUser.status === UserStatus.DELETED) {
    throw new AppError_default(status3.NOT_FOUND, "User not found");
  }
  return existingUser;
};
var getNewToken = async (refreshToken, sessionToken) => {
  const isSessionTokenExists = await prisma.session.findUnique({
    where: {
      token: sessionToken
    },
    include: {
      user: true
    }
  });
  if (!isSessionTokenExists) {
    throw new AppError_default(status3.UNAUTHORIZED, "Invalid session token");
  }
  const verifiedRefreshToken = jwtUtils.verifyToken(
    refreshToken,
    envVars.REFRESH_TOKEN_SECRET
  );
  if (!verifiedRefreshToken.success && verifiedRefreshToken.error) {
    throw new AppError_default(status3.UNAUTHORIZED, "Invalid refresh token");
  }
  const data = verifiedRefreshToken.data;
  const jwtPayload = {
    userId: data.userId,
    name: data.name,
    role: data.role,
    email: data.email,
    status: data.status,
    isDeleted: data.isDeleted,
    emailVerified: data.emailVerified
  };
  const newAccessToken = tokenUtils.getAccessToken(jwtPayload);
  const newRefreshToken = tokenUtils.getRefreshToken(jwtPayload);
  const { token } = await prisma.session.update({
    where: {
      token: sessionToken
    },
    data: {
      token: sessionToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1e3),
      updatedAt: /* @__PURE__ */ new Date()
    }
  });
  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    sessionToken: token
  };
};
var changePassword = async (payload, sessionToken) => {
  const session = await auth.api.getSession({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  if (!session) {
    throw new AppError_default(status3.UNAUTHORIZED, "Invalid session token");
  }
  const { currentPassword, newPassword } = payload;
  const result = await auth.api.changePassword({
    body: {
      currentPassword,
      newPassword,
      revokeOtherSessions: true
    },
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  const jwtPayload = {
    userId: session.user.id,
    name: session.user.name,
    role: session.user.role,
    email: session.user.email,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVerified: session.user.emailVerified
  };
  const accessToken = tokenUtils.getAccessToken(jwtPayload);
  const refreshToken = tokenUtils.getRefreshToken(jwtPayload);
  return {
    ...result,
    accessToken,
    refreshToken
  };
};
var logoutUser = async (sessionToken) => {
  const result = await auth.api.signOut({
    headers: {
      Authorization: `Bearer ${sessionToken}`
    }
  });
  return result;
};
var verifyEmail = async (email, otp) => {
  const result = await auth.api.verifyEmailOTP({
    body: {
      email,
      otp
    }
  });
  if (!result?.status) {
    throw new AppError_default(status3.BAD_REQUEST, "Invalid or expired OTP");
  }
  const updatedUser = await prisma.user.update({
    where: { email },
    data: { emailVerified: true }
  });
  const jwtPayload = {
    userId: updatedUser.id,
    name: updatedUser.name,
    role: updatedUser.role,
    email: updatedUser.email,
    status: updatedUser.status,
    isDeleted: updatedUser.isDeleted,
    emailVerified: updatedUser.emailVerified
  };
  const accessToken = tokenUtils.getAccessToken(jwtPayload);
  const refreshToken = tokenUtils.getRefreshToken(jwtPayload);
  return {
    user: updatedUser,
    accessToken,
    refreshToken
  };
};
var resendVerificationOTP = async (email) => {
  const normalizedEmail = email.toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail }
  });
  if (!user) {
    throw new AppError_default(status3.NOT_FOUND, "User not found");
  }
  if (user.emailVerified) {
    throw new AppError_default(status3.BAD_REQUEST, "Email is already verified");
  }
  if (user.isDeleted || user.status === UserStatus.DELETED) {
    throw new AppError_default(status3.NOT_FOUND, "User not found");
  }
  await auth.api.sendVerificationOTP({
    body: {
      email: normalizedEmail,
      type: "email-verification"
    }
  });
  return {
    email: normalizedEmail
  };
};
var forgetPassword = async (email) => {
  const isUserExists = await prisma.user.findUnique({
    where: { email }
  });
  if (!isUserExists) {
    throw new AppError_default(status3.NOT_FOUND, "User not found");
  }
  if (!isUserExists.emailVerified) {
    throw new AppError_default(status3.BAD_REQUEST, "Email not verified");
  }
  if (isUserExists.isDeleted || isUserExists.status === UserStatus.DELETED) {
    throw new AppError_default(status3.NOT_FOUND, "User not found");
  }
  await auth.api.requestPasswordResetEmailOTP({
    body: {
      email
    }
  });
};
var resetPassword = async (email, otp, newPassword) => {
  const isUserExists = await prisma.user.findUnique({
    where: { email }
  });
  if (!isUserExists) {
    throw new AppError_default(status3.NOT_FOUND, "User not found");
  }
  if (!isUserExists.emailVerified) {
    throw new AppError_default(status3.BAD_REQUEST, "Email not verified");
  }
  if (isUserExists.isDeleted || isUserExists.status === UserStatus.DELETED) {
    throw new AppError_default(status3.NOT_FOUND, "User not found");
  }
  await auth.api.resetPasswordEmailOTP({
    body: {
      email,
      otp,
      password: newPassword
    }
  });
  await prisma.session.deleteMany({
    where: {
      userId: isUserExists.id
    }
  });
};
var googleLoginSuccess = async (session) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      id: session.user.id
    }
  });
  if (!isUserExists) {
    await prisma.user.create({
      data: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: "USER"
      }
    });
  }
  const payload = {
    userId: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: "USER"
  };
  const accessToken = tokenUtils.getAccessToken(payload);
  const refreshToken = tokenUtils.getRefreshToken(payload);
  return {
    accessToken,
    refreshToken
  };
};
var authService = {
  registerUser,
  loginUser,
  getMe,
  getNewToken,
  changePassword,
  logoutUser,
  verifyEmail,
  resendVerificationOTP,
  forgetPassword,
  resetPassword,
  googleLoginSuccess
};

// src/app/modules/auth/auth.controller.ts
import status4 from "http-status";
var registerUser2 = catchAsync_default(async (req, res) => {
  const payload = req.body;
  const result = await authService.registerUser(payload);
  const { accessToken, refreshToken, token, ...rest } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    httpStatusCode: status4.CREATED,
    success: true,
    message: "User registered successfully",
    data: {
      token,
      accessToken,
      refreshToken,
      ...rest
    }
  });
});
var loginUser2 = catchAsync_default(async (req, res) => {
  const payload = req.body;
  const result = await authService.loginUser(payload);
  const { accessToken, refreshToken, token, ...rest } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    httpStatusCode: status4.OK,
    success: true,
    message: "User logged in successfully",
    data: {
      token,
      accessToken,
      refreshToken,
      ...rest
    }
  });
});
var getMe2 = catchAsync_default(async (req, res) => {
  const result = await authService.getMe(req.user);
  sendResponse(res, {
    httpStatusCode: status4.OK,
    success: true,
    message: "User profile fetch successfully",
    data: result
  });
});
var getNewToken2 = catchAsync_default(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const betterAuthSessionToken = req.cookies["better-auth.session_token"] || req.cookies["better-auth.session-token"];
  if (!refreshToken) {
    throw new AppError_default(status4.UNAUTHORIZED, "Refresh token is missing");
  }
  const result = await authService.getNewToken(
    refreshToken,
    betterAuthSessionToken
  );
  const { accessToken, refreshToken: newRefreshToken, sessionToken } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, newRefreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, sessionToken);
  sendResponse(res, {
    httpStatusCode: status4.OK,
    success: true,
    message: "New tokens generated successfully",
    data: {
      accessToken,
      refreshToken: newRefreshToken,
      sessionToken
    }
  });
});
var changePassword2 = catchAsync_default(async (req, res) => {
  const payload = req.body;
  const betterAuthSessionToken = req.cookies["better-auth.session_token"] || req.cookies["better-auth.session-token"];
  const result = await authService.changePassword(
    payload,
    betterAuthSessionToken
  );
  const { accessToken, refreshToken, token } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    httpStatusCode: status4.OK,
    success: true,
    message: "Password changed successfully",
    data: result
  });
});
var logoutUser2 = catchAsync_default(async (req, res) => {
  const betterAuthSessionToken = req.cookies["better-auth.session_token"] || req.cookies["better-auth.session-token"];
  const result = await authService.logoutUser(betterAuthSessionToken);
  CookieUtils.clearCookie(res, "accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  CookieUtils.clearCookie(res, "refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  CookieUtils.clearCookie(res, "better-auth.session_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  sendResponse(res, {
    httpStatusCode: status4.OK,
    success: true,
    message: "User logout successfully",
    data: result
  });
});
var verifyEmail2 = catchAsync_default(async (req, res) => {
  const { email, otp } = req.body;
  const result = await authService.verifyEmail(email, otp);
  const sessionToken = req.cookies["better-auth.session_token"] || req.cookies["better-auth.session-token"];
  tokenUtils.setAccessTokenCookie(res, result.accessToken);
  tokenUtils.setRefreshTokenCookie(res, result.refreshToken);
  if (sessionToken) {
    tokenUtils.setBetterAuthSessionCookie(res, sessionToken);
  }
  sendResponse(res, {
    httpStatusCode: status4.OK,
    success: true,
    message: "Email verified successfully",
    data: result
  });
});
var resendVerificationOTP2 = catchAsync_default(
  async (req, res) => {
    const { email } = req.body;
    const result = await authService.resendVerificationOTP(email);
    sendResponse(res, {
      httpStatusCode: status4.OK,
      success: true,
      message: "Verification OTP sent successfully",
      data: result
    });
  }
);
var forgetPassword2 = catchAsync_default(async (req, res) => {
  const { email } = req.body;
  await authService.forgetPassword(email);
  sendResponse(res, {
    httpStatusCode: status4.OK,
    success: true,
    message: "Password reset OTP sent to email successfully"
  });
});
var resetPassword2 = catchAsync_default(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  await authService.resetPassword(email, otp, newPassword);
  sendResponse(res, {
    httpStatusCode: status4.OK,
    success: true,
    message: "Password reset successfully"
  });
});
var googleLogin = catchAsync_default((req, res) => {
  const redirectPath = req.query.redirect || "/dashboard";
  const encodedRedirectPath = encodeURIComponent(redirectPath);
  const callbackURL = `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success?redirect=${encodedRedirectPath}`;
  res.render("googleRedirect", {
    callbackURL,
    betterAuthUrl: envVars.BETTER_AUTH_URL
  });
});
var googleLoginSuccess2 = catchAsync_default(async (req, res) => {
  const redirectPath = req.query.redirect || "/dashboard";
  const sessionToken = req.cookies["better-auth.session_token"];
  if (!sessionToken) {
    return res.redirect(`${envVars.FRONTEND_URL}/login?error=oauth_failed`);
  }
  const session = await auth.api.getSession({
    headers: {
      Cookie: `better-auth.session_token=${sessionToken}`
    }
  });
  if (!session) {
    return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_session_found`);
  }
  if (session && !session.user) {
    return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_user_found`);
  }
  const result = await authService.googleLoginSuccess(session);
  const { accessToken, refreshToken } = result;
  const isValidRedirectPath = redirectPath.startsWith("/") && !redirectPath.startsWith("//");
  const finalRedirectPath = isValidRedirectPath ? redirectPath : "/dashboard";
  const callbackUrl = new URL(
    `${envVars.FRONTEND_URL}/api/auth/google/callback`
  );
  callbackUrl.searchParams.set("accessToken", accessToken);
  callbackUrl.searchParams.set("refreshToken", refreshToken);
  callbackUrl.searchParams.set("sessionToken", sessionToken);
  callbackUrl.searchParams.set("redirect", finalRedirectPath);
  res.redirect(callbackUrl.toString());
});
var handleOAuthError = catchAsync_default((req, res) => {
  const error = req.query.error || "oauth_failed";
  res.redirect(`${envVars.FRONTEND_URL}/login?error=${error}`);
});
var authController = {
  registerUser: registerUser2,
  loginUser: loginUser2,
  getMe: getMe2,
  getNewToken: getNewToken2,
  changePassword: changePassword2,
  logoutUser: logoutUser2,
  verifyEmail: verifyEmail2,
  resendVerificationOTP: resendVerificationOTP2,
  forgetPassword: forgetPassword2,
  resetPassword: resetPassword2,
  googleLogin,
  googleLoginSuccess: googleLoginSuccess2,
  handleOAuthError
};

// src/app/middleware/checkAuth.ts
import status5 from "http-status";
var hasRoleAccess = (authRoles, userRole) => {
  if (authRoles.includes(userRole)) {
    return true;
  }
  if (userRole === Role.SUPER_ADMIN && authRoles.includes(Role.ADMIN)) {
    return true;
  }
  return false;
};
var checkAuth = (...authRoles) => async (req, res, next) => {
  try {
    const sessionToken = CookieUtils.getCookie(req, "better-auth.session_token") || CookieUtils.getCookie(req, "better-auth.session-token");
    if (sessionToken) {
      const sessionExists = await prisma.session.findFirst({
        where: {
          token: sessionToken,
          expiresAt: {
            gt: /* @__PURE__ */ new Date()
          }
        },
        include: {
          user: true
        }
      });
      if (sessionExists && sessionExists.user) {
        const user = sessionExists.user;
        const now = /* @__PURE__ */ new Date();
        const expiresAt = new Date(sessionExists.expiresAt);
        const createdAt = new Date(sessionExists.createdAt);
        const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
        const timeRemaining = expiresAt.getTime() - now.getTime();
        const percentRemaining = timeRemaining / sessionLifeTime * 100;
        if (percentRemaining < 20) {
          res.setHeader("X-Session-Refresh", "true");
          res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
          res.setHeader("X-Time-Remaining", timeRemaining.toString());
          console.log("Session Expiring Soon!!");
        }
        if (user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED) {
          throw new AppError_default(
            status5.UNAUTHORIZED,
            "Unauthorized access! User is not active."
          );
        }
        if (user.isDeleted) {
          throw new AppError_default(
            status5.UNAUTHORIZED,
            "Unauthorized access! User is deleted."
          );
        }
        if (authRoles.length > 0 && !hasRoleAccess(authRoles, user.role)) {
          throw new AppError_default(
            status5.FORBIDDEN,
            "Forbidden access! You do not have permission to access this resource."
          );
        }
        req.user = {
          userId: user.id,
          name: user.name,
          role: user.role,
          email: user.email,
          status: user.status,
          isDeleted: user.isDeleted,
          emailVerified: user.emailVerified
        };
      }
    }
    const accessToken = CookieUtils.getCookie(req, "accessToken");
    if (!accessToken) {
      throw new AppError_default(
        status5.UNAUTHORIZED,
        "Unauthorized access! No access token provided."
      );
    }
    const verifiedToken = jwtUtils.verifyToken(
      accessToken,
      envVars.ACCESS_TOKEN_SECRET
    );
    if (!verifiedToken.success) {
      throw new AppError_default(
        status5.UNAUTHORIZED,
        "Unauthorized access! Invalid access token."
      );
    }
    if (!req.user) {
      const tokenData = verifiedToken.data;
      if (!tokenData?.userId) {
        throw new AppError_default(
          status5.UNAUTHORIZED,
          "Unauthorized access! Invalid token payload."
        );
      }
      const user = await prisma.user.findFirst({
        where: {
          id: tokenData.userId,
          isDeleted: false
        }
      });
      if (!user || user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED) {
        throw new AppError_default(
          status5.UNAUTHORIZED,
          "Unauthorized access! User is not active."
        );
      }
      req.user = {
        userId: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
        status: user.status,
        isDeleted: user.isDeleted,
        emailVerified: user.emailVerified
      };
    }
    if (authRoles.length > 0 && !hasRoleAccess(authRoles, req.user.role)) {
      throw new AppError_default(
        status5.FORBIDDEN,
        "Forbidden access! You do not have permission to access this resource."
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};

// src/app/modules/auth/auth.route.ts
var router = Router();
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.get("/me", checkAuth(Role.ADMIN, Role.USER), authController.getMe);
router.post("/refresh-token", authController.getNewToken);
router.post(
  "/change-password",
  checkAuth(Role.ADMIN, Role.USER),
  authController.changePassword
);
router.post(
  "/logout",
  checkAuth(Role.ADMIN, Role.USER),
  authController.logoutUser
);
router.post("/verify-email", authController.verifyEmail);
router.post("/resend-verification-otp", authController.resendVerificationOTP);
router.post("/forget-password", authController.forgetPassword);
router.post("/reset-password", authController.resetPassword);
router.get("/login/google", authController.googleLogin);
router.get("/google/success", authController.googleLoginSuccess);
router.get("/oauth/error", authController.handleOAuthError);
var AuthRoutes = router;

// src/app/modules/user/user.route.ts
import { Router as Router2 } from "express";

// src/app/modules/user/user.controller.ts
import status7 from "http-status";

// src/app/modules/user/user.service.ts
import status6 from "http-status";
var searchUsers = async (user, query) => {
  const searchTerm = query.searchTerm?.trim();
  const eventId = query.eventId?.trim();
  const parsedLimit = Number(query.limit ?? "10");
  const limit = Number.isFinite(parsedLimit) ? Math.max(1, Math.min(30, parsedLimit)) : 10;
  const excludedUserIds = /* @__PURE__ */ new Set([user.userId]);
  if (eventId) {
    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        isDeleted: false
      },
      select: {
        ownerId: true
      }
    });
    if (!event) {
      throw new AppError_default(status6.NOT_FOUND, "Event not found");
    }
    if (event.ownerId !== user.userId && user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN) {
      throw new AppError_default(
        status6.FORBIDDEN,
        "You are not allowed to invite users for this event"
      );
    }
    excludedUserIds.add(event.ownerId);
    const [existingInvitations, existingParticipants] = await Promise.all([
      prisma.eventInvitation.findMany({
        where: {
          eventId,
          isDeleted: false
        },
        select: {
          userId: true
        }
      }),
      prisma.eventParticipant.findMany({
        where: {
          eventId,
          isDeleted: false
        },
        select: {
          userId: true
        }
      })
    ]);
    existingInvitations.forEach((item) => excludedUserIds.add(item.userId));
    existingParticipants.forEach((item) => excludedUserIds.add(item.userId));
  }
  const users = await prisma.user.findMany({
    where: {
      isDeleted: false,
      status: UserStatus.ACTIVE,
      id: {
        notIn: [...excludedUserIds]
      },
      ...searchTerm ? {
        OR: [
          {
            name: {
              contains: searchTerm,
              mode: "insensitive"
            }
          },
          {
            email: {
              contains: searchTerm,
              mode: "insensitive"
            }
          }
        ]
      } : {}
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true
    },
    orderBy: {
      createdAt: "desc"
    },
    take: limit
  });
  return users;
};
var getMe3 = async (user) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id: user.userId
    },
    include: {
      events: {
        where: {
          isDeleted: false
        },
        orderBy: {
          createdAt: "desc"
        }
      },
      eventParticipants: {
        where: {
          isDeleted: false
        },
        include: {
          event: true
        },
        orderBy: {
          createdAt: "desc"
        }
      },
      eventReviews: {
        where: {
          isDeleted: false
        },
        include: {
          event: true
        },
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });
  if (!existingUser || existingUser.isDeleted || existingUser.status === UserStatus.DELETED) {
    throw new AppError_default(status6.NOT_FOUND, "User not found");
  }
  return existingUser;
};
var updateMe = async (user, payload) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id: user.userId
    }
  });
  if (!existingUser || existingUser.isDeleted || existingUser.status === UserStatus.DELETED) {
    throw new AppError_default(status6.NOT_FOUND, "User not found");
  }
  if (!payload || Object.keys(payload).length === 0) {
    throw new AppError_default(status6.BAD_REQUEST, "No data provided");
  }
  const updatedUser = await prisma.user.update({
    where: {
      id: user.userId
    },
    data: payload
  });
  return updatedUser;
};
var deleteMe = async (user) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id: user.userId
    }
  });
  if (!existingUser || existingUser.isDeleted || existingUser.status === UserStatus.DELETED) {
    throw new AppError_default(status6.NOT_FOUND, "User not found");
  }
  const deletedUser = await prisma.user.update({
    where: {
      id: user.userId
    },
    data: {
      status: UserStatus.DELETED,
      isDeleted: true,
      deletedAt: /* @__PURE__ */ new Date()
    }
  });
  return deletedUser;
};
var UserService = {
  searchUsers,
  getMe: getMe3,
  updateMe,
  deleteMe
};

// src/app/modules/user/user.controller.ts
var getMe4 = catchAsync_default(async (req, res) => {
  const result = await UserService.getMe(req.user);
  sendResponse(res, {
    httpStatusCode: status7.OK,
    success: true,
    message: "Profile retrieved successfully",
    data: result
  });
});
var searchUsers2 = catchAsync_default(async (req, res) => {
  const result = await UserService.searchUsers(
    req.user,
    req.query
  );
  sendResponse(res, {
    httpStatusCode: status7.OK,
    success: true,
    message: "Users retrieved successfully",
    data: result
  });
});
var updateMe2 = catchAsync_default(async (req, res) => {
  const result = await UserService.updateMe(req.user, req.body);
  sendResponse(res, {
    httpStatusCode: status7.OK,
    success: true,
    message: "Profile updated successfully",
    data: result
  });
});
var deleteMe2 = catchAsync_default(async (req, res) => {
  const result = await UserService.deleteMe(req.user);
  sendResponse(res, {
    httpStatusCode: status7.OK,
    success: true,
    message: "Account deleted successfully",
    data: result
  });
});
var uploadAvatar = catchAsync_default(async (req, res) => {
  const file2 = req.file;
  if (!file2) {
    throw new AppError_default(status7.BAD_REQUEST, "No image file provided");
  }
  const imageUrl = file2.path;
  const result = await UserService.updateMe(req.user, {
    image: imageUrl
  });
  sendResponse(res, {
    httpStatusCode: status7.OK,
    success: true,
    message: "Profile image updated successfully",
    data: { imageUrl: result.image }
  });
});
var UserController = {
  searchUsers: searchUsers2,
  getMe: getMe4,
  updateMe: updateMe2,
  deleteMe: deleteMe2,
  uploadAvatar
};

// src/app/modules/user/user.validation.ts
import { z } from "zod";
var updateUserValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    image: z.string().url().optional()
  })
});

// src/app/middleware/validateRequest.ts
var validateRequest = (zodSchema) => {
  return (req, res, next) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    const parsedResult = zodSchema.safeParse({
      body: req.body
    });
    if (!parsedResult.success) {
      return next(parsedResult.error);
    }
    req.body = parsedResult.data.body ?? {};
    return next();
  };
};

// src/app/config/multer.config.ts
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// src/app/config/cloudinary.config.ts
import { v2 as cloudinary } from "cloudinary";
import status8 from "http-status";
cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET
});
var deleteFileFromCloudinary = async (url) => {
  try {
    const regex = /\/v\d+\/(.+?)(?:\.[a-zA-Z0-9]+)+$/;
    const match = url.match(regex);
    if (match && match[1]) {
      const publicId = match[1];
      await cloudinary.uploader.destroy(publicId, {
        resource_type: "image"
      });
      console.log(`File ${publicId} deleted from cloudinary`);
    }
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    throw new AppError_default(
      status8.INTERNAL_SERVER_ERROR,
      "Failed to delete file from Cloudinary"
    );
  }
};
var cloudinaryUpload = cloudinary;

// src/app/config/multer.config.ts
var storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: async (req, file2) => {
    const originalName = file2.originalname;
    const extension = originalName.split(".").pop()?.toLocaleLowerCase();
    const fileNameWithoutExtension = originalName.split(".").slice(0, -1).join(".").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
    const uniqueName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileNameWithoutExtension;
    const folder = extension === "pdf" ? "pdfs" : "images";
    return {
      folder: `ph-healthcare/${folder}`,
      public_id: uniqueName,
      resource_type: "auto"
    };
  }
});
var multerUpload = multer({ storage });

// src/app/modules/user/user.route.ts
var router2 = Router2();
router2.get(
  "/search",
  checkAuth(Role.ADMIN, Role.USER),
  UserController.searchUsers
);
router2.get("/me", checkAuth(Role.ADMIN, Role.USER), UserController.getMe);
router2.patch(
  "/me",
  checkAuth(Role.ADMIN, Role.USER),
  validateRequest(updateUserValidationSchema),
  UserController.updateMe
);
router2.delete("/me", checkAuth(Role.ADMIN, Role.USER), UserController.deleteMe);
router2.post(
  "/me/avatar",
  checkAuth(Role.ADMIN, Role.USER),
  multerUpload.single("image"),
  UserController.uploadAvatar
);
var UserRoutes = router2;

// src/app/modules/event/event.route.ts
import { Router as Router3 } from "express";

// src/app/modules/event/event.controller.ts
import status10 from "http-status";

// src/app/modules/event/event.service.ts
import status9 from "http-status";

// src/app/utils/QueryBuilder.ts
var QueryBuilder = class {
  constructor(model, queryParams, config2 = {}) {
    this.model = model;
    this.queryParams = queryParams;
    this.config = config2;
    this.query = {
      where: {},
      include: {},
      orderBy: {},
      skip: 0,
      take: 10
    };
    this.countQuery = {
      where: {}
    };
  }
  query;
  countQuery;
  page = 1;
  limit = 10;
  skip = 0;
  sortBy = "createdAt";
  sortOrder = "desc";
  selectFields;
  search() {
    const { searchTerm } = this.queryParams;
    const { searchableFields } = this.config;
    if (searchTerm && searchableFields && searchableFields.length > 0) {
      const searchConditions = searchableFields.map(
        (field) => {
          if (field.includes(".")) {
            const parts = field.split(".");
            if (parts.length === 2) {
              const [relation, nestedField] = parts;
              const stringFilter2 = {
                contains: searchTerm,
                mode: "insensitive"
              };
              return {
                [relation]: {
                  [nestedField]: stringFilter2
                }
              };
            } else if (parts.length === 3) {
              const [relation, nestedRelation, nestedField] = parts;
              const stringFilter2 = {
                contains: searchTerm,
                mode: "insensitive"
              };
              return {
                [relation]: {
                  some: {
                    [nestedRelation]: {
                      [nestedField]: stringFilter2
                    }
                  }
                }
              };
            }
          }
          const stringFilter = {
            contains: searchTerm,
            mode: "insensitive"
          };
          return {
            [field]: stringFilter
          };
        }
      );
      const whereConditions = this.query.where;
      whereConditions.OR = searchConditions;
      const countWhereConditions = this.countQuery.where;
      countWhereConditions.OR = searchConditions;
    }
    return this;
  }
  filter() {
    const { filterableFields } = this.config;
    const excludedField = [
      "searchTerm",
      "page",
      "limit",
      "sortBy",
      "sortOrder",
      "fields",
      "include"
    ];
    const filterParams = {};
    Object.keys(this.queryParams).forEach((key) => {
      if (!excludedField.includes(key)) {
        filterParams[key] = this.queryParams[key];
      }
    });
    const queryWhere = this.query.where;
    const countQueryWhere = this.countQuery.where;
    Object.keys(filterParams).forEach((key) => {
      const value = filterParams[key];
      if (value === void 0 || value === "") {
        return;
      }
      const isAllowedField = !filterableFields || filterableFields.length === 0 || filterableFields.includes(key);
      if (key.includes(".")) {
        const parts = key.split(".");
        if (filterableFields && !filterableFields.includes(key)) {
          return;
        }
        if (parts.length === 2) {
          const [relation, nestedField] = parts;
          if (!queryWhere[relation]) {
            queryWhere[relation] = {};
            countQueryWhere[relation] = {};
          }
          const queryRelation = queryWhere[relation];
          const countRelation = countQueryWhere[relation];
          queryRelation[nestedField] = this.parseFilterValue(value);
          countRelation[nestedField] = this.parseFilterValue(value);
          return;
        } else if (parts.length === 3) {
          const [relation, nestedRelation, nestedField] = parts;
          if (!queryWhere[relation]) {
            queryWhere[relation] = {
              some: {}
            };
            countQueryWhere[relation] = {
              some: {}
            };
          }
          const queryRelation = queryWhere[relation];
          const countRelation = countQueryWhere[relation];
          if (!queryRelation.some) {
            queryRelation.some = {};
          }
          if (!countRelation.some) {
            countRelation.some = {};
          }
          const querySome = queryRelation.some;
          const countSome = countRelation.some;
          if (!querySome[nestedRelation]) {
            querySome[nestedRelation] = {};
          }
          if (!countSome[nestedRelation]) {
            countSome[nestedRelation] = {};
          }
          const queryNestedRelation = querySome[nestedRelation];
          const countNestedRelation = countSome[nestedRelation];
          queryNestedRelation[nestedField] = this.parseFilterValue(value);
          countNestedRelation[nestedField] = this.parseFilterValue(value);
          return;
        }
      }
      if (!isAllowedField) {
        return;
      }
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        queryWhere[key] = this.parseRangeFilter(
          value
        );
        countQueryWhere[key] = this.parseRangeFilter(
          value
        );
        return;
      }
      queryWhere[key] = this.parseFilterValue(value);
      countQueryWhere[key] = this.parseFilterValue(value);
    });
    return this;
  }
  paginate() {
    const page = Number(this.queryParams.page) || 1;
    const limit = Number(this.queryParams.limit) || 10;
    this.page = page;
    this.limit = limit;
    this.skip = (page - 1) * limit;
    this.query.skip = this.skip;
    this.query.take = this.limit;
    return this;
  }
  sort() {
    const sortBy = this.queryParams.sortBy || "createdAt";
    const sortOrder = this.queryParams.sortOrder === "asc" ? "asc" : "desc";
    this.sortBy = sortBy;
    this.sortOrder = sortOrder;
    if (sortBy.includes(".")) {
      const parts = sortBy.split(".");
      if (parts.length === 2) {
        const [relation, nestedField] = parts;
        this.query.orderBy = {
          [relation]: {
            [nestedField]: sortOrder
          }
        };
      } else if (parts.length === 3) {
        const [relation, nestedRelation, nestedField] = parts;
        this.query.orderBy = {
          [relation]: {
            [nestedRelation]: {
              [nestedField]: sortOrder
            }
          }
        };
      } else {
        this.query.orderBy = {
          [sortBy]: sortOrder
        };
      }
    } else {
      this.query.orderBy = {
        [sortBy]: sortOrder
      };
    }
    return this;
  }
  fields() {
    const fieldsParam = this.queryParams.fields;
    if (fieldsParam && typeof fieldsParam === "string") {
      const fieldsArray = fieldsParam?.split(",").map((field) => field.trim());
      this.selectFields = {};
      fieldsArray?.forEach((field) => {
        if (this.selectFields) {
          this.selectFields[field] = true;
        }
      });
      this.query.select = this.selectFields;
      delete this.query.include;
    }
    return this;
  }
  include(relation) {
    if (this.selectFields) {
      return this;
    }
    this.query.include = {
      ...this.query.include,
      ...relation
    };
    return this;
  }
  dynamicInclude(includeConfig, defaultInclude) {
    if (this.selectFields) {
      return this;
    }
    const result = {};
    defaultInclude?.forEach((field) => {
      if (includeConfig[field]) {
        result[field] = includeConfig[field];
      }
    });
    const includeParam = this.queryParams.include;
    if (includeParam && typeof includeParam === "string") {
      const requestedRelations = includeParam.split(",").map((relation) => relation.trim());
      requestedRelations.forEach((relation) => {
        if (includeConfig[relation]) {
          result[relation] = includeConfig[relation];
        }
      });
    }
    this.query.include = {
      ...this.query.include,
      ...result
    };
    return this;
  }
  where(condition) {
    this.query.where = this.deepMerge(
      this.query.where,
      condition
    );
    this.countQuery.where = this.deepMerge(
      this.countQuery.where,
      condition
    );
    return this;
  }
  async execute() {
    const [total, data] = await Promise.all([
      this.model.count(
        this.countQuery
      ),
      this.model.findMany(
        this.query
      )
    ]);
    const totalPages = Math.ceil(total / this.limit);
    return {
      data,
      meta: {
        page: this.page,
        limit: this.limit,
        total,
        totalPages
      }
    };
  }
  async count() {
    return await this.model.count(
      this.countQuery
    );
  }
  getQuery() {
    return this.query;
  }
  deepMerge(target, source) {
    const result = { ...target };
    for (const key in source) {
      if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
        if (result[key] && typeof result[key] === "object" && !Array.isArray(result[key])) {
          result[key] = this.deepMerge(
            result[key],
            source[key]
          );
        } else {
          result[key] = source[key];
        }
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }
  parseFilterValue(value) {
    if (value === "true") {
      return true;
    }
    if (value === "false") {
      return false;
    }
    if (typeof value === "string" && !isNaN(Number(value)) && value != "") {
      return Number(value);
    }
    if (Array.isArray(value)) {
      return { in: value.map((item) => this.parseFilterValue(item)) };
    }
    return value;
  }
  parseRangeFilter(value) {
    const rangeQuery = {};
    Object.keys(value).forEach((operator) => {
      const operatorValue = value[operator];
      const parsedValue = typeof operatorValue === "string" && !isNaN(Number(operatorValue)) ? Number(operatorValue) : operatorValue;
      switch (operator) {
        case "lt":
        case "lte":
        case "gt":
        case "gte":
        case "equals":
        case "not":
        case "contains":
        case "startsWith":
        case "endsWith":
          rangeQuery[operator] = parsedValue;
          break;
        case "in":
        case "notIn":
          if (Array.isArray(operatorValue)) {
            rangeQuery[operator] = operatorValue;
          } else {
            rangeQuery[operator] = [parsedValue];
          }
          break;
        default:
          break;
      }
    });
    return Object.keys(rangeQuery).length > 0 ? rangeQuery : value;
  }
};

// src/app/modules/event/event.constant.ts
var eventSearchableFields = ["title", "description"];
var eventFilterableFields = [
  "visibility",
  "feeType",
  "status",
  "ownerId",
  "venue"
];
var eventIncludeConfig = {
  owner: {
    owner: {
      select: {
        id: true,
        name: true,
        email: true,
        image: true
      }
    }
  },
  reviews: {
    reviews: {
      where: {
        isDeleted: false
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    }
  },
  participants: {
    participants: true
  },
  eventInvitations: {
    eventInvitations: true
  }
};

// src/app/modules/event/event.service.ts
var buildEventDateTime = (eventDate, eventTime) => {
  const dateTime = /* @__PURE__ */ new Date(`${eventDate}T${eventTime}:00`);
  if (Number.isNaN(dateTime.getTime())) {
    throw new AppError_default(status9.BAD_REQUEST, "Invalid event date or time");
  }
  return dateTime;
};
var getFeeType = (registrationFee) => {
  return registrationFee && registrationFee > 0 ? FeeType.PAID : FeeType.FREE;
};
var normalizeText = (value) => value.trim().toLowerCase();
var getPopularityScore = (participants, reviews) => {
  return participants * 2 + reviews * 3;
};
var createEvent = async (user, payload) => {
  const eventDateTime = buildEventDateTime(
    payload.eventDate,
    payload.eventTime
  );
  const registrationFee = payload.registrationFee ?? 0;
  const feeType = getFeeType(registrationFee);
  const event = await prisma.event.create({
    data: {
      title: payload.title,
      description: payload.description,
      image: payload.image,
      eventDateTime,
      venue: payload.venue,
      eventLink: payload.eventLink,
      visibility: payload.visibility,
      status: payload.status ?? EventStatus.ACTIVE,
      registrationFee,
      feeType,
      ownerId: user.userId
    },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      }
    }
  });
  return event;
};
var getAllEvents = async (query) => {
  const queryBuilder = new QueryBuilder(prisma.event, query, {
    searchableFields: eventSearchableFields,
    filterableFields: eventFilterableFields
  });
  const result = await queryBuilder.search().filter().where({
    isDeleted: false
  }).include({
    owner: {
      select: {
        id: true,
        name: true,
        email: true,
        image: true
      }
    },
    _count: {
      select: {
        participants: true,
        reviews: true
      }
    }
  }).dynamicInclude(eventIncludeConfig).paginate().sort().fields().execute();
  return result;
};
var getMyEvents = async (user) => {
  const events = await prisma.event.findMany({
    where: {
      ownerId: user.userId,
      isDeleted: false
    },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      },
      _count: {
        select: {
          participants: true,
          reviews: true,
          eventInvitations: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return events;
};
var getUpcomingPublicEvents = async () => {
  const events = await prisma.event.findMany({
    where: {
      isDeleted: false,
      visibility: EventVisibility.PUBLIC,
      eventDateTime: {
        gt: /* @__PURE__ */ new Date()
      }
    },
    orderBy: {
      eventDateTime: "asc"
    },
    take: 9,
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      }
    }
  });
  return events;
};
var getSingleEvent = async (eventId) => {
  const event = await prisma.event.findFirst({
    where: {
      id: eventId,
      isDeleted: false
    },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      },
      reviews: {
        where: {
          isDeleted: false
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      },
      _count: {
        select: {
          participants: true,
          reviews: true,
          eventInvitations: true
        }
      }
    }
  });
  if (!event) {
    throw new AppError_default(status9.NOT_FOUND, "Event not found");
  }
  return event;
};
var getSearchSuggestions = async (query) => {
  const keyword = typeof query.q === "string" ? normalizeText(query.q).slice(0, 60) : "";
  const requestedLimit = Number(query.limit || 8);
  const limit = Number.isFinite(requestedLimit) ? Math.max(3, Math.min(12, requestedLimit)) : 8;
  const events = await prisma.event.findMany({
    where: {
      isDeleted: false,
      status: EventStatus.ACTIVE
    },
    orderBy: [{ eventDateTime: "asc" }, { createdAt: "desc" }],
    take: 80,
    include: {
      owner: {
        select: {
          name: true
        }
      },
      _count: {
        select: {
          participants: true,
          reviews: true
        }
      }
    }
  });
  const suggestionsMap = /* @__PURE__ */ new Map();
  const registerSuggestion = (rawText, type, hint, baseScore) => {
    if (!rawText) {
      return;
    }
    const text = rawText.trim();
    if (!text) {
      return;
    }
    const normalized = normalizeText(text);
    const startsWith = keyword ? normalized.startsWith(keyword) : false;
    const includes = keyword ? normalized.includes(keyword) : false;
    const hasWordPrefix = keyword ? normalized.split(/\s+/).some((word) => word.startsWith(keyword)) : false;
    if (keyword && !startsWith && !includes && !hasWordPrefix) {
      return;
    }
    let relevance = baseScore;
    if (startsWith) {
      relevance += 14;
    }
    if (hasWordPrefix) {
      relevance += 9;
    }
    if (includes) {
      relevance += 5;
    }
    const existing = suggestionsMap.get(normalized);
    if (!existing || relevance > existing.score) {
      suggestionsMap.set(normalized, {
        text,
        type,
        hint,
        score: relevance
      });
    }
  };
  for (const event of events) {
    const popularity = getPopularityScore(
      event._count.participants,
      event._count.reviews
    );
    registerSuggestion(event.title, "TITLE", "Event title", popularity + 4);
    registerSuggestion(event.venue, "VENUE", "Event venue", popularity + 2);
    registerSuggestion(
      event.owner?.name,
      "ORGANIZER",
      "Organizer name",
      popularity + 1
    );
  }
  const suggestions = Array.from(suggestionsMap.values()).sort((a, b) => b.score - a.score).slice(0, limit);
  const trending = events.map((event) => ({
    id: event.id,
    title: event.title,
    popularity: getPopularityScore(
      event._count.participants,
      event._count.reviews
    ),
    visibility: event.visibility,
    feeType: event.feeType,
    eventDateTime: event.eventDateTime
  })).sort((a, b) => {
    if (b.popularity !== a.popularity) {
      return b.popularity - a.popularity;
    }
    return a.eventDateTime.getTime() - b.eventDateTime.getTime();
  }).slice(0, 5);
  return {
    keyword,
    suggestions,
    trending
  };
};
var getPersonalizedRecommendations = async (user, query) => {
  const requestedLimit = Number(query.limit || 6);
  const limit = Number.isFinite(requestedLimit) ? Math.max(3, Math.min(12, requestedLimit)) : 6;
  const [participations, invitations, reviews] = await Promise.all([
    prisma.eventParticipant.findMany({
      where: {
        userId: user.userId,
        isDeleted: false
      },
      include: {
        event: {
          select: {
            id: true,
            visibility: true,
            feeType: true
          }
        }
      }
    }),
    prisma.eventInvitation.findMany({
      where: {
        userId: user.userId,
        isDeleted: false
      },
      include: {
        event: {
          select: {
            id: true,
            visibility: true,
            feeType: true
          }
        }
      }
    }),
    prisma.eventReview.findMany({
      where: {
        userId: user.userId,
        isDeleted: false
      },
      include: {
        event: {
          select: {
            id: true,
            visibility: true,
            feeType: true
          }
        }
      }
    })
  ]);
  const visibilityScores = {
    PUBLIC: 1,
    PRIVATE: 1
  };
  const feeTypeScores = {
    FREE: 1,
    PAID: 1
  };
  const excludedEventIds = /* @__PURE__ */ new Set();
  for (const item of participations) {
    excludedEventIds.add(item.eventId);
    const signalWeight = item.status === ParticipationStatus.JOINED || item.status === ParticipationStatus.APPROVED ? 3 : item.status === ParticipationStatus.PENDING ? 1 : 0;
    visibilityScores[item.event.visibility] += signalWeight;
    feeTypeScores[item.event.feeType] += signalWeight;
  }
  for (const item of invitations) {
    excludedEventIds.add(item.eventId);
    const signalWeight = item.status === InvitationStatus.ACCEPTED ? 2 : item.status === InvitationStatus.PENDING ? 1 : 0;
    visibilityScores[item.event.visibility] += signalWeight;
    feeTypeScores[item.event.feeType] += signalWeight;
  }
  for (const item of reviews) {
    excludedEventIds.add(item.eventId);
    visibilityScores[item.event.visibility] += 2;
    feeTypeScores[item.event.feeType] += 2;
  }
  const preferredVisibility = visibilityScores.PRIVATE > visibilityScores.PUBLIC ? "PRIVATE" : "PUBLIC";
  const preferredFeeType = feeTypeScores.PAID > feeTypeScores.FREE ? "PAID" : "FREE";
  const candidateEvents = await prisma.event.findMany({
    where: {
      isDeleted: false,
      status: EventStatus.ACTIVE,
      ownerId: {
        not: user.userId
      },
      eventDateTime: {
        gt: /* @__PURE__ */ new Date()
      },
      ...excludedEventIds.size ? {
        id: {
          notIn: Array.from(excludedEventIds)
        }
      } : {}
    },
    orderBy: [{ eventDateTime: "asc" }, { createdAt: "desc" }],
    take: 60,
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      },
      _count: {
        select: {
          participants: true,
          reviews: true
        }
      }
    }
  });
  const recommendations = candidateEvents.map((event) => {
    const popularityScore = getPopularityScore(
      event._count.participants,
      event._count.reviews
    );
    const preferenceScore = visibilityScores[event.visibility] + feeTypeScores[event.feeType];
    const daysUntilEvent = Math.floor(
      (event.eventDateTime.getTime() - Date.now()) / (1e3 * 60 * 60 * 24)
    );
    const freshnessScore = daysUntilEvent <= 14 ? 3 : daysUntilEvent <= 45 ? 2 : 1;
    const aiScore = preferenceScore * 3 + popularityScore + freshnessScore;
    return {
      ...event,
      aiScore,
      aiReason: `Matches your ${event.visibility.toLowerCase()} and ${event.feeType.toLowerCase()} activity pattern.`
    };
  }).sort((a, b) => b.aiScore - a.aiScore).slice(0, limit);
  return {
    insights: {
      preferredVisibility,
      preferredFeeType,
      signalStrength: {
        participations: participations.length,
        invitations: invitations.length,
        reviews: reviews.length
      }
    },
    recommendations
  };
};
var updateEvent = async (user, eventId, payload) => {
  const existingEvent = await prisma.event.findFirst({
    where: {
      id: eventId,
      isDeleted: false
    }
  });
  if (!existingEvent) {
    throw new AppError_default(status9.NOT_FOUND, "Event not found");
  }
  if (existingEvent.ownerId !== user.userId && user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN) {
    throw new AppError_default(
      status9.FORBIDDEN,
      "You are not allowed to update this event"
    );
  }
  const updateData = {
    title: payload.title,
    description: payload.description,
    image: payload.image,
    venue: payload.venue,
    eventLink: payload.eventLink,
    visibility: payload.visibility,
    status: payload.status
  };
  if (payload.registrationFee !== void 0) {
    updateData.registrationFee = payload.registrationFee;
    updateData.feeType = getFeeType(payload.registrationFee);
  }
  if (payload.eventDate || payload.eventTime) {
    const currentDate = existingEvent.eventDateTime.toISOString().slice(0, 10);
    const currentTime = existingEvent.eventDateTime.toTimeString().slice(0, 5);
    updateData.eventDateTime = buildEventDateTime(
      payload.eventDate ?? currentDate,
      payload.eventTime ?? currentTime
    );
  }
  const event = await prisma.event.update({
    where: {
      id: eventId
    },
    data: updateData,
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      }
    }
  });
  return event;
};
var deleteEvent = async (user, eventId) => {
  const existingEvent = await prisma.event.findFirst({
    where: {
      id: eventId,
      isDeleted: false
    }
  });
  if (!existingEvent) {
    throw new AppError_default(status9.NOT_FOUND, "Event not found");
  }
  if (existingEvent.ownerId !== user.userId && user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN) {
    throw new AppError_default(
      status9.FORBIDDEN,
      "You are not allowed to delete this event"
    );
  }
  const deletedEvent = await prisma.event.update({
    where: {
      id: eventId
    },
    data: {
      isDeleted: true,
      deletedAt: /* @__PURE__ */ new Date()
    }
  });
  return deletedEvent;
};
var EventService = {
  createEvent,
  getAllEvents,
  getMyEvents,
  getUpcomingPublicEvents,
  getSearchSuggestions,
  getPersonalizedRecommendations,
  getSingleEvent,
  updateEvent,
  deleteEvent
};

// src/app/modules/event/event.controller.ts
var createEvent2 = catchAsync_default(async (req, res) => {
  const imageUrl = req.file?.path;
  const result = await EventService.createEvent(req.user, {
    ...req.body,
    ...imageUrl ? { image: imageUrl } : {}
  });
  sendResponse(res, {
    httpStatusCode: status10.CREATED,
    success: true,
    message: "Event created successfully",
    data: result
  });
});
var getAllEvents2 = catchAsync_default(async (req, res) => {
  const result = await EventService.getAllEvents(req.query);
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "Events retrieved successfully",
    data: result.data,
    meta: result.meta
  });
});
var getMyEvents2 = catchAsync_default(async (req, res) => {
  const result = await EventService.getMyEvents(req.user);
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "My events retrieved successfully",
    data: result
  });
});
var getUpcomingPublicEvents2 = catchAsync_default(
  async (_req, res) => {
    const result = await EventService.getUpcomingPublicEvents();
    sendResponse(res, {
      httpStatusCode: status10.OK,
      success: true,
      message: "Upcoming public events retrieved successfully",
      data: result
    });
  }
);
var getSearchSuggestions2 = catchAsync_default(async (req, res) => {
  let result;
  try {
    result = await EventService.getSearchSuggestions(req.query);
  } catch {
    result = {
      keyword: typeof req.query.q === "string" ? req.query.q.trim().toLowerCase().slice(0, 60) : "",
      suggestions: [],
      trending: []
    };
  }
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "Event search suggestions retrieved successfully",
    data: result
  });
});
var getPersonalizedRecommendations2 = catchAsync_default(
  async (req, res) => {
    const result = await EventService.getPersonalizedRecommendations(
      req.user,
      req.query
    );
    sendResponse(res, {
      httpStatusCode: status10.OK,
      success: true,
      message: "Personalized recommendations retrieved successfully",
      data: result
    });
  }
);
var getSingleEvent2 = catchAsync_default(async (req, res) => {
  const result = await EventService.getSingleEvent(
    req.params.eventId
  );
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "Event retrieved successfully",
    data: result
  });
});
var updateEvent2 = catchAsync_default(async (req, res) => {
  const imageUrl = req.file?.path;
  const result = await EventService.updateEvent(
    req.user,
    req.params.eventId,
    {
      ...req.body,
      ...imageUrl ? { image: imageUrl } : {}
    }
  );
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "Event updated successfully",
    data: result
  });
});
var deleteEvent2 = catchAsync_default(async (req, res) => {
  const result = await EventService.deleteEvent(
    req.user,
    req.params.eventId
  );
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "Event deleted successfully",
    data: result
  });
});
var EventController = {
  createEvent: createEvent2,
  getAllEvents: getAllEvents2,
  getMyEvents: getMyEvents2,
  getUpcomingPublicEvents: getUpcomingPublicEvents2,
  getSearchSuggestions: getSearchSuggestions2,
  getPersonalizedRecommendations: getPersonalizedRecommendations2,
  getSingleEvent: getSingleEvent2,
  updateEvent: updateEvent2,
  deleteEvent: deleteEvent2
};

// src/app/modules/event/event.validation.ts
import { z as z2 } from "zod";
var createEventValidationSchema = z2.object({
  body: z2.object({
    title: z2.string().min(3).max(255),
    description: z2.string().min(10),
    eventDate: z2.string().min(1),
    eventTime: z2.string().min(1),
    venue: z2.string().optional(),
    eventLink: z2.string().url().optional(),
    visibility: z2.nativeEnum(EventVisibility),
    status: z2.nativeEnum(EventStatus).optional(),
    registrationFee: z2.coerce.number().min(0).optional()
  }).refine((data) => data.venue || data.eventLink, {
    message: "Either venue or eventLink is required",
    path: ["venue"]
  })
});
var updateEventValidationSchema = z2.object({
  body: z2.object({
    title: z2.string().min(3).max(255).optional(),
    description: z2.string().min(10).optional(),
    eventDate: z2.string().optional(),
    eventTime: z2.string().optional(),
    venue: z2.string().optional(),
    eventLink: z2.string().url().optional(),
    visibility: z2.nativeEnum(EventVisibility).optional(),
    status: z2.nativeEnum(EventStatus).optional(),
    registrationFee: z2.coerce.number().min(0).optional()
  })
});

// src/app/modules/event/event.route.ts
var router3 = Router3();
router3.get("/", EventController.getAllEvents);
router3.get(
  "/my-events",
  checkAuth(Role.ADMIN, Role.USER),
  EventController.getMyEvents
);
router3.get("/upcoming", EventController.getUpcomingPublicEvents);
router3.get("/search-suggestions", EventController.getSearchSuggestions);
router3.get(
  "/recommendations",
  checkAuth(Role.ADMIN, Role.USER),
  EventController.getPersonalizedRecommendations
);
router3.get("/:eventId", EventController.getSingleEvent);
router3.post(
  "/",
  checkAuth(Role.ADMIN, Role.USER),
  multerUpload.single("image"),
  validateRequest(createEventValidationSchema),
  EventController.createEvent
);
router3.patch(
  "/:eventId",
  checkAuth(Role.ADMIN, Role.USER),
  multerUpload.single("image"),
  validateRequest(updateEventValidationSchema),
  EventController.updateEvent
);
router3.delete(
  "/:eventId",
  checkAuth(Role.ADMIN, Role.USER),
  EventController.deleteEvent
);
var EventRoutes = router3;

// src/app/modules/participation/participation.route.ts
import { Router as Router4 } from "express";

// src/app/modules/participation/participation.controller.ts
import status12 from "http-status";

// src/app/modules/participation/participation.service.ts
import status11 from "http-status";
var participationSearchableFields = ["event.title", "event.venue"];
var participationFilterableFields = ["status", "paymentStatus"];
var joinEvent = async (user, eventId) => {
  const event = await prisma.event.findFirst({
    where: {
      id: eventId,
      isDeleted: false
    }
  });
  if (!event) {
    throw new AppError_default(status11.NOT_FOUND, "Event not found");
  }
  if (event.status !== EventStatus.ACTIVE) {
    throw new AppError_default(
      status11.BAD_REQUEST,
      "This event is not accepting new participants"
    );
  }
  if (event.ownerId === user.userId) {
    throw new AppError_default(status11.BAD_REQUEST, "Event owner cannot join own event");
  }
  const existingParticipant = await prisma.eventParticipant.findFirst({
    where: {
      eventId,
      userId: user.userId,
      isDeleted: false
    }
  });
  if (existingParticipant) {
    throw new AppError_default(
      status11.CONFLICT,
      "You already requested or joined this event"
    );
  }
  const participantData = {
    eventId,
    userId: user.userId,
    status: ParticipationStatus.PENDING
  };
  if (event.visibility === EventVisibility.PUBLIC && event.feeType === FeeType.PAID) {
    participantData.paymentStatus = PaymentStatus.PENDING;
  }
  if (event.visibility === EventVisibility.PRIVATE && event.feeType === FeeType.FREE) {
    participantData.paymentStatus = PaymentStatus.PAID;
    participantData.paidAmount = 0;
  }
  if (event.visibility === EventVisibility.PRIVATE && event.feeType === FeeType.PAID) {
    participantData.paymentStatus = PaymentStatus.PENDING;
  }
  if (event.visibility === EventVisibility.PUBLIC && event.feeType === FeeType.FREE) {
    participantData.paymentStatus = PaymentStatus.PAID;
    participantData.paidAmount = 0;
  }
  const participant = await prisma.eventParticipant.create({
    data: participantData,
    include: {
      event: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      }
    }
  });
  return participant;
};
var getMyParticipations = async (user, query = {}) => {
  const queryBuilder = new QueryBuilder(prisma.eventParticipant, query, {
    searchableFields: participationSearchableFields,
    filterableFields: participationFilterableFields
  });
  const result = await queryBuilder.search().filter().where({
    userId: user.userId,
    isDeleted: false
  }).include({
    event: {
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    }
  }).paginate().sort().fields().execute();
  return result;
};
var getEventParticipants = async (user, eventId, query = {}) => {
  const event = await prisma.event.findFirst({
    where: {
      id: eventId,
      isDeleted: false
    }
  });
  if (!event) {
    throw new AppError_default(status11.NOT_FOUND, "Event not found");
  }
  if (event.ownerId !== user.userId && user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN) {
    throw new AppError_default(
      status11.FORBIDDEN,
      "You are not allowed to view participants"
    );
  }
  const queryBuilder = new QueryBuilder(prisma.eventParticipant, query, {
    searchableFields: ["user.name", "user.email"],
    filterableFields: participationFilterableFields
  });
  const result = await queryBuilder.search().filter().where({
    eventId,
    isDeleted: false
  }).include({
    user: {
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        status: true
      }
    }
  }).paginate().sort().fields().execute();
  return result;
};
var getMyPendingApprovals = async (user) => {
  const approvals = await prisma.eventParticipant.findMany({
    where: {
      isDeleted: false,
      status: ParticipationStatus.PENDING,
      event: {
        ownerId: user.userId,
        isDeleted: false
      }
    },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          feeType: true,
          status: true
        }
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return approvals;
};
var approveParticipant = async (user, participantId) => {
  const participant = await prisma.eventParticipant.findFirst({
    where: {
      id: participantId,
      isDeleted: false
    },
    include: {
      event: true
    }
  });
  if (!participant) {
    throw new AppError_default(status11.NOT_FOUND, "Participant not found");
  }
  if (participant.event.status !== EventStatus.ACTIVE) {
    throw new AppError_default(
      status11.BAD_REQUEST,
      "You cannot update participation on a non-active event"
    );
  }
  if (participant.event.ownerId !== user.userId && user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN) {
    throw new AppError_default(
      status11.FORBIDDEN,
      "You are not allowed to approve this participant"
    );
  }
  if (participant.status !== ParticipationStatus.PENDING) {
    throw new AppError_default(
      status11.BAD_REQUEST,
      "Only pending requests can be approved"
    );
  }
  if (participant.event.feeType === FeeType.PAID && participant.paymentStatus !== PaymentStatus.PAID) {
    throw new AppError_default(
      status11.BAD_REQUEST,
      "Payment is required before approval"
    );
  }
  const updatedParticipant = await prisma.eventParticipant.update({
    where: {
      id: participantId
    },
    data: {
      status: ParticipationStatus.JOINED,
      approvedAt: /* @__PURE__ */ new Date()
    },
    include: {
      event: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      }
    }
  });
  return updatedParticipant;
};
var rejectParticipant = async (user, participantId) => {
  const participant = await prisma.eventParticipant.findFirst({
    where: {
      id: participantId,
      isDeleted: false
    },
    include: {
      event: true
    }
  });
  if (!participant) {
    throw new AppError_default(status11.NOT_FOUND, "Participant not found");
  }
  if (participant.event.ownerId !== user.userId && user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN) {
    throw new AppError_default(
      status11.FORBIDDEN,
      "You are not allowed to reject this participant"
    );
  }
  const updatedParticipant = await prisma.eventParticipant.update({
    where: {
      id: participantId
    },
    data: {
      status: ParticipationStatus.REJECTED,
      rejectedAt: /* @__PURE__ */ new Date()
    }
  });
  return updatedParticipant;
};
var banParticipant = async (user, participantId) => {
  const participant = await prisma.eventParticipant.findFirst({
    where: {
      id: participantId,
      isDeleted: false
    },
    include: {
      event: true
    }
  });
  if (!participant) {
    throw new AppError_default(status11.NOT_FOUND, "Participant not found");
  }
  if (participant.event.ownerId !== user.userId && user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN) {
    throw new AppError_default(
      status11.FORBIDDEN,
      "You are not allowed to ban this participant"
    );
  }
  const updatedParticipant = await prisma.eventParticipant.update({
    where: {
      id: participantId
    },
    data: {
      status: ParticipationStatus.BANNED,
      bannedAt: /* @__PURE__ */ new Date()
    }
  });
  return updatedParticipant;
};
var ParticipationService = {
  joinEvent,
  getMyParticipations,
  getEventParticipants,
  getMyPendingApprovals,
  approveParticipant,
  rejectParticipant,
  banParticipant
};

// src/app/modules/participation/participation.controller.ts
var joinEvent2 = catchAsync_default(async (req, res) => {
  const result = await ParticipationService.joinEvent(
    req.user,
    req.params.eventId
  );
  sendResponse(res, {
    httpStatusCode: status12.CREATED,
    success: true,
    message: "Participation request created successfully",
    data: result
  });
});
var getMyParticipations2 = catchAsync_default(async (req, res) => {
  const result = await ParticipationService.getMyParticipations(
    req.user,
    req.query
  );
  sendResponse(res, {
    httpStatusCode: status12.OK,
    success: true,
    message: "My participations retrieved successfully",
    data: result
  });
});
var getEventParticipants2 = catchAsync_default(async (req, res) => {
  const result = await ParticipationService.getEventParticipants(
    req.user,
    req.params.eventId
  );
  sendResponse(res, {
    httpStatusCode: status12.OK,
    success: true,
    message: "Event participants retrieved successfully",
    data: result
  });
});
var getMyPendingApprovals2 = catchAsync_default(
  async (req, res) => {
    const result = await ParticipationService.getMyPendingApprovals(
      req.user
    );
    sendResponse(res, {
      httpStatusCode: status12.OK,
      success: true,
      message: "My pending approvals retrieved successfully",
      data: result
    });
  }
);
var approveParticipant2 = catchAsync_default(async (req, res) => {
  const result = await ParticipationService.approveParticipant(
    req.user,
    req.params.participantId
  );
  sendResponse(res, {
    httpStatusCode: status12.OK,
    success: true,
    message: "Participant accepted and joined successfully",
    data: result
  });
});
var acceptParticipant = catchAsync_default(async (req, res) => {
  const result = await ParticipationService.approveParticipant(
    req.user,
    req.params.participantId
  );
  sendResponse(res, {
    httpStatusCode: status12.OK,
    success: true,
    message: "Participant accepted and joined successfully",
    data: result
  });
});
var rejectParticipant2 = catchAsync_default(async (req, res) => {
  const result = await ParticipationService.rejectParticipant(
    req.user,
    req.params.participantId
  );
  sendResponse(res, {
    httpStatusCode: status12.OK,
    success: true,
    message: "Participant rejected successfully",
    data: result
  });
});
var banParticipant2 = catchAsync_default(async (req, res) => {
  const result = await ParticipationService.banParticipant(
    req.user,
    req.params.participantId
  );
  sendResponse(res, {
    httpStatusCode: status12.OK,
    success: true,
    message: "Participant banned successfully",
    data: result
  });
});
var ParticipationController = {
  joinEvent: joinEvent2,
  getMyParticipations: getMyParticipations2,
  getEventParticipants: getEventParticipants2,
  getMyPendingApprovals: getMyPendingApprovals2,
  acceptParticipant,
  approveParticipant: approveParticipant2,
  rejectParticipant: rejectParticipant2,
  banParticipant: banParticipant2
};

// src/app/modules/participation/participation.route.ts
var router4 = Router4();
router4.post(
  "/events/:eventId/join",
  checkAuth(Role.ADMIN, Role.USER),
  ParticipationController.joinEvent
);
router4.get(
  "/me",
  checkAuth(Role.ADMIN, Role.USER),
  ParticipationController.getMyParticipations
);
router4.get(
  "/approvals/me",
  checkAuth(Role.ADMIN, Role.USER),
  ParticipationController.getMyPendingApprovals
);
router4.get(
  "/events/:eventId",
  checkAuth(Role.ADMIN, Role.USER),
  ParticipationController.getEventParticipants
);
router4.patch(
  "/:participantId/accept",
  checkAuth(Role.ADMIN, Role.USER),
  ParticipationController.acceptParticipant
);
router4.patch(
  "/:participantId/approve",
  checkAuth(Role.ADMIN, Role.USER),
  ParticipationController.approveParticipant
);
router4.patch(
  "/:participantId/reject",
  checkAuth(Role.ADMIN, Role.USER),
  ParticipationController.rejectParticipant
);
router4.patch(
  "/:participantId/ban",
  checkAuth(Role.ADMIN, Role.USER),
  ParticipationController.banParticipant
);
var ParticipationRoutes = router4;

// src/app/modules/invitation/invitation.route.ts
import { Router as Router5 } from "express";

// src/app/modules/invitation/invitation.controller.ts
import status14 from "http-status";

// src/app/modules/invitation/invitation.service.ts
import status13 from "http-status";

// src/app/modules/invitation/invitation.constant.ts
var InvitationStatus2 = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED"
};

// src/app/modules/invitation/invitation.service.ts
var invitationSearchableFields = ["event.title", "event.venue"];
var invitationFilterableFields = ["status", "eventId", "invitedById"];
var inviteUser = async (user, eventId, payload) => {
  const event = await prisma.event.findFirst({
    where: {
      id: eventId,
      isDeleted: false
    }
  });
  if (!event) {
    throw new AppError_default(status13.NOT_FOUND, "Event not found");
  }
  if (event.status !== EventStatus.ACTIVE) {
    throw new AppError_default(
      status13.BAD_REQUEST,
      "Cannot invite users to a non-active event"
    );
  }
  if (event.ownerId !== user.userId && user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN) {
    throw new AppError_default(status13.FORBIDDEN, "You are not allowed to invite users");
  }
  if (payload.userId === event.ownerId) {
    throw new AppError_default(status13.BAD_REQUEST, "Event owner cannot be invited");
  }
  const invitedUser = await prisma.user.findUnique({
    where: {
      id: payload.userId
    }
  });
  if (!invitedUser || invitedUser.isDeleted || invitedUser.status === UserStatus.DELETED) {
    throw new AppError_default(status13.NOT_FOUND, "Invited user not found");
  }
  const existingInvitation = await prisma.eventInvitation.findFirst({
    where: {
      eventId,
      userId: payload.userId,
      isDeleted: false
    }
  });
  if (existingInvitation) {
    throw new AppError_default(status13.CONFLICT, "Invitation already exists");
  }
  const existingParticipant = await prisma.eventParticipant.findFirst({
    where: {
      eventId,
      userId: payload.userId,
      isDeleted: false
    }
  });
  if (existingParticipant) {
    throw new AppError_default(
      status13.CONFLICT,
      "User already joined or requested this event"
    );
  }
  const invitation = await prisma.eventInvitation.create({
    data: {
      eventId,
      userId: payload.userId,
      invitedById: user.userId,
      status: InvitationStatus2.PENDING
    },
    include: {
      event: true
    }
  });
  return invitation;
};
var getMyInvitations = async (user, query = {}) => {
  const queryBuilder = new QueryBuilder(prisma.eventInvitation, query, {
    searchableFields: invitationSearchableFields,
    filterableFields: invitationFilterableFields
  });
  const result = await queryBuilder.search().filter().where({
    userId: user.userId,
    isDeleted: false
  }).include({
    event: true
  }).paginate().sort().fields().execute();
  const invitations = result.data;
  const inviterIds = [...new Set(invitations.map((item) => item.invitedById))];
  const inviters = inviterIds.length ? await prisma.user.findMany({
    where: {
      id: {
        in: inviterIds
      }
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true
    }
  }) : [];
  const inviterMap = new Map(inviters.map((item) => [item.id, item]));
  return {
    data: invitations.map((item) => ({
      ...item,
      invitedByUser: inviterMap.get(item.invitedById) || null
    })),
    meta: result.meta
  };
};
var acceptInvitation = async (user, invitationId) => {
  const invitation = await prisma.eventInvitation.findFirst({
    where: {
      id: invitationId,
      userId: user.userId,
      isDeleted: false
    },
    include: {
      event: true
    }
  });
  if (!invitation) {
    throw new AppError_default(status13.NOT_FOUND, "Invitation not found");
  }
  if (invitation.status !== InvitationStatus2.PENDING) {
    throw new AppError_default(
      status13.BAD_REQUEST,
      "Only pending invitations can be accepted"
    );
  }
  if (invitation.event.status !== EventStatus.ACTIVE) {
    throw new AppError_default(
      status13.BAD_REQUEST,
      "This event is not accepting new participants"
    );
  }
  const existingParticipant = await prisma.eventParticipant.findFirst({
    where: {
      eventId: invitation.eventId,
      userId: user.userId,
      isDeleted: false
    }
  });
  if (existingParticipant) {
    throw new AppError_default(status13.CONFLICT, "Participant already exists");
  }
  const result = await prisma.$transaction(async (tx) => {
    await tx.eventInvitation.update({
      where: {
        id: invitation.id
      },
      data: {
        status: InvitationStatus2.ACCEPTED
      }
    });
    const participant = await tx.eventParticipant.create({
      data: {
        eventId: invitation.eventId,
        userId: user.userId,
        status: ParticipationStatus.PENDING,
        paymentStatus: invitation.event.feeType === FeeType.PAID ? PaymentStatus.PENDING : PaymentStatus.PAID,
        paidAmount: invitation.event.feeType === FeeType.PAID ? null : 0
      },
      include: {
        event: true
      }
    });
    return participant;
  });
  return result;
};
var rejectInvitation = async (user, invitationId) => {
  const invitation = await prisma.eventInvitation.findFirst({
    where: {
      id: invitationId,
      userId: user.userId,
      isDeleted: false
    }
  });
  if (!invitation) {
    throw new AppError_default(status13.NOT_FOUND, "Invitation not found");
  }
  if (invitation.status !== InvitationStatus2.PENDING) {
    throw new AppError_default(
      status13.BAD_REQUEST,
      "Only pending invitations can be rejected"
    );
  }
  const updatedInvitation = await prisma.eventInvitation.update({
    where: {
      id: invitationId
    },
    data: {
      status: InvitationStatus2.REJECTED
    }
  });
  return updatedInvitation;
};
var InvitationService = {
  inviteUser,
  getMyInvitations,
  acceptInvitation,
  rejectInvitation
};

// src/app/modules/invitation/invitation.controller.ts
var inviteUser2 = catchAsync_default(async (req, res) => {
  const result = await InvitationService.inviteUser(
    req.user,
    req.params.eventId,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: status14.CREATED,
    success: true,
    message: "Invitation sent successfully",
    data: result
  });
});
var getMyInvitations2 = catchAsync_default(async (req, res) => {
  const result = await InvitationService.getMyInvitations(
    req.user,
    req.query
  );
  sendResponse(res, {
    httpStatusCode: status14.OK,
    success: true,
    message: "Invitations retrieved successfully",
    data: result.data,
    meta: result.meta
  });
});
var acceptInvitation2 = catchAsync_default(async (req, res) => {
  const result = await InvitationService.acceptInvitation(
    req.user,
    req.params.invitationId
  );
  sendResponse(res, {
    httpStatusCode: status14.OK,
    success: true,
    message: "Invitation accepted successfully",
    data: result
  });
});
var rejectInvitation2 = catchAsync_default(async (req, res) => {
  const result = await InvitationService.rejectInvitation(
    req.user,
    req.params.invitationId
  );
  sendResponse(res, {
    httpStatusCode: status14.OK,
    success: true,
    message: "Invitation rejected successfully",
    data: result
  });
});
var InvitationController = {
  inviteUser: inviteUser2,
  getMyInvitations: getMyInvitations2,
  acceptInvitation: acceptInvitation2,
  rejectInvitation: rejectInvitation2
};

// src/app/modules/invitation/invitation.validation.ts
import { z as z3 } from "zod";
var createInvitationValidationSchema = z3.object({
  body: z3.object({
    userId: z3.string().min(1)
  })
});

// src/app/modules/invitation/invitation.route.ts
var router5 = Router5();
router5.post(
  "/events/:eventId",
  checkAuth(Role.ADMIN, Role.USER),
  validateRequest(createInvitationValidationSchema),
  InvitationController.inviteUser
);
router5.get(
  "/me",
  checkAuth(Role.ADMIN, Role.USER),
  InvitationController.getMyInvitations
);
router5.patch(
  "/:invitationId/accept",
  checkAuth(Role.ADMIN, Role.USER),
  InvitationController.acceptInvitation
);
router5.patch(
  "/:invitationId/reject",
  checkAuth(Role.ADMIN, Role.USER),
  InvitationController.rejectInvitation
);
var InvitationRoutes = router5;

// src/app/modules/review/review.route.ts
import { Router as Router6 } from "express";

// src/app/modules/review/review.controller.ts
import status16 from "http-status";

// src/app/modules/review/review.service.ts
import status15 from "http-status";
var REVIEW_EDIT_WINDOW_DAYS = 7;
var createReview = async (user, eventId, payload) => {
  const event = await prisma.event.findFirst({
    where: {
      id: eventId,
      isDeleted: false
    }
  });
  if (!event) {
    throw new AppError_default(status15.NOT_FOUND, "Event not found");
  }
  if (event.status !== EventStatus.COMPLETED) {
    throw new AppError_default(
      status15.BAD_REQUEST,
      "You can review only after the event is completed by the owner"
    );
  }
  const participant = await prisma.eventParticipant.findFirst({
    where: {
      eventId,
      userId: user.userId,
      isDeleted: false,
      status: {
        in: [ParticipationStatus.JOINED, ParticipationStatus.APPROVED]
      }
    }
  });
  if (!participant) {
    throw new AppError_default(
      status15.FORBIDDEN,
      "You are not allowed to review this event"
    );
  }
  const existingReview = await prisma.eventReview.findFirst({
    where: {
      eventId,
      userId: user.userId,
      isDeleted: false
    }
  });
  if (existingReview) {
    throw new AppError_default(status15.CONFLICT, "You already reviewed this event");
  }
  const review = await prisma.eventReview.create({
    data: {
      eventId,
      userId: user.userId,
      rating: payload.rating,
      review: payload.review
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      },
      event: true
    }
  });
  return review;
};
var getEventReviews = async (eventId) => {
  const reviews = await prisma.eventReview.findMany({
    where: {
      eventId,
      isDeleted: false
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return reviews;
};
var getMyReviews = async (user) => {
  const reviews = await prisma.eventReview.findMany({
    where: {
      userId: user.userId,
      isDeleted: false
    },
    include: {
      event: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return reviews;
};
var updateReview = async (user, reviewId, payload) => {
  const review = await prisma.eventReview.findFirst({
    where: {
      id: reviewId,
      isDeleted: false
    },
    include: {
      event: true
    }
  });
  if (!review) {
    throw new AppError_default(status15.NOT_FOUND, "Review not found");
  }
  if (review.userId !== user.userId) {
    throw new AppError_default(
      status15.FORBIDDEN,
      "You are not allowed to update this review"
    );
  }
  const reviewDeadline = new Date(review.event.eventDateTime);
  reviewDeadline.setDate(reviewDeadline.getDate() + REVIEW_EDIT_WINDOW_DAYS);
  if (/* @__PURE__ */ new Date() > reviewDeadline) {
    throw new AppError_default(status15.BAD_REQUEST, "Review edit period expired");
  }
  const updatedReview = await prisma.eventReview.update({
    where: {
      id: reviewId
    },
    data: payload,
    include: {
      event: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      }
    }
  });
  return updatedReview;
};
var deleteReview = async (user, reviewId) => {
  const review = await prisma.eventReview.findFirst({
    where: {
      id: reviewId,
      isDeleted: false
    },
    include: {
      event: true
    }
  });
  if (!review) {
    throw new AppError_default(status15.NOT_FOUND, "Review not found");
  }
  if (review.userId !== user.userId) {
    throw new AppError_default(
      status15.FORBIDDEN,
      "You are not allowed to delete this review"
    );
  }
  const reviewDeadline = new Date(review.event.eventDateTime);
  reviewDeadline.setDate(reviewDeadline.getDate() + REVIEW_EDIT_WINDOW_DAYS);
  if (/* @__PURE__ */ new Date() > reviewDeadline) {
    throw new AppError_default(status15.BAD_REQUEST, "Review delete period expired");
  }
  const deletedReview = await prisma.eventReview.update({
    where: {
      id: reviewId
    },
    data: {
      isDeleted: true,
      deletedAt: /* @__PURE__ */ new Date()
    }
  });
  return deletedReview;
};
var ReviewService = {
  createReview,
  getEventReviews,
  getMyReviews,
  updateReview,
  deleteReview
};

// src/app/modules/review/review.controller.ts
var createReview2 = catchAsync_default(async (req, res) => {
  const result = await ReviewService.createReview(
    req.user,
    req.params.eventId,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: status16.CREATED,
    success: true,
    message: "Review created successfully",
    data: result
  });
});
var getEventReviews2 = catchAsync_default(async (req, res) => {
  const result = await ReviewService.getEventReviews(
    req.params.eventId
  );
  sendResponse(res, {
    httpStatusCode: status16.OK,
    success: true,
    message: "Event reviews retrieved successfully",
    data: result
  });
});
var getMyReviews2 = catchAsync_default(async (req, res) => {
  const result = await ReviewService.getMyReviews(req.user);
  sendResponse(res, {
    httpStatusCode: status16.OK,
    success: true,
    message: "My reviews retrieved successfully",
    data: result
  });
});
var updateReview2 = catchAsync_default(async (req, res) => {
  const result = await ReviewService.updateReview(
    req.user,
    req.params.reviewId,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: status16.OK,
    success: true,
    message: "Review updated successfully",
    data: result
  });
});
var deleteReview2 = catchAsync_default(async (req, res) => {
  const result = await ReviewService.deleteReview(
    req.user,
    req.params.reviewId
  );
  sendResponse(res, {
    httpStatusCode: status16.OK,
    success: true,
    message: "Review deleted successfully",
    data: result
  });
});
var ReviewController = {
  createReview: createReview2,
  getEventReviews: getEventReviews2,
  getMyReviews: getMyReviews2,
  updateReview: updateReview2,
  deleteReview: deleteReview2
};

// src/app/modules/review/review.validation.ts
import { z as z4 } from "zod";
var createReviewValidationSchema = z4.object({
  body: z4.object({
    rating: z4.coerce.number().int().min(1).max(5),
    review: z4.string().max(1e3).optional()
  })
});
var updateReviewValidationSchema = z4.object({
  body: z4.object({
    rating: z4.coerce.number().int().min(1).max(5).optional(),
    review: z4.string().max(1e3).optional()
  })
});

// src/app/modules/review/review.route.ts
var router6 = Router6();
router6.get("/events/:eventId", ReviewController.getEventReviews);
router6.get(
  "/me",
  checkAuth(Role.ADMIN, Role.USER),
  ReviewController.getMyReviews
);
router6.post(
  "/events/:eventId",
  checkAuth(Role.ADMIN, Role.USER),
  validateRequest(createReviewValidationSchema),
  ReviewController.createReview
);
router6.patch(
  "/:reviewId",
  checkAuth(Role.ADMIN, Role.USER),
  validateRequest(updateReviewValidationSchema),
  ReviewController.updateReview
);
router6.delete(
  "/:reviewId",
  checkAuth(Role.ADMIN, Role.USER),
  ReviewController.deleteReview
);
var ReviewRoutes = router6;

// src/app/modules/payment/payment.route.ts
import { Router as Router7 } from "express";

// src/app/modules/payment/payment.controller.ts
import status17 from "http-status";

// src/app/modules/payment/payment.constant.ts
var PAYMENT_MESSAGE = {
  INITIATED: "Payment session initiated successfully",
  VERIFIED: "Payment verified successfully",
  FAILED: "Payment failed",
  CANCELLED: "Payment cancelled",
  IPN_RECEIVED: "IPN received successfully"
};
var paymentSearchableFields = [
  "trxId",
  "bankTransactionId",
  "gatewayTransactionId",
  "valId",
  "user.name",
  "user.email",
  "event.title"
];
var paymentFilterableFields = [
  "trxId",
  "status",
  "gateway",
  "currency",
  "userId",
  "eventId",
  "eventParticipantId"
];
var paymentIncludeConfig = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      image: true
    }
  },
  event: {
    select: {
      id: true,
      title: true,
      eventDateTime: true,
      feeType: true,
      registrationFee: true,
      ownerId: true
    }
  },
  eventParticipant: {
    select: {
      id: true,
      status: true,
      paymentStatus: true,
      paidAmount: true,
      requestedAt: true
    }
  }
};

// src/app/modules/payment/payment.service.ts
import httpStatus from "http-status";

// src/app/modules/payment/payment.utils.ts
var isTruthy = (value) => {
  return ["true", "1", "yes"].includes(value.trim().toLowerCase());
};
var getSSLBaseUrl = () => {
  return isTruthy(envVars.SSLCOMMERZ.SSL_IS_LIVE) ? "https://securepay.sslcommerz.com" : "https://sandbox.sslcommerz.com";
};
var sslCommerzInitPayment = async (payload) => {
  const url = `${getSSLBaseUrl()}/gwprocess/v4/api.php`;
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    formData.append(key, String(value));
  });
  const response = await fetch(url, {
    method: "POST",
    body: formData
  });
  let data;
  try {
    data = await response.json();
  } catch {
    const responseText = await response.text();
    data = {
      status: "FAILED",
      failedreason: responseText || "Invalid gateway response"
    };
  }
  return data;
};
var sslCommerzValidatePayment = async (valId) => {
  const url = `${getSSLBaseUrl()}/validator/api/validationserverAPI.php`;
  const queryParams = new URLSearchParams({
    val_id: valId,
    store_id: envVars.SSLCOMMERZ.SSL_STORE_ID,
    store_passwd: envVars.SSLCOMMERZ.SSL_STORE_PASSWORD,
    v: "1",
    format: "json"
  });
  const response = await fetch(`${url}?${queryParams.toString()}`, {
    method: "GET"
  });
  const data = await response.json();
  return data;
};
var sslCommerzQueryTransactionByTransactionId = async (trxId) => {
  const url = `${getSSLBaseUrl()}/validator/api/merchantTransIDvalidationAPI.php`;
  const queryParams = new URLSearchParams({
    tran_id: trxId,
    store_id: envVars.SSLCOMMERZ.SSL_STORE_ID,
    store_passwd: envVars.SSLCOMMERZ.SSL_STORE_PASSWORD,
    v: "1",
    format: "json"
  });
  const response = await fetch(`${url}?${queryParams.toString()}`, {
    method: "GET"
  });
  const data = await response.json();
  return data;
};

// src/app/modules/payment/payment.service.ts
var getBackendBaseUrl = () => {
  const rawBaseUrl = process.env.BACKEND_URL || envVars.BETTER_AUTH_URL || `http://localhost:${envVars.PORT}`;
  try {
    return new URL(rawBaseUrl).origin;
  } catch {
    return rawBaseUrl;
  }
};
var getSafeFrontendBaseUrl = (requestedOrigin) => {
  const defaultOrigin = (() => {
    try {
      return new URL(envVars.FRONTEND_URL).origin;
    } catch {
      return envVars.FRONTEND_URL.replace(/\/$/, "");
    }
  })();
  if (!requestedOrigin) {
    return defaultOrigin;
  }
  const allowedOrigins = /* @__PURE__ */ new Set([defaultOrigin, "http://localhost:3000"]);
  return allowedOrigins.has(requestedOrigin) ? requestedOrigin : defaultOrigin;
};
var toJsonValue = (payload) => {
  if (payload === void 0) {
    return void 0;
  }
  return payload;
};
var initiateEventPayment = async (userId, payload, requestedFrontendOrigin) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      isDeleted: false,
      status: "ACTIVE"
    }
  });
  if (!user) {
    throw new AppError_default(httpStatus.NOT_FOUND, "User not found");
  }
  const event = await prisma.event.findFirst({
    where: {
      id: payload.eventId,
      isDeleted: false
    },
    include: {
      owner: true
    }
  });
  if (!event) {
    throw new AppError_default(httpStatus.NOT_FOUND, "Event not found");
  }
  if (event.ownerId === userId) {
    throw new AppError_default(httpStatus.BAD_REQUEST, "Owner cannot join own event");
  }
  if (event.feeType !== FeeType.PAID || event.registrationFee <= 0) {
    throw new AppError_default(
      httpStatus.BAD_REQUEST,
      "This event does not require payment"
    );
  }
  const existingParticipant = await prisma.eventParticipant.findUnique({
    where: {
      eventId_userId: {
        eventId: event.id,
        userId
      }
    }
  });
  if (existingParticipant?.status === ParticipationStatus.APPROVED || existingParticipant?.status === ParticipationStatus.JOINED) {
    throw new AppError_default(httpStatus.BAD_REQUEST, "You already joined this event");
  }
  if (existingParticipant?.status === ParticipationStatus.BANNED) {
    throw new AppError_default(httpStatus.FORBIDDEN, "You are banned from this event");
  }
  const participant = existingParticipant ? await prisma.eventParticipant.update({
    where: { id: existingParticipant.id },
    data: {
      status: ParticipationStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      paidAmount: null
    }
  }) : await prisma.eventParticipant.create({
    data: {
      eventId: event.id,
      userId,
      status: ParticipationStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING
    }
  });
  const trxId = `planora_${Date.now()}_${participant.id.slice(0, 8)}`;
  const backendBaseUrl = getBackendBaseUrl();
  const frontendBaseUrl = getSafeFrontendBaseUrl(requestedFrontendOrigin);
  const encodedFrontend = encodeURIComponent(frontendBaseUrl);
  const successUrl = `${backendBaseUrl}/api/v1/payments/success?trxId=${trxId}&frontend=${encodedFrontend}`;
  const failUrl = `${backendBaseUrl}/api/v1/payments/fail?trxId=${trxId}&frontend=${encodedFrontend}`;
  const cancelUrl = `${backendBaseUrl}/api/v1/payments/cancel?trxId=${trxId}&frontend=${encodedFrontend}`;
  const ipnUrl = `${backendBaseUrl}/api/v1/payments/ipn`;
  await prisma.paymentTransaction.create({
    data: {
      trxId,
      userId,
      eventId: event.id,
      eventParticipantId: participant.id,
      amount: event.registrationFee,
      currency: "BDT",
      status: TransactionStatus.INITIATED,
      successUrl,
      failUrl,
      cancelUrl
    }
  });
  const sslPayload = {
    store_id: envVars.SSLCOMMERZ.SSL_STORE_ID,
    store_passwd: envVars.SSLCOMMERZ.SSL_STORE_PASSWORD,
    productcategory: "Events",
    total_amount: Number(event.registrationFee),
    currency: "BDT",
    tran_id: trxId,
    success_url: successUrl,
    fail_url: failUrl,
    cancel_url: cancelUrl,
    ipn_url: ipnUrl,
    shipping_method: "NO",
    product_name: event.title,
    product_category: "Event Registration",
    product_profile: "general",
    cus_name: user.name,
    cus_email: user.email,
    cus_add1: "Dhaka",
    cus_add2: "Dhaka",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1207",
    cus_country: "Bangladesh",
    cus_phone: "01700000000",
    num_of_item: 1,
    ship_name: user.name,
    ship_add1: "Dhaka",
    ship_add2: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: "1207",
    ship_country: "Bangladesh"
  };
  const sslResponse = await sslCommerzInitPayment(sslPayload);
  if (!sslResponse?.GatewayPageURL && !sslResponse?.gatewayPageURL) {
    await prisma.paymentTransaction.update({
      where: { trxId },
      data: {
        status: TransactionStatus.FAILED,
        gatewayResponse: toJsonValue(sslResponse)
      }
    });
    const failureReason = sslResponse?.failedreason || sslResponse?.status;
    throw new AppError_default(
      httpStatus.BAD_REQUEST,
      failureReason ? `Failed to initialize payment session: ${failureReason}` : "Failed to initialize payment session"
    );
  }
  await prisma.paymentTransaction.update({
    where: { trxId },
    data: {
      gatewayResponse: toJsonValue(sslResponse)
    }
  });
  return {
    paymentUrl: sslResponse.GatewayPageURL || sslResponse.gatewayPageURL,
    trxId,
    participantId: participant.id
  };
};
var handlePaymentSuccess = async (trxId, valId, payload) => {
  const transaction = await prisma.paymentTransaction.findUnique({
    where: { trxId },
    include: {
      eventParticipant: true,
      event: true
    }
  });
  if (!transaction) {
    throw new AppError_default(httpStatus.NOT_FOUND, "Transaction not found");
  }
  if (transaction.status === TransactionStatus.VALID) {
    return transaction;
  }
  const validationResponse = valId ? await sslCommerzValidatePayment(valId) : await sslCommerzQueryTransactionByTransactionId(trxId);
  if (validationResponse?.tran_id && validationResponse.tran_id !== trxId) {
    throw new AppError_default(httpStatus.BAD_REQUEST, "Transaction mismatch detected");
  }
  const validatedStatus = validationResponse?.status;
  if (validatedStatus !== "VALID" && validatedStatus !== "VALIDATED") {
    await prisma.paymentTransaction.update({
      where: { trxId },
      data: {
        status: TransactionStatus.FAILED,
        verifyPayload: toJsonValue(validationResponse)
      }
    });
    if (transaction.eventParticipantId) {
      await prisma.eventParticipant.update({
        where: { id: transaction.eventParticipantId },
        data: {
          paymentStatus: PaymentStatus.FAILED
        }
      });
    }
    throw new AppError_default(httpStatus.BAD_REQUEST, "Payment validation failed");
  }
  await prisma.$transaction(async (tx) => {
    await tx.paymentTransaction.update({
      where: { trxId },
      data: {
        status: TransactionStatus.VALID,
        valId: validationResponse.val_id || valId || null,
        gatewayTransactionId: validationResponse.tran_id || trxId,
        bankTransactionId: validationResponse.bank_tran_id,
        cardType: validationResponse.card_type,
        storeAmount: validationResponse.store_amount ? Number(validationResponse.store_amount) : null,
        verifyPayload: toJsonValue(validationResponse),
        gatewayResponse: toJsonValue(payload)
      }
    });
    if (transaction.eventParticipantId) {
      await tx.eventParticipant.update({
        where: { id: transaction.eventParticipantId },
        data: {
          paymentStatus: PaymentStatus.PAID,
          paidAmount: transaction.amount,
          status: ParticipationStatus.PENDING
        }
      });
    }
  });
  return transaction;
};
var handlePaymentFail = async (trxId, payload) => {
  const transaction = await prisma.paymentTransaction.findUnique({
    where: { trxId }
  });
  if (!transaction) {
    throw new AppError_default(httpStatus.NOT_FOUND, "Transaction not found");
  }
  await prisma.$transaction(async (tx) => {
    await tx.paymentTransaction.update({
      where: { trxId },
      data: {
        status: TransactionStatus.FAILED,
        gatewayResponse: toJsonValue(payload)
      }
    });
    if (transaction.eventParticipantId) {
      await tx.eventParticipant.update({
        where: { id: transaction.eventParticipantId },
        data: {
          paymentStatus: PaymentStatus.FAILED
        }
      });
    }
  });
  return null;
};
var handlePaymentCancel = async (trxId, payload) => {
  const transaction = await prisma.paymentTransaction.findUnique({
    where: { trxId }
  });
  if (!transaction) {
    throw new AppError_default(httpStatus.NOT_FOUND, "Transaction not found");
  }
  await prisma.$transaction(async (tx) => {
    await tx.paymentTransaction.update({
      where: { trxId },
      data: {
        status: TransactionStatus.CANCELLED,
        gatewayResponse: toJsonValue(payload)
      }
    });
    if (transaction.eventParticipantId) {
      await tx.eventParticipant.update({
        where: { id: transaction.eventParticipantId },
        data: {
          paymentStatus: PaymentStatus.FAILED
        }
      });
    }
  });
  return null;
};
var handlePaymentIPN = async (payload) => {
  const trxId = payload.tran_id;
  const valId = payload.val_id;
  if (!trxId) {
    throw new AppError_default(httpStatus.BAD_REQUEST, "tran_id is missing in IPN");
  }
  const transaction = await prisma.paymentTransaction.findUnique({
    where: { trxId }
  });
  if (!transaction) {
    throw new AppError_default(httpStatus.NOT_FOUND, "Transaction not found");
  }
  if (transaction.status === TransactionStatus.VALID) {
    return null;
  }
  await handlePaymentSuccess(trxId, valId, payload);
  return null;
};
var validateExistingTransaction = async (trxId) => {
  const transaction = await prisma.paymentTransaction.findUnique({
    where: { trxId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      },
      event: {
        select: {
          id: true,
          title: true,
          eventDateTime: true,
          ownerId: true,
          feeType: true,
          registrationFee: true
        }
      },
      eventParticipant: {
        select: {
          id: true,
          status: true,
          paymentStatus: true,
          paidAmount: true
        }
      }
    }
  });
  if (!transaction) {
    throw new AppError_default(httpStatus.NOT_FOUND, "Transaction not found");
  }
  return transaction;
};
var getMyPayments = async (user, query = {}) => {
  const queryBuilder = new QueryBuilder(prisma.paymentTransaction, query, {
    searchableFields: paymentSearchableFields,
    filterableFields: paymentFilterableFields
  });
  const result = await queryBuilder.search().filter().where({
    userId: user.userId
  }).include({
    user: {
      select: {
        id: true,
        name: true,
        email: true,
        image: true
      }
    },
    event: {
      select: {
        id: true,
        title: true,
        eventDateTime: true,
        ownerId: true,
        feeType: true,
        registrationFee: true
      }
    },
    eventParticipant: {
      select: {
        id: true,
        status: true,
        paymentStatus: true,
        paidAmount: true
      }
    }
  }).dynamicInclude(paymentIncludeConfig).paginate().sort().fields().execute();
  return result;
};
var getAllPayments = async (user, query = {}) => {
  if (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN) {
    throw new AppError_default(
      httpStatus.FORBIDDEN,
      "Only admin can access all payments"
    );
  }
  const queryBuilder = new QueryBuilder(prisma.paymentTransaction, query, {
    searchableFields: paymentSearchableFields,
    filterableFields: paymentFilterableFields
  });
  const result = await queryBuilder.search().filter().where({
    user: {
      isDeleted: false,
      status: {
        not: UserStatus.DELETED
      }
    },
    event: {
      isDeleted: false
    }
  }).include({
    user: {
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        status: true
      }
    },
    event: {
      select: {
        id: true,
        title: true,
        eventDateTime: true,
        ownerId: true,
        visibility: true,
        feeType: true,
        registrationFee: true
      }
    },
    eventParticipant: {
      select: {
        id: true,
        status: true,
        paymentStatus: true,
        paidAmount: true
      }
    }
  }).dynamicInclude(paymentIncludeConfig).paginate().sort().fields().execute();
  return result;
};
var PaymentService = {
  initiateEventPayment,
  handlePaymentSuccess,
  handlePaymentFail,
  handlePaymentCancel,
  handlePaymentIPN,
  validateExistingTransaction,
  getMyPayments,
  getAllPayments
};

// src/app/modules/payment/payment.controller.ts
var buildFrontendRedirectUrl = (path4, trxId, frontendBaseUrl) => {
  const frontendUrl = (frontendBaseUrl || envVars.FRONTEND_URL).replace(
    /\/$/,
    ""
  );
  const url = new URL(path4, frontendUrl);
  if (trxId) {
    url.searchParams.set("trxId", trxId);
  }
  return url.toString();
};
var getSafeFrontendBaseUrl2 = (requestedUrl) => {
  const defaultOrigin = (() => {
    try {
      return new URL(envVars.FRONTEND_URL).origin;
    } catch {
      return envVars.FRONTEND_URL.replace(/\/$/, "");
    }
  })();
  if (!requestedUrl) {
    return defaultOrigin;
  }
  try {
    const origin = new URL(requestedUrl).origin;
    const allowedOrigins = /* @__PURE__ */ new Set([defaultOrigin, "http://localhost:3000"]);
    return allowedOrigins.has(origin) ? origin : defaultOrigin;
  } catch {
    return defaultOrigin;
  }
};
var resolveFrontendBaseUrlFromRequest = (req) => {
  const callbackFrontend = req.query.frontend;
  if (callbackFrontend) {
    return getSafeFrontendBaseUrl2(callbackFrontend);
  }
  const headerOrigin = req.get("origin") || void 0;
  const headerReferer = req.get("referer") || void 0;
  return getSafeFrontendBaseUrl2(headerOrigin || headerReferer);
};
var getTrxIdFromCallback = (req) => {
  return req.query.trxId || req.query.tran_id || req.body?.trxId || req.body?.tran_id;
};
var initiatePayment = catchAsync_default(async (req, res) => {
  const frontendBaseUrl = resolveFrontendBaseUrlFromRequest(req);
  const result = await PaymentService.initiateEventPayment(
    req.user.userId,
    req.body,
    frontendBaseUrl
  );
  sendResponse(res, {
    httpStatusCode: status17.CREATED,
    success: true,
    message: PAYMENT_MESSAGE.INITIATED,
    data: result
  });
});
var paymentSuccess = async (req, res) => {
  const trxId = getTrxIdFromCallback(req);
  const valId = req.query.val_id || req.body?.val_id;
  const frontendBaseUrl = resolveFrontendBaseUrlFromRequest(req);
  try {
    if (!trxId) {
      throw new AppError_default(status17.BAD_REQUEST, "trxId is required");
    }
    await PaymentService.handlePaymentSuccess(trxId, valId, {
      ...req.query,
      ...req.body
    });
    return res.redirect(
      buildFrontendRedirectUrl("/dashboard", trxId, frontendBaseUrl)
    );
  } catch {
    return res.redirect(
      buildFrontendRedirectUrl("/payment/fail", trxId, frontendBaseUrl)
    );
  }
};
var paymentFail = async (req, res) => {
  const trxId = getTrxIdFromCallback(req);
  const frontendBaseUrl = resolveFrontendBaseUrlFromRequest(req);
  try {
    if (!trxId) {
      throw new AppError_default(status17.BAD_REQUEST, "trxId is required");
    }
    await PaymentService.handlePaymentFail(trxId, {
      ...req.query,
      ...req.body
    });
  } catch {
  }
  return res.redirect(
    buildFrontendRedirectUrl("/payment/fail", trxId, frontendBaseUrl)
  );
};
var paymentCancel = async (req, res) => {
  const trxId = getTrxIdFromCallback(req);
  const frontendBaseUrl = resolveFrontendBaseUrlFromRequest(req);
  try {
    if (!trxId) {
      throw new AppError_default(status17.BAD_REQUEST, "trxId is required");
    }
    await PaymentService.handlePaymentCancel(trxId, {
      ...req.query,
      ...req.body
    });
  } catch {
  }
  return res.redirect(
    buildFrontendRedirectUrl("/payment/cancel", trxId, frontendBaseUrl)
  );
};
var paymentIPN = catchAsync_default(async (req, res) => {
  await PaymentService.handlePaymentIPN(req.body);
  sendResponse(res, {
    httpStatusCode: status17.OK,
    success: true,
    message: PAYMENT_MESSAGE.IPN_RECEIVED,
    data: null
  });
});
var validateTransaction = catchAsync_default(async (req, res) => {
  const trxId = req.query.trxId;
  const user = req.user;
  const result = await PaymentService.validateExistingTransaction(trxId);
  if (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN && result.userId !== user.userId) {
    throw new AppError_default(
      status17.FORBIDDEN,
      "You are not allowed to view this transaction"
    );
  }
  sendResponse(res, {
    httpStatusCode: status17.OK,
    success: true,
    message: PAYMENT_MESSAGE.VERIFIED,
    data: result
  });
});
var getMyPayments2 = catchAsync_default(async (req, res) => {
  const result = await PaymentService.getMyPayments(
    req.user,
    req.query
  );
  sendResponse(res, {
    httpStatusCode: status17.OK,
    success: true,
    message: "My payments retrieved successfully",
    data: result.data,
    meta: result.meta
  });
});
var getAllPayments2 = catchAsync_default(async (req, res) => {
  const result = await PaymentService.getAllPayments(
    req.user,
    req.query
  );
  sendResponse(res, {
    httpStatusCode: status17.OK,
    success: true,
    message: "All payments retrieved successfully",
    data: result.data,
    meta: result.meta
  });
});
var PaymentController = {
  initiatePayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  paymentIPN,
  validateTransaction,
  getMyPayments: getMyPayments2,
  getAllPayments: getAllPayments2
};

// src/app/modules/payment/payment.validation.ts
import { z as z5 } from "zod";
var initiatePaymentSchema = z5.object({
  body: z5.object({
    eventId: z5.string().min(1, "eventId is required").uuid("eventId must be a valid uuid")
  })
});
var transactionQuerySchema = z5.object({
  query: z5.object({
    trxId: z5.string().min(1, "trxId is required")
  })
});
var transactionListQuerySchema = z5.object({
  query: z5.object({
    searchTerm: z5.string().optional(),
    page: z5.string().optional(),
    limit: z5.string().optional(),
    sortBy: z5.string().optional(),
    sortOrder: z5.enum(["asc", "desc"]).optional(),
    fields: z5.string().optional(),
    include: z5.string().optional(),
    trxId: z5.string().optional(),
    userId: z5.string().uuid("userId must be a valid uuid").optional(),
    eventId: z5.string().uuid("eventId must be a valid uuid").optional(),
    eventParticipantId: z5.string().uuid("eventParticipantId must be a valid uuid").optional(),
    status: z5.nativeEnum(TransactionStatus).optional(),
    gateway: z5.nativeEnum(PaymentGateway).optional(),
    currency: z5.string().optional()
  }).passthrough()
});
var PaymentValidation = {
  initiatePaymentSchema,
  transactionQuerySchema,
  transactionListQuerySchema
};

// src/app/modules/payment/payment.route.ts
var router7 = Router7();
router7.post(
  "/initiate",
  checkAuth(Role.ADMIN, Role.USER),
  validateRequest(PaymentValidation.initiatePaymentSchema),
  PaymentController.initiatePayment
);
router7.get(
  "/validate",
  checkAuth(Role.ADMIN, Role.USER),
  validateRequest(PaymentValidation.transactionQuerySchema),
  PaymentController.validateTransaction
);
router7.get("/success", PaymentController.paymentSuccess);
router7.post("/success", PaymentController.paymentSuccess);
router7.get("/fail", PaymentController.paymentFail);
router7.post("/fail", PaymentController.paymentFail);
router7.get("/cancel", PaymentController.paymentCancel);
router7.post("/cancel", PaymentController.paymentCancel);
router7.post("/ipn", PaymentController.paymentIPN);
router7.get(
  "/me",
  checkAuth(Role.ADMIN, Role.USER),
  validateRequest(PaymentValidation.transactionListQuerySchema),
  PaymentController.getMyPayments
);
router7.get(
  "/",
  checkAuth(Role.ADMIN),
  validateRequest(PaymentValidation.transactionListQuerySchema),
  PaymentController.getAllPayments
);
var PaymentRoutes = router7;

// src/app/modules/dashboard/dashboard.route.ts
import { Router as Router8 } from "express";

// src/app/modules/dashboard/dashboard.controller.ts
import status18 from "http-status";

// src/app/modules/dashboard/dashboard.service.ts
var getSummary = async (user) => {
  const [
    myEventsCount,
    myRequestsCount,
    pendingInvitationsCount,
    myReviewsCount,
    pendingApprovalsCount
  ] = await Promise.all([
    prisma.event.count({
      where: {
        ownerId: user.userId,
        isDeleted: false
      }
    }),
    prisma.eventParticipant.count({
      where: {
        userId: user.userId,
        isDeleted: false
      }
    }),
    prisma.eventInvitation.count({
      where: {
        userId: user.userId,
        isDeleted: false,
        status: InvitationStatus2.PENDING
      }
    }),
    prisma.eventReview.count({
      where: {
        userId: user.userId,
        isDeleted: false
      }
    }),
    prisma.eventParticipant.count({
      where: {
        isDeleted: false,
        status: ParticipationStatus.PENDING,
        event: {
          ownerId: user.userId,
          isDeleted: false
        }
      }
    })
  ]);
  return {
    myEventsCount,
    myRequestsCount,
    pendingInvitationsCount,
    myReviewsCount,
    pendingApprovalsCount
  };
};
var getMyEvents3 = async (user) => {
  return prisma.event.findMany({
    where: {
      ownerId: user.userId,
      isDeleted: false
    },
    include: {
      _count: {
        select: {
          participants: true,
          reviews: true,
          eventInvitations: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var getPendingInvitations = async (user) => {
  return prisma.eventInvitation.findMany({
    where: {
      userId: user.userId,
      isDeleted: false,
      status: InvitationStatus2.PENDING
    },
    include: {
      event: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var getMyReviews3 = async (user) => {
  return prisma.eventReview.findMany({
    where: {
      userId: user.userId,
      isDeleted: false
    },
    include: {
      event: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var getMyRequests = async (user) => {
  return prisma.eventParticipant.findMany({
    where: {
      userId: user.userId,
      isDeleted: false
    },
    include: {
      event: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var getPendingApprovals = async (user) => {
  return prisma.eventParticipant.findMany({
    where: {
      isDeleted: false,
      status: ParticipationStatus.PENDING,
      event: {
        ownerId: user.userId,
        isDeleted: false
      }
    },
    include: {
      event: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var getMyEventStatusSummary = async (user) => {
  const baseWhere = {
    isDeleted: false,
    event: {
      ownerId: user.userId,
      isDeleted: false
    }
  };
  const [pending, approved, rejected, joined, banned, recentPending] = await Promise.all([
    prisma.eventParticipant.count({
      where: {
        ...baseWhere,
        status: ParticipationStatus.PENDING
      }
    }),
    prisma.eventParticipant.count({
      where: {
        ...baseWhere,
        status: ParticipationStatus.APPROVED
      }
    }),
    prisma.eventParticipant.count({
      where: {
        ...baseWhere,
        status: ParticipationStatus.REJECTED
      }
    }),
    prisma.eventParticipant.count({
      where: {
        ...baseWhere,
        status: ParticipationStatus.JOINED
      }
    }),
    prisma.eventParticipant.count({
      where: {
        ...baseWhere,
        status: ParticipationStatus.BANNED
      }
    }),
    prisma.eventParticipant.findMany({
      where: {
        ...baseWhere,
        status: ParticipationStatus.PENDING
      },
      include: {
        event: {
          select: {
            id: true,
            title: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 8
    })
  ]);
  return {
    total: pending + approved + rejected + joined + banned,
    pending,
    approved,
    rejected,
    joined,
    banned,
    recentPending
  };
};
var DashboardService = {
  getSummary,
  getMyEvents: getMyEvents3,
  getPendingInvitations,
  getMyReviews: getMyReviews3,
  getMyRequests,
  getPendingApprovals,
  getMyEventStatusSummary
};

// src/app/modules/dashboard/dashboard.controller.ts
var getSummary2 = catchAsync_default(async (req, res) => {
  const result = await DashboardService.getSummary(req.user);
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "Dashboard summary retrieved successfully",
    data: result
  });
});
var getMyEvents4 = catchAsync_default(async (req, res) => {
  const result = await DashboardService.getMyEvents(req.user);
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "My events retrieved successfully",
    data: result
  });
});
var getPendingInvitations2 = catchAsync_default(
  async (req, res) => {
    const result = await DashboardService.getPendingInvitations(
      req.user
    );
    sendResponse(res, {
      httpStatusCode: status18.OK,
      success: true,
      message: "Pending invitations retrieved successfully",
      data: result
    });
  }
);
var getMyReviews4 = catchAsync_default(async (req, res) => {
  const result = await DashboardService.getMyReviews(req.user);
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "My reviews retrieved successfully",
    data: result
  });
});
var getMyRequests2 = catchAsync_default(async (req, res) => {
  const result = await DashboardService.getMyRequests(req.user);
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "My participation requests retrieved successfully",
    data: result
  });
});
var getPendingApprovals2 = catchAsync_default(async (req, res) => {
  const result = await DashboardService.getPendingApprovals(
    req.user
  );
  sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "Pending approvals retrieved successfully",
    data: result
  });
});
var getMyEventStatusSummary2 = catchAsync_default(
  async (req, res) => {
    const result = await DashboardService.getMyEventStatusSummary(
      req.user
    );
    sendResponse(res, {
      httpStatusCode: status18.OK,
      success: true,
      message: "My event participation status summary retrieved successfully",
      data: result
    });
  }
);
var DashboardController = {
  getSummary: getSummary2,
  getMyEvents: getMyEvents4,
  getPendingInvitations: getPendingInvitations2,
  getMyReviews: getMyReviews4,
  getMyRequests: getMyRequests2,
  getPendingApprovals: getPendingApprovals2,
  getMyEventStatusSummary: getMyEventStatusSummary2
};

// src/app/modules/dashboard/dashboard.route.ts
var router8 = Router8();
router8.get(
  "/summary",
  checkAuth(Role.ADMIN, Role.USER),
  DashboardController.getSummary
);
router8.get(
  "/my-events",
  checkAuth(Role.ADMIN, Role.USER),
  DashboardController.getMyEvents
);
router8.get(
  "/pending-invitations",
  checkAuth(Role.ADMIN, Role.USER),
  DashboardController.getPendingInvitations
);
router8.get(
  "/my-reviews",
  checkAuth(Role.ADMIN, Role.USER),
  DashboardController.getMyReviews
);
router8.get(
  "/my-requests",
  checkAuth(Role.ADMIN, Role.USER),
  DashboardController.getMyRequests
);
router8.get(
  "/pending-approvals",
  checkAuth(Role.ADMIN, Role.USER),
  DashboardController.getPendingApprovals
);
router8.get(
  "/my-event-status-summary",
  checkAuth(Role.ADMIN, Role.USER),
  DashboardController.getMyEventStatusSummary
);
var DashboardRoutes = router8;

// src/app/modules/admin/admin.route.ts
import { Router as Router9 } from "express";

// src/app/modules/admin/admin.controller.ts
import status20 from "http-status";

// src/app/modules/admin/admin.service.ts
import status19 from "http-status";
var getStats = async () => {
  const [totalUsers, totalEvents, totalReviews, totalParticipants] = await Promise.all([
    prisma.user.count({
      where: {
        isDeleted: false
      }
    }),
    prisma.event.count({
      where: {
        isDeleted: false
      }
    }),
    prisma.eventReview.count({
      where: {
        isDeleted: false
      }
    }),
    prisma.eventParticipant.count({
      where: {
        isDeleted: false
      }
    })
  ]);
  return {
    totalUsers,
    totalEvents,
    totalReviews,
    totalParticipants
  };
};
var getReportsSummary = async () => {
  const [
    totalUsers,
    activeUsers,
    blockedUsers,
    deletedUsers,
    totalEvents,
    privateEvents,
    publicEvents,
    paidEvents,
    freeEvents,
    totalReviews,
    totalParticipants
  ] = await Promise.all([
    prisma.user.count({
      where: {
        isDeleted: false
      }
    }),
    prisma.user.count({
      where: {
        isDeleted: false,
        status: UserStatus.ACTIVE
      }
    }),
    prisma.user.count({
      where: {
        isDeleted: false,
        status: UserStatus.BLOCKED
      }
    }),
    prisma.user.count({
      where: {
        OR: [
          {
            isDeleted: true
          },
          {
            status: UserStatus.DELETED
          }
        ]
      }
    }),
    prisma.event.count({
      where: {
        isDeleted: false
      }
    }),
    prisma.event.count({
      where: {
        isDeleted: false,
        visibility: "PRIVATE"
      }
    }),
    prisma.event.count({
      where: {
        isDeleted: false,
        visibility: "PUBLIC"
      }
    }),
    prisma.event.count({
      where: {
        isDeleted: false,
        feeType: "PAID"
      }
    }),
    prisma.event.count({
      where: {
        isDeleted: false,
        feeType: "FREE"
      }
    }),
    prisma.eventReview.count({
      where: {
        isDeleted: false
      }
    }),
    prisma.eventParticipant.count({
      where: {
        isDeleted: false
      }
    })
  ]);
  return {
    users: {
      totalUsers,
      activeUsers,
      blockedUsers,
      deletedUsers
    },
    events: {
      totalEvents,
      privateEvents,
      publicEvents,
      paidEvents,
      freeEvents
    },
    engagement: {
      totalReviews,
      totalParticipants
    }
  };
};
var getAllUsers = async (query) => {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 10);
  const skip = (page - 1) * limit;
  const searchTerm = query.searchTerm || "";
  const statusFilter = query.status;
  const roleFilter = query.role;
  const where = {
    isDeleted: false
  };
  if (searchTerm) {
    where.OR = [
      {
        name: {
          contains: searchTerm,
          mode: "insensitive"
        }
      },
      {
        email: {
          contains: searchTerm,
          mode: "insensitive"
        }
      }
    ];
  }
  if (statusFilter && ["ACTIVE", "BLOCKED", "DELETED"].includes(statusFilter)) {
    where.status = statusFilter;
  }
  if (roleFilter && ["SUPER_ADMIN", "ADMIN", "USER"].includes(roleFilter)) {
    where.role = roleFilter;
  }
  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc"
      },
      include: {
        _count: {
          select: {
            events: true,
            eventParticipants: true,
            eventReviews: true
          }
        }
      }
    }),
    prisma.user.count({ where })
  ]);
  return {
    meta: {
      page,
      limit,
      total
    },
    data
  };
};
var getUserById = async (userId) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      isDeleted: false
    },
    include: {
      _count: {
        select: {
          events: true,
          eventParticipants: true,
          eventReviews: true,
          eventInvitations: true,
          sentInvitations: true
        }
      },
      events: {
        where: {
          isDeleted: false
        },
        orderBy: {
          createdAt: "desc"
        },
        take: 5,
        select: {
          id: true,
          title: true,
          createdAt: true,
          visibility: true,
          feeType: true
        }
      },
      eventParticipants: {
        where: {
          isDeleted: false
        },
        orderBy: {
          createdAt: "desc"
        },
        take: 5,
        select: {
          id: true,
          status: true,
          paymentStatus: true,
          createdAt: true,
          event: {
            select: {
              id: true,
              title: true
            }
          }
        }
      },
      eventReviews: {
        where: {
          isDeleted: false
        },
        orderBy: {
          createdAt: "desc"
        },
        take: 5,
        select: {
          id: true,
          rating: true,
          review: true,
          createdAt: true,
          event: {
            select: {
              id: true,
              title: true
            }
          }
        }
      }
    }
  });
  if (!user) {
    throw new AppError_default(status19.NOT_FOUND, "User not found");
  }
  return user;
};
var getAllEvents3 = async (query) => {
  const page = Number(query.page || 1);
  const limit = Number(query.limit || 10);
  const skip = (page - 1) * limit;
  const searchTerm = query.searchTerm || "";
  const where = {
    isDeleted: false
  };
  if (searchTerm) {
    where.OR = [
      {
        title: {
          contains: searchTerm,
          mode: "insensitive"
        }
      },
      {
        owner: {
          name: {
            contains: searchTerm,
            mode: "insensitive"
          }
        }
      }
    ];
  }
  const [data, total] = await Promise.all([
    prisma.event.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc"
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        _count: {
          select: {
            participants: true,
            reviews: true,
            eventInvitations: true
          }
        }
      }
    }),
    prisma.event.count({ where })
  ]);
  return {
    meta: {
      page,
      limit,
      total
    },
    data
  };
};
var updateUser = async (adminUser, userId, payload) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });
  if (!existingUser || existingUser.isDeleted) {
    throw new AppError_default(status19.NOT_FOUND, "User not found");
  }
  if (Object.keys(payload).length === 0) {
    throw new AppError_default(status19.BAD_REQUEST, "No data provided");
  }
  if (adminUser.userId === userId && (payload.role !== void 0 || payload.status !== void 0)) {
    throw new AppError_default(
      status19.BAD_REQUEST,
      "You cannot change your own role or status from this endpoint"
    );
  }
  if (payload.role === Role.SUPER_ADMIN) {
    throw new AppError_default(
      status19.BAD_REQUEST,
      "Setting SUPER_ADMIN role is not allowed from this endpoint"
    );
  }
  if (existingUser.role === Role.SUPER_ADMIN) {
    throw new AppError_default(
      status19.BAD_REQUEST,
      "Super admin account cannot be modified from this endpoint"
    );
  }
  if (adminUser.role === Role.ADMIN && payload.role !== void 0) {
    if (existingUser.role !== Role.USER || payload.role !== Role.ADMIN) {
      throw new AppError_default(
        status19.BAD_REQUEST,
        "Admin can only promote user role to admin"
      );
    }
  }
  if (existingUser.role === Role.ADMIN && (payload.role !== void 0 || payload.status !== void 0)) {
    if (adminUser.role !== Role.SUPER_ADMIN) {
      throw new AppError_default(
        status19.BAD_REQUEST,
        "Only super admin can change admin account role or status"
      );
    }
    if (payload.role !== void 0 && payload.role !== Role.USER) {
      throw new AppError_default(
        status19.BAD_REQUEST,
        "Super admin can only demote admin to user from this endpoint"
      );
    }
    if (payload.status !== void 0) {
      throw new AppError_default(
        status19.BAD_REQUEST,
        "Admin account status cannot be changed from this endpoint"
      );
    }
    if (payload.role === void 0) {
      throw new AppError_default(
        status19.BAD_REQUEST,
        "Provide role USER to demote this admin account"
      );
    }
  }
  const updateData = {
    ...payload.name !== void 0 ? { name: payload.name } : {},
    ...payload.image !== void 0 ? { image: payload.image } : {},
    ...payload.role !== void 0 ? { role: payload.role } : {},
    ...payload.status !== void 0 ? { status: payload.status } : {}
  };
  if (payload.status === UserStatus.DELETED) {
    updateData.isDeleted = true;
    updateData.deletedAt = /* @__PURE__ */ new Date();
  }
  if (payload.status === UserStatus.ACTIVE || payload.status === UserStatus.BLOCKED) {
    updateData.isDeleted = false;
    updateData.deletedAt = null;
  }
  const updatedUser = await prisma.user.update({
    where: {
      id: userId
    },
    data: updateData
  });
  return updatedUser;
};
var blockUser = async (userId) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });
  if (!existingUser || existingUser.isDeleted) {
    throw new AppError_default(status19.NOT_FOUND, "User not found");
  }
  if (existingUser.role === Role.ADMIN || existingUser.role === Role.SUPER_ADMIN) {
    throw new AppError_default(
      status19.BAD_REQUEST,
      "Admin or super admin accounts cannot be blocked from this endpoint"
    );
  }
  const updatedUser = await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      status: UserStatus.BLOCKED
    }
  });
  return updatedUser;
};
var unblockUser = async (userId) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });
  if (!existingUser || existingUser.isDeleted) {
    throw new AppError_default(status19.NOT_FOUND, "User not found");
  }
  const updatedUser = await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      status: UserStatus.ACTIVE
    }
  });
  return updatedUser;
};
var deleteUser = async (userId) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });
  if (!existingUser || existingUser.isDeleted) {
    throw new AppError_default(status19.NOT_FOUND, "User not found");
  }
  if (existingUser.role === Role.ADMIN || existingUser.role === Role.SUPER_ADMIN) {
    throw new AppError_default(
      status19.BAD_REQUEST,
      "Admin or super admin accounts cannot be deleted from this endpoint"
    );
  }
  const updatedUser = await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      status: UserStatus.DELETED,
      isDeleted: true,
      deletedAt: /* @__PURE__ */ new Date()
    }
  });
  return updatedUser;
};
var deleteEvent3 = async (eventId) => {
  const existingEvent = await prisma.event.findFirst({
    where: {
      id: eventId,
      isDeleted: false
    }
  });
  if (!existingEvent) {
    throw new AppError_default(status19.NOT_FOUND, "Event not found");
  }
  const updatedEvent = await prisma.event.update({
    where: {
      id: eventId
    },
    data: {
      isDeleted: true,
      deletedAt: /* @__PURE__ */ new Date()
    }
  });
  return updatedEvent;
};
var AdminService = {
  getStats,
  getReportsSummary,
  getAllUsers,
  getUserById,
  getAllEvents: getAllEvents3,
  updateUser,
  blockUser,
  unblockUser,
  deleteUser,
  deleteEvent: deleteEvent3
};

// src/app/modules/admin/admin.controller.ts
var getStats2 = catchAsync_default(async (_req, res) => {
  const result = await AdminService.getStats();
  sendResponse(res, {
    httpStatusCode: status20.OK,
    success: true,
    message: "Admin stats retrieved successfully",
    data: result
  });
});
var getReportsSummary2 = catchAsync_default(async (_req, res) => {
  const result = await AdminService.getReportsSummary();
  sendResponse(res, {
    httpStatusCode: status20.OK,
    success: true,
    message: "Admin report summary retrieved successfully",
    data: result
  });
});
var getAllUsers2 = catchAsync_default(async (req, res) => {
  const result = await AdminService.getAllUsers(req.query);
  sendResponse(res, {
    httpStatusCode: status20.OK,
    success: true,
    message: "Users retrieved successfully",
    data: result.data,
    meta: result.meta
  });
});
var getUserById2 = catchAsync_default(async (req, res) => {
  const result = await AdminService.getUserById(req.params.userId);
  sendResponse(res, {
    httpStatusCode: status20.OK,
    success: true,
    message: "User retrieved successfully",
    data: result
  });
});
var getAllEvents4 = catchAsync_default(async (req, res) => {
  const result = await AdminService.getAllEvents(req.query);
  sendResponse(res, {
    httpStatusCode: status20.OK,
    success: true,
    message: "Events retrieved successfully",
    data: result.data,
    meta: result.meta
  });
});
var updateUser2 = catchAsync_default(async (req, res) => {
  const result = await AdminService.updateUser(
    req.user,
    req.params.userId,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: status20.OK,
    success: true,
    message: "User updated successfully",
    data: result
  });
});
var blockUser2 = catchAsync_default(async (req, res) => {
  const result = await AdminService.blockUser(req.params.userId);
  sendResponse(res, {
    httpStatusCode: status20.OK,
    success: true,
    message: "User blocked successfully",
    data: result
  });
});
var unblockUser2 = catchAsync_default(async (req, res) => {
  const result = await AdminService.unblockUser(req.params.userId);
  sendResponse(res, {
    httpStatusCode: status20.OK,
    success: true,
    message: "User unblocked successfully",
    data: result
  });
});
var deleteUser2 = catchAsync_default(async (req, res) => {
  const result = await AdminService.deleteUser(req.params.userId);
  sendResponse(res, {
    httpStatusCode: status20.OK,
    success: true,
    message: "User deleted successfully",
    data: result
  });
});
var deleteEvent4 = catchAsync_default(async (req, res) => {
  const result = await AdminService.deleteEvent(req.params.eventId);
  sendResponse(res, {
    httpStatusCode: status20.OK,
    success: true,
    message: "Event deleted successfully",
    data: result
  });
});
var AdminController = {
  getStats: getStats2,
  getReportsSummary: getReportsSummary2,
  getAllUsers: getAllUsers2,
  getUserById: getUserById2,
  getAllEvents: getAllEvents4,
  updateUser: updateUser2,
  blockUser: blockUser2,
  unblockUser: unblockUser2,
  deleteUser: deleteUser2,
  deleteEvent: deleteEvent4
};

// src/app/modules/admin/admin.validation.ts
import { z as z6 } from "zod";
var updateUserByAdminValidationSchema = z6.object({
  body: z6.object({
    name: z6.string().min(2).max(100).optional(),
    image: z6.string().url().optional(),
    role: z6.nativeEnum(Role).optional(),
    status: z6.nativeEnum(UserStatus).optional()
  }).refine((data) => Object.keys(data).length > 0, {
    message: "No data provided"
  })
});

// src/app/modules/admin/admin.route.ts
var router9 = Router9();
router9.get("/stats", checkAuth(Role.ADMIN), AdminController.getStats);
router9.get(
  "/reports/summary",
  checkAuth(Role.ADMIN),
  AdminController.getReportsSummary
);
router9.get("/users", checkAuth(Role.ADMIN), AdminController.getAllUsers);
router9.get(
  "/users/:userId",
  checkAuth(Role.ADMIN),
  AdminController.getUserById
);
router9.get("/events", checkAuth(Role.ADMIN), AdminController.getAllEvents);
router9.patch(
  "/users/:userId",
  checkAuth(Role.ADMIN),
  validateRequest(updateUserByAdminValidationSchema),
  AdminController.updateUser
);
router9.patch(
  "/users/:userId/block",
  checkAuth(Role.ADMIN),
  AdminController.blockUser
);
router9.patch(
  "/users/:userId/unblock",
  checkAuth(Role.ADMIN),
  AdminController.unblockUser
);
router9.delete(
  "/users/:userId",
  checkAuth(Role.ADMIN),
  AdminController.deleteUser
);
router9.delete(
  "/events/:eventId",
  checkAuth(Role.ADMIN),
  AdminController.deleteEvent
);
var AdminRoutes = router9;

// src/app/routes/index.ts
var router10 = Router10();
router10.use("/auth", AuthRoutes);
router10.use("/users", UserRoutes);
router10.use("/events", EventRoutes);
router10.use("/participations", ParticipationRoutes);
router10.use("/invitations", InvitationRoutes);
router10.use("/reviews", ReviewRoutes);
router10.use("/payments", PaymentRoutes);
router10.use("/dashboard", DashboardRoutes);
router10.use("/admin", AdminRoutes);
var IndexRoutes = router10;

// src/app/middleware/notFound.ts
import status21 from "http-status";
var notFound = (req, res) => {
  res.status(status21.NOT_FOUND).json({
    success: false,
    message: `Route ${req.originalUrl} Not Found`
  });
};

// src/app/middleware/globalErrorHandler.ts
import status23 from "http-status";
import z7 from "zod";

// src/app/errorHelpers/handleZodError.ts
import status22 from "http-status";
var handleZodError = (err) => {
  const statusCode = status22.BAD_REQUEST;
  const message = "Zod Validation Error";
  const errorSources = [];
  err.issues.forEach((issue) => {
    errorSources.push({
      path: issue.path.join(" => "),
      message: issue.message
    });
  });
  return {
    success: false,
    message,
    errorSources,
    statusCode
  };
};

// src/app/middleware/globalErrorHandler.ts
var globalErrorHandler = async (err, req, res, next) => {
  if (envVars.NODE_ENV === "development") {
    console.log("Error from Global Error Handler", err);
  }
  if (req.file) {
    await deleteFileFromCloudinary(req.file.path);
  }
  if (req.files && Array.isArray(req.files) && req.files?.length > 0) {
    const imageUrls = req.files.map((file2) => file2.path);
    await Promise.all(imageUrls.map((url) => deleteFileFromCloudinary(url)));
  }
  let errorSources = [];
  let statusCode = status23.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  let stack = void 0;
  if (err instanceof z7.ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof AppError_default) {
    statusCode = err.statusCode;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message
      }
    ];
  } else if (err instanceof Error) {
    statusCode = status23.INTERNAL_SERVER_ERROR;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message
      }
    ];
  }
  const errorResponse = {
    success: false,
    message,
    errorSources,
    error: envVars.NODE_ENV === "development" ? err : void 0,
    stack: envVars.NODE_ENV === "development" ? stack : void 0
  };
  res.status(statusCode).json(errorResponse);
};

// src/app.ts
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import path3 from "path";
import qs from "qs";
import cors from "cors";
var app = express();
app.set("query parser", (str) => qs.parse(str));
var explicitAllowedOrigins = [
  envVars.FRONTEND_URL,
  envVars.BETTER_AUTH_URL,
  "http://localhost:3000"
].flatMap((value) => value.split(",")).map((value) => value.trim()).filter(Boolean);
var isAllowedOrigin = (origin) => {
  if (!origin) {
    return true;
  }
  if (explicitAllowedOrigins.includes(origin)) {
    return true;
  }
  if (/^https:\/\/.*planora-frontend.*\.vercel\.app$/i.test(origin)) {
    return true;
  }
  if (/^https:\/\/(sandbox|securepay)\.sslcommerz\.com$/i.test(origin)) {
    return true;
  }
  return false;
};
app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked for origin: ${origin || "unknown"}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
  })
);
app.set("view engine", "ejs");
app.set("views", path3.resolve(process.cwd(), "src/app/templates"));
app.use("/api/auth", toNodeHandler(auth));
app.use(express.urlencoded({ extended: true }));
dotenv2.config();
app.use(express.json());
app.use(cookieParser());
app.use(async (_req, _res, next) => {
  await prismaSchemaReady;
  next();
});
app.use("/api/v1", IndexRoutes);
app.get("/", (req, res) => {
  res.send("Hello, TypeScript + Express!");
});
app.use(globalErrorHandler);
app.use(notFound);
var app_default = app;

// src/index.ts
var index_default = app_default;
export {
  index_default as default
};
