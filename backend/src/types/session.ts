import { Session, SessionData } from 'express-session';
import { PrismaClient } from '@prisma/client';

declare module 'express' {
  interface Request {
    session: Session & Partial<SessionData> & { user?: { id: number; piUserId: string; username: string } };
    prisma: PrismaClient;
  }
}
