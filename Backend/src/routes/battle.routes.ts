// routes/battle.routes.ts
import { Router } from 'express';
import {
	createBattle,
	joinBattle,
	getBattleStatus,
	submitBattleAnswer,
	getBattleHistory,
	getAvailableBattles,
} from '../controllers/battle.controller';
import { verifyJWT } from '../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(verifyJWT);

router.route('/create').post(createBattle);
router.route('/available').get(getAvailableBattles);
router.route('/history').get(getBattleHistory);
router.route('/:battleId/status').get(getBattleStatus);
router.route('/:battleId/answer').post(submitBattleAnswer);
router.route('/join/:roomId').post(joinBattle);

export default router;
