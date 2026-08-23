import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';

import authRoutes from '../server/src/routes/authRoutes';
import productRoutes from '../server/src/routes/productRoutes';
import orderRoutes from '../server/src/routes/orderRoutes';
import customerRoutes from '../server/src/routes/customerRoutes';
import paymentRoutes from '../server/src/routes/paymentRoutes';
import uploadRoutes from '../server/src/routes/uploadRoutes';
import analyticsRoutes from '../server/src/routes/analyticsRoutes';
import { errorHandler } from '../server/src/middleware/errorHandler';

dotenv.config();

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: 'Vercel Serverless Production'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use(errorHandler);

export default app;
