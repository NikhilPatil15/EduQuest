// types/adaptive.types.ts - UPDATE EXISTING
import { Document, ObjectId } from 'mongoose';
import { DifficultyLevel } from './quiz.types'; // Import from quiz types

export interface IUserPerformance extends Document {
	_id: string;
	userId: ObjectId;
	subject: 'math' | 'science' | 'coding';
	difficultyLevel: DifficultyLevel; // Use the same type
	correctAnswers: number;
	totalQuestions: number;
	streak: number;
	averageTimePerQuestion: number;
	accuracy: number; // Virtual field
	lastPerformanceUpdate: Date;
	createdAt: Date;
	updatedAt: Date;
}

export interface IAdaptiveConfig extends Document {
	_id: string;
	subject: string;
	difficulty: DifficultyLevel; // Use the same type
	accuracyThreshold: number;
	streakRequired: number;
	timeThreshold: number;
	questionCount: number;
	xpMultiplier: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface AdaptiveQuizRequest {
	subject: 'math' | 'science' | 'coding';
	preferredDifficulty?: DifficultyLevel;
	questionCount?: number;
}

export interface PerformanceUpdate {
	subject: string;
	correctAnswers: number;
	totalQuestions: number;
	averageTime: number;
	streak: number;
}
