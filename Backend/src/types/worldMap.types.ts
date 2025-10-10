// types/worldMap.types.ts - UPDATED
import { Document, ObjectId } from 'mongoose';

export interface IWorldMap extends Document {
	_id: string;
	name: string;
	description: string;
	theme: 'forest' | 'ocean' | 'mountain' | 'desert' | 'volcano' | 'sky';
	color: string;
	icon: string;
	order: number;
	isActive: boolean;
	requiredLevel: number;
	subjects: string[];
	createdAt: Date;
	updatedAt: Date;
}

export interface IUserWorldProgress extends Document {
	_id: string;
	userId: ObjectId;
	regionId: ObjectId;
	unlockedAt: Date;
	completedQuizzes: number;
	totalQuizzes: number;
	mastery: number; // 0-100%
	bestScore: number;
	averageTime: number;
	lastActivity: Date;
	isUnlocked: boolean;
	isCompleted: boolean;
	completedAt?: Date;
	createdAt: Date;
	updatedAt: Date;

	// ✅ ADDED: Instance methods
	calculateMastery(): number;
	updateProgress(score: number, timeSpent: number): Promise<void>;
}

export interface IMapRegion extends Document {
	_id: string;
	worldMapId: ObjectId;
	name: string;
	description: string;
	position: {
		x: number;
		y: number;
	};
	color: string;
	icon: string;
	requiredLevel: number;
	subject: string;
	totalQuizzes: number;
	difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
	pokemonType: string;
	rewards: {
		xp: number;
		coins: number;
		pokemonId?: ObjectId;
	};
	isActive: boolean;
	order: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface RegionUnlockRequest {
	regionId: string;
}

export interface UserMapProgress {
	worldMap: IWorldMap;
	regions: IMapRegion[];
	userProgress: IUserWorldProgress[];
	unlockedRegions: number;
	totalRegions: number;
	overallProgress: number;
}
