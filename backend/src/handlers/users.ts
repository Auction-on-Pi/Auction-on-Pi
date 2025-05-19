import { Router, Request, Response } from 'express';

const router = Router();

router.get('/me', async (req: Request, res: Response) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = await req.prisma.user.findUnique({
      where: { id: req.session.user.id },
      select: {
        id: true,
        piUserId: true,
        username: true,
        roles: true
      }
    });

    res.json(user || { error: 'User not found' });
  } catch (error) {
    console.error('User error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/roles', async (req: Request, res: Response) => {
  try {
    if (!req.session.user?.roles?.includes('admin')) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { userId, roles } = req.body;
    const updatedUser = await req.prisma.user.update({
      where: { id: userId },
      data: { roles },
      select: {
        id: true,
        username: true,
        roles: true
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Role update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
