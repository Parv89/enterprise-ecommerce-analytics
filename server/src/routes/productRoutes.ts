import { Router } from 'express';
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories
} from '../controllers/productController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:slug', getProductBySlug);

// Protected Admin / Manager routes
router.post('/', authenticateToken, requireRole(['ADMIN', 'MANAGER']), createProduct);
router.put('/:id', authenticateToken, requireRole(['ADMIN', 'MANAGER']), updateProduct);
router.delete('/:id', authenticateToken, requireRole(['ADMIN']), deleteProduct);

export default router;
