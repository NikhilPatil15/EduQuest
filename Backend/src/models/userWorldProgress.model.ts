// models/userWorldProgress.model.ts - UPDATED
import { Schema, model } from 'mongoose';
import { IUserWorldProgress } from '../types/worldMap.types';

const UserWorldProgressSchema = new Schema<IUserWorldProgress>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		regionId: {
			type: Schema.Types.ObjectId,
			ref: 'MapRegion',
			required: true,
		},
		unlockedAt: {
			type: Date,
			default: Date.now,
		},
		completedQuizzes: {
			type: Number,
			default: 0,
		},
		totalQuizzes: {
			type: Number,
			default: 0,
		},
		mastery: {
			type: Number,
			default: 0,
			min: 0,
			max: 100,
		},
		bestScore: {
			type: Number,
			default: 0,
		},
		averageTime: {
			type: Number,
			default: 0,
		},
		lastActivity: {
			type: Date,
			default: Date.now,
		},
		isUnlocked: {
			type: Boolean,
			default: false,
		},
		isCompleted: {
			type: Boolean,
			default: false,
		},
		completedAt: {
			type: Date,
		},
	},
	{
		timestamps: true,
	},
);

// Compound index for user progress
UserWorldProgressSchema.index({ userId: 1, regionId: 1 }, { unique: true });
UserWorldProgressSchema.index({ userId: 1, isCompleted: 1 });

// ✅ FIXED: Calculate mastery percentage - INSTANCE METHOD
UserWorldProgressSchema.methods.calculateMastery = function (): number {
	if (this.totalQuizzes === 0) return 0;
	return (this.completedQuizzes / this.totalQuizzes) * 100;
};

// ✅ ADDED: Update progress with quiz results
UserWorldProgressSchema.methods.updateProgress = async function (
	score: number,
	timeSpent: number,
): Promise<void> {
	this.completedQuizzes += 1;
	this.lastActivity = new Date();

	if (score > this.bestScore) {
		this.bestScore = score;
	}

	// Update average time
	const totalTime = this.averageTime * (this.completedQuizzes - 1) + timeSpent;
	this.averageTime = totalTime / this.completedQuizzes;

	// Calculate mastery
	this.mastery = this.calculateMastery();

	// Check if region is completed
	if (this.completedQuizzes >= this.totalQuizzes && !this.isCompleted) {
		this.isCompleted = true;
		this.completedAt = new Date();
	}

	await this.save();
};

export const UserWorldProgress = model<IUserWorldProgress>(
	'UserWorldProgress',
	UserWorldProgressSchema,
);
