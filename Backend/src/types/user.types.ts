// types/user.types.ts - UPDATED
import { Document } from 'mongoose';

export interface IUser extends Document {
	userName: string;
	email: string;
	fullName: string;
	avatar: {
		public_Id: string;
		url: string;
	};
	password: string;
	refreshToken: string;

	// EDUQUEST GAME FIELDS
	level: number;
	xp: number;
	coins: number;
	dailyStreak: number;
	lastActive: Date;

	// Game Stats
	totalQuizzes: number;
	correctAnswers: number;
	totalBattles: number;
	battlesWon: number;

	// Social & Progress
	friends: string[];
	friendRequests: string[];
	unlockedSubjects: string[];

	// ✅ ADDED: New fields for enhanced features
	longestStreak?: number;
	levelHistory?: {
		level: number;
		achievedAt: Date;
		xpAtLevel: number;
	}[];
	questPreferences?: {
		favoriteSubjects: string[];
		dailyGoal: number;
		notificationEnabled: boolean;
	};

	// ✅ ADDED: Instance methods
	isPasswordCorrect(password: string): Promise<boolean>;
	generateAccessToken(): Promise<string>;
	generateRefreshToken(): Promise<string>;
	addXP(xpAmount: number): Promise<{ newLevel: number; newXP: number; leveledUp: boolean }>;
	addCoins(coinAmount: number): Promise<number>;
	updateDailyStreak(): Promise<number>;
	canUnlockSubject(subject: string): boolean;
	addLevelHistory(): Promise<void>;
}
