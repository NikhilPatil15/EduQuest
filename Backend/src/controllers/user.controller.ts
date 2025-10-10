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
		// console.log(user);
		const accessToken = user.generateAccessToken();
		// console.log(accessToken);
		const refreshToken = user.generateRefreshToken();
		// console.log(refreshToken);

		user.refreshToken = refreshToken;
		await user.save({ validateBeforeSave: false });

		return { accessToken, refreshToken };
	} catch (error: any) {
		throw new ErrorResponse(500, error);
	}
};

const registerUser = asyncHandler(async (req: any, res: Response) => {
	/* 1.get user details from frontend
    2.validation - should not be empty
    3.check if user already exists :username and email
    4.check for images, check for avatar
    5.upload them to cloudinary : avatar
    6.create user object - create entry in db
    7.remove password and  refresh token field from response
    8.check for user creation
      - if yes then return 
      - no then catch block*/

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

	// const coverImageLocalPath = req.files?.coverImage[0]?.path;

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

	const user: IUser = await User.create({
		fullName,
		avatar: {
			public_Id: avatarResponse?.public_id,
			url: avatarResponse?.url,
		},
		email,
		password,
		userName: userName.toLowerCase(),
	});

	const userCreated = await User.findById(user._id)?.select('-password -refreshToken');

	if (!userCreated) {
		throw new ErrorResponse(500, 'Something went wrong while regestering the user!');
	}

	return res.status(201).json(new SuccessResponse(200, userCreated, 'User registered succesfully'));
});

const loginUser = asyncHandler(async (req: any, res: Response) => {
	/* 
    1.req.body => data
    2.username or email
    3.find the user
    4.check is user exists in db
    5.check password
    6.if password doesnt match then give warning or error
    7.if correct then generate access and refresh token  
    8.send this tokens through cookies 
    */

	const { userName, email, password } = req.body;

	if (!userName && !email) {
		throw new ErrorResponse(400, 'username or email is required');
	}

	/* condition if only one them is needed to login :if(!(userName || email)) */

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
				'User Logged in succesfully',
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
			.cookie('refreshToken', refreshAccessToken, options)
			.json(
				new SuccessResponse(
					200,
					{ accessToken, refreshToken: refreshToken },
					'Access Token refreshed!',
				),
			);
	} catch (error: any) {
		throw new ErrorResponse(401, error?.message || 'Invalid refresh token');
	}
});

const changeCurrentPassword = asyncHandler(async (req: any, res: Response) => {
	const { oldPassword, newPassword } = req.body;

	const user: IUser | any = await User.findById(req.user?._id);
	/* console.log(user);*/
	const isOldPasswordCorrect = await user.isPasswordCorrect(oldPassword);
	/* console.log("old password correct or not: ",isOldPasswordCorrect);*/

	if (!isOldPasswordCorrect) {
		throw new ErrorResponse(400, 'Invalid old Password');
	}

	user.password = newPassword;

	await user.save({ validateBeforeSave: false });

	return res.status(200).json(new SuccessResponse(200, {}, 'Password changed successfullly!'));
});

const getCurrentUser = asyncHandler(async (req: any, res: Response) => {
	return res
		.status(200)
		.json(new SuccessResponse(200, req.user, 'Current user fetched successfully'));
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

	/* Deleting old avatar image from cloudinary */
	const oldAvatarPublicId = req.user?.avatar.public_Id;

	// await deleteFromCloudinary(oldAvatarPublicId, 'image');

	const user: IUser | any = await User.findById(req.user?._id).select('-password');

	user.avatar = { public_Id: newAvatar.public_id, url: newAvatar.url };
	await user.save({ validateBeforeSave: false });

	return res.status(200).json(new SuccessResponse(200, user, 'Avatar updated successfully!'));
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
};
