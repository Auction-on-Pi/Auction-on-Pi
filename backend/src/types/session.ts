import { Session, SessionData } from 'express-session';

declare module 'express' {
  interface Request {
    session: Session & Partial<SessionData> & { user?: { id: number; piUserId: string; username: string } };
  }
}
