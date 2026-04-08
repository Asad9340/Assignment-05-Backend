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

const explicitAllowedOrigins = [
  envVars.FRONTEND_URL,
  envVars.BETTER_AUTH_URL,
  'http://localhost:3000',
]
  .flatMap(value => value.split(','))
  .map(value => value.trim())
  .filter(Boolean);

const isAllowedOrigin = (origin?: string) => {
  if (!origin) {
    return true;
  }

  if (explicitAllowedOrigins.includes(origin)) {
    return true;
  }

  // Allow Vercel preview and production domains for the frontend project.
  if (/^https:\/\/.*planora-frontend.*\.vercel\.app$/i.test(origin)) {
    return true;
  }

  // Allow SSLCommerz hosted payment pages to call back into the API.
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

      callback(new Error(`CORS blocked for origin: ${origin || 'unknown'}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
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
