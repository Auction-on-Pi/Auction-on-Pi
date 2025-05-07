import dotenv from 'dotenv';

dotenv.config();

export default {
  database_url: process.env.DATABASE_URL || 'postgresql://postgres.cguwsbdsweikvbnwziaw:p7LdtbAGz2L2vC76@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres',
  frontend_url: process.env.FRONTEND_URL || 'https://auction-on-pi.vercel.app',
  session_secret: process.env.SESSION_SECRET || 'mysecrect123',
  platform_api_url: process.env.PLATFORM_API_URL || 'https://api.minepi.com',
  pi_api_key: process.env.PI_API_KEY || 'https://api.minepi.com'
};
