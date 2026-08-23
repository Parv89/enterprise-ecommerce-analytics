import { Router } from 'express';
import { handleFileUpload } from '../controllers/uploadController';
import { uploadMiddleware } from '../services/storageService';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, requireRole(['ADMIN', 'MANAGER']), uploadMiddleware.single('file'), handleFileUpload);

export default router;
