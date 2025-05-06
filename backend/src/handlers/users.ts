import { Router, Request, Response } from 'express';
import axios from 'axios';
import env from '../environments';
import '../types/session';

const router = Router();

router.post('/signin', async (req: Request, res: Response) => {
  try {
    const { piUserId, username } = req.body;
    if (!piUserId || !username) {
      return res.status(400).json({ error: 'Missing piUserId or username' });
    }

    const prisma = req.prisma;
    let user = await prisma.user.findUnique({
      where: { piUserId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          piUserId,
          username
        },
      });

      const supabaseAdmin = axios.create({
        baseURL: env.supabase_url,
        headers: {
          'Authorization': `Bearer ${env.supabase_service_role_key}`,
          'Content-Type': 'application/json',
          'apikey': env.supabase_service_role_key
        }
      });

      await supabaseAdmin.post('/auth/v1/users', {
        id: piUserId,
        email: `${username.replace(/\s+/g, '').toLowerCase()}@auction-on-pi.com`,
        role: 'authenticated'
      });
    }

    req.session.user = user;
    res.status(200).json(user);
  } catch (error: any) {
    console.error('Signin error:', {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: 'Signin failed', details: error.message });
  }
});

export default function mountUserEndpoints(router: Router) {
  return router;
}
