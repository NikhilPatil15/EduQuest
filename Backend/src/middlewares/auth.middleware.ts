import { User } from '../models/user.model';
import { ErrorResponse } from '../utils/errorResponse';
import { asyncHandler } from '../utils/asyncHandler';
import jwt from 'jsonwebtoken';
import { NextFunction } from 'express';
import { accessTokenSecret } from '../config/settings';

export const verifyJWT = asyncHandler(async (req: Request | any, _, next: NextFunction) => {
	try {
		const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');
		// console.log(token);
		if (!token) {
			throw new ErrorResponse(401, ' Unauthorized request');
		}

		const decodedToken: any = jwt.verify(token, accessTokenSecret as string);
		const user = await User.findById(decodedToken?._id).select('-password -refreshToken');

		if (!user) {
			throw new ErrorResponse(401, 'Invalid Access Token');
		}

		req.user = user;
		next();
	} catch (error: any) {
		throw new ErrorResponse(403, 'Token verification failed!');
	}
});
