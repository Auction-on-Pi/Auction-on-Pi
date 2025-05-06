import { Router, Request, Response } from 'express';
import platformAPIClient from '../services/platformAPIClient';
import '../types/session';

const router = Router();

router.post('/process', async (req: Request, res: Response) => {
  try {
    const prisma = req.prisma;
    const payment = await prisma.bid.create({
      data: {
        amount: req.body.amount || 0,
        auctionId: req.body.auctionId || 1,
        userId: req.body.userId || 1,
      },
    });
    res.status(200).json({ message: 'Payment processed', payment });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ error: 'Payment failed' });
  }
});

export default function mountPaymentsEndpoints(router: Router) {
  return router;
}
