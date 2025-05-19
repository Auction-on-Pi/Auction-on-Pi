import cors from 'cors';
import express, { Request, Response, NextFunction, Application, ErrorRequestHandler } from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import logger from 'morgan';
import pgSimple from 'connect-pg-simple';
import { Pool } from 'pg';
import env from './environments';
import { PrismaClient } from '@prisma/client';
import { paymentsRouter } from './handlers/payments';
import { userRouter } from './handlers/users';
import './types/session';

// Extend Express Request type to include prisma
declare global {
  namespace Express {
    interface Request {
      prisma: PrismaClient;
    }
  }
}

// Fallback for Prisma
let prisma: PrismaClient;
try {
  prisma = require('./lib/prisma').default;
} catch (e) {
  console.warn('Falling back to new PrismaClient instance');
  prisma = new PrismaClient();
}

const app: Application = express();

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(cors({
  origin: env.frontend_url,
  credentials: true
}));
app.use(cookieParser());

// Session configuration
const PGStore = pgSimple(session);
const pgPool = new Pool({
  connectionString: env.database_url,
});

app.use(session({
  secret: env.session_secret,
  resave: false,
  saveUninitialized: false,
  store: new PGStore({
    pool: pgPool,
    tableName: 'user_sessions',
    createTableIfMissing: true
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// Attach Prisma to request
app.use((req: Request, _res: Response, next: NextFunction) => {
  req.prisma = prisma;
  next();
});

// Routes
app.use('/payments', paymentsRouter);
app.use('/user', userRouter);

// Health check endpoint
app.get('/', async (_req: Request, res: Response) => {
  res.status(200).json({ message: "Hello, World!" });
});

// Error handling middleware
const errorHandler: ErrorRequestHandler = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof Error) {
    console.error('Server Error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
  return res.status(500).json({ error: 'Unknown server error' });
};

app.use(errorHandler);

export default app;
