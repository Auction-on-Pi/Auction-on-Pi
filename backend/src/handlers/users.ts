import { Router, Request, Response } from 'express';
import '../types/session';

const router = Router();

router.post('/signin', async (req: Request, res: Response) => {
  try {
    const prisma = req.prisma;
    const user = await prisma.user.findUnique({
      where: { piUserId: req.body.piUserId },
    });
    if (!user) {
      const newUser = await prisma.user.create({
        data: {
          piUserId: req.body.piUserId,
          username: req.body.username || 'Anonymous',
        },
      });
      req.session.user = newUser;
      return res.status(200).json(newUser);
    }
    req.session.user = user;
    res.status(200).json(user);
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Signin failed' });
  }
});

export default function mountUserEndpoints(router: Router) {
  return router;
}
