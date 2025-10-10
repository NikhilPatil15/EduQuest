// types/leaderboard.types.ts
import { Document, ObjectId } from 'mongoose';

export interface ILeaderboard extends Document {
	_id: string;
	type: 'global' | 'subject' | 'weekly' | 'friends';
	subject?: string; // For subject-specific leaderboards
	timeframe?: 'daily' | 'weekly' | 'monthly' | 'all-time';
	rankings: {
		userId: ObjectId;
		rank: number;
		score: number;
		xp: number;
		level: number;
		badges: number;
		pokemonCount: number;
		streak: number;
		accuracy: number;
	}[];
	calculatedAt: Date;
	expiresAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}

export interface IBadge extends Document {
	_id: string;
	name: string;
	description: string;
	icon: string;
	color: string;
	rarity: 'common' | 'rare' | 'epic' | 'legendary';
	category: 'quiz' | 'battle' | 'collection' | 'streak' | 'social';
	requirement: {
		type: string;
		target: number;
		subject?: string;
	};
	rewards: {
		xp: number;
		coins: number;
	};
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface IUserBadge extends Document {
	_id: string;
	userId: ObjectId;
	badgeId: ObjectId;
	earnedAt: Date;
	progress: number;
	isEarned: boolean;
	shared: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface IFriend extends Document {
	_id: string;
	userId: ObjectId;
	friendId: ObjectId;
	status: 'pending' | 'accepted' | 'blocked';
	requestedAt: Date;
	acceptedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}

export interface ISocialShare extends Document {
	_id: string;
	userId: ObjectId;
	type: 'badge' | 'victory' | 'level_up' | 'pokemon_catch';
	title: string;
	message: string;
	imageUrl?: string;
	data: any;
	shareCount: number;
	lastSharedAt: Date;
	createdAt: Date;
	updatedAt: Date;
}

export interface LeaderboardFilters {
	type: 'global' | 'subject' | 'weekly' | 'friends';
	subject?: string;
	timeframe?: string;
	limit?: number;
	offset?: number;
}

export interface FriendRequest {
	friendUsername: string;
}
