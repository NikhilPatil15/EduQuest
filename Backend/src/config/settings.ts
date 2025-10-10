import dotenv from 'dotenv';
import { CookieOptions } from 'express';

dotenv.config();

const databaseUrl = process.env.MONGODB_URL as string;
const databaseName = process.env.DB_NAME as string;
const PORT = process.env.PORT;
const corsOrigin = process.env.CORS_ORIGIN;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;
const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY!;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string;
const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY!;
const jwtSecret = process.env.JWT_SECRET;

const options: CookieOptions = {
	httpOnly: true,
	secure: process.env.NODE_ENV === 'production',
	sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
	path: '/',
	maxAge: 15 * 60 * 1000,
};

export {
	databaseName,
	databaseUrl,
	PORT,
	corsOrigin,
	accessTokenExpiry,
	accessTokenSecret,
	refreshTokenExpiry,
	refreshTokenSecret,
	jwtSecret,
	options,
};
