import dotenv from 'dotenv';

dotenv.config();

export default {
  database_url: process.env.DATABASE_URL,
  frontend_url: process.env.FRONTEND_URL || 'https://auction-on-pi-frontend.vercel.app',
  session_secret: process.env.SESSION_SECRET || 'your-secret-key',
  platform_api_url: process.env.PLATFORM_API_URL || 'https://api.minepi.com',
  pi_api_key: process.env.PI_API_KEY || ''
};
