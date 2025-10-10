// models/adaptiveConfig.model.ts
import { Schema, model } from 'mongoose';
import { IAdaptiveConfig } from '../types/adaptive.types';

const AdaptiveConfigSchema = new Schema<IAdaptiveConfig>(
	{
		subject: {
			type: String,
			required: true,
			enum: ['math', 'science', 'coding'],
		},
		difficulty: {
			type: String,
			required: true,
			enum: ['beginner', 'intermediate', 'advanced', 'expert'],
		},
		accuracyThreshold: {
			type: Number,
			default: 70, // 70% accuracy required
		},
		streakRequired: {
			type: Number,
			default: 3, // 3 correct in a row
		},
		timeThreshold: {
			type: Number,
			default: 20, // 20 seconds per question max
		},
		questionCount: {
			type: Number,
			default: 8,
		},
		xpMultiplier: {
			type: Number,
			default: 1.0,
		},
	},
	{
		timestamps: true,
	},
);

// Compound index
AdaptiveConfigSchema.index({ subject: 1, difficulty: 1 }, { unique: true });

export const AdaptiveConfig = model<IAdaptiveConfig>('AdaptiveConfig', AdaptiveConfigSchema);
