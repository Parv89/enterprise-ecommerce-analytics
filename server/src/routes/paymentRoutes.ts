import { Router } from 'express';
import { createPaymentIntent, confirmPayment } from '../controllers/paymentController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);
router.post('/create-intent', createPaymentIntent);
router.post('/confirm', confirmPayment);

export default router;
