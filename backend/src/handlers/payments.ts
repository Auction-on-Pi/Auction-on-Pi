import { Router, Request, Response } from 'express';

const router: Router = Router();

router.post('/create', async (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: 'Payment created' });
  } catch (error) {
    res.status(500).json({ error: 'Payment failed' });
  }
});

export default router;
