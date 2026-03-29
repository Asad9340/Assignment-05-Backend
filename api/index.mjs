// src/app.ts
import express from "express";
import dotenv2 from "dotenv";

// src/app/routes/index.ts
import { Router as Router7 } from "express";

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
    FRONTEND_URL: process.env.FRONTEND_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
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
      SSL_STORE_ID: process.env.SSL_STORE_ID,
      SSL_STORE_PASSWORD: process.env.SSL_STORE_PASSWORD,
      SSL_IS_LIVE: process.env.SSL_IS_LIVE
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
  "inlineSchema": 'model User {\n  id                  String               @id @default(uuid())\n  name                String\n  email               String\n  emailVerified       Boolean              @default(false)\n  role                Role                 @default(USER)\n  status              UserStatus           @default(ACTIVE)\n  isDeleted           Boolean              @default(false)\n  deletedAt           DateTime?\n  image               String?\n  createdAt           DateTime             @default(now())\n  updatedAt           DateTime             @updatedAt\n  sessions            Session[]\n  accounts            Account[]\n  events              Event[]\n  eventParticipants   EventParticipant[]\n  eventReviews        EventReview[]\n  eventInvitations    EventInvitation[]    @relation("EventInvitationUser")\n  sentInvitations     EventInvitation[]    @relation("EventInvitationInvitedBy")\n  paymentTransactions PaymentTransaction[]\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id @default(uuid())\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id @default(uuid())\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id @default(uuid())\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nenum Role {\n  ADMIN\n  USER\n}\n\nenum EventVisibility {\n  PUBLIC\n  PRIVATE\n}\n\nenum FeeType {\n  FREE\n  PAID\n}\n\nenum ParticipationStatus {\n  PENDING\n  APPROVED\n  REJECTED\n  JOINED\n  BANNED\n}\n\nenum PaymentStatus {\n  PENDING\n  PAID\n  FAILED\n}\n\nenum UserStatus {\n  ACTIVE\n  BLOCKED\n  DELETED\n}\n\nenum InvitationStatus {\n  PENDING\n  ACCEPTED\n  REJECTED\n}\n\nenum PaymentGateway {\n  SSLCOMMERZ\n}\n\nenum TransactionStatus {\n  INITIATED\n  VALID\n  FAILED\n  CANCELLED\n}\n\nmodel Event {\n  id            String   @id @default(uuid())\n  title         String\n  description   String\n  eventDateTime DateTime\n  venue         String?\n  eventLink     String?\n\n  visibility      EventVisibility\n  feeType         FeeType         @default(FREE)\n  registrationFee Float           @default(0)\n\n  ownerId String\n  owner   User   @relation(fields: [ownerId], references: [id])\n\n  participants     EventParticipant[]\n  reviews          EventReview[]\n  eventInvitations EventInvitation[]\n\n  createdAt           DateTime             @default(now())\n  updatedAt           DateTime             @updatedAt\n  isDeleted           Boolean              @default(false)\n  deletedAt           DateTime?\n  paymentTransactions PaymentTransaction[]\n\n  @@index([visibility, feeType])\n  @@index([isDeleted])\n  @@index([eventDateTime])\n  @@index([ownerId])\n  @@index([isDeleted, visibility, eventDateTime])\n}\n\nmodel EventParticipant {\n  id      String @id @default(uuid())\n  eventId String\n  userId  String\n\n  status ParticipationStatus @default(PENDING)\n\n  paymentStatus PaymentStatus @default(PENDING)\n  paidAmount    Float?\n\n  requestedAt DateTime  @default(now())\n  approvedAt  DateTime?\n  rejectedAt  DateTime?\n  bannedAt    DateTime?\n\n  event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)\n  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  createdAt           DateTime             @default(now())\n  updatedAt           DateTime             @updatedAt\n  isDeleted           Boolean              @default(false)\n  deletedAt           DateTime?\n  paymentTransactions PaymentTransaction[]\n\n  @@unique([eventId, userId])\n}\n\nmodel EventInvitation {\n  id          String @id @default(uuid())\n  eventId     String\n  userId      String\n  invitedById String\n\n  status InvitationStatus\n\n  event     Event @relation(fields: [eventId], references: [id], onDelete: Cascade)\n  user      User  @relation("EventInvitationUser", fields: [userId], references: [id], onDelete: Cascade)\n  invitedBy User  @relation("EventInvitationInvitedBy", fields: [invitedById], references: [id], onDelete: Cascade)\n\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n\n  @@unique([eventId, userId])\n}\n\nmodel EventReview {\n  id      String @id @default(uuid())\n  eventId String\n  userId  String\n\n  rating Int\n  review String?\n\n  event Event @relation(fields: [eventId], references: [id], onDelete: Cascade)\n  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n\n  @@unique([eventId, userId])\n}\n\nmodel PaymentTransaction {\n  id      String         @id @default(uuid())\n  trxId   String         @unique\n  gateway PaymentGateway @default(SSLCOMMERZ)\n\n  userId             String\n  eventId            String\n  eventParticipantId String?\n\n  amount   Float\n  currency String @default("BDT")\n\n  status TransactionStatus @default(INITIATED)\n\n  gatewayTransactionId String?\n  bankTransactionId    String?\n  valId                String?\n  cardType             String?\n  storeAmount          Float?\n  verifyPayload        Json?\n\n  successUrl      String?\n  failUrl         String?\n  cancelUrl       String?\n  gatewayResponse Json?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  user             User              @relation(fields: [userId], references: [id], onDelete: Cascade)\n  event            Event             @relation(fields: [eventId], references: [id], onDelete: Cascade)\n  eventParticipant EventParticipant? @relation(fields: [eventParticipantId], references: [id], onDelete: SetNull)\n\n  @@index([userId])\n  @@index([eventId])\n  @@index([eventParticipantId])\n}\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n',
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
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"events","kind":"object","type":"Event","relationName":"EventToUser"},{"name":"eventParticipants","kind":"object","type":"EventParticipant","relationName":"EventParticipantToUser"},{"name":"eventReviews","kind":"object","type":"EventReview","relationName":"EventReviewToUser"},{"name":"eventInvitations","kind":"object","type":"EventInvitation","relationName":"EventInvitationUser"},{"name":"sentInvitations","kind":"object","type":"EventInvitation","relationName":"EventInvitationInvitedBy"},{"name":"paymentTransactions","kind":"object","type":"PaymentTransaction","relationName":"PaymentTransactionToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Event":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"eventDateTime","kind":"scalar","type":"DateTime"},{"name":"venue","kind":"scalar","type":"String"},{"name":"eventLink","kind":"scalar","type":"String"},{"name":"visibility","kind":"enum","type":"EventVisibility"},{"name":"feeType","kind":"enum","type":"FeeType"},{"name":"registrationFee","kind":"scalar","type":"Float"},{"name":"ownerId","kind":"scalar","type":"String"},{"name":"owner","kind":"object","type":"User","relationName":"EventToUser"},{"name":"participants","kind":"object","type":"EventParticipant","relationName":"EventToEventParticipant"},{"name":"reviews","kind":"object","type":"EventReview","relationName":"EventToEventReview"},{"name":"eventInvitations","kind":"object","type":"EventInvitation","relationName":"EventToEventInvitation"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"paymentTransactions","kind":"object","type":"PaymentTransaction","relationName":"EventToPaymentTransaction"}],"dbName":null},"EventParticipant":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"eventId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"ParticipationStatus"},{"name":"paymentStatus","kind":"enum","type":"PaymentStatus"},{"name":"paidAmount","kind":"scalar","type":"Float"},{"name":"requestedAt","kind":"scalar","type":"DateTime"},{"name":"approvedAt","kind":"scalar","type":"DateTime"},{"name":"rejectedAt","kind":"scalar","type":"DateTime"},{"name":"bannedAt","kind":"scalar","type":"DateTime"},{"name":"event","kind":"object","type":"Event","relationName":"EventToEventParticipant"},{"name":"user","kind":"object","type":"User","relationName":"EventParticipantToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"paymentTransactions","kind":"object","type":"PaymentTransaction","relationName":"EventParticipantToPaymentTransaction"}],"dbName":null},"EventInvitation":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"eventId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"invitedById","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"InvitationStatus"},{"name":"event","kind":"object","type":"Event","relationName":"EventToEventInvitation"},{"name":"user","kind":"object","type":"User","relationName":"EventInvitationUser"},{"name":"invitedBy","kind":"object","type":"User","relationName":"EventInvitationInvitedBy"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"EventReview":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"eventId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"review","kind":"scalar","type":"String"},{"name":"event","kind":"object","type":"Event","relationName":"EventToEventReview"},{"name":"user","kind":"object","type":"User","relationName":"EventReviewToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"PaymentTransaction":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"trxId","kind":"scalar","type":"String"},{"name":"gateway","kind":"enum","type":"PaymentGateway"},{"name":"userId","kind":"scalar","type":"String"},{"name":"eventId","kind":"scalar","type":"String"},{"name":"eventParticipantId","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"currency","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TransactionStatus"},{"name":"gatewayTransactionId","kind":"scalar","type":"String"},{"name":"bankTransactionId","kind":"scalar","type":"String"},{"name":"valId","kind":"scalar","type":"String"},{"name":"cardType","kind":"scalar","type":"String"},{"name":"storeAmount","kind":"scalar","type":"Float"},{"name":"verifyPayload","kind":"scalar","type":"Json"},{"name":"successUrl","kind":"scalar","type":"String"},{"name":"failUrl","kind":"scalar","type":"String"},{"name":"cancelUrl","kind":"scalar","type":"String"},{"name":"gatewayResponse","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"PaymentTransactionToUser"},{"name":"event","kind":"object","type":"Event","relationName":"EventToPaymentTransaction"},{"name":"eventParticipant","kind":"object","type":"EventParticipant","relationName":"EventParticipantToPaymentTransaction"}],"dbName":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","owner","event","eventParticipant","paymentTransactions","_count","participants","reviews","invitedBy","eventInvitations","events","eventParticipants","eventReviews","sentInvitations","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","data","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","create","update","User.upsertOne","User.deleteOne","User.deleteMany","having","_min","_max","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Event.findUnique","Event.findUniqueOrThrow","Event.findFirst","Event.findFirstOrThrow","Event.findMany","Event.createOne","Event.createMany","Event.createManyAndReturn","Event.updateOne","Event.updateMany","Event.updateManyAndReturn","Event.upsertOne","Event.deleteOne","Event.deleteMany","_avg","_sum","Event.groupBy","Event.aggregate","EventParticipant.findUnique","EventParticipant.findUniqueOrThrow","EventParticipant.findFirst","EventParticipant.findFirstOrThrow","EventParticipant.findMany","EventParticipant.createOne","EventParticipant.createMany","EventParticipant.createManyAndReturn","EventParticipant.updateOne","EventParticipant.updateMany","EventParticipant.updateManyAndReturn","EventParticipant.upsertOne","EventParticipant.deleteOne","EventParticipant.deleteMany","EventParticipant.groupBy","EventParticipant.aggregate","EventInvitation.findUnique","EventInvitation.findUniqueOrThrow","EventInvitation.findFirst","EventInvitation.findFirstOrThrow","EventInvitation.findMany","EventInvitation.createOne","EventInvitation.createMany","EventInvitation.createManyAndReturn","EventInvitation.updateOne","EventInvitation.updateMany","EventInvitation.updateManyAndReturn","EventInvitation.upsertOne","EventInvitation.deleteOne","EventInvitation.deleteMany","EventInvitation.groupBy","EventInvitation.aggregate","EventReview.findUnique","EventReview.findUniqueOrThrow","EventReview.findFirst","EventReview.findFirstOrThrow","EventReview.findMany","EventReview.createOne","EventReview.createMany","EventReview.createManyAndReturn","EventReview.updateOne","EventReview.updateMany","EventReview.updateManyAndReturn","EventReview.upsertOne","EventReview.deleteOne","EventReview.deleteMany","EventReview.groupBy","EventReview.aggregate","PaymentTransaction.findUnique","PaymentTransaction.findUniqueOrThrow","PaymentTransaction.findFirst","PaymentTransaction.findFirstOrThrow","PaymentTransaction.findMany","PaymentTransaction.createOne","PaymentTransaction.createMany","PaymentTransaction.createManyAndReturn","PaymentTransaction.updateOne","PaymentTransaction.updateMany","PaymentTransaction.updateManyAndReturn","PaymentTransaction.upsertOne","PaymentTransaction.deleteOne","PaymentTransaction.deleteMany","PaymentTransaction.groupBy","PaymentTransaction.aggregate","AND","OR","NOT","id","trxId","PaymentGateway","gateway","userId","eventId","eventParticipantId","amount","currency","TransactionStatus","status","gatewayTransactionId","bankTransactionId","valId","cardType","storeAmount","verifyPayload","successUrl","failUrl","cancelUrl","gatewayResponse","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","contains","startsWith","endsWith","rating","review","isDeleted","deletedAt","invitedById","InvitationStatus","ParticipationStatus","PaymentStatus","paymentStatus","paidAmount","requestedAt","approvedAt","rejectedAt","bannedAt","title","description","eventDateTime","venue","eventLink","EventVisibility","visibility","FeeType","feeType","registrationFee","ownerId","identifier","value","expiresAt","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","name","email","emailVerified","Role","role","UserStatus","image","every","some","none","eventId_userId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "sAVUkAEWBAAAxwIAIAUAAMgCACAJAADNAgAgDgAAzAIAIA8AAMkCACAQAADKAgAgEQAAywIAIBIAAMwCACCrAQAAwQIAMKwBAAA0ABCtAQAAwQIAMK4BAQAAAAG4AQAAxAKEAiLDAUAAtwIAIcQBQAC3AgAh2AEgAMICACHZAUAAxQIAIf4BAQC2AgAh_wEBAAAAAYACIADCAgAhggIAAMMCggIihAIBAMYCACEBAAAAAQAgDAMAANICACCrAQAA5QIAMKwBAAADABCtAQAA5QIAMK4BAQC2AgAhsgEBALYCACHDAUAAtwIAIcQBQAC3AgAh8QFAALcCACH7AQEAtgIAIfwBAQDGAgAh_QEBAMYCACEDAwAA4QQAIPwBAADmAgAg_QEAAOYCACAMAwAA0gIAIKsBAADlAgAwrAEAAAMAEK0BAADlAgAwrgEBAAAAAbIBAQC2AgAhwwFAALcCACHEAUAAtwIAIfEBQAC3AgAh-wEBAAAAAfwBAQDGAgAh_QEBAMYCACEDAAAAAwAgAQAABAAwAgAABQAgEQMAANICACCrAQAA5AIAMKwBAAAHABCtAQAA5AIAMK4BAQC2AgAhsgEBALYCACHDAUAAtwIAIcQBQAC3AgAh8gEBALYCACHzAQEAtgIAIfQBAQDGAgAh9QEBAMYCACH2AQEAxgIAIfcBQADFAgAh-AFAAMUCACH5AQEAxgIAIfoBAQDGAgAhCAMAAOEEACD0AQAA5gIAIPUBAADmAgAg9gEAAOYCACD3AQAA5gIAIPgBAADmAgAg-QEAAOYCACD6AQAA5gIAIBEDAADSAgAgqwEAAOQCADCsAQAABwAQrQEAAOQCADCuAQEAAAABsgEBALYCACHDAUAAtwIAIcQBQAC3AgAh8gEBALYCACHzAQEAtgIAIfQBAQDGAgAh9QEBAMYCACH2AQEAxgIAIfcBQADFAgAh-AFAAMUCACH5AQEAxgIAIfoBAQDGAgAhAwAAAAcAIAEAAAgAMAIAAAkAIBYGAADSAgAgCQAAzQIAIAsAAMoCACAMAADLAgAgDgAAzAIAIKsBAADhAgAwrAEAAAsAEK0BAADhAgAwrgEBALYCACHDAUAAtwIAIcQBQAC3AgAh2AEgAMICACHZAUAAxQIAIeQBAQC2AgAh5QEBALYCACHmAUAAtwIAIecBAQDGAgAh6AEBAMYCACHqAQAA4gLqASLsAQAA4wLsASLtAQgA2AIAIe4BAQC2AgAhCAYAAOEEACAJAADfBAAgCwAA3AQAIAwAAN0EACAOAADeBAAg2QEAAOYCACDnAQAA5gIAIOgBAADmAgAgFgYAANICACAJAADNAgAgCwAAygIAIAwAAMsCACAOAADMAgAgqwEAAOECADCsAQAACwAQrQEAAOECADCuAQEAAAABwwFAALcCACHEAUAAtwIAIdgBIADCAgAh2QFAAMUCACHkAQEAtgIAIeUBAQC2AgAh5gFAALcCACHnAQEAxgIAIegBAQDGAgAh6gEAAOIC6gEi7AEAAOMC7AEi7QEIANgCACHuAQEAtgIAIQMAAAALACABAAAMADACAAANACAUAwAA0gIAIAcAANECACAJAADNAgAgqwEAAN4CADCsAQAADwAQrQEAAN4CADCuAQEAtgIAIbIBAQC2AgAhswEBALYCACG4AQAA3wLdASLDAUAAtwIAIcQBQAC3AgAh2AEgAMICACHZAUAAxQIAId4BAADgAt4BIt8BCADaAgAh4AFAALcCACHhAUAAxQIAIeIBQADFAgAh4wFAAMUCACEIAwAA4QQAIAcAAOAEACAJAADfBAAg2QEAAOYCACDfAQAA5gIAIOEBAADmAgAg4gEAAOYCACDjAQAA5gIAIBUDAADSAgAgBwAA0QIAIAkAAM0CACCrAQAA3gIAMKwBAAAPABCtAQAA3gIAMK4BAQAAAAGyAQEAtgIAIbMBAQC2AgAhuAEAAN8C3QEiwwFAALcCACHEAUAAtwIAIdgBIADCAgAh2QFAAMUCACHeAQAA4ALeASLfAQgA2gIAIeABQAC3AgAh4QFAAMUCACHiAUAAxQIAIeMBQADFAgAhiAIAAN0CACADAAAADwAgAQAAEAAwAgAAEQAgGwMAANICACAHAADRAgAgCAAA3AIAIKsBAADWAgAwrAEAABMAEK0BAADWAgAwrgEBALYCACGvAQEAtgIAIbEBAADXArEBIrIBAQC2AgAhswEBALYCACG0AQEAxgIAIbUBCADYAgAhtgEBALYCACG4AQAA2QK4ASK5AQEAxgIAIboBAQDGAgAhuwEBAMYCACG8AQEAxgIAIb0BCADaAgAhvgEAANsCACC_AQEAxgIAIcABAQDGAgAhwQEBAMYCACHCAQAA2wIAIMMBQAC3AgAhxAFAALcCACEOAwAA4QQAIAcAAOAEACAIAADiBAAgtAEAAOYCACC5AQAA5gIAILoBAADmAgAguwEAAOYCACC8AQAA5gIAIL0BAADmAgAgvgEAAOYCACC_AQAA5gIAIMABAADmAgAgwQEAAOYCACDCAQAA5gIAIBsDAADSAgAgBwAA0QIAIAgAANwCACCrAQAA1gIAMKwBAAATABCtAQAA1gIAMK4BAQAAAAGvAQEAAAABsQEAANcCsQEisgEBALYCACGzAQEAtgIAIbQBAQDGAgAhtQEIANgCACG2AQEAtgIAIbgBAADZArgBIrkBAQDGAgAhugEBAMYCACG7AQEAxgIAIbwBAQDGAgAhvQEIANoCACG-AQAA2wIAIL8BAQDGAgAhwAEBAMYCACHBAQEAxgIAIcIBAADbAgAgwwFAALcCACHEAUAAtwIAIQMAAAATACABAAAUADACAAAVACABAAAADwAgAQAAABMAIA4DAADSAgAgBwAA0QIAIKsBAADUAgAwrAEAABkAEK0BAADUAgAwrgEBALYCACGyAQEAtgIAIbMBAQC2AgAhwwFAALcCACHEAUAAtwIAIdYBAgDVAgAh1wEBAMYCACHYASAAwgIAIdkBQADFAgAhBAMAAOEEACAHAADgBAAg1wEAAOYCACDZAQAA5gIAIA8DAADSAgAgBwAA0QIAIKsBAADUAgAwrAEAABkAEK0BAADUAgAwrgEBAAAAAbIBAQC2AgAhswEBALYCACHDAUAAtwIAIcQBQAC3AgAh1gECANUCACHXAQEAxgIAIdgBIADCAgAh2QFAAMUCACGIAgAA0wIAIAMAAAAZACABAAAaADACAAAbACAPAwAA0gIAIAcAANECACANAADSAgAgqwEAAM8CADCsAQAAHQAQrQEAAM8CADCuAQEAtgIAIbIBAQC2AgAhswEBALYCACG4AQAA0ALcASLDAUAAtwIAIcQBQAC3AgAh2AEgAMICACHZAUAAxQIAIdoBAQC2AgAhBAMAAOEEACAHAADgBAAgDQAA4QQAINkBAADmAgAgEAMAANICACAHAADRAgAgDQAA0gIAIKsBAADPAgAwrAEAAB0AEK0BAADPAgAwrgEBAAAAAbIBAQC2AgAhswEBALYCACG4AQAA0ALcASLDAUAAtwIAIcQBQAC3AgAh2AEgAMICACHZAUAAxQIAIdoBAQC2AgAhiAIAAM4CACADAAAAHQAgAQAAHgAwAgAAHwAgAwAAABMAIAEAABQAMAIAABUAIAEAAAAPACABAAAAGQAgAQAAAB0AIAEAAAATACADAAAADwAgAQAAEAAwAgAAEQAgAwAAABkAIAEAABoAMAIAABsAIAMAAAAdACABAAAeADACAAAfACADAAAAHQAgAQAAHgAwAgAAHwAgAwAAABMAIAEAABQAMAIAABUAIAEAAAADACABAAAABwAgAQAAAAsAIAEAAAAPACABAAAAGQAgAQAAAB0AIAEAAAAdACABAAAAEwAgAQAAAAEAIBYEAADHAgAgBQAAyAIAIAkAAM0CACAOAADMAgAgDwAAyQIAIBAAAMoCACARAADLAgAgEgAAzAIAIKsBAADBAgAwrAEAADQAEK0BAADBAgAwrgEBALYCACG4AQAAxAKEAiLDAUAAtwIAIcQBQAC3AgAh2AEgAMICACHZAUAAxQIAIf4BAQC2AgAh_wEBALYCACGAAiAAwgIAIYICAADDAoICIoQCAQDGAgAhCgQAANkEACAFAADaBAAgCQAA3wQAIA4AAN4EACAPAADbBAAgEAAA3AQAIBEAAN0EACASAADeBAAg2QEAAOYCACCEAgAA5gIAIAMAAAA0ACABAAA1ADACAAABACADAAAANAAgAQAANQAwAgAAAQAgAwAAADQAIAEAADUAMAIAAAEAIBMEAADRBAAgBQAA0gQAIAkAANgEACAOAADWBAAgDwAA0wQAIBAAANQEACARAADVBAAgEgAA1wQAIK4BAQAAAAG4AQAAAIQCAsMBQAAAAAHEAUAAAAAB2AEgAAAAAdkBQAAAAAH-AQEAAAAB_wEBAAAAAYACIAAAAAGCAgAAAIICAoQCAQAAAAEBGAAAOQAgC64BAQAAAAG4AQAAAIQCAsMBQAAAAAHEAUAAAAAB2AEgAAAAAdkBQAAAAAH-AQEAAAAB_wEBAAAAAYACIAAAAAGCAgAAAIICAoQCAQAAAAEBGAAAOwAwARgAADsAMBMEAAD4AwAgBQAA-QMAIAkAAP8DACAOAAD9AwAgDwAA-gMAIBAAAPsDACARAAD8AwAgEgAA_gMAIK4BAQDsAgAhuAEAAPcDhAIiwwFAAPICACHEAUAA8gIAIdgBIAD_AgAh2QFAAIADACH-AQEA7AIAIf8BAQDsAgAhgAIgAP8CACGCAgAA9gOCAiKEAgEA8AIAIQIAAAABACAYAAA-ACALrgEBAOwCACG4AQAA9wOEAiLDAUAA8gIAIcQBQADyAgAh2AEgAP8CACHZAUAAgAMAIf4BAQDsAgAh_wEBAOwCACGAAiAA_wIAIYICAAD2A4ICIoQCAQDwAgAhAgAAADQAIBgAAEAAIAIAAAA0ACAYAABAACADAAAAAQAgHwAAOQAgIAAAPgAgAQAAAAEAIAEAAAA0ACAFCgAA8wMAICUAAPUDACAmAAD0AwAg2QEAAOYCACCEAgAA5gIAIA6rAQAAugIAMKwBAABHABCtAQAAugIAMK4BAQCAAgAhuAEAALwChAIiwwFAAIcCACHEAUAAhwIAIdgBIACbAgAh2QFAAJwCACH-AQEAgAIAIf8BAQCAAgAhgAIgAJsCACGCAgAAuwKCAiKEAgEAggIAIQMAAAA0ACABAABGADAkAABHACADAAAANAAgAQAANQAwAgAAAQAgAQAAAAUAIAEAAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACAJAwAA8gMAIK4BAQAAAAGyAQEAAAABwwFAAAAAAcQBQAAAAAHxAUAAAAAB-wEBAAAAAfwBAQAAAAH9AQEAAAABARgAAE8AIAiuAQEAAAABsgEBAAAAAcMBQAAAAAHEAUAAAAAB8QFAAAAAAfsBAQAAAAH8AQEAAAAB_QEBAAAAAQEYAABRADABGAAAUQAwCQMAAPEDACCuAQEA7AIAIbIBAQDsAgAhwwFAAPICACHEAUAA8gIAIfEBQADyAgAh-wEBAOwCACH8AQEA8AIAIf0BAQDwAgAhAgAAAAUAIBgAAFQAIAiuAQEA7AIAIbIBAQDsAgAhwwFAAPICACHEAUAA8gIAIfEBQADyAgAh-wEBAOwCACH8AQEA8AIAIf0BAQDwAgAhAgAAAAMAIBgAAFYAIAIAAAADACAYAABWACADAAAABQAgHwAATwAgIAAAVAAgAQAAAAUAIAEAAAADACAFCgAA7gMAICUAAPADACAmAADvAwAg_AEAAOYCACD9AQAA5gIAIAurAQAAuQIAMKwBAABdABCtAQAAuQIAMK4BAQCAAgAhsgEBAIACACHDAUAAhwIAIcQBQACHAgAh8QFAAIcCACH7AQEAgAIAIfwBAQCCAgAh_QEBAIICACEDAAAAAwAgAQAAXAAwJAAAXQAgAwAAAAMAIAEAAAQAMAIAAAUAIAEAAAAJACABAAAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIAMAAAAHACABAAAIADACAAAJACADAAAABwAgAQAACAAwAgAACQAgDgMAAO0DACCuAQEAAAABsgEBAAAAAcMBQAAAAAHEAUAAAAAB8gEBAAAAAfMBAQAAAAH0AQEAAAAB9QEBAAAAAfYBAQAAAAH3AUAAAAAB-AFAAAAAAfkBAQAAAAH6AQEAAAABARgAAGUAIA2uAQEAAAABsgEBAAAAAcMBQAAAAAHEAUAAAAAB8gEBAAAAAfMBAQAAAAH0AQEAAAAB9QEBAAAAAfYBAQAAAAH3AUAAAAAB-AFAAAAAAfkBAQAAAAH6AQEAAAABARgAAGcAMAEYAABnADAOAwAA7AMAIK4BAQDsAgAhsgEBAOwCACHDAUAA8gIAIcQBQADyAgAh8gEBAOwCACHzAQEA7AIAIfQBAQDwAgAh9QEBAPACACH2AQEA8AIAIfcBQACAAwAh-AFAAIADACH5AQEA8AIAIfoBAQDwAgAhAgAAAAkAIBgAAGoAIA2uAQEA7AIAIbIBAQDsAgAhwwFAAPICACHEAUAA8gIAIfIBAQDsAgAh8wEBAOwCACH0AQEA8AIAIfUBAQDwAgAh9gEBAPACACH3AUAAgAMAIfgBQACAAwAh-QEBAPACACH6AQEA8AIAIQIAAAAHACAYAABsACACAAAABwAgGAAAbAAgAwAAAAkAIB8AAGUAICAAAGoAIAEAAAAJACABAAAABwAgCgoAAOkDACAlAADrAwAgJgAA6gMAIPQBAADmAgAg9QEAAOYCACD2AQAA5gIAIPcBAADmAgAg-AEAAOYCACD5AQAA5gIAIPoBAADmAgAgEKsBAAC4AgAwrAEAAHMAEK0BAAC4AgAwrgEBAIACACGyAQEAgAIAIcMBQACHAgAhxAFAAIcCACHyAQEAgAIAIfMBAQCAAgAh9AEBAIICACH1AQEAggIAIfYBAQCCAgAh9wFAAJwCACH4AUAAnAIAIfkBAQCCAgAh-gEBAIICACEDAAAABwAgAQAAcgAwJAAAcwAgAwAAAAcAIAEAAAgAMAIAAAkAIAmrAQAAtQIAMKwBAAB5ABCtAQAAtQIAMK4BAQAAAAHDAUAAtwIAIcQBQAC3AgAh7wEBALYCACHwAQEAtgIAIfEBQAC3AgAhAQAAAHYAIAEAAAB2ACAJqwEAALUCADCsAQAAeQAQrQEAALUCADCuAQEAtgIAIcMBQAC3AgAhxAFAALcCACHvAQEAtgIAIfABAQC2AgAh8QFAALcCACEAAwAAAHkAIAEAAHoAMAIAAHYAIAMAAAB5ACABAAB6ADACAAB2ACADAAAAeQAgAQAAegAwAgAAdgAgBq4BAQAAAAHDAUAAAAABxAFAAAAAAe8BAQAAAAHwAQEAAAAB8QFAAAAAAQEYAAB-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_AgAh2QFAAIADACHeAQAAlQPeASLfAQgA8QIAIeABQADyAgAh4QFAAIADACHiAUAAgAMAIeMBQACAAwAhAgAAABEAIBgAAK8BACAOrgEBAOwCACGyAQEA7AIAIbMBAQDsAgAhuAEAAJQD3QEiwwFAAPICACHEAUAA8gIAIdgBIAD_AgAh2QFAAIADACHeAQAAlQPeASLfAQgA8QIAIeABQADyAgAh4QFAAIADACHiAUAAgAMAIeMBQACAAwAhAgAAAA8AIBgAALEBACACAAAADwAgGAAAsQEAIAMAAAARACAfAACqAQAgIAAArwEAIAEAAAARACABAAAADwAgCgoAAI8DACAlAACSAwAgJgAAkQMAIGcAAJADACBoAACTAwAg2QEAAOYCACDfAQAA5gIAIOEBAADmAgAg4gEAAOYCACDjAQAA5gIAIBGrAQAApgIAMKwBAAC4AQAQrQEAAKYCADCuAQEAgAIAIbIBAQCAAgAhswEBAIACACG4AQAApwLdASLDAUAAhwIAIcQBQACHAgAh2AEgAJsCACHZAUAAnAIAId4BAACoAt4BIt8BCACFAgAh4AFAAIcCACHhAUAAnAIAIeIBQACcAgAh4wFAAJwCACEDAAAADwAgAQAAtwEAMCQAALgBACADAAAADwAgAQAAEAAwAgAAEQAgAQAAAB8AIAEAAAAfACADAAAAHQAgAQAAHgAwAgAAHwAgAwAAAB0AIAEAAB4AMAIAAB8AIAMAAAAdACABAAAeADACAAAfACAMAwAAjQMAIAcAAIwDACANAACOAwAgrgEBAAAAAbIBAQAAAAGzAQEAAAABuAEAAADcAQLDAUAAAAABxAFAAAAAAdgBIAAAAAHZAUAAAAAB2gEBAAAAAQEYAADAAQAgCa4BAQAAAAGyAQEAAAABswEBAAAAAbgBAAAA3AECwwFAAAAAAcQBQAAAAAHYASAAAAAB2QFAAAAAAdoBAQAAAAEBGAAAwgEAMAEYAADCAQAwDAMAAIoDACAHAACJAwAgDQAAiwMAIK4BAQDsAgAhsgEBAOwCACGzAQEA7AIAIbgBAACIA9wBIsMBQADyAgAhxAFAAPICACHYASAA_wIAIdkBQACAAwAh2gEBAOwCACECAAAAHwAgGAAAxQEAIAmuAQEA7AIAIbIBAQDsAgAhswEBAOwCACG4AQAAiAPcASLDAUAA8gIAIcQBQADyAgAh2AEgAP8CACHZAUAAgAMAIdoBAQDsAgAhAgAAAB0AIBgAAMcBACACAAAAHQAgGAAAxwEAIAMAAAAfACAfAADAAQAgIAAAxQEAIAEAAAAfACABAAAAHQAgBAoAAIUDACAlAACHAwAgJgAAhgMAINkBAADmAgAgDKsBAACiAgAwrAEAAM4BABCtAQAAogIAMK4BAQCAAgAhsgEBAIACACGzAQEAgAIAIbgBAACjAtwBIsMBQACHAgAhxAFAAIcCACHYASAAmwIAIdkBQACcAgAh2gEBAIACACEDAAAAHQAgAQAAzQEAMCQAAM4BACADAAAAHQAgAQAAHgAwAgAAHwAgAQAAABsAIAEAAAAbACADAAAAGQAgAQAAGgAwAgAAGwAgAwAAABkAIAEAABoAMAIAABsAIAMAAAAZACABAAAaADACAAAbACALAwAAhAMAIAcAAIMDACCuAQEAAAABsgEBAAAAAbMBAQAAAAHDAUAAAAABxAFAAAAAAdYBAgAAAAHXAQEAAAAB2AEgAAAAAdkBQAAAAAEBGAAA1gEAIAmuAQEAAAABsgEBAAAAAbMBAQAAAAHDAUAAAAABxAFAAAAAAdYBAgAAAAHXAQEAAAAB2AEgAAAAAdkBQAAAAAEBGAAA2AEAMAEYAADYAQAwCwMAAIIDACAHAACBAwAgrgEBAOwCACGyAQEA7AIAIbMBAQDsAgAhwwFAAPICACHEAUAA8gIAIdYBAgD-AgAh1wEBAPACACHYASAA_wIAIdkBQACAAwAhAgAAABsAIBgAANsBACAJrgEBAOwCACGyAQEA7AIAIbMBAQDsAgAhwwFAAPICACHEAUAA8gIAIdYBAgD-AgAh1wEBAPACACHYASAA_wIAIdkBQACAAwAhAgAAABkAIBgAAN0BACACAAAAGQAgGAAA3QEAIAMAAAAbACAfAADWAQAgIAAA2wEAIAEAAAAbACABAAAAGQAgBwoAAPkCACAlAAD8AgAgJgAA-wIAIGcAAPoCACBoAAD9AgAg1wEAAOYCACDZAQAA5gIAIAyrAQAAmQIAMKwBAADkAQAQrQEAAJkCADCuAQEAgAIAIbIBAQCAAgAhswEBAIACACHDAUAAhwIAIcQBQACHAgAh1gECAJoCACHXAQEAggIAIdgBIACbAgAh2QFAAJwCACEDAAAAGQAgAQAA4wEAMCQAAOQBACADAAAAGQAgAQAAGgAwAgAAGwAgAQAAABUAIAEAAAAVACADAAAAEwAgAQAAFAAwAgAAFQAgAwAAABMAIAEAABQAMAIAABUAIAMAAAATACABAAAUADACAAAVACAYAwAA9gIAIAcAAPcCACAIAAD4AgAgrgEBAAAAAa8BAQAAAAGxAQAAALEBArIBAQAAAAGzAQEAAAABtAEBAAAAAbUBCAAAAAG2AQEAAAABuAEAAAC4AQK5AQEAAAABugEBAAAAAbsBAQAAAAG8AQEAAAABvQEIAAAAAb4BgAAAAAG_AQEAAAABwAEBAAAAAcEBAQAAAAHCAYAAAAABwwFAAAAAAcQBQAAAAAEBGAAA7AEAIBWuAQEAAAABrwEBAAAAAbEBAAAAsQECsgEBAAAAAbMBAQAAAAG0AQEAAAABtQEIAAAAAbYBAQAAAAG4AQAAALgBArkBAQAAAAG6AQEAAAABuwEBAAAAAbwBAQAAAAG9AQgAAAABvgGAAAAAAb8BAQAAAAHAAQEAAAABwQEBAAAAAcIBgAAAAAHDAUAAAAABxAFAAAAAAQEYAADuAQAwARgAAO4BADABAAAADwAgGAMAAPMCACAHAAD0AgAgCAAA9QIAIK4BAQDsAgAhrwEBAOwCACGxAQAA7QKxASKyAQEA7AIAIbMBAQDsAgAhtAEBAPACACG1AQgA7gIAIbYBAQDsAgAhuAEAAO8CuAEiuQEBAPACACG6AQEA8AIAIbsBAQDwAgAhvAEBAPACACG9AQgA8QIAIb4BgAAAAAG_AQEA8AIAIcABAQDwAgAhwQEBAPACACHCAYAAAAABwwFAAPICACHEAUAA8gIAIQIAAAAVACAYAADyAQAgFa4BAQDsAgAhrwEBAOwCACGxAQAA7QKxASKyAQEA7AIAIbMBAQDsAgAhtAEBAPACACG1AQgA7gIAIbYBAQDsAgAhuAEAAO8CuAEiuQEBAPACACG6AQEA8AIAIbsBAQDwAgAhvAEBAPACACG9AQgA8QIAIb4BgAAAAAG_AQEA8AIAIcABAQDwAgAhwQEBAPACACHCAYAAAAABwwFAAPICACHEAUAA8gIAIQIAAAATACAYAAD0AQAgAgAAABMAIBgAAPQBACABAAAADwAgAwAAABUAIB8AAOwBACAgAADyAQAgAQAAABUAIAEAAAATACAQCgAA5wIAICUAAOoCACAmAADpAgAgZwAA6AIAIGgAAOsCACC0AQAA5gIAILkBAADmAgAgugEAAOYCACC7AQAA5gIAILwBAADmAgAgvQEAAOYCACC-AQAA5gIAIL8BAADmAgAgwAEAAOYCACDBAQAA5gIAIMIBAADmAgAgGKsBAAD_AQAwrAEAAPwBABCtAQAA_wEAMK4BAQCAAgAhrwEBAIACACGxAQAAgQKxASKyAQEAgAIAIbMBAQCAAgAhtAEBAIICACG1AQgAgwIAIbYBAQCAAgAhuAEAAIQCuAEiuQEBAIICACG6AQEAggIAIbsBAQCCAgAhvAEBAIICACG9AQgAhQIAIb4BAACGAgAgvwEBAIICACHAAQEAggIAIcEBAQCCAgAhwgEAAIYCACDDAUAAhwIAIcQBQACHAgAhAwAAABMAIAEAAPsBADAkAAD8AQAgAwAAABMAIAEAABQAMAIAABUAIBirAQAA_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_wEBAIACACGAAiAAmwIAIYICAAC7AoICIoQCAQCCAgAhBwoAAIkCACAlAADAAgAgJgAAwAIAIMUBAAAAggICxgEAAACCAgjHAQAAAIICCMwBAAC_AoICIgcKAACJAgAgJQAAvgIAICYAAL4CACDFAQAAAIQCAsYBAAAAhAIIxwEAAACEAgjMAQAAvQKEAiIHCgAAiQIAICUAAL4CACAmAAC-AgAgxQEAAACEAgLGAQAAAIQCCMcBAAAAhAIIzAEAAL0ChAIiBMUBAAAAhAICxgEAAACEAgjHAQAAAIQCCMwBAAC-AoQCIgcKAACJAgAgJQAAwAIAICYAAMACACDFAQAAAIICAsYBAAAAggIIxwEAAACCAgjMAQAAvwKCAiIExQEAAACCAgLGAQAAAIICCMcBAAAAggIIzAEAAMACggIiFgQAAMcCACAFAADIAgAgCQAAzQIAIA4AAMwCACAPAADJAgAgEAAAygIAIBEAAMsCACASAADMAgAgqwEAAMECADCsAQAANAAQrQEAAMECADCuAQEAtgIAIbgBAADEAoQCIsMBQAC3AgAhxAFAALcCACHYASAAwgIAIdkBQADFAgAh_gEBALYCACH_AQEAtgIAIYACIADCAgAhggIAAMMCggIihAIBAMYCACECxQEgAAAAAcwBIACgAgAhBMUBAAAAggICxgEAAACCAgjHAQAAAIICCMwBAADAAoICIgTFAQAAAIQCAsYBAAAAhAIIxwEAAACEAgjMAQAAvgKEAiIIxQFAAAAAAcYBQAAAAAXHAUAAAAAFyAFAAAAAAckBQAAAAAHKAUAAAAABywFAAAAAAcwBQACeAgAhC8UBAQAAAAHGAQEAAAAFxwEBAAAABcgBAQAAAAHJAQEAAAABygEBAAAAAcsBAQAAAAHMAQEAlAIAIdMBAQAAAAHUAQEAAAAB1QEBAAAAAQOFAgAAAwAghgIAAAMAIIcCAAADACADhQIAAAcAIIYCAAAHACCHAgAABwAgA4UCAAALACCGAgAACwAghwIAAAsAIAOFAgAADwAghgIAAA8AIIcCAAAPACADhQIAABkAIIYCAAAZACCHAgAAGQAgA4UCAAAdACCGAgAAHQAghwIAAB0AIAOFAgAAEwAghgIAABMAIIcCAAATACACsgEBAAAAAbMBAQAAAAEPAwAA0gIAIAcAANECACANAADSAgAgqwEAAM8CADCsAQAAHQAQrQEAAM8CADCuAQEAtgIAIbIBAQC2AgAhswEBALYCACG4AQAA0ALcASLDAUAAtwIAIcQBQAC3AgAh2AEgAMICACHZAUAAxQIAIdoBAQC2AgAhBMUBAAAA3AECxgEAAADcAQjHAQAAANwBCMwBAAClAtwBIhgGAADSAgAgCQAAzQIAIAsAAMoCACAMAADLAgAgDgAAzAIAIKsBAADhAgAwrAEAAAsAEK0BAADhAgAwrgEBALYCACHDAUAAtwIAIcQBQAC3AgAh2AEgAMICACHZAUAAxQIAIeQBAQC2AgAh5QEBALYCACHmAUAAtwIAIecBAQDGAgAh6AEBAMYCACHqAQAA4gLqASLsAQAA4wLsASLtAQgA2AIAIe4BAQC2AgAhiQIAAAsAIIoCAAALACAYBAAAxwIAIAUAAMgCACAJAADNAgAgDgAAzAIAIA8AAMkCACAQAADKAgAgEQAAywIAIBIAAMwCACCrAQAAwQIAMKwBAAA0ABCtAQAAwQIAMK4BAQC2AgAhuAEAAMQChAIiwwFAALcCACHEAUAAtwIAIdgBIADCAgAh2QFAAMUCACH-AQEAtgIAIf8BAQC2AgAhgAIgAMICACGCAgAAwwKCAiKEAgEAxgIAIYkCAAA0ACCKAgAANAAgArIBAQAAAAGzAQEAAAABDgMAANICACAHAADRAgAgqwEAANQCADCsAQAAGQAQrQEAANQCADCuAQEAtgIAIbIBAQC2AgAhswEBALYCACHDAUAAtwIAIcQBQAC3AgAh1gECANUCACHXAQEAxgIAIdgBIADCAgAh2QFAAMUCACEIxQECAAAAAcYBAgAAAATHAQIAAAAEyAECAAAAAckBAgAAAAHKAQIAAAABywECAAAAAcwBAgCJAgAhGwMAANICACAHAADRAgAgCAAA3AIAIKsBAADWAgAwrAEAABMAEK0BAADWAgAwrgEBALYCACGvAQEAtgIAIbEBAADXArEBIrIBAQC2AgAhswEBALYCACG0AQEAxgIAIbUBCADYAgAhtgEBALYCACG4AQAA2QK4ASK5AQEAxgIAIboBAQDGAgAhuwEBAMYCACG8AQEAxgIAIb0BCADaAgAhvgEAANsCACC_AQEAxgIAIcABAQDGAgAhwQEBAMYCACHCAQAA2wIAIMMBQAC3AgAhxAFAALcCACEExQEAAACxAQLGAQAAALEBCMcBAAAAsQEIzAEAAJYCsQEiCMUBCAAAAAHGAQgAAAAExwEIAAAABMgBCAAAAAHJAQgAAAABygEIAAAAAcsBCAAAAAHMAQgAkgIAIQTFAQAAALgBAsYBAAAAuAEIxwEAAAC4AQjMAQAAkAK4ASIIxQEIAAAAAcYBCAAAAAXHAQgAAAAFyAEIAAAAAckBCAAAAAHKAQgAAAABywEIAAAAAcwBCACOAgAhDMUBgAAAAAHIAYAAAAAByQGAAAAAAcoBgAAAAAHLAYAAAAABzAGAAAAAAc0BAQAAAAHOAQEAAAABzwEBAAAAAdABgAAAAAHRAYAAAAAB0gGAAAAAARYDAADSAgAgBwAA0QIAIAkAAM0CACCrAQAA3gIAMKwBAAAPABCtAQAA3gIAMK4BAQC2AgAhsgEBALYCACGzAQEAtgIAIbgBAADfAt0BIsMBQAC3AgAhxAFAALcCACHYASAAwgIAIdkBQADFAgAh3gEAAOAC3gEi3wEIANoCACHgAUAAtwIAIeEBQADFAgAh4gFAAMUCACHjAUAAxQIAIYkCAAAPACCKAgAADwAgArIBAQAAAAGzAQEAAAABFAMAANICACAHAADRAgAgCQAAzQIAIKsBAADeAgAwrAEAAA8AEK0BAADeAgAwrgEBALYCACGyAQEAtgIAIbMBAQC2AgAhuAEAAN8C3QEiwwFAALcCACHEAUAAtwIAIdgBIADCAgAh2QFAAMUCACHeAQAA4ALeASLfAQgA2gIAIeABQAC3AgAh4QFAAMUCACHiAUAAxQIAIeMBQADFAgAhBMUBAAAA3QECxgEAAADdAQjHAQAAAN0BCMwBAACsAt0BIgTFAQAAAN4BAsYBAAAA3gEIxwEAAADeAQjMAQAAqgLeASIWBgAA0gIAIAkAAM0CACALAADKAgAgDAAAywIAIA4AAMwCACCrAQAA4QIAMKwBAAALABCtAQAA4QIAMK4BAQC2AgAhwwFAALcCACHEAUAAtwIAIdgBIADCAgAh2QFAAMUCACHkAQEAtgIAIeUBAQC2AgAh5gFAALcCACHnAQEAxgIAIegBAQDGAgAh6gEAAOIC6gEi7AEAAOMC7AEi7QEIANgCACHuAQEAtgIAIQTFAQAAAOoBAsYBAAAA6gEIxwEAAADqAQjMAQAAswLqASIExQEAAADsAQLGAQAAAOwBCMcBAAAA7AEIzAEAALEC7AEiEQMAANICACCrAQAA5AIAMKwBAAAHABCtAQAA5AIAMK4BAQC2AgAhsgEBALYCACHDAUAAtwIAIcQBQAC3AgAh8gEBALYCACHzAQEAtgIAIfQBAQDGAgAh9QEBAMYCACH2AQEAxgIAIfcBQADFAgAh-AFAAMUCACH5AQEAxgIAIfoBAQDGAgAhDAMAANICACCrAQAA5QIAMKwBAAADABCtAQAA5QIAMK4BAQC2AgAhsgEBALYCACHDAUAAtwIAIcQBQAC3AgAh8QFAALcCACH7AQEAtgIAIfwBAQDGAgAh_QEBAMYCACEAAAAAAAABjgIBAAAAAQGOAgAAALEBAgWOAggAAAABlAIIAAAAAZUCCAAAAAGWAggAAAABlwIIAAAAAQGOAgAAALgBAgGOAgEAAAABBY4CCAAAAAGUAggAAAABlQIIAAAAAZYCCAAAAAGXAggAAAABAY4CQAAAAAEFHwAApgUAICAAAK8FACCLAgAApwUAIIwCAACuBQAgkQIAAAEAIAUfAACkBQAgIAAArAUAIIsCAAClBQAgjAIAAKsFACCRAgAADQAgBx8AAKIFACAgAACpBQAgiwIAAKMFACCMAgAAqAUAII8CAAAPACCQAgAADwAgkQIAABEAIAMfAACmBQAgiwIAAKcFACCRAgAAAQAgAx8AAKQFACCLAgAApQUAIJECAAANACADHwAAogUAIIsCAACjBQAgkQIAABEAIAAAAAAABY4CAgAAAAGUAgIAAAABlQICAAAAAZYCAgAAAAGXAgIAAAABAY4CIAAAAAEBjgJAAAAAAQUfAACaBQAgIAAAoAUAIIsCAACbBQAgjAIAAJ8FACCRAgAADQAgBR8AAJgFACAgAACdBQAgiwIAAJkFACCMAgAAnAUAIJECAAABACADHwAAmgUAIIsCAACbBQAgkQIAAA0AIAMfAACYBQAgiwIAAJkFACCRAgAAAQAgAAAAAY4CAAAA3AECBR8AAI0FACAgAACWBQAgiwIAAI4FACCMAgAAlQUAIJECAAANACAFHwAAiwUAICAAAJMFACCLAgAAjAUAIIwCAACSBQAgkQIAAAEAIAUfAACJBQAgIAAAkAUAIIsCAACKBQAgjAIAAI8FACCRAgAAAQAgAx8AAI0FACCLAgAAjgUAIJECAAANACADHwAAiwUAIIsCAACMBQAgkQIAAAEAIAMfAACJBQAgiwIAAIoFACCRAgAAAQAgAAAAAAABjgIAAADdAQIBjgIAAADeAQIFHwAAgAUAICAAAIcFACCLAgAAgQUAIIwCAACGBQAgkQIAAA0AIAUfAAD-BAAgIAAAhAUAIIsCAAD_BAAgjAIAAIMFACCRAgAAAQAgCx8AAJkDADAgAACeAwAwiwIAAJoDADCMAgAAmwMAMI0CAACcAwAgjgIAAJ0DADCPAgAAnQMAMJACAACdAwAwkQIAAJ0DADCSAgAAnwMAMJMCAACgAwAwFgMAAPYCACAHAAD3AgAgrgEBAAAAAa8BAQAAAAGxAQAAALEBArIBAQAAAAGzAQEAAAABtQEIAAAAAbYBAQAAAAG4AQAAALgBArkBAQAAAAG6AQEAAAABuwEBAAAAAbwBAQAAAAG9AQgAAAABvgGAAAAAAb8BAQAAAAHAAQEAAAABwQEBAAAAAcIBgAAAAAHDAUAAAAABxAFAAAAAAQIAAAAVACAfAACkAwAgAwAAABUAIB8AAKQDACAgAACjAwAgARgAAIIFADAbAwAA0gIAIAcAANECACAIAADcAgAgqwEAANYCADCsAQAAEwAQrQEAANYCADCuAQEAAAABrwEBAAAAAbEBAADXArEBIrIBAQC2AgAhswEBALYCACG0AQEAxgIAIbUBCADYAgAhtgEBALYCACG4AQAA2QK4ASK5AQEAxgIAIboBAQDGAgAhuwEBAMYCACG8AQEAxgIAIb0BCADaAgAhvgEAANsCACC_AQEAxgIAIcABAQDGAgAhwQEBAMYCACHCAQAA2wIAIMMBQAC3AgAhxAFAALcCACECAAAAFQAgGAAAowMAIAIAAAChAwAgGAAAogMAIBirAQAAoAMAMKwBAAChAwAQrQEAAKADADCuAQEAtgIAIa8BAQC2AgAhsQEAANcCsQEisgEBALYCACGzAQEAtgIAIbQBAQDGAgAhtQEIANgCACG2AQEAtgIAIbgBAADZArgBIrkBAQDGAgAhugEBAMYCACG7AQEAxgIAIbwBAQDGAgAhvQEIANoCACG-AQAA2wIAIL8BAQDGAgAhwAEBAMYCACHBAQEAxgIAIcIBAADbAgAgwwFAALcCACHEAUAAtwIAIRirAQAAoAMAMKwBAAChAwAQrQEAAKADADCuAQEAtgIAIa8BAQC2AgAhsQEAANcCsQEisgEBALYCACGzAQEAtgIAIbQBAQDGAgAhtQEIANgCACG2AQEAtgIAIbgBAADZArgBIrkBAQDGAgAhugEBAMYCACG7AQEAxgIAIbwBAQDGAgAhvQEIANoCACG-AQAA2wIAIL8BAQDGAgAhwAEBAMYCACHBAQEAxgIAIcIBAADbAgAgwwFAALcCACHEAUAAtwIAIRSuAQEA7AIAIa8BAQDsAgAhsQEAAO0CsQEisgEBAOwCACGzAQEA7AIAIbUBCADuAgAhtgEBAOwCACG4AQAA7wK4ASK5AQEA8AIAIboBAQDwAgAhuwEBAPACACG8AQEA8AIAIb0BCADxAgAhvgGAAAAAAb8BAQDwAgAhwAEBAPACACHBAQEA8AIAIcIBgAAAAAHDAUAA8gIAIcQBQADyAgAhFgMAAPMCACAHAAD0AgAgrgEBAOwCACGvAQEA7AIAIbEBAADtArEBIrIBAQDsAgAhswEBAOwCACG1AQgA7gIAIbYBAQDsAgAhuAEAAO8CuAEiuQEBAPACACG6AQEA8AIAIbsBAQDwAgAhvAEBAPACACG9AQgA8QIAIb4BgAAAAAG_AQEA8AIAIcABAQDwAgAhwQEBAPACACHCAYAAAAABwwFAAPICACHEAUAA8gIAIRYDAAD2AgAgBwAA9wIAIK4BAQAAAAGvAQEAAAABsQEAAACxAQKyAQEAAAABswEBAAAAAbUBCAAAAAG2AQEAAAABuAEAAAC4AQK5AQEAAAABugEBAAAAAbsBAQAAAAG8AQEAAAABvQEIAAAAAb4BgAAAAAG_AQEAAAABwAEBAAAAAcEBAQAAAAHCAYAAAAABwwFAAAAAAcQBQAAAAAEDHwAAgAUAIIsCAACBBQAgkQIAAA0AIAMfAAD-BAAgiwIAAP8EACCRAgAAAQAgBB8AAJkDADCLAgAAmgMAMI0CAACcAwAgkQIAAJ0DADAAAAAAAAGOAgAAAOoBAgGOAgAAAOwBAgUfAAD1BAAgIAAA_AQAIIsCAAD2BAAgjAIAAPsEACCRAgAAAQAgCx8AANUDADAgAADaAwAwiwIAANYDADCMAgAA1wMAMI0CAADYAwAgjgIAANkDADCPAgAA2QMAMJACAADZAwAwkQIAANkDADCSAgAA2wMAMJMCAADcAwAwCx8AAMkDADAgAADOAwAwiwIAAMoDADCMAgAAywMAMI0CAADMAwAgjgIAAM0DADCPAgAAzQMAMJACAADNAwAwkQIAAM0DADCSAgAAzwMAMJMCAADQAwAwCx8AAL0DADAgAADCAwAwiwIAAL4DADCMAgAAvwMAMI0CAADAAwAgjgIAAMEDADCPAgAAwQMAMJACAADBAwAwkQIAAMEDADCSAgAAwwMAMJMCAADEAwAwCx8AALQDADAgAAC4AwAwiwIAALUDADCMAgAAtgMAMI0CAAC3AwAgjgIAAJ0DADCPAgAAnQMAMJACAACdAwAwkQIAAJ0DADCSAgAAuQMAMJMCAACgAwAwFgMAAPYCACAIAAD4AgAgrgEBAAAAAa8BAQAAAAGxAQAAALEBArIBAQAAAAG0AQEAAAABtQEIAAAAAbYBAQAAAAG4AQAAALgBArkBAQAAAAG6AQEAAAABuwEBAAAAAbwBAQAAAAG9AQgAAAABvgGAAAAAAb8BAQAAAAHAAQEAAAABwQEBAAAAAcIBgAAAAAHDAUAAAAABxAFAAAAAAQIAAAAVACAfAAC8AwAgAwAAABUAIB8AALwDACAgAAC7AwAgARgAAPoEADACAAAAFQAgGAAAuwMAIAIAAAChAwAgGAAAugMAIBSuAQEA7AIAIa8BAQDsAgAhsQEAAO0CsQEisgEBAOwCACG0AQEA8AIAIbUBCADuAgAhtgEBAOwCACG4AQAA7wK4ASK5AQEA8AIAIboBAQDwAgAhuwEBAPACACG8AQEA8AIAIb0BCADxAgAhvgGAAAAAAb8BAQDwAgAhwAEBAPACACHBAQEA8AIAIcIBgAAAAAHDAUAA8gIAIcQBQADyAgAhFgMAAPMCACAIAAD1AgAgrgEBAOwCACGvAQEA7AIAIbEBAADtArEBIrIBAQDsAgAhtAEBAPACACG1AQgA7gIAIbYBAQDsAgAhuAEAAO8CuAEiuQEBAPACACG6AQEA8AIAIbsBAQDwAgAhvAEBAPACACG9AQgA8QIAIb4BgAAAAAG_AQEA8AIAIcABAQDwAgAhwQEBAPACACHCAYAAAAABwwFAAPICACHEAUAA8gIAIRYDAAD2AgAgCAAA-AIAIK4BAQAAAAGvAQEAAAABsQEAAACxAQKyAQEAAAABtAEBAAAAAbUBCAAAAAG2AQEAAAABuAEAAAC4AQK5AQEAAAABugEBAAAAAbsBAQAAAAG8AQEAAAABvQEIAAAAAb4BgAAAAAG_AQEAAAABwAEBAAAAAcEBAQAAAAHCAYAAAAABwwFAAAAAAcQBQAAAAAEKAwAAjQMAIA0AAI4DACCuAQEAAAABsgEBAAAAAbgBAAAA3AECwwFAAAAAAcQBQAAAAAHYASAAAAAB2QFAAAAAAdoBAQAAAAECAAAAHwAgHwAAyAMAIAMAAAAfACAfAADIAwAgIAAAxwMAIAEYAAD5BAAwEAMAANICACAHAADRAgAgDQAA0gIAIKsBAADPAgAwrAEAAB0AEK0BAADPAgAwrgEBAAAAAbIBAQC2AgAhswEBALYCACG4AQAA0ALcASLDAUAAtwIAIcQBQAC3AgAh2AEgAMICACHZAUAAxQIAIdoBAQC2AgAhiAIAAM4CACACAAAAHwAgGAAAxwMAIAIAAADFAwAgGAAAxgMAIAyrAQAAxAMAMKwBAADFAwAQrQEAAMQDADCuAQEAtgIAIbIBAQC2AgAhswEBALYCACG4AQAA0ALcASLDAUAAtwIAIcQBQAC3AgAh2AEgAMICACHZAUAAxQIAIdoBAQC2AgAhDKsBAADEAwAwrAEAAMUDABCtAQAAxAMAMK4BAQC2AgAhsgEBALYCACGzAQEAtgIAIbgBAADQAtwBIsMBQAC3AgAhxAFAALcCACHYASAAwgIAIdkBQADFAgAh2gEBALYCACEIrgEBAOwCACGyAQEA7AIAIbgBAACIA9wBIsMBQADyAgAhxAFAAPICACHYASAA_wIAIdkBQACAAwAh2gEBAOwCACEKAwAAigMAIA0AAIsDACCuAQEA7AIAIbIBAQDsAgAhuAEAAIgD3AEiwwFAAPICACHEAUAA8gIAIdgBIAD_AgAh2QFAAIADACHaAQEA7AIAIQoDAACNAwAgDQAAjgMAIK4BAQAAAAGyAQEAAAABuAEAAADcAQLDAUAAAAABxAFAAAAAAdgBIAAAAAHZAUAAAAAB2gEBAAAAAQkDAACEAwAgrgEBAAAAAbIBAQAAAAHDAUAAAAABxAFAAAAAAdYBAgAAAAHXAQEAAAAB2AEgAAAAAdkBQAAAAAECAAAAGwAgHwAA1AMAIAMAAAAbACAfAADUAwAgIAAA0wMAIAEYAAD4BAAwDwMAANICACAHAADRAgAgqwEAANQCADCsAQAAGQAQrQEAANQCADCuAQEAAAABsgEBALYCACGzAQEAtgIAIcMBQAC3AgAhxAFAALcCACHWAQIA1QIAIdcBAQDGAgAh2AEgAMICACHZAUAAxQIAIYgCAADTAgAgAgAAABsAIBgAANMDACACAAAA0QMAIBgAANIDACAMqwEAANADADCsAQAA0QMAEK0BAADQAwAwrgEBALYCACGyAQEAtgIAIbMBAQC2AgAhwwFAALcCACHEAUAAtwIAIdYBAgDVAgAh1wEBAMYCACHYASAAwgIAIdkBQADFAgAhDKsBAADQAwAwrAEAANEDABCtAQAA0AMAMK4BAQC2AgAhsgEBALYCACGzAQEAtgIAIcMBQAC3AgAhxAFAALcCACHWAQIA1QIAIdcBAQDGAgAh2AEgAMICACHZAUAAxQIAIQiuAQEA7AIAIbIBAQDsAgAhwwFAAPICACHEAUAA8gIAIdYBAgD-AgAh1wEBAPACACHYASAA_wIAIdkBQACAAwAhCQMAAIIDACCuAQEA7AIAIbIBAQDsAgAhwwFAAPICACHEAUAA8gIAIdYBAgD-AgAh1wEBAPACACHYASAA_wIAIdkBQACAAwAhCQMAAIQDACCuAQEAAAABsgEBAAAAAcMBQAAAAAHEAUAAAAAB1gECAAAAAdcBAQAAAAHYASAAAAAB2QFAAAAAAQ8DAACmAwAgCQAApwMAIK4BAQAAAAGyAQEAAAABuAEAAADdAQLDAUAAAAABxAFAAAAAAdgBIAAAAAHZAUAAAAAB3gEAAADeAQLfAQgAAAAB4AFAAAAAAeEBQAAAAAHiAUAAAAAB4wFAAAAAAQIAAAARACAfAADgAwAgAwAAABEAIB8AAOADACAgAADfAwAgARgAAPcEADAVAwAA0gIAIAcAANECACAJAADNAgAgqwEAAN4CADCsAQAADwAQrQEAAN4CADCuAQEAAAABsgEBALYCACGzAQEAtgIAIbgBAADfAt0BIsMBQAC3AgAhxAFAALcCACHYASAAwgIAIdkBQADFAgAh3gEAAOAC3gEi3wEIANoCACHgAUAAtwIAIeEBQADFAgAh4gFAAMUCACHjAUAAxQIAIYgCAADdAgAgAgAAABEAIBgAAN8DACACAAAA3QMAIBgAAN4DACARqwEAANwDADCsAQAA3QMAEK0BAADcAwAwrgEBALYCACGyAQEAtgIAIbMBAQC2AgAhuAEAAN8C3QEiwwFAALcCACHEAUAAtwIAIdgBIADCAgAh2QFAAMUCACHeAQAA4ALeASLfAQgA2gIAIeABQAC3AgAh4QFAAMUCACHiAUAAxQIAIeMBQADFAgAhEasBAADcAwAwrAEAAN0DABCtAQAA3AMAMK4BAQC2AgAhsgEBALYCACGzAQEAtgIAIbgBAADfAt0BIsMBQAC3AgAhxAFAALcCACHYASAAwgIAIdkBQADFAgAh3gEAAOAC3gEi3wEIANoCACHgAUAAtwIAIeEBQADFAgAh4gFAAMUCACHjAUAAxQIAIQ2uAQEA7AIAIbIBAQDsAgAhuAEAAJQD3QEiwwFAAPICACHEAUAA8gIAIdgBIAD_AgAh2QFAAIADACHeAQAAlQPeASLfAQgA8QIAIeABQADyAgAh4QFAAIADACHiAUAAgAMAIeMBQACAAwAhDwMAAJcDACAJAACYAwAgrgEBAOwCACGyAQEA7AIAIbgBAACUA90BIsMBQADyAgAhxAFAAPICACHYASAA_wIAIdkBQACAAwAh3gEAAJUD3gEi3wEIAPECACHgAUAA8gIAIeEBQACAAwAh4gFAAIADACHjAUAAgAMAIQ8DAACmAwAgCQAApwMAIK4BAQAAAAGyAQEAAAABuAEAAADdAQLDAUAAAAABxAFAAAAAAdgBIAAAAAHZAUAAAAAB3gEAAADeAQLfAQgAAAAB4AFAAAAAAeEBQAAAAAHiAUAAAAAB4wFAAAAAAQMfAAD1BAAgiwIAAPYEACCRAgAAAQAgBB8AANUDADCLAgAA1gMAMI0CAADYAwAgkQIAANkDADAEHwAAyQMAMIsCAADKAwAwjQIAAMwDACCRAgAAzQMAMAQfAAC9AwAwiwIAAL4DADCNAgAAwAMAIJECAADBAwAwBB8AALQDADCLAgAAtQMAMI0CAAC3AwAgkQIAAJ0DADAAAAAAAAAFHwAA8AQAICAAAPMEACCLAgAA8QQAIIwCAADyBAAgkQIAAAEAIAMfAADwBAAgiwIAAPEEACCRAgAAAQAgAAAABR8AAOsEACAgAADuBAAgiwIAAOwEACCMAgAA7QQAIJECAAABACADHwAA6wQAIIsCAADsBAAgkQIAAAEAIAAAAAGOAgAAAIICAgGOAgAAAIQCAgsfAADFBAAwIAAAygQAMIsCAADGBAAwjAIAAMcEADCNAgAAyAQAII4CAADJBAAwjwIAAMkEADCQAgAAyQQAMJECAADJBAAwkgIAAMsEADCTAgAAzAQAMAsfAAC5BAAwIAAAvgQAMIsCAAC6BAAwjAIAALsEADCNAgAAvAQAII4CAAC9BAAwjwIAAL0EADCQAgAAvQQAMJECAAC9BAAwkgIAAL8EADCTAgAAwAQAMAsfAACtBAAwIAAAsgQAMIsCAACuBAAwjAIAAK8EADCNAgAAsAQAII4CAACxBAAwjwIAALEEADCQAgAAsQQAMJECAACxBAAwkgIAALMEADCTAgAAtAQAMAsfAACkBAAwIAAAqAQAMIsCAAClBAAwjAIAAKYEADCNAgAApwQAII4CAADZAwAwjwIAANkDADCQAgAA2QMAMJECAADZAwAwkgIAAKkEADCTAgAA3AMAMAsfAACbBAAwIAAAnwQAMIsCAACcBAAwjAIAAJ0EADCNAgAAngQAII4CAADNAwAwjwIAAM0DADCQAgAAzQMAMJECAADNAwAwkgIAAKAEADCTAgAA0AMAMAsfAACSBAAwIAAAlgQAMIsCAACTBAAwjAIAAJQEADCNAgAAlQQAII4CAADBAwAwjwIAAMEDADCQAgAAwQMAMJECAADBAwAwkgIAAJcEADCTAgAAxAMAMAsfAACJBAAwIAAAjQQAMIsCAACKBAAwjAIAAIsEADCNAgAAjAQAII4CAADBAwAwjwIAAMEDADCQAgAAwQMAMJECAADBAwAwkgIAAI4EADCTAgAAxAMAMAsfAACABAAwIAAAhAQAMIsCAACBBAAwjAIAAIIEADCNAgAAgwQAII4CAACdAwAwjwIAAJ0DADCQAgAAnQMAMJECAACdAwAwkgIAAIUEADCTAgAAoAMAMBYHAAD3AgAgCAAA-AIAIK4BAQAAAAGvAQEAAAABsQEAAACxAQKzAQEAAAABtAEBAAAAAbUBCAAAAAG2AQEAAAABuAEAAAC4AQK5AQEAAAABugEBAAAAAbsBAQAAAAG8AQEAAAABvQEIAAAAAb4BgAAAAAG_AQEAAAABwAEBAAAAAcEBAQAAAAHCAYAAAAABwwFAAAAAAcQBQAAAAAECAAAAFQAgHwAAiAQAIAMAAAAVACAfAACIBAAgIAAAhwQAIAEYAADqBAAwAgAAABUAIBgAAIcEACACAAAAoQMAIBgAAIYEACAUrgEBAOwCACGvAQEA7AIAIbEBAADtArEBIrMBAQDsAgAhtAEBAPACACG1AQgA7gIAIbYBAQDsAgAhuAEAAO8CuAEiuQEBAPACACG6AQEA8AIAIbsBAQDwAgAhvAEBAPACACG9AQgA8QIAIb4BgAAAAAG_AQEA8AIAIcABAQDwAgAhwQEBAPACACHCAYAAAAABwwFAAPICACHEAUAA8gIAIRYHAAD0AgAgCAAA9QIAIK4BAQDsAgAhrwEBAOwCACGxAQAA7QKxASKzAQEA7AIAIbQBAQDwAgAhtQEIAO4CACG2AQEA7AIAIbgBAADvArgBIrkBAQDwAgAhugEBAPACACG7AQEA8AIAIbwBAQDwAgAhvQEIAPECACG-AYAAAAABvwEBAPACACHAAQEA8AIAIcEBAQDwAgAhwgGAAAAAAcMBQADyAgAhxAFAAPICACEWBwAA9wIAIAgAAPgCACCuAQEAAAABrwEBAAAAAbEBAAAAsQECswEBAAAAAbQBAQAAAAG1AQgAAAABtgEBAAAAAbgBAAAAuAECuQEBAAAAAboBAQAAAAG7AQEAAAABvAEBAAAAAb0BCAAAAAG-AYAAAAABvwEBAAAAAcABAQAAAAHBAQEAAAABwgGAAAAAAcMBQAAAAAHEAUAAAAABCgMAAI0DACAHAACMAwAgrgEBAAAAAbIBAQAAAAGzAQEAAAABuAEAAADcAQLDAUAAAAABxAFAAAAAAdgBIAAAAAHZAUAAAAABAgAAAB8AIB8AAJEEACADAAAAHwAgHwAAkQQAICAAAJAEACABGAAA6QQAMAIAAAAfACAYAACQBAAgAgAAAMUDACAYAACPBAAgCK4BAQDsAgAhsgEBAOwCACGzAQEA7AIAIbgBAACIA9wBIsMBQADyAgAhxAFAAPICACHYASAA_wIAIdkBQACAAwAhCgMAAIoDACAHAACJAwAgrgEBAOwCACGyAQEA7AIAIbMBAQDsAgAhuAEAAIgD3AEiwwFAAPICACHEAUAA8gIAIdgBIAD_AgAh2QFAAIADACEKAwAAjQMAIAcAAIwDACCuAQEAAAABsgEBAAAAAbMBAQAAAAG4AQAAANwBAsMBQAAAAAHEAUAAAAAB2AEgAAAAAdkBQAAAAAEKBwAAjAMAIA0AAI4DACCuAQEAAAABswEBAAAAAbgBAAAA3AECwwFAAAAAAcQBQAAAAAHYASAAAAAB2QFAAAAAAdoBAQAAAAECAAAAHwAgHwAAmgQAIAMAAAAfACAfAACaBAAgIAAAmQQAIAEYAADoBAAwAgAAAB8AIBgAAJkEACACAAAAxQMAIBgAAJgEACAIrgEBAOwCACGzAQEA7AIAIbgBAACIA9wBIsMBQADyAgAhxAFAAPICACHYASAA_wIAIdkBQACAAwAh2gEBAOwCACEKBwAAiQMAIA0AAIsDACCuAQEA7AIAIbMBAQDsAgAhuAEAAIgD3AEiwwFAAPICACHEAUAA8gIAIdgBIAD_AgAh2QFAAIADACHaAQEA7AIAIQoHAACMAwAgDQAAjgMAIK4BAQAAAAGzAQEAAAABuAEAAADcAQLDAUAAAAABxAFAAAAAAdgBIAAAAAHZAUAAAAAB2gEBAAAAAQkHAACDAwAgrgEBAAAAAbMBAQAAAAHDAUAAAAABxAFAAAAAAdYBAgAAAAHXAQEAAAAB2AEgAAAAAdkBQAAAAAECAAAAGwAgHwAAowQAIAMAAAAbACAfAACjBAAgIAAAogQAIAEYAADnBAAwAgAAABsAIBgAAKIEACACAAAA0QMAIBgAAKEEACAIrgEBAOwCACGzAQEA7AIAIcMBQADyAgAhxAFAAPICACHWAQIA_gIAIdcBAQDwAgAh2AEgAP8CACHZAUAAgAMAIQkHAACBAwAgrgEBAOwCACGzAQEA7AIAIcMBQADyAgAhxAFAAPICACHWAQIA_gIAIdcBAQDwAgAh2AEgAP8CACHZAUAAgAMAIQkHAACDAwAgrgEBAAAAAbMBAQAAAAHDAUAAAAABxAFAAAAAAdYBAgAAAAHXAQEAAAAB2AEgAAAAAdkBQAAAAAEPBwAApQMAIAkAAKcDACCuAQEAAAABswEBAAAAAbgBAAAA3QECwwFAAAAAAcQBQAAAAAHYASAAAAAB2QFAAAAAAd4BAAAA3gEC3wEIAAAAAeABQAAAAAHhAUAAAAAB4gFAAAAAAeMBQAAAAAECAAAAEQAgHwAArAQAIAMAAAARACAfAACsBAAgIAAAqwQAIAEYAADmBAAwAgAAABEAIBgAAKsEACACAAAA3QMAIBgAAKoEACANrgEBAOwCACGzAQEA7AIAIbgBAACUA90BIsMBQADyAgAhxAFAAPICACHYASAA_wIAIdkBQACAAwAh3gEAAJUD3gEi3wEIAPECACHgAUAA8gIAIeEBQACAAwAh4gFAAIADACHjAUAAgAMAIQ8HAACWAwAgCQAAmAMAIK4BAQDsAgAhswEBAOwCACG4AQAAlAPdASLDAUAA8gIAIcQBQADyAgAh2AEgAP8CACHZAUAAgAMAId4BAACVA94BIt8BCADxAgAh4AFAAPICACHhAUAAgAMAIeIBQACAAwAh4wFAAIADACEPBwAApQMAIAkAAKcDACCuAQEAAAABswEBAAAAAbgBAAAA3QECwwFAAAAAAcQBQAAAAAHYASAAAAAB2QFAAAAAAd4BAAAA3gEC3wEIAAAAAeABQAAAAAHhAUAAAAAB4gFAAAAAAeMBQAAAAAERCQAA5QMAIAsAAOIDACAMAADjAwAgDgAA5AMAIK4BAQAAAAHDAUAAAAABxAFAAAAAAdgBIAAAAAHZAUAAAAAB5AEBAAAAAeUBAQAAAAHmAUAAAAAB5wEBAAAAAegBAQAAAAHqAQAAAOoBAuwBAAAA7AEC7QEIAAAAAQIAAAANACAfAAC4BAAgAwAAAA0AIB8AALgEACAgAAC3BAAgARgAAOUEADAWBgAA0gIAIAkAAM0CACALAADKAgAgDAAAywIAIA4AAMwCACCrAQAA4QIAMKwBAAALABCtAQAA4QIAMK4BAQAAAAHDAUAAtwIAIcQBQAC3AgAh2AEgAMICACHZAUAAxQIAIeQBAQC2AgAh5QEBALYCACHmAUAAtwIAIecBAQDGAgAh6AEBAMYCACHqAQAA4gLqASLsAQAA4wLsASLtAQgA2AIAIe4BAQC2AgAhAgAAAA0AIBgAALcEACACAAAAtQQAIBgAALYEACARqwEAALQEADCsAQAAtQQAEK0BAAC0BAAwrgEBALYCACHDAUAAtwIAIcQBQAC3AgAh2AEgAMICACHZAUAAxQIAIeQBAQC2AgAh5QEBALYCACHmAUAAtwIAIecBAQDGAgAh6AEBAMYCACHqAQAA4gLqASLsAQAA4wLsASLtAQgA2AIAIe4BAQC2AgAhEasBAAC0BAAwrAEAALUEABCtAQAAtAQAMK4BAQC2AgAhwwFAALcCACHEAUAAtwIAIdgBIADCAgAh2QFAAMUCACHkAQEAtgIAIeUBAQC2AgAh5gFAALcCACHnAQEAxgIAIegBAQDGAgAh6gEAAOIC6gEi7AEAAOMC7AEi7QEIANgCACHuAQEAtgIAIQ2uAQEA7AIAIcMBQADyAgAhxAFAAPICACHYASAA_wIAIdkBQACAAwAh5AEBAOwCACHlAQEA7AIAIeYBQADyAgAh5wEBAPACACHoAQEA8AIAIeoBAACtA-oBIuwBAACuA-wBIu0BCADuAgAhEQkAALMDACALAACwAwAgDAAAsQMAIA4AALIDACCuAQEA7AIAIcMBQADyAgAhxAFAAPICACHYASAA_wIAIdkBQACAAwAh5AEBAOwCACHlAQEA7AIAIeYBQADyAgAh5wEBAPACACHoAQEA8AIAIeoBAACtA-oBIuwBAACuA-wBIu0BCADuAgAhEQkAAOUDACALAADiAwAgDAAA4wMAIA4AAOQDACCuAQEAAAABwwFAAAAAAcQBQAAAAAHYASAAAAAB2QFAAAAAAeQBAQAAAAHlAQEAAAAB5gFAAAAAAecBAQAAAAHoAQEAAAAB6gEAAADqAQLsAQAAAOwBAu0BCAAAAAEMrgEBAAAAAcMBQAAAAAHEAUAAAAAB8gEBAAAAAfMBAQAAAAH0AQEAAAAB9QEBAAAAAfYBAQAAAAH3AUAAAAAB-AFAAAAAAfkBAQAAAAH6AQEAAAABAgAAAAkAIB8AAMQEACADAAAACQAgHwAAxAQAICAAAMMEACABGAAA5AQAMBEDAADSAgAgqwEAAOQCADCsAQAABwAQrQEAAOQCADCuAQEAAAABsgEBALYCACHDAUAAtwIAIcQBQAC3AgAh8gEBALYCACHzAQEAtgIAIfQBAQDGAgAh9QEBAMYCACH2AQEAxgIAIfcBQADFAgAh-AFAAMUCACH5AQEAxgIAIfoBAQDGAgAhAgAAAAkAIBgAAMMEACACAAAAwQQAIBgAAMIEACAQqwEAAMAEADCsAQAAwQQAEK0BAADABAAwrgEBALYCACGyAQEAtgIAIcMBQAC3AgAhxAFAALcCACHyAQEAtgIAIfMBAQC2AgAh9AEBAMYCACH1AQEAxgIAIfYBAQDGAgAh9wFAAMUCACH4AUAAxQIAIfkBAQDGAgAh-gEBAMYCACEQqwEAAMAEADCsAQAAwQQAEK0BAADABAAwrgEBALYCACGyAQEAtgIAIcMBQAC3AgAhxAFAALcCACHyAQEAtgIAIfMBAQC2AgAh9AEBAMYCACH1AQEAxgIAIfYBAQDGAgAh9wFAAMUCACH4AUAAxQIAIfkBAQDGAgAh-gEBAMYCACEMrgEBAOwCACHDAUAA8gIAIcQBQADyAgAh8gEBAOwCACHzAQEA7AIAIfQBAQDwAgAh9QEBAPACACH2AQEA8AIAIfcBQACAAwAh-AFAAIADACH5AQEA8AIAIfoBAQDwAgAhDK4BAQDsAgAhwwFAAPICACHEAUAA8gIAIfIBAQDsAgAh8wEBAOwCACH0AQEA8AIAIfUBAQDwAgAh9gEBAPACACH3AUAAgAMAIfgBQACAAwAh-QEBAPACACH6AQEA8AIAIQyuAQEAAAABwwFAAAAAAcQBQAAAAAHyAQEAAAAB8wEBAAAAAfQBAQAAAAH1AQEAAAAB9gEBAAAAAfcBQAAAAAH4AUAAAAAB-QEBAAAAAfoBAQAAAAEHrgEBAAAAAcMBQAAAAAHEAUAAAAAB8QFAAAAAAfsBAQAAAAH8AQEAAAAB_QEBAAAAAQIAAAAFACAfAADQBAAgAwAAAAUAIB8AANAEACAgAADPBAAgARgAAOMEADAMAwAA0gIAIKsBAADlAgAwrAEAAAMAEK0BAADlAgAwrgEBAAAAAbIBAQC2AgAhwwFAALcCACHEAUAAtwIAIfEBQAC3AgAh-wEBAAAAAfwBAQDGAgAh_QEBAMYCACECAAAABQAgGAAAzwQAIAIAAADNBAAgGAAAzgQAIAurAQAAzAQAMKwBAADNBAAQrQEAAMwEADCuAQEAtgIAIbIBAQC2AgAhwwFAALcCACHEAUAAtwIAIfEBQAC3AgAh-wEBALYCACH8AQEAxgIAIf0BAQDGAgAhC6sBAADMBAAwrAEAAM0EABCtAQAAzAQAMK4BAQC2AgAhsgEBALYCACHDAUAAtwIAIcQBQAC3AgAh8QFAALcCACH7AQEAtgIAIfwBAQDGAgAh_QEBAMYCACEHrgEBAOwCACHDAUAA8gIAIcQBQADyAgAh8QFAAPICACH7AQEA7AIAIfwBAQDwAgAh_QEBAPACACEHrgEBAOwCACHDAUAA8gIAIcQBQADyAgAh8QFAAPICACH7AQEA7AIAIfwBAQDwAgAh_QEBAPACACEHrgEBAAAAAcMBQAAAAAHEAUAAAAAB8QFAAAAAAfsBAQAAAAH8AQEAAAAB_QEBAAAAAQQfAADFBAAwiwIAAMYEADCNAgAAyAQAIJECAADJBAAwBB8AALkEADCLAgAAugQAMI0CAAC8BAAgkQIAAL0EADAEHwAArQQAMIsCAACuBAAwjQIAALAEACCRAgAAsQQAMAQfAACkBAAwiwIAAKUEADCNAgAApwQAIJECAADZAwAwBB8AAJsEADCLAgAAnAQAMI0CAACeBAAgkQIAAM0DADAEHwAAkgQAMIsCAACTBAAwjQIAAJUEACCRAgAAwQMAMAQfAACJBAAwiwIAAIoEADCNAgAAjAQAIJECAADBAwAwBB8AAIAEADCLAgAAgQQAMI0CAACDBAAgkQIAAJ0DADAAAAAAAAAACAYAAOEEACAJAADfBAAgCwAA3AQAIAwAAN0EACAOAADeBAAg2QEAAOYCACDnAQAA5gIAIOgBAADmAgAgCgQAANkEACAFAADaBAAgCQAA3wQAIA4AAN4EACAPAADbBAAgEAAA3AQAIBEAAN0EACASAADeBAAg2QEAAOYCACCEAgAA5gIAIAgDAADhBAAgBwAA4AQAIAkAAN8EACDZAQAA5gIAIN8BAADmAgAg4QEAAOYCACDiAQAA5gIAIOMBAADmAgAgB64BAQAAAAHDAUAAAAABxAFAAAAAAfEBQAAAAAH7AQEAAAAB_AEBAAAAAf0BAQAAAAEMrgEBAAAAAcMBQAAAAAHEAUAAAAAB8gEBAAAAAfMBAQAAAAH0AQEAAAAB9QEBAAAAAfYBAQAAAAH3AUAAAAAB-AFAAAAAAfkBAQAAAAH6AQEAAAABDa4BAQAAAAHDAUAAAAABxAFAAAAAAdgBIAAAAAHZAUAAAAAB5AEBAAAAAeUBAQAAAAHmAUAAAAAB5wEBAAAAAegBAQAAAAHqAQAAAOoBAuwBAAAA7AEC7QEIAAAAAQ2uAQEAAAABswEBAAAAAbgBAAAA3QECwwFAAAAAAcQBQAAAAAHYASAAAAAB2QFAAAAAAd4BAAAA3gEC3wEIAAAAAeABQAAAAAHhAUAAAAAB4gFAAAAAAeMBQAAAAAEIrgEBAAAAAbMBAQAAAAHDAUAAAAABxAFAAAAAAdYBAgAAAAHXAQEAAAAB2AEgAAAAAdkBQAAAAAEIrgEBAAAAAbMBAQAAAAG4AQAAANwBAsMBQAAAAAHEAUAAAAAB2AEgAAAAAdkBQAAAAAHaAQEAAAABCK4BAQAAAAGyAQEAAAABswEBAAAAAbgBAAAA3AECwwFAAAAAAcQBQAAAAAHYASAAAAAB2QFAAAAAARSuAQEAAAABrwEBAAAAAbEBAAAAsQECswEBAAAAAbQBAQAAAAG1AQgAAAABtgEBAAAAAbgBAAAAuAECuQEBAAAAAboBAQAAAAG7AQEAAAABvAEBAAAAAb0BCAAAAAG-AYAAAAABvwEBAAAAAcABAQAAAAHBAQEAAAABwgGAAAAAAcMBQAAAAAHEAUAAAAABEgUAANIEACAJAADYBAAgDgAA1gQAIA8AANMEACAQAADUBAAgEQAA1QQAIBIAANcEACCuAQEAAAABuAEAAACEAgLDAUAAAAABxAFAAAAAAdgBIAAAAAHZAUAAAAAB_gEBAAAAAf8BAQAAAAGAAiAAAAABggIAAACCAgKEAgEAAAABAgAAAAEAIB8AAOsEACADAAAANAAgHwAA6wQAICAAAO8EACAUAAAANAAgBQAA-QMAIAkAAP8DACAOAAD9AwAgDwAA-gMAIBAAAPsDACARAAD8AwAgEgAA_gMAIBgAAO8EACCuAQEA7AIAIbgBAAD3A4QCIsMBQADyAgAhxAFAAPICACHYASAA_wIAIdkBQACAAwAh_gEBAOwCACH_AQEA7AIAIYACIAD_AgAhggIAAPYDggIihAIBAPACACESBQAA-QMAIAkAAP8DACAOAAD9AwAgDwAA-gMAIBAAAPsDACARAAD8AwAgEgAA_gMAIK4BAQDsAgAhuAEAAPcDhAIiwwFAAPICACHEAUAA8gIAIdgBIAD_AgAh2QFAAIADACH-AQEA7AIAIf8BAQDsAgAhgAIgAP8CACGCAgAA9gOCAiKEAgEA8AIAIRIEAADRBAAgCQAA2AQAIA4AANYEACAPAADTBAAgEAAA1AQAIBEAANUEACASAADXBAAgrgEBAAAAAbgBAAAAhAICwwFAAAAAAcQBQAAAAAHYASAAAAAB2QFAAAAAAf4BAQAAAAH_AQEAAAABgAIgAAAAAYICAAAAggIChAIBAAAAAQIAAAABACAfAADwBAAgAwAAADQAIB8AAPAEACAgAAD0BAAgFAAAADQAIAQAAPgDACAJAAD_AwAgDgAA_QMAIA8AAPoDACAQAAD7AwAgEQAA_AMAIBIAAP4DACAYAAD0BAAgrgEBAOwCACG4AQAA9wOEAiLDAUAA8gIAIcQBQADyAgAh2AEgAP8CACHZAUAAgAMAIf4BAQDsAgAh_wEBAOwCACGAAiAA_wIAIYICAAD2A4ICIoQCAQDwAgAhEgQAAPgDACAJAAD_AwAgDgAA_QMAIA8AAPoDACAQAAD7AwAgEQAA_AMAIBIAAP4DACCuAQEA7AIAIbgBAAD3A4QCIsMBQADyAgAhxAFAAPICACHYASAA_wIAIdkBQACAAwAh_gEBAOwCACH_AQEA7AIAIYACIAD_AgAhggIAAPYDggIihAIBAPACACESBAAA0QQAIAUAANIEACAJAADYBAAgDgAA1gQAIBAAANQEACARAADVBAAgEgAA1wQAIK4BAQAAAAG4AQAAAIQCAsMBQAAAAAHEAUAAAAAB2AEgAAAAAdkBQAAAAAH-AQEAAAAB_wEBAAAAAYACIAAAAAGCAgAAAIICAoQCAQAAAAECAAAAAQAgHwAA9QQAIA2uAQEAAAABsgEBAAAAAbgBAAAA3QECwwFAAAAAAcQBQAAAAAHYASAAAAAB2QFAAAAAAd4BAAAA3gEC3wEIAAAAAeABQAAAAAHhAUAAAAAB4gFAAAAAAeMBQAAAAAEIrgEBAAAAAbIBAQAAAAHDAUAAAAABxAFAAAAAAdYBAgAAAAHXAQEAAAAB2AEgAAAAAdkBQAAAAAEIrgEBAAAAAbIBAQAAAAG4AQAAANwBAsMBQAAAAAHEAUAAAAAB2AEgAAAAAdkBQAAAAAHaAQEAAAABFK4BAQAAAAGvAQEAAAABsQEAAACxAQKyAQEAAAABtAEBAAAAAbUBCAAAAAG2AQEAAAABuAEAAAC4AQK5AQEAAAABugEBAAAAAbsBAQAAAAG8AQEAAAABvQEIAAAAAb4BgAAAAAG_AQEAAAABwAEBAAAAAcEBAQAAAAHCAYAAAAABwwFAAAAAAcQBQAAAAAEDAAAANAAgHwAA9QQAICAAAP0EACAUAAAANAAgBAAA-AMAIAUAAPkDACAJAAD_AwAgDgAA_QMAIBAAAPsDACARAAD8AwAgEgAA_gMAIBgAAP0EACCuAQEA7AIAIbgBAAD3A4QCIsMBQADyAgAhxAFAAPICACHYASAA_wIAIdkBQACAAwAh_gEBAOwCACH_AQEA7AIAIYACIAD_AgAhggIAAPYDggIihAIBAPACACESBAAA-AMAIAUAAPkDACAJAAD_AwAgDgAA_QMAIBAAAPsDACARAAD8AwAgEgAA_gMAIK4BAQDsAgAhuAEAAPcDhAIiwwFAAPICACHEAUAA8gIAIdgBIAD_AgAh2QFAAIADACH-AQEA7AIAIf8BAQDsAgAhgAIgAP8CACGCAgAA9gOCAiKEAgEA8AIAIRIEAADRBAAgBQAA0gQAIAkAANgEACAOAADWBAAgDwAA0wQAIBEAANUEACASAADXBAAgrgEBAAAAAbgBAAAAhAICwwFAAAAAAcQBQAAAAAHYASAAAAAB2QFAAAAAAf4BAQAAAAH_AQEAAAABgAIgAAAAAYICAAAAggIChAIBAAAAAQIAAAABACAfAAD-BAAgEgYAAOEDACAJAADlAwAgDAAA4wMAIA4AAOQDACCuAQEAAAABwwFAAAAAAcQBQAAAAAHYASAAAAAB2QFAAAAAAeQBAQAAAAHlAQEAAAAB5gFAAAAAAecBAQAAAAHoAQEAAAAB6gEAAADqAQLsAQAAAOwBAu0BCAAAAAHuAQEAAAABAgAAAA0AIB8AAIAFACAUrgEBAAAAAa8BAQAAAAGxAQAAALEBArIBAQAAAAGzAQEAAAABtQEIAAAAAbYBAQAAAAG4AQAAALgBArkBAQAAAAG6AQEAAAABuwEBAAAAAbwBAQAAAAG9AQgAAAABvgGAAAAAAb8BAQAAAAHAAQEAAAABwQEBAAAAAcIBgAAAAAHDAUAAAAABxAFAAAAAAQMAAAA0ACAfAAD-BAAgIAAAhQUAIBQAAAA0ACAEAAD4AwAgBQAA-QMAIAkAAP8DACAOAAD9AwAgDwAA-gMAIBEAAPwDACASAAD-AwAgGAAAhQUAIK4BAQDsAgAhuAEAAPcDhAIiwwFAAPICACHEAUAA8gIAIdgBIAD_AgAh2QFAAIADACH-AQEA7AIAIf8BAQDsAgAhgAIgAP8CACGCAgAA9gOCAiKEAgEA8AIAIRIEAAD4AwAgBQAA-QMAIAkAAP8DACAOAAD9AwAgDwAA-gMAIBEAAPwDACASAAD-AwAgrgEBAOwCACG4AQAA9wOEAiLDAUAA8gIAIcQBQADyAgAh2AEgAP8CACHZAUAAgAMAIf4BAQDsAgAh_wEBAOwCACGAAiAA_wIAIYICAAD2A4ICIoQCAQDwAgAhAwAAAAsAIB8AAIAFACAgAACIBQAgFAAAAAsAIAYAAK8DACAJAACzAwAgDAAAsQMAIA4AALIDACAYAACIBQAgrgEBAOwCACHDAUAA8gIAIcQBQADyAgAh2AEgAP8CACHZAUAAgAMAIeQBAQDsAgAh5QEBAOwCACHmAUAA8gIAIecBAQDwAgAh6AEBAPACACHqAQAArQPqASLsAQAArgPsASLtAQgA7gIAIe4BAQDsAgAhEgYAAK8DACAJAACzAwAgDAAAsQMAIA4AALIDACCuAQEA7AIAIcMBQADyAgAhxAFAAPICACHYASAA_wIAIdkBQACAAwAh5AEBAOwCACHlAQEA7AIAIeYBQADyAgAh5wEBAPACACHoAQEA8AIAIeoBAACtA-oBIuwBAACuA-wBIu0BCADuAgAh7gEBAOwCACESBAAA0QQAIAUAANIEACAJAADYBAAgDgAA1gQAIA8AANMEACAQAADUBAAgEQAA1QQAIK4BAQAAAAG4AQAAAIQCAsMBQAAAAAHEAUAAAAAB2AEgAAAAAdkBQAAAAAH-AQEAAAAB_wEBAAAAAYACIAAAAAGCAgAAAIICAoQCAQAAAAECAAAAAQAgHwAAiQUAIBIEAADRBAAgBQAA0gQAIAkAANgEACAPAADTBAAgEAAA1AQAIBEAANUEACASAADXBAAgrgEBAAAAAbgBAAAAhAICwwFAAAAAAcQBQAAAAAHYASAAAAAB2QFAAAAAAf4BAQAAAAH_AQEAAAABgAIgAAAAAYICAAAAggIChAIBAAAAAQIAAAABACAfAACLBQAgEgYAAOEDACAJAADlAwAgCwAA4gMAIAwAAOMDACCuAQEAAAABwwFAAAAAAcQBQAAAAAHYASAAAAAB2QFAAAAAAeQBAQAAAAHlAQEAAAAB5gFAAAAAAecBAQAAAAHoAQEAAAAB6gEAAADqAQLsAQAAAOwBAu0BCAAAAAHuAQEAAAABAgAAAA0AIB8AAI0FACADAAAANAAgHwAAiQUAICAAAJEFACAUAAAANAAgBAAA-AMAIAUAAPkDACAJAAD_AwAgDgAA_QMAIA8AAPoDACAQAAD7AwAgEQAA_AMAIBgAAJEFACCuAQEA7AIAIbgBAAD3A4QCIsMBQADyAgAhxAFAAPICACHYASAA_wIAIdkBQACAAwAh_gEBAOwCACH_AQEA7AIAIYACIAD_AgAhggIAAPYDggIihAIBAPACACESBAAA-AMAIAUAAPkDACAJAAD_AwAgDgAA_QMAIA8AAPoDACAQAAD7AwAgEQAA_AMAIK4BAQDsAgAhuAEAAPcDhAIiwwFAAPICACHEAUAA8gIAIdgBIAD_AgAh2QFAAIADACH-AQEA7AIAIf8BAQDsAgAhgAIgAP8CACGCAgAA9gOCAiKEAgEA8AIAIQMAAAA0ACAfAACLBQAgIAAAlAUAIBQAAAA0ACAEAAD4AwAgBQAA-QMAIAkAAP8DACAPAAD6AwAgEAAA-wMAIBEAAPwDACASAAD-AwAgGAAAlAUAIK4BAQDsAgAhuAEAAPcDhAIiwwFAAPICACHEAUAA8gIAIdgBIAD_AgAh2QFAAIADACH-AQEA7AIAIf8BAQDsAgAhgAIgAP8CACGCAgAA9gOCAiKEAgEA8AIAIRIEAAD4AwAgBQAA-QMAIAkAAP8DACAPAAD6AwAgEAAA-wMAIBEAAPwDACASAAD-AwAgrgEBAOwCACG4AQAA9wOEAiLDAUAA8gIAIcQBQADyAgAh2AEgAP8CACHZAUAAgAMAIf4BAQDsAgAh_wEBAOwCACGAAiAA_wIAIYICAAD2A4ICIoQCAQDwAgAhAwAAAAsAIB8AAI0FACAgAACXBQAgFAAAAAsAIAYAAK8DACAJAACzAwAgCwAAsAMAIAwAALEDACAYAACXBQAgrgEBAOwCACHDAUAA8gIAIcQBQADyAgAh2AEgAP8CACHZAUAAgAMAIeQBAQDsAgAh5QEBAOwCACHmAUAA8gIAIecBAQDwAgAh6AEBAPACACHqAQAArQPqASLsAQAArgPsASLtAQgA7gIAIe4BAQDsAgAhEgYAAK8DACAJAACzAwAgCwAAsAMAIAwAALEDACCuAQEA7AIAIcMBQADyAgAhxAFAAPICACHYASAA_wIAIdkBQACAAwAh5AEBAOwCACHlAQEA7AIAIeYBQADyAgAh5wEBAPACACHoAQEA8AIAIeoBAACtA-oBIuwBAACuA-wBIu0BCADuAgAh7gEBAOwCACESBAAA0QQAIAUAANIEACAJAADYBAAgDgAA1gQAIA8AANMEACAQAADUBAAgEgAA1wQAIK4BAQAAAAG4AQAAAIQCAsMBQAAAAAHEAUAAAAAB2AEgAAAAAdkBQAAAAAH-AQEAAAAB_wEBAAAAAYACIAAAAAGCAgAAAIICAoQCAQAAAAECAAAAAQAgHwAAmAUAIBIGAADhAwAgCQAA5QMAIAsAAOIDACAOAADkAwAgrgEBAAAAAcMBQAAAAAHEAUAAAAAB2AEgAAAAAdkBQAAAAAHkAQEAAAAB5QEBAAAAAeYBQAAAAAHnAQEAAAAB6AEBAAAAAeoBAAAA6gEC7AEAAADsAQLtAQgAAAAB7gEBAAAAAQIAAAANACAfAACaBQAgAwAAADQAIB8AAJgFACAgAACeBQAgFAAAADQAIAQAAPgDACAFAAD5AwAgCQAA_wMAIA4AAP0DACAPAAD6AwAgEAAA-wMAIBIAAP4DACAYAACeBQAgrgEBAOwCACG4AQAA9wOEAiLDAUAA8gIAIcQBQADyAgAh2AEgAP8CACHZAUAAgAMAIf4BAQDsAgAh_wEBAOwCACGAAiAA_wIAIYICAAD2A4ICIoQCAQDwAgAhEgQAAPgDACAFAAD5AwAgCQAA_wMAIA4AAP0DACAPAAD6AwAgEAAA-wMAIBIAAP4DACCuAQEA7AIAIbgBAAD3A4QCIsMBQADyAgAhxAFAAPICACHYASAA_wIAIdkBQACAAwAh_gEBAOwCACH_AQEA7AIAIYACIAD_AgAhggIAAPYDggIihAIBAPACACEDAAAACwAgHwAAmgUAICAAAKEFACAUAAAACwAgBgAArwMAIAkAALMDACALAACwAwAgDgAAsgMAIBgAAKEFACCuAQEA7AIAIcMBQADyAgAhxAFAAPICACHYASAA_wIAIdkBQACAAwAh5AEBAOwCACHlAQEA7AIAIeYBQADyAgAh5wEBAPACACHoAQEA8AIAIeoBAACtA-oBIuwBAACuA-wBIu0BCADuAgAh7gEBAOwCACESBgAArwMAIAkAALMDACALAACwAwAgDgAAsgMAIK4BAQDsAgAhwwFAAPICACHEAUAA8gIAIdgBIAD_AgAh2QFAAIADACHkAQEA7AIAIeUBAQDsAgAh5gFAAPICACHnAQEA8AIAIegBAQDwAgAh6gEAAK0D6gEi7AEAAK4D7AEi7QEIAO4CACHuAQEA7AIAIRADAACmAwAgBwAApQMAIK4BAQAAAAGyAQEAAAABswEBAAAAAbgBAAAA3QECwwFAAAAAAcQBQAAAAAHYASAAAAAB2QFAAAAAAd4BAAAA3gEC3wEIAAAAAeABQAAAAAHhAUAAAAAB4gFAAAAAAeMBQAAAAAECAAAAEQAgHwAAogUAIBIGAADhAwAgCwAA4gMAIAwAAOMDACAOAADkAwAgrgEBAAAAAcMBQAAAAAHEAUAAAAAB2AEgAAAAAdkBQAAAAAHkAQEAAAAB5QEBAAAAAeYBQAAAAAHnAQEAAAAB6AEBAAAAAeoBAAAA6gEC7AEAAADsAQLtAQgAAAAB7gEBAAAAAQIAAAANACAfAACkBQAgEgQAANEEACAFAADSBAAgDgAA1gQAIA8AANMEACAQAADUBAAgEQAA1QQAIBIAANcEACCuAQEAAAABuAEAAACEAgLDAUAAAAABxAFAAAAAAdgBIAAAAAHZAUAAAAAB_gEBAAAAAf8BAQAAAAGAAiAAAAABggIAAACCAgKEAgEAAAABAgAAAAEAIB8AAKYFACADAAAADwAgHwAAogUAICAAAKoFACASAAAADwAgAwAAlwMAIAcAAJYDACAYAACqBQAgrgEBAOwCACGyAQEA7AIAIbMBAQDsAgAhuAEAAJQD3QEiwwFAAPICACHEAUAA8gIAIdgBIAD_AgAh2QFAAIADACHeAQAAlQPeASLfAQgA8QIAIeABQADyAgAh4QFAAIADACHiAUAAgAMAIeMBQACAAwAhEAMAAJcDACAHAACWAwAgrgEBAOwCACGyAQEA7AIAIbMBAQDsAgAhuAEAAJQD3QEiwwFAAPICACHEAUAA8gIAIdgBIAD_AgAh2QFAAIADACHeAQAAlQPeASLfAQgA8QIAIeABQADyAgAh4QFAAIADACHiAUAAgAMAIeMBQACAAwAhAwAAAAsAIB8AAKQFACAgAACtBQAgFAAAAAsAIAYAAK8DACALAACwAwAgDAAAsQMAIA4AALIDACAYAACtBQAgrgEBAOwCACHDAUAA8gIAIcQBQADyAgAh2AEgAP8CACHZAUAAgAMAIeQBAQDsAgAh5QEBAOwCACHmAUAA8gIAIecBAQDwAgAh6AEBAPACACHqAQAArQPqASLsAQAArgPsASLtAQgA7gIAIe4BAQDsAgAhEgYAAK8DACALAACwAwAgDAAAsQMAIA4AALIDACCuAQEA7AIAIcMBQADyAgAhxAFAAPICACHYASAA_wIAIdkBQACAAwAh5AEBAOwCACHlAQEA7AIAIeYBQADyAgAh5wEBAPACACHoAQEA8AIAIeoBAACtA-oBIuwBAACuA-wBIu0BCADuAgAh7gEBAOwCACEDAAAANAAgHwAApgUAICAAALAFACAUAAAANAAgBAAA-AMAIAUAAPkDACAOAAD9AwAgDwAA-gMAIBAAAPsDACARAAD8AwAgEgAA_gMAIBgAALAFACCuAQEA7AIAIbgBAAD3A4QCIsMBQADyAgAhxAFAAPICACHYASAA_wIAIdkBQACAAwAh_gEBAOwCACH_AQEA7AIAIYACIAD_AgAhggIAAPYDggIihAIBAPACACESBAAA-AMAIAUAAPkDACAOAAD9AwAgDwAA-gMAIBAAAPsDACARAAD8AwAgEgAA_gMAIK4BAQDsAgAhuAEAAPcDhAIiwwFAAPICACHEAUAA8gIAIdgBIAD_AgAh2QFAAIADACH-AQEA7AIAIf8BAQDsAgAhgAIgAP8CACGCAgAA9gOCAiKEAgEA8AIAIQkEBgIFCgMJKgYKAAsOKAkPDgQQJgURJwgSKQkBAwABAQMAAQYGAAEJIQYKAAoLEgUMHAgOIAkEAwABBwAECRYGCgAHAwMAAQcABAgXBQEJGAACAwABBwAEAwMAAQcABA0AAQQJJQALIgAMIwAOJAAIBCsABSwACTIADjAADy0AEC4AES8AEjEAAAAAAwoAECUAESYAEgAAAAMKABAlABEmABIBAwABAQMAAQMKABclABgmABkAAAADCgAXJQAYJgAZAQMAAQEDAAEDCgAeJQAfJgAgAAAAAwoAHiUAHyYAIAAAAAMKACYlACcmACgAAAADCgAmJQAnJgAoAQYAAQEGAAEFCgAtJQAwJgAxZwAuaAAvAAAAAAAFCgAtJQAwJgAxZwAuaAAvAgMAAQcABAIDAAEHAAQFCgA2JQA5JgA6ZwA3aAA4AAAAAAAFCgA2JQA5JgA6ZwA3aAA4AwMAAQcABA0AAQMDAAEHAAQNAAEDCgA_JQBAJgBBAAAAAwoAPyUAQCYAQQIDAAEHAAQCAwABBwAEBQoARiUASSYASmcAR2gASAAAAAAABQoARiUASSYASmcAR2gASAMDAAEHAAQI8QEFAwMAAQcABAj3AQUFCgBPJQBSJgBTZwBQaABRAAAAAAAFCgBPJQBSJgBTZwBQaABREwIBFDMBFTYBFjcBFzgBGToBGjwMGz0NHD8BHUEMHkIOIUMBIkQBI0UMJ0gPKEkTKUoCKksCK0wCLE0CLU4CLlACL1IMMFMUMVUCMlcMM1gVNFkCNVoCNlsMN14WOF8aOWADOmEDO2IDPGMDPWQDPmYDP2gMQGkbQWsDQm0MQ24cRG8DRXADRnEMR3QdSHUhSXciSngiS3siTHwiTX0iTn8iT4EBDFCCASNRhAEiUoYBDFOHASRUiAEiVYkBIlaKAQxXjQElWI4BKVmPAQRakAEEW5EBBFySAQRdkwEEXpUBBF-XAQxgmAEqYZoBBGKcAQxjnQErZJ4BBGWfAQRmoAEMaaMBLGqkATJrpQEFbKYBBW2nAQVuqAEFb6kBBXCrAQVxrQEMcq4BM3OwAQV0sgEMdbMBNHa0AQV3tQEFeLYBDHm5ATV6ugE7e7sBCXy8AQl9vQEJfr4BCX-_AQmAAcEBCYEBwwEMggHEATyDAcYBCYQByAEMhQHJAT2GAcoBCYcBywEJiAHMAQyJAc8BPooB0AFCiwHRAQiMAdIBCI0B0wEIjgHUAQiPAdUBCJAB1wEIkQHZAQySAdoBQ5MB3AEIlAHeAQyVAd8BRJYB4AEIlwHhAQiYAeIBDJkB5QFFmgHmAUubAecBBpwB6AEGnQHpAQaeAeoBBp8B6wEGoAHtAQahAe8BDKIB8AFMowHzAQakAfUBDKUB9gFNpgH4AQanAfkBBqgB-gEMqQH9AU6qAf4BVA"
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
            sendEmail({
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
            sendEmail({
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
  redirectURLs: {
    signIn: `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success`
  },
  trustedOrigins: [envVars.BETTER_AUTH_URL, envVars.FRONTEND_URL],
  advanced: {
    useSecureCookies: false,
    cookies: {
      state: {
        attributes: {
          sameSite: "none",
          secure: true,
          httpOnly: true,
          path: "/"
        }
      },
      sessionToken: {
        attributes: {
          sameSite: "none",
          secure: true,
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
  if (result.status && !result.user.emailVerified) {
    await prisma.user.update({
      where: { email },
      data: { emailVerified: true }
    });
  }
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
  await authService.verifyEmail(email, otp);
  sendResponse(res, {
    httpStatusCode: status4.OK,
    success: true,
    message: "Email verified successfully"
  });
});
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
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  const isValidRedirectPath = redirectPath.startsWith("/") && !redirectPath.startsWith("//");
  const finalRedirectPath = isValidRedirectPath ? redirectPath : "/dashboard";
  res.redirect(`${envVars.FRONTEND_URL}${finalRedirectPath}`);
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
  forgetPassword: forgetPassword2,
  resetPassword: resetPassword2,
  googleLogin,
  googleLoginSuccess: googleLoginSuccess2,
  handleOAuthError
};

// src/app/middleware/checkAuth.ts
import status5 from "http-status";
var checkAuth = (...authRoles) => async (req, res, next) => {
  try {
    const sessionToken = CookieUtils.getCookie(req, "better-auth.session_token") || CookieUtils.getCookie(req, "better-auth.session-token");
    if (!sessionToken) {
      throw new Error("Unauthorized access! No session token provided.");
    }
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
        if (authRoles.length > 0 && !authRoles.includes(user.role)) {
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
      const accessToken2 = CookieUtils.getCookie(req, "accessToken");
      if (!accessToken2) {
        throw new AppError_default(
          status5.UNAUTHORIZED,
          "Unauthorized access! No access token provided."
        );
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
    if (authRoles.length > 0 && !authRoles.includes(verifiedToken.data.role)) {
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
  if (Object.keys(payload).length === 0) {
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
var UserController = {
  getMe: getMe4,
  updateMe: updateMe2,
  deleteMe: deleteMe2
};

// src/app/modules/user/user.validation.ts
import { z } from "zod";
var updateUserValidationSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  image: z.string().url().optional()
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
    req.body = parsedResult.data.body;
    return next();
  };
};

// src/app/modules/user/user.route.ts
var router2 = Router2();
router2.get("/me", checkAuth(Role.ADMIN, Role.USER), UserController.getMe);
router2.patch(
  "/me",
  checkAuth(Role.ADMIN, Role.USER),
  validateRequest(updateUserValidationSchema),
  UserController.updateMe
);
router2.delete("/me", checkAuth(Role.ADMIN, Role.USER), UserController.deleteMe);
var UserRoutes = router2;

// src/app/modules/event/event.route.ts
import { Router as Router3 } from "express";

// src/app/modules/event/event.controller.ts
import status9 from "http-status";

// src/app/modules/event/event.service.ts
import status8 from "http-status";

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
    throw new AppError_default(status8.BAD_REQUEST, "Invalid event date or time");
  }
  return dateTime;
};
var getFeeType = (registrationFee) => {
  return registrationFee && registrationFee > 0 ? FeeType.PAID : FeeType.FREE;
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
      eventDateTime,
      venue: payload.venue,
      eventLink: payload.eventLink,
      visibility: payload.visibility,
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
    throw new AppError_default(status8.NOT_FOUND, "Event not found");
  }
  return event;
};
var updateEvent = async (user, eventId, payload) => {
  const existingEvent = await prisma.event.findFirst({
    where: {
      id: eventId,
      isDeleted: false
    }
  });
  if (!existingEvent) {
    throw new AppError_default(status8.NOT_FOUND, "Event not found");
  }
  if (existingEvent.ownerId !== user.userId && user.role !== Role.ADMIN) {
    throw new AppError_default(
      status8.FORBIDDEN,
      "You are not allowed to update this event"
    );
  }
  const updateData = {
    title: payload.title,
    description: payload.description,
    venue: payload.venue,
    eventLink: payload.eventLink,
    visibility: payload.visibility
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
    throw new AppError_default(status8.NOT_FOUND, "Event not found");
  }
  if (existingEvent.ownerId !== user.userId && user.role !== Role.ADMIN) {
    throw new AppError_default(
      status8.FORBIDDEN,
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
  getUpcomingPublicEvents,
  getSingleEvent,
  updateEvent,
  deleteEvent
};

// src/app/modules/event/event.controller.ts
var createEvent2 = catchAsync_default(async (req, res) => {
  const result = await EventService.createEvent(
    req.user,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: status9.CREATED,
    success: true,
    message: "Event created successfully",
    data: result
  });
});
var getAllEvents2 = catchAsync_default(async (req, res) => {
  const result = await EventService.getAllEvents(req.query);
  sendResponse(res, {
    httpStatusCode: status9.OK,
    success: true,
    message: "Events retrieved successfully",
    data: result.data,
    meta: result.meta
  });
});
var getUpcomingPublicEvents2 = catchAsync_default(
  async (_req, res) => {
    const result = await EventService.getUpcomingPublicEvents();
    sendResponse(res, {
      httpStatusCode: status9.OK,
      success: true,
      message: "Upcoming public events retrieved successfully",
      data: result
    });
  }
);
var getSingleEvent2 = catchAsync_default(async (req, res) => {
  const result = await EventService.getSingleEvent(req.params.eventId);
  sendResponse(res, {
    httpStatusCode: status9.OK,
    success: true,
    message: "Event retrieved successfully",
    data: result
  });
});
var updateEvent2 = catchAsync_default(async (req, res) => {
  const result = await EventService.updateEvent(
    req.user,
    req.params.eventId,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: status9.OK,
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
    httpStatusCode: status9.OK,
    success: true,
    message: "Event deleted successfully",
    data: result
  });
});
var EventController = {
  createEvent: createEvent2,
  getAllEvents: getAllEvents2,
  getUpcomingPublicEvents: getUpcomingPublicEvents2,
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
    registrationFee: z2.coerce.number().min(0).optional()
  })
});

// src/app/modules/event/event.route.ts
var router3 = Router3();
router3.get("/", EventController.getAllEvents);
router3.get("/upcoming", EventController.getUpcomingPublicEvents);
router3.get("/:eventId", EventController.getSingleEvent);
router3.post(
  "/",
  checkAuth(Role.ADMIN, Role.USER),
  validateRequest(createEventValidationSchema),
  EventController.createEvent
);
router3.patch(
  "/:eventId",
  checkAuth(Role.ADMIN, Role.USER),
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
import status11 from "http-status";

// src/app/modules/participation/participation.service.ts
import status10 from "http-status";
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
    throw new AppError_default(status10.NOT_FOUND, "Event not found");
  }
  if (event.ownerId === user.userId) {
    throw new AppError_default(status10.BAD_REQUEST, "Event owner cannot join own event");
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
      status10.CONFLICT,
      "You already requested or joined this event"
    );
  }
  const participantData = {
    eventId,
    userId: user.userId
  };
  if (event.visibility === EventVisibility.PUBLIC && event.feeType === FeeType.FREE) {
    participantData.status = ParticipationStatus.JOINED;
    participantData.paymentStatus = PaymentStatus.PAID;
    participantData.paidAmount = 0;
  }
  if (event.visibility === EventVisibility.PUBLIC && event.feeType === FeeType.PAID) {
    participantData.status = ParticipationStatus.PENDING;
    participantData.paymentStatus = PaymentStatus.PENDING;
  }
  if (event.visibility === EventVisibility.PRIVATE && event.feeType === FeeType.FREE) {
    participantData.status = ParticipationStatus.PENDING;
    participantData.paymentStatus = PaymentStatus.PAID;
    participantData.paidAmount = 0;
  }
  if (event.visibility === EventVisibility.PRIVATE && event.feeType === FeeType.PAID) {
    participantData.status = ParticipationStatus.PENDING;
    participantData.paymentStatus = PaymentStatus.PENDING;
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
    throw new AppError_default(status10.NOT_FOUND, "Event not found");
  }
  if (event.ownerId !== user.userId && user.role !== Role.ADMIN) {
    throw new AppError_default(
      status10.FORBIDDEN,
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
    throw new AppError_default(status10.NOT_FOUND, "Participant not found");
  }
  if (participant.event.ownerId !== user.userId && user.role !== Role.ADMIN) {
    throw new AppError_default(
      status10.FORBIDDEN,
      "You are not allowed to approve this participant"
    );
  }
  if (participant.status !== ParticipationStatus.PENDING) {
    throw new AppError_default(
      status10.BAD_REQUEST,
      "Only pending requests can be approved"
    );
  }
  if (participant.event.feeType === FeeType.PAID && participant.paymentStatus !== PaymentStatus.PAID) {
    throw new AppError_default(
      status10.BAD_REQUEST,
      "Payment is required before approval"
    );
  }
  const updatedParticipant = await prisma.eventParticipant.update({
    where: {
      id: participantId
    },
    data: {
      status: ParticipationStatus.APPROVED,
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
    throw new AppError_default(status10.NOT_FOUND, "Participant not found");
  }
  if (participant.event.ownerId !== user.userId && user.role !== Role.ADMIN) {
    throw new AppError_default(
      status10.FORBIDDEN,
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
    throw new AppError_default(status10.NOT_FOUND, "Participant not found");
  }
  if (participant.event.ownerId !== user.userId && user.role !== Role.ADMIN) {
    throw new AppError_default(
      status10.FORBIDDEN,
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
    httpStatusCode: status11.CREATED,
    success: true,
    message: "Participation request created successfully",
    data: result
  });
});
var getMyParticipations2 = catchAsync_default(async (req, res) => {
  const result = await ParticipationService.getMyParticipations(
    req.user
  );
  sendResponse(res, {
    httpStatusCode: status11.OK,
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
    httpStatusCode: status11.OK,
    success: true,
    message: "Event participants retrieved successfully",
    data: result
  });
});
var approveParticipant2 = catchAsync_default(async (req, res) => {
  const result = await ParticipationService.approveParticipant(
    req.user,
    req.params.participantId
  );
  sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "Participant approved successfully",
    data: result
  });
});
var rejectParticipant2 = catchAsync_default(async (req, res) => {
  const result = await ParticipationService.rejectParticipant(
    req.user,
    req.params.participantId
  );
  sendResponse(res, {
    httpStatusCode: status11.OK,
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
    httpStatusCode: status11.OK,
    success: true,
    message: "Participant banned successfully",
    data: result
  });
});
var ParticipationController = {
  joinEvent: joinEvent2,
  getMyParticipations: getMyParticipations2,
  getEventParticipants: getEventParticipants2,
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
  "/events/:eventId",
  checkAuth(Role.ADMIN, Role.USER),
  ParticipationController.getEventParticipants
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
import status13 from "http-status";

// src/app/modules/invitation/invitation.service.ts
import status12 from "http-status";

// src/app/modules/invitation/invitation.constant.ts
var InvitationStatus = {
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
    throw new AppError_default(status12.NOT_FOUND, "Event not found");
  }
  if (event.ownerId !== user.userId && user.role !== Role.ADMIN) {
    throw new AppError_default(status12.FORBIDDEN, "You are not allowed to invite users");
  }
  if (payload.userId === event.ownerId) {
    throw new AppError_default(status12.BAD_REQUEST, "Event owner cannot be invited");
  }
  const invitedUser = await prisma.user.findUnique({
    where: {
      id: payload.userId
    }
  });
  if (!invitedUser || invitedUser.isDeleted || invitedUser.status === UserStatus.DELETED) {
    throw new AppError_default(status12.NOT_FOUND, "Invited user not found");
  }
  const existingInvitation = await prisma.eventInvitation.findFirst({
    where: {
      eventId,
      userId: payload.userId,
      isDeleted: false
    }
  });
  if (existingInvitation) {
    throw new AppError_default(status12.CONFLICT, "Invitation already exists");
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
      status12.CONFLICT,
      "User already joined or requested this event"
    );
  }
  const invitation = await prisma.eventInvitation.create({
    data: {
      eventId,
      userId: payload.userId,
      invitedById: user.userId,
      status: InvitationStatus.PENDING
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
    throw new AppError_default(status12.NOT_FOUND, "Invitation not found");
  }
  if (invitation.status !== InvitationStatus.PENDING) {
    throw new AppError_default(
      status12.BAD_REQUEST,
      "Only pending invitations can be accepted"
    );
  }
  if (invitation.event.feeType === FeeType.PAID) {
    throw new AppError_default(
      status12.BAD_REQUEST,
      "This invitation requires payment. Use pay and accept flow"
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
    throw new AppError_default(status12.CONFLICT, "Participant already exists");
  }
  const result = await prisma.$transaction(async (tx) => {
    await tx.eventInvitation.update({
      where: {
        id: invitation.id
      },
      data: {
        status: InvitationStatus.ACCEPTED
      }
    });
    const participant = await tx.eventParticipant.create({
      data: {
        eventId: invitation.eventId,
        userId: user.userId,
        status: ParticipationStatus.JOINED,
        paymentStatus: PaymentStatus.PAID,
        paidAmount: 0
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
    throw new AppError_default(status12.NOT_FOUND, "Invitation not found");
  }
  if (invitation.status !== InvitationStatus.PENDING) {
    throw new AppError_default(
      status12.BAD_REQUEST,
      "Only pending invitations can be rejected"
    );
  }
  const updatedInvitation = await prisma.eventInvitation.update({
    where: {
      id: invitationId
    },
    data: {
      status: InvitationStatus.REJECTED
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
    httpStatusCode: status13.CREATED,
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
    httpStatusCode: status13.OK,
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
    httpStatusCode: status13.OK,
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
    httpStatusCode: status13.OK,
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
import status15 from "http-status";

// src/app/modules/review/review.service.ts
import status14 from "http-status";
var REVIEW_EDIT_WINDOW_DAYS = 7;
var createReview = async (user, eventId, payload) => {
  const event = await prisma.event.findFirst({
    where: {
      id: eventId,
      isDeleted: false
    }
  });
  if (!event) {
    throw new AppError_default(status14.NOT_FOUND, "Event not found");
  }
  if (event.eventDateTime > /* @__PURE__ */ new Date()) {
    throw new AppError_default(
      status14.BAD_REQUEST,
      "You can review only after event date"
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
      status14.FORBIDDEN,
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
    throw new AppError_default(status14.CONFLICT, "You already reviewed this event");
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
    throw new AppError_default(status14.NOT_FOUND, "Review not found");
  }
  if (review.userId !== user.userId) {
    throw new AppError_default(
      status14.FORBIDDEN,
      "You are not allowed to update this review"
    );
  }
  const reviewDeadline = new Date(review.event.eventDateTime);
  reviewDeadline.setDate(reviewDeadline.getDate() + REVIEW_EDIT_WINDOW_DAYS);
  if (/* @__PURE__ */ new Date() > reviewDeadline) {
    throw new AppError_default(status14.BAD_REQUEST, "Review edit period expired");
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
    throw new AppError_default(status14.NOT_FOUND, "Review not found");
  }
  if (review.userId !== user.userId) {
    throw new AppError_default(
      status14.FORBIDDEN,
      "You are not allowed to delete this review"
    );
  }
  const reviewDeadline = new Date(review.event.eventDateTime);
  reviewDeadline.setDate(reviewDeadline.getDate() + REVIEW_EDIT_WINDOW_DAYS);
  if (/* @__PURE__ */ new Date() > reviewDeadline) {
    throw new AppError_default(status14.BAD_REQUEST, "Review delete period expired");
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
    httpStatusCode: status15.CREATED,
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
    httpStatusCode: status15.OK,
    success: true,
    message: "Event reviews retrieved successfully",
    data: result
  });
});
var getMyReviews2 = catchAsync_default(async (req, res) => {
  const result = await ReviewService.getMyReviews(req.user);
  sendResponse(res, {
    httpStatusCode: status15.OK,
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
    httpStatusCode: status15.OK,
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
    httpStatusCode: status15.OK,
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

// src/app/routes/index.ts
var router7 = Router7();
router7.use("/auth", AuthRoutes);
router7.use("/users", UserRoutes);
router7.use("/events", EventRoutes);
router7.use("/participations", ParticipationRoutes);
router7.use("/invitations", InvitationRoutes);
router7.use("/reviews", ReviewRoutes);
var IndexRoutes = router7;

// src/app/middleware/notFound.ts
import status16 from "http-status";
var notFound = (req, res) => {
  res.status(status16.NOT_FOUND).json({
    success: false,
    message: `Route ${req.originalUrl} Not Found`
  });
};

// src/app/middleware/globalErrorHandler.ts
import status19 from "http-status";
import z5 from "zod";

// src/app/errorHelpers/handleZodError.ts
import status17 from "http-status";
var handleZodError = (err) => {
  const statusCode = status17.BAD_REQUEST;
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

// src/app/config/cloudinary.config.ts
import { v2 as cloudinary } from "cloudinary";
import status18 from "http-status";
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
      status18.INTERNAL_SERVER_ERROR,
      "Failed to delete file from Cloudinary"
    );
  }
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
  let statusCode = status19.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  let stack = void 0;
  if (err instanceof z5.ZodError) {
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
    statusCode = status19.INTERNAL_SERVER_ERROR;
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
app.use(
  cors({
    origin: [envVars.FRONTEND_URL, envVars.BETTER_AUTH_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.set("view engine", "ejs");
app.set("views", path3.resolve(process.cwd(), "src/app/templates"));
app.use("/api/auth", toNodeHandler(auth));
app.use(express.urlencoded({ extended: true }));
dotenv2.config();
app.use(express.json());
app.use(cookieParser());
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
