// models/user.model.ts - UPDATED WITH MISSING METHODS
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

		// ✅ ADDED: New fields for enhanced features
		longestStreak: {
			type: Number,
			default: 0,
		},
		levelHistory: [
			{
				level: {
					type: Number,
					required: true,
				},
				achievedAt: {
					type: Date,
					default: Date.now,
				},
				xpAtLevel: {
					type: Number,
					required: true,
				},
			},
		],
		questPreferences: {
			favoriteSubjects: [
				{
					type: String,
					enum: ['math', 'science', 'coding'],
				},
			],
			dailyGoal: {
				type: Number,
				default: 5, // 5 quizzes per day
			},
			notificationEnabled: {
				type: Boolean,
				default: true,
			},
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

UserSchema.methods.isPasswordCorrect = async function (password: string): Promise<boolean> {
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

// Update user.model.ts - Add badge checking on level up
UserSchema.methods.addXP = async function (xpAmount: number) {
	const oldLevel = this.level;
	this.xp += xpAmount;

	const xpNeededForNextLevel = this.level * 1000;

	while (this.xp >= xpNeededForNextLevel) {
		this.level += 1;
		this.xp -= xpNeededForNextLevel;
		this.coins += 50;

		await this.addLevelHistory();

		// Check for badges on level up
		const { BadgeService } = await import('../utils/services/badge.service');
		BadgeService.checkAndAwardBadges(this._id.toString()).catch(console.error);
	}

	await this.save();

	return {
		newLevel: this.level,
		newXP: this.xp,
		leveledUp: oldLevel < this.level,
	};
};

// ✅ ADDED: Add coins to user
UserSchema.methods.addCoins = async function (coinAmount: number) {
	this.coins += coinAmount;
	await this.save();
	return this.coins;
};

// ✅ ADDED: Update daily streak with proper logic
UserSchema.methods.updateDailyStreak = async function () {
	const today = new Date();
	today.setHours(0, 0, 0, 0); // Normalize to start of day

	const lastActive = new Date(this.lastActive);
	lastActive.setHours(0, 0, 0, 0); // Normalize to start of day

	// If last activity was not today
	if (lastActive.getTime() !== today.getTime()) {
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		// If last activity was yesterday, increment streak
		if (lastActive.getTime() === yesterday.getTime()) {
			this.dailyStreak += 1;

			// Update longest streak if current is higher
			if (this.dailyStreak > this.longestStreak) {
				this.longestStreak = this.dailyStreak;
			}

			// Streak bonus coins
			const streakBonus = 10 * this.dailyStreak;
			this.coins += streakBonus;
		} else {
			// Streak broken, reset to 1
			this.dailyStreak = 1;
			this.coins += 10; // Base daily login bonus
		}

		this.lastActive = new Date(); // Update to current time
		await this.save();
	}

	return this.dailyStreak;
};

// ✅ ADDED: Check if user can unlock a subject
UserSchema.methods.canUnlockSubject = function (subject: string): boolean {
	const requiredLevels: { [key: string]: number } = {
		math: 1,
		science: 5,
		coding: 10,
	};

	return this.level >= (requiredLevels[subject] || 1);
};

// ✅ ADDED: Track level history
UserSchema.methods.addLevelHistory = async function () {
	if (!this.levelHistory) {
		this.levelHistory = [];
	}

	this.levelHistory.push({
		level: this.level,
		achievedAt: new Date(),
		xpAtLevel: this.xp,
	});

	// Keep only last 10 level ups to prevent array from growing too large
	if (this.levelHistory.length > 10) {
		this.levelHistory = this.levelHistory.slice(-10);
	}

	await this.save();
};

export const User = model<IUser>('User', UserSchema);
