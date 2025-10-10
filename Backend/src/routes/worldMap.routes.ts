// routes/worldMap.routes.ts
import { Router } from 'express';
import {
	getWorldMapProgress,
	unlockRegion,
	getRecommendedRegion,
	getRegionLeaderboard,
	getRegionDetails,
} from '../controllers/worldMap.controller';
import { verifyJWT } from '../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(verifyJWT);

router.route('/progress').get(getWorldMapProgress);
router.route('/unlock-region').post(unlockRegion);
router.route('/recommended').get(getRecommendedRegion);
router.route('/:regionId/details').get(getRegionDetails);
router.route('/:regionId/leaderboard').get(getRegionLeaderboard);

export default router;
