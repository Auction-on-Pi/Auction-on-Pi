import { Request, Response, Router } from 'express';
import { AuthUserData } from '../types/users';

const router = Router();

// Get current user
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

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('User error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user roles (admin-only example)
router.patch('/roles', async (req: Request, res: Response) => {
  try {
    // Check if current user is admin
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
