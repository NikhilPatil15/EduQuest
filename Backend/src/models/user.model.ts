// @ts-nocheck

import { Schema, model } from 'mongoose';
import { IUser } from '../types/user.types';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
	accessTokenExpiry,
	accessTokenSecret,
	refreshTokenExpiry,
	refreshTokenSecret,
} from '../config/settings';

const UserSchema = new Schema<IUser>(
	{
		userName: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
			index: true,
		},
		email: {
			type: String,
			lowercase: true,
			unique: true,
			required: true,
			trim: true,
		},
		fullName: {
			type: String,
			required: true,
			trim: true,
			index: true,
		},
		avatar: {
			public_Id: {
				type: String,
			},
			url: {
				type: String,
			},
		},
		password: {
			type: String,
			required: [true, 'Paswsword is required'],
		},
		refreshToken: {
			type: String,
		},
	},
	{
		timestamps: true,
	},
);

UserSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	this.password = await bcrypt.hash(this.password as string, 10);
	next();
});

UserSchema.methods.isPasswordCorrect = async function (password: any) {
	return await bcrypt.compare(password, this.password);
};

UserSchema.methods.generateAccessToken = async function (): Promise<string> {
	if (!accessTokenSecret) {
		throw new Error('Access Token Secret is not defined');
	}

	return jwt.sign(
		{
			_id: this._id,
			name: this.fullName,
			email: this.email,
		},
		accessTokenSecret,
		{ expiresIn: accessTokenExpiry },
	);
};

UserSchema.methods.generateRefreshToken = async function (): Promise<string> {
	if (!refreshTokenSecret) {
		throw new Error('Refresh Token Secret is not defined');
	}

	return jwt.sign(
		{
			_id: this._id,
		},
		refreshTokenSecret as string,
		{
			expiresIn: refreshTokenExpiry,
		},
	);
};

export const User = model<IUser>('Admin', UserSchema);
