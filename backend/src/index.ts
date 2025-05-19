import cors from 'cors';
import express, { Request, Response, NextFunction, Application } from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import logger from 'morgan';
import * as pgSimple from 'connect-pg-simple';
import { Pool } from 'pg';
import env from './environments';
import { PrismaClient } from '@prisma/client';
import paymentsRouter from './handlers/payments';
import userRouter from './handlers/users';
import './types';

declare global {
  namespace Express {
    interface Request {
      prisma: PrismaClient;
      session: session.Session & { user?: { id: string; roles?: string[] } };
    }
  }
}

const app: Application = express();
const PGStore = pgSimple(session);
const pgPool = new Pool({ connectionString: env.database_url });

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(cors({ origin: env.frontend_url, credentials: true }));
app.use(cookieParser());
app.use(session({
  secret: env.session_secret,
  resave: false,
  saveUninitialized: false,
  store: new PGStore({ pool: pgPool, tableName: 'user_sessions' }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 86400000
  }
}));

// Prisma Middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  req.prisma = new PrismaClient();
  next();
});

// Routes
app.use('/payments', paymentsRouter);
app.use('/user', userRouter);

// Health Check
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({ message: "OK" });
});

// Error Handler
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;
