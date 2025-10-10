// controllers/user.controller.ts
import { asyncHandler } from '../utils/asyncHandler';
import { ErrorResponse } from '../utils/errorResponse';
import { User } from '../models/user.model';
import uploadOnCloudinary from '../utils/cloudinary';
import { SuccessResponse } from '../utils/successResponse';
import jwt from 'jsonwebtoken';
import { IUser } from '../types/user.types';
import { Response } from 'express';
import { refreshTokenSecret } from '../config/settings';

const generateAccessAndRefreshTokens = async (userId: string) => {
	try {
		const user: IUser | any = await User.findById(userId);

		const accessToken = user.generateAccessToken();
		const refreshToken = user.generateRefreshToken();

		user.refreshToken = refreshToken;
		await user.save({ validateBeforeSave: false });

		return { accessToken, refreshToken };
	} catch (error: any) {
		throw new ErrorResponse(500, error);
	}
};

const registerUser = asyncHandler(async (req: any, res: Response) => {
	const { fullName, userName, email, password } = req.body;
	console.log('email: ', email);

	if ([fullName, email, userName, password].some((field) => field?.trim() === '')) {
		throw new ErrorResponse(400, 'All fields are required!');
	}

	console.log('req.body', req.body);
	console.log('req.file: ', req.files);

	const existedUser = await User.findOne({
		$or: [{ userName }, { email }],
	});

	if (existedUser) {
		throw new ErrorResponse(409, 'User with email or username already exists');
	}

	const avatarLocalPath = req.files?.avatar[0]?.path;
	let coverImageLocalPath;

	if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
		coverImageLocalPath = req.files.coverImage[0].path;
	}

	if (!avatarLocalPath) {
		throw new ErrorResponse(400, 'Avatar image is required');
	}

	const avatarResponse = await uploadOnCloudinary(avatarLocalPath);
	const coverImageResponse = await uploadOnCloudinary(coverImageLocalPath);

	if (!avatarResponse) {
		throw new ErrorResponse(400, 'Avatar image is required');
	}

	// ✅ Create user with EduQuest default values
	const user: IUser = await User.create({
		fullName,
		avatar: {
			public_Id: avatarResponse?.public_id,
			url: avatarResponse?.url,
		},
		email,
		password,
		userName: userName.toLowerCase(),
		// EduQuest fields will use their default values
	});

	const userCreated = await User.findById(user._id).select('-password -refreshToken');

	if (!userCreated) {
		throw new ErrorResponse(500, 'Something went wrong while registering the user!');
	}

	return res
		.status(201)
		.json(new SuccessResponse(200, userCreated, 'User registered successfully'));
});

const loginUser = asyncHandler(async (req: any, res: Response) => {
	const { userName, email, password } = req.body;

	if (!userName && !email) {
		throw new ErrorResponse(400, 'username or email is required');
	}

	const userExists: IUser | any = await User.findOne({
		$or: [{ userName }, { email }],
	});

	if (!userExists) {
		throw new ErrorResponse(404, 'Username does not exists');
	}

	const isPasswordValid = await userExists.isPasswordCorrect(password);

	if (!isPasswordValid) {
		throw new ErrorResponse(401, 'Incorrect Password!');
	}

	// ✅ Update daily streak on login
	await userExists.updateDailyStreak();

	const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(userExists._id);

	const loggedUser: IUser = await User.findById(userExists._id).select('-password -refreshToken');

	const options = {
		httpOnly: true,
		secure: true,
	};

	return res
		.status(200)
		.cookie('accessToken', accessToken, options)
		.cookie('refreshToken', refreshToken, options)
		.json(
			new SuccessResponse(
				200,
				{
					user: loggedUser,
					accessToken,
					refreshToken,
				},
				'User Logged in successfully',
			),
		);
});

const logoutUser = asyncHandler(async (req: any, res: Response) => {
	await User.findByIdAndUpdate(
		req.user._id,
		{
			$set: {
				refreshToken: undefined,
			},
		},
		{
			new: true,
		},
	);

	const options = {
		httpOnly: true,
		secure: true,
	};

	return res
		.status(200)
		.clearCookie('accessToken', options)
		.clearCookie('refreshToken', options)
		.json(new SuccessResponse(200, {}, 'User Logged Out'));
});

