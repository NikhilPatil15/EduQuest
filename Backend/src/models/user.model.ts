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
		// EDUQUEST GAME FIELDS
		level: {
			type: Number,
			default: 1,
		},
		xp: {
			type: Number,
			default: 0,
		},
		coins: {
			type: Number,
			default: 100,
		},
		dailyStreak: {
			type: Number,
			default: 0,
		},
		lastActive: {
			type: Date,
			default: Date.now,
		},

		// Game Stats
		totalQuizzes: { type: Number, default: 0 },
		correctAnswers: { type: Number, default: 0 },
		totalBattles: { type: Number, default: 0 },
		battlesWon: { type: Number, default: 0 },

		// Social & Progress
		friends: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		friendRequests: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		unlockedSubjects: [
			{
				type: String,
				default: ['math'],
			},
		],
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
UserSchema.methods.addXP = async function (xpAmount: number) {
	this.xp += xpAmount;

	const xpNeededForNextLevel = this.level * 1000;
	if (this.xp >= xpNeededForNextLevel) {
		this.level += 1;
		this.xp -= xpNeededForNextLevel;
		this.coins += 50;
	}

	await this.save();
	return { newLevel: this.level, newXP: this.xp };
};

UserSchema.methods.addCoins = async function (coinAmount: number) {
	this.coins += coinAmount;
	await this.save();
	return this.coins;
};

UserSchema.methods.updateDailyStreak = async function () {
	const today = new Date();
	const lastActive = new Date(this.lastActive);

	if (lastActive.toDateString() !== today.toDateString()) {
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		if (lastActive.toDateString() === yesterday.toDateString()) {
			this.dailyStreak += 1;
			this.coins += 10 * this.dailyStreak;
		} else {
			this.dailyStreak = 1;
			this.coins += 10;
		}

		this.lastActive = today;
		await this.save();
	}

	return this.dailyStreak;
};

UserSchema.methods.canUnlockSubject = function (subject: string) {
	const requiredLevels: { [key: string]: number } = {
		math: 1,
		science: 5,
		coding: 10,
	};

	return this.level >= (requiredLevels[subject] || 1);
};

export const User = model<IUser>('Admin', UserSchema);
