import fs from 'fs';
import path from 'path';
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import logger from 'morgan';
import pgSimple from 'connect-pg-simple';
import { Pool } from 'pg';
import env from './environments';
import prisma from './lib/prisma';
import mountPaymentsEndpoints from './handlers/payments';
import mountUserEndpoints from './handlers/users';
import "./types/session";

const app: express.Application = express();

app.use(logger('dev'));
app.use(logger('common', {
  stream: fs.createWriteStream(path.join(__dirname, '..', 'log', 'access.log'), { flags: 'a' }),
}));
app.use(express.json());
app.use(cors({
  origin: env.frontend_url,
  credentials: true
}));
app.use(cookieParser());

// Set up PostgreSQL session store
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

// Make Prisma client available
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

const paymentsRouter = express.Router();
mountPaymentsEndpoints(paymentsRouter);
app.use('/payments', paymentsRouter);

const userRouter = express.Router();
mountUserEndpoints(userRouter);
app.use('/user', userRouter);

app.get('/', async (_, res) => {
  res.status(200).send({ message: "Hello, World!" });
});

export default app;