const refreshAccessToken = asyncHandler(async (req: any, res: Response) => {
	const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

	if (!incomingRefreshToken) {
		throw new ErrorResponse(401, 'Unauthorized request');
	}

	try {
		const decodedToken: any = jwt.verify(incomingRefreshToken, refreshTokenSecret as string);

		const userExists: IUser | any = await User.findById(decodedToken?._id);

		if (!userExists) {
			throw new ErrorResponse(401, 'Invalid refresh Token');
		}

		if (incomingRefreshToken !== userExists?.refreshToken) {
			throw new ErrorResponse(401, 'Refresh token is expired or used');
		}

		const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(userExists._id);

		const options = {
			httpOnly: true,
			secure: true,
		};

		return res
			.status(200)
			.cookie('accessToken', accessToken, options)
			.cookie('refreshToken', refreshToken, options) // ✅ Fixed: was refreshAccessToken
			.json(new SuccessResponse(200, { accessToken, refreshToken }, 'Access Token refreshed!'));
	} catch (error: any) {
		throw new ErrorResponse(401, error?.message || 'Invalid refresh token');
	}
});

const changeCurrentPassword = asyncHandler(async (req: any, res: Response) => {
	const { oldPassword, newPassword } = req.body;

	const user: IUser | any = await User.findById(req.user?._id);

	const isOldPasswordCorrect = await user.isPasswordCorrect(oldPassword);

	if (!isOldPasswordCorrect) {
		throw new ErrorResponse(400, 'Invalid old Password');
	}

	user.password = newPassword;
	await user.save({ validateBeforeSave: false });

	return res.status(200).json(new SuccessResponse(200, {}, 'Password changed successfully!'));
});

const getCurrentUser = asyncHandler(async (req: any, res: Response) => {
	// ✅ Populate friends for the game profile
	const user = await User.findById(req.user._id)
		.select('-password -refreshToken')
		.populate('friends', 'userName fullName avatar level xp');

	return res.status(200).json(new SuccessResponse(200, user, 'Current user fetched successfully'));
});

const updateUserDetails = asyncHandler(async (req: any, res: Response) => {
	const { fullName, email } = req.body;

	if (!fullName || !email) {
		throw new ErrorResponse(400, 'All fields are required');
	}

	const user: IUser | any = await User.findByIdAndUpdate(
		req.user?._id,
		{ $set: { fullName, email } },
		{ new: true },
	).select('-password');

	return res
		.status(200)
		.json(new SuccessResponse(200, user, 'Account Details updated successfully'));
});

const updateUserAvatar = asyncHandler(async (req: any, res: Response) => {
	const avatarLocalPath = req.file?.path;

	if (!avatarLocalPath) {
		throw new ErrorResponse(400, 'Avatar file is missing');
	}

	const newAvatar: any = await uploadOnCloudinary(avatarLocalPath);

	if (!newAvatar.url) {
		throw new ErrorResponse(400, 'Error while uploading avatar');
	}

	const oldAvatarPublicId = req.user?.avatar.public_Id;

	// await deleteFromCloudinary(oldAvatarPublicId, 'image');

	const user: IUser | any = await User.findById(req.user?._id).select('-password');

	user.avatar = { public_Id: newAvatar.public_id, url: newAvatar.url };
	await user.save({ validateBeforeSave: false });

	return res.status(200).json(new SuccessResponse(200, user, 'Avatar updated successfully!'));
});

// ✅ NEW EDUQUEST GAME CONTROLLERS

const getUserGameProfile = asyncHandler(async (req: any, res: Response) => {
	const user = await User.findById(req.user._id)
		.select('-password -refreshToken')
		.populate('friends', 'userName fullName avatar level xp coins dailyStreak');

	if (!user) {
		throw new ErrorResponse(404, 'User not found');
	}

	// Calculate rank or additional game stats
	const userRank = (await User.countDocuments({ xp: { $gt: user.xp } })) + 1;

	const gameProfile = {
		...user.toObject(),
		rank: userRank,
		nextLevelXP: user.level * 1000,
		progressToNextLevel: (user.xp / (user.level * 1000)) * 100,
	};

	return res
		.status(200)
		.json(new SuccessResponse(200, gameProfile, 'Game profile fetched successfully'));
});

