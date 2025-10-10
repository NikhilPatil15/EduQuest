import { Router } from 'express';
import {
	changeCurrentPassword,
	getCurrentUser,
	loginUser,
	logoutUser,
	refreshAccessToken,
	registerUser,
	updateUserDetails,
	updateUserAvatar,
} from '../controllers/user.controller';
import { upload } from '../middlewares/multer.middleware';
import { verifyJWT } from '../middlewares/auth.middleware';

const router = Router();

/* Register route */
router.route('/register').post(
	upload.fields([
		{ name: 'avatar', maxCount: 1 },
		{
			name: 'coverImage',
			maxCount: 1,
		},
	]),
	registerUser,
);

/* Login route */
router.route('/login').post(loginUser);

/* Secured Routes */
router.route('/logout').post(verifyJWT, logoutUser);
router.route('/refresh-AccessToken').post(refreshAccessToken);
router.route('/updateAvatar').patch(verifyJWT, upload.single('avatar'), updateUserAvatar);
router.route('/changePassword').post(verifyJWT, changeCurrentPassword);
router.route('/updateAccountDetails').patch(verifyJWT, updateUserDetails);
router.route('/currentUser').get(verifyJWT, getCurrentUser);

export default router;
