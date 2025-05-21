import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { Pool } from 'pg';
import { approvePiPayment, completePiPayment } from './handlers/payments';
import { getUserProfile } from './handlers/users';

const app = express();
const port = process.env.PORT || 3000;

// Database connection for session store
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Session middleware
const PgSession = connectPgSimple(session);
app.use(
  session({
    store: new PgSession({
      pool,
      tableName: 'session',
    }),
    secret: process.env.SESSION_SECRET || 'your-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
  })
);

// JSON middleware
app.use(express.json());

// Routes
app.post('/api/payments/approve', async (req: Request, res: Response) => {
  try {
    const { paymentId, itemId, bidderId } = req.body;
    const result = await approvePiPayment(paymentId, itemId, bidderId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/payments/complete', async (req: Request, res: Response) => {
  try {
    const { paymentId, txid } = req.body;
    const result = await completePiPayment(paymentId, txid);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users/:userId', async (req: Request, res: Response) => {
  try {
    const user = await getUserProfile(req.params.userId);
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
