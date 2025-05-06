import dotenv from 'dotenv';

dotenv.config();

export default {
  database_url: process.env.DATABASE_URL,
  frontend_url: process.env.FRONTEND_URL || 'https://auction-on-pi-frontend.vercel.app',
  session_secret: process.env.SESSION_SECRET || 'your-secret-key',
};
