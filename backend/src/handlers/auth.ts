import { Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Login endpoint
router.post('/login', async (req: Request, res: Response) => {
  const { piUserId, accessToken } = req.body;

  // Basic validation
  if (!piUserId || !accessToken) {
    return res.status(400).json({ error: 'piUserId and accessToken are required' });
  }

  try {
    // 1. Find or create user in database
    const user = await prisma.user.upsert({
      where: { piUserId },
      create: {
        piUserId,
        username: `user_${piUserId.slice(0, 5)}`, // Simple username
        accessToken
      },
      update: { accessToken }
    });

    // 2. Set session data
    req.session.user = {
      id: user.id,
      piUserId: user.piUserId,
      username: user.username
    };

    // 3. Send response (excluding sensitive data)
    res.json({
      id: user.id,
      username: user.username,
      piUserId: user.piUserId
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Logout endpoint
router.post('/logout', (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('connect.sid'); // Session cookie name
    res.json({ success: true });
  });
});

export default router;
