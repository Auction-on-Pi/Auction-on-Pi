import { Router, Request, Response } from 'express';

const router: Router = Router();

router.get('/me', async (req: Request, res: Response) => {
  try {
    if (!req.session.user) return res.status(401).json({ error: 'Unauthorized' });
    
    const user = await req.prisma.user.findUnique({
      where: { id: req.session.user.id },
      select: { id: true, username: true, roles: true }
    });

    user ? res.json(user) : res.status(404).json({ error: 'Not found' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/roles', async (req: Request, res: Response) => {
  try {
    if (!req.session.user?.roles?.includes('admin')) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updatedUser = await req.prisma.user.update({
      where: { id: req.body.userId },
      data: { roles: req.body.roles },
      select: { id: true, roles: true }
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Update failed' });
  }
});

export default router;
