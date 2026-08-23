import { Router } from 'express';
import { getCustomers, updateCustomerRole } from '../controllers/customerController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);
router.get('/', requireRole(['ADMIN', 'MANAGER']), getCustomers);
router.patch('/:id/role', requireRole(['ADMIN']), updateCustomerRole);

export default router;
