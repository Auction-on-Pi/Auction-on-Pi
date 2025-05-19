// users.ts
import { Router, Request, Response } from 'express';

export const userRouter = Router();

userRouter.get('/me', async (req: Request, res: Response) => {
  // ... existing code ...
});

userRouter.patch('/roles', async (req: Request, res: Response) => {
  // ... existing code ...
});