const addXP = asyncHandler(async (req: any, res: Response) => {
	const { xpAmount } = req.body;

	if (!xpAmount || xpAmount <= 0) {
		throw new ErrorResponse(400, 'Valid XP amount is required');
	}

	const user: IUser | any = await User.findById(req.user._id);

	const result = await user.addXP(xpAmount);

	return res.status(200).json(new SuccessResponse(200, result, 'XP added successfully'));
});

const addCoins = asyncHandler(async (req: any, res: Response) => {
	const { coinAmount } = req.body;

	if (!coinAmount || coinAmount <= 0) {
		throw new ErrorResponse(400, 'Valid coin amount is required');
	}

	const user: IUser | any = await User.findById(req.user._id);

	const newBalance = await user.addCoins(coinAmount);

	return res
		.status(200)
		.json(new SuccessResponse(200, { coins: newBalance }, 'Coins added successfully'));
});

const updateQuizStats = asyncHandler(async (req: any, res: Response) => {
	const { correctAnswers, totalQuestions, xpEarned, coinsEarned } = req.body;

	const user: IUser | any = await User.findById(req.user._id);

	// Update quiz stats
	user.totalQuizzes += 1;
	user.correctAnswers += correctAnswers || 0;

	// Add XP and coins if earned
	if (xpEarned) await user.addXP(xpEarned);
	if (coinsEarned) await user.addCoins(coinsEarned);

	await user.save();

	return res.status(200).json(new SuccessResponse(200, user, 'Quiz stats updated successfully'));
});

const addFriend = asyncHandler(async (req: any, res: Response) => {
	const { friendUserName } = req.body;

	if (!friendUserName) {
		throw new ErrorResponse(400, 'Friend username is required');
	}

	if (req.user.userName === friendUserName) {
		throw new ErrorResponse(400, 'Cannot add yourself as friend');
	}

	const user: IUser | any = await User.findById(req.user._id);
	const friend = await User.findOne({ userName: friendUserName });

	if (!friend) {
		throw new ErrorResponse(404, 'User not found');
	}

	if (user.friends.includes(friend._id)) {
		throw new ErrorResponse(400, 'Already friends');
	}

	// Add to friends list
	user.friends.push(friend._id);
	await user.save();

	return res.status(200).json(new SuccessResponse(200, {}, 'Friend added successfully'));
});

const removeFriend = asyncHandler(async (req: any, res: Response) => {
	const { friendId } = req.body;

	const user: IUser | any = await User.findById(req.user._id);

	user.friends = user.friends.filter((id: string) => id.toString() !== friendId);
	await user.save();

	return res.status(200).json(new SuccessResponse(200, {}, 'Friend removed successfully'));
});

const getLeaderboard = asyncHandler(async (req: any, res: Response) => {
	const { type = 'global', limit = 50 } = req.query;

	let leaderboard;

	switch (type) {
		case 'friends':
			const user = await User.findById(req.user._id).populate('friends');
			if (!user) {
				throw new ErrorResponse(404, 'User not found');
			}
			const friendIds = user.friends.map((friend: any) => friend._id);
			friendIds.push(req.user._id);

			leaderboard = await User.find({ _id: { $in: friendIds } })
				.select(
					'userName fullName avatar level xp coins dailyStreak totalQuizzes correctAnswers battlesWon',
				)
				.sort({ xp: -1, level: -1 })
				.limit(parseInt(limit));
			break;

		case 'global':
		default:
			leaderboard = await User.find({})
				.select(
					'userName fullName avatar level xp coins dailyStreak totalQuizzes correctAnswers battlesWon',
				)
				.sort({ xp: -1, level: -1 })
				.limit(parseInt(limit));
			break;
	}

	return res
		.status(200)
		.json(new SuccessResponse(200, leaderboard, 'Leaderboard fetched successfully'));
});

export {
	registerUser,
	loginUser,
	logoutUser,
	refreshAccessToken,
	changeCurrentPassword,
	getCurrentUser,
	updateUserDetails,
	updateUserAvatar,
	// New EduQuest exports
	getUserGameProfile,
	addXP,
	addCoins,
	updateQuizStats,
	addFriend,
	removeFriend,
	getLeaderboard,
};
