// routes/leaderboard.routes.ts
import { Router } from 'express';
import {
	getLeaderboard,
	getUserBadges,
	getBadgeStats,
	shareBadge,
	sendFriendRequest,
	acceptFriendRequest,
	declineFriendRequest,
	removeFriend,
	getUserFriends,
	getPendingRequests,
	getFriendSuggestions,
	shareVictory,
	shareLevelUp,
	sharePokemonCatch,
	getUserShares,
	getPopularShares,
	incrementShareCount,
} from '../controllers/leaderboard.controller';
import { verifyJWT } from '../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(verifyJWT);

// Leaderboard routes
router.route('/leaderboard').get(getLeaderboard);

// Badge routes
router.route('/badges').get(getUserBadges);
router.route('/badges/stats').get(getBadgeStats);
router.route('/badges/share').post(shareBadge);

// Friend routes
router.route('/friends').get(getUserFriends);
router.route('/friends/requests').get(getPendingRequests);
router.route('/friends/suggestions').get(getFriendSuggestions);
router.route('/friends/request').post(sendFriendRequest);
router.route('/friends/requests/:requestId/accept').post(acceptFriendRequest);
router.route('/friends/requests/:requestId/decline').delete(declineFriendRequest);
router.route('/friends/:friendId').delete(removeFriend);

// Social share routes
router.route('/share/victory').post(shareVictory);
router.route('/share/level-up').post(shareLevelUp);
router.route('/share/pokemon-catch').post(sharePokemonCatch);
router.route('/shares').get(getUserShares);
router.route('/shares/popular').get(getPopularShares);
router.route('/shares/:shareId/increment').patch(incrementShareCount);

export default router;
