// src/types/session.ts
import { Session, SessionData } from 'express-session';
import { PrismaClient } from '@prisma/client';

declare module 'express-session' {
  interface SessionData {
    user?: {
      id: number;       // Matches your Prisma User model's Int ID
      piUserId: string;
      username: string;
      roles?: string[];  // Optional if you want to add roles later
    };
  }
}

declare module 'express' {
  interface Request {
    session: Session & SessionData;
    prisma: PrismaClient;
  }
}
