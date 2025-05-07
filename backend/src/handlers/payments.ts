import { Router, Request, Response } from 'express';
import platformAPIClient from '../services/platformAPIClient';

const router = Router();

// Example route (replace with actual routes)
router.post('/create', async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Payments endpoint' });
});

export default router;
