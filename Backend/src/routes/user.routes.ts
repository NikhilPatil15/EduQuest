// routes/user.routes.ts
import { Router } from 'express';
import {
	registerUser,
	loginUser,
	logoutUser,
	refreshAccessToken,
	changeCurrentPassword,
	getCurrentUser,
	updateUserDetails,
	updateUserAvatar,
	// New EduQuest routes
	getUserGameProfile,
	addXP,
	addCoins,
	updateQuizStats,
	addFriend,
	removeFriend,
	getLeaderboard,
} from '../controllers/user.controller';
import { verifyJWT } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/multer.middleware';

const router = Router();

// Public routes
router.route('/register').post(
	upload.fields([
		{ name: 'avatar', maxCount: 1 },
		{ name: 'coverImage', maxCount: 1 },
	]),
	registerUser,
);

router.route('/login').post(loginUser);
router.route('/refresh-token').post(refreshAccessToken);

// Protected routes
router.use(verifyJWT);

router.route('/logout').post(logoutUser);
router.route('/change-password').post(changeCurrentPassword);
router.route('/current-user').get(getCurrentUser);
router.route('/update-profile').patch(updateUserDetails);
router.route('/update-avatar').patch(upload.single('avatar'), updateUserAvatar);

// ✅ NEW EDUQUEST GAME ROUTES
router.route('/game-profile').get(getUserGameProfile);
router.route('/add-xp').post(addXP);
router.route('/add-coins').post(addCoins);
router.route('/update-quiz-stats').post(updateQuizStats);
router.route('/add-friend').post(addFriend);
router.route('/remove-friend').delete(removeFriend);
router.route('/leaderboard').get(getLeaderboard);

export default router;
