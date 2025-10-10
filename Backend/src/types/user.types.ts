import { Document } from 'mongoose';

export interface IUser extends Document {
	_id: string;
	name: string;
	email: string;
	password: string;
	refreshToken?: string;
	createdAt: Date;
	updatedAt: Date;
	isPasswordCorrect(password: string): Promise<boolean>;
	generateAccessToken(): Promise<String>;
	generateRefreshToken(): Promise<String>;
}
