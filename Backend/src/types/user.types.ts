import { Document } from 'mongoose';

export interface IUser extends Document {
	_id: string;
	userName: string;
	email: string;
	fullName: string;
	avatar: {
		public_Id: string;
		url: string;
	};

	password: string;
	refreshToken?: string;
	createdAt: Date;
	updatedAt: Date;
	isPasswordCorrect(password: string): Promise<boolean>;
	generateAccessToken(): Promise<String>;
	generateRefreshToken(): Promise<String>;
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
	friends: string[]; // User IDs
	friendRequests: string[]; // User IDs
	unlockedSubjects: string[]; // 'math', 'science', 'coding'
}
