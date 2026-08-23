import { Router } from 'express';
import { getDashboardAnalytics, exportAnalyticsReport } from '../controllers/analyticsController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);
router.get('/dashboard', requireRole(['ADMIN', 'MANAGER']), getDashboardAnalytics);
router.get('/export', requireRole(['ADMIN', 'MANAGER']), exportAnalyticsReport);

export default router;
