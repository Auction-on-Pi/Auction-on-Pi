// payments.ts
import { Router, Request, Response } from 'express';
import platformAPIClient from '../services/platformAPIClient';

export const paymentsRouter = Router();

paymentsRouter.post('/create', async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Payments endpoint' });
});
