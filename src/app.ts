import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import { IndexRoutes } from './app/routes';
import { notFound } from './app/middleware/notFound';
import { globalErrorHandler } from './app/middleware/globalErrorHandler';
import cookieParser from 'cookie-parser';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './app/lib/auth';
import path from 'path';
import qs from 'qs';
import cors from 'cors';
import { envVars } from './app/config/env.config';
import { prismaSchemaReady } from './app/lib/prisma';

const app: Application = express();
app.set('query parser', (str: string) => qs.parse(str));
app.use(
  cors({
    origin: [envVars.FRONTEND_URL, envVars.BETTER_AUTH_URL],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.set('view engine', 'ejs');
app.set('views', path.resolve(process.cwd(), 'src/app/templates'));

app.use('/api/auth', toNodeHandler(auth));
app.use(express.urlencoded({ extended: true }));
dotenv.config();
app.use(express.json());
app.use(cookieParser());

app.use(async (_req, _res, next) => {
  await prismaSchemaReady;
  next();
});

app.use('/api/v1', IndexRoutes);
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript + Express!');
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
