import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import logger from 'morgan';
import pgSimple from 'connect-pg-simple';
import { Pool } from 'pg';
import env from './environments';
import { PrismaClient } from '@prisma/client';
import paymentsRouter from './handlers/payments';
import userRouter from './handlers/users';
import './types/session';

// Fallback for Prisma
let prisma: PrismaClient;
try {
  prisma = require('./lib/prisma').default;
} catch (e) {
  console.warn('Falling back to new PrismaClient instance');
  prisma = new PrismaClient();
}

const app: express.Application = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors({
  origin: env.frontend_url,
  credentials: true
}));
app.use(cookieParser());

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
}));

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  req.prisma = prisma;
  next();
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.use('/payments', paymentsRouter);
app.use('/user', userRouter);

app.get('/', async (_: express.Request, res: express.Response) => {
  res.status(200).send({ message: "Hello, World!" });
});

export default app;
