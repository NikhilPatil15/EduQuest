// types/feedback.types.ts
import { Document, ObjectId } from 'mongoose';

export interface IDailyQuest extends Document {
	_id: string;
	userId: ObjectId;
	title: string;
	description: string;
	type: 'quiz_completion' | 'streak' | 'subject_mastery' | 'pokemon_capture' | 'battle_victory';
	goal: number;
	progress: number;
	reward: {
		xp: number;
		coins: number;
		pokemonId?: ObjectId;
	};
	status: 'active' | 'completed' | 'claimed';
	expiresAt: Date;
	completedAt?: Date;
	claimedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}

export interface IPerformanceInsight extends Document {
	_id: string;
	userId: ObjectId;
	type: 'streak_alert' | 'level_up' | 'subject_improvement' | 'performance_dip' | 'milestone';
	title: string;
	message: string;
	data: any; // Flexible data field for insights
	isRead: boolean;
	priority: 'low' | 'medium' | 'high';
	expiresAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}

export interface INotification extends Document {
	_id: string;
	userId: ObjectId;
	type: 'quest' | 'battle' | 'social' | 'system' | 'reward';
	title: string;
	message: string;
	actionUrl?: string;
	imageUrl?: string;
	isRead: boolean;
	createdAt: Date;
}

export interface IUserStreak extends Document {
	_id: string;
	userId: ObjectId;
	currentStreak: number;
	longestStreak: number;
	lastActivityDate: Date;
	totalDaysActive: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface QuestProgressUpdate {
	questId: string;
	progress: number;
}

export interface InsightData {
	subject?: string;
	oldLevel?: string;
	newLevel?: string;
	streak?: number;
	accuracy?: number;
	milestone?: string;
}
