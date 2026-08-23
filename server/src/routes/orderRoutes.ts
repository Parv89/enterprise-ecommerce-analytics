import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus
} from '../controllers/orderController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.post('/', createOrder);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrderById);

// Admin & Manager routes
router.get('/', requireRole(['ADMIN', 'MANAGER']), getAllOrders);
router.patch('/:id/status', requireRole(['ADMIN', 'MANAGER']), updateOrderStatus);

export default router;
