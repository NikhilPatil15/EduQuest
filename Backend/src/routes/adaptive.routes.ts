// routes/adaptive.routes.ts
import { Router } from 'express';
import {
	startAdaptiveQuiz,
	updateAdaptivePerformance,
	getPerformanceAnalytics,
} from '../controllers/adaptiveQuiz.controller';
import { verifyJWT } from '../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(verifyJWT);

router.route('/start').post(startAdaptiveQuiz);
router.route('/:sessionId/performance').post(updateAdaptivePerformance);
router.route('/analytics').get(getPerformanceAnalytics);

export default router;
