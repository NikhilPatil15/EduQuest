// models/badge.model.ts
import { Schema, model } from 'mongoose';
import { IBadge } from '../types/leaderboard.types';

const BadgeSchema = new Schema<IBadge>(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		icon: {
			type: String,
			required: true,
		},
		color: {
			type: String,
			required: true,
		},
		rarity: {
			type: String,
			enum: ['common', 'rare', 'epic', 'legendary'],
			default: 'common',
		},
		category: {
			type: String,
			enum: ['quiz', 'battle', 'collection', 'streak', 'social'],
			required: true,
		},
		requirement: {
			type: {
				type: String,
				required: true,
			},
			target: {
				type: Number,
				required: true,
			},
			subject: {
				type: String,
				enum: ['math', 'science', 'coding'],
			},
		},
		rewards: {
			xp: {
				type: Number,
				default: 0,
			},
			coins: {
				type: Number,
				default: 0,
			},
		},
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	},
);

// Index for active badges by category
BadgeSchema.index({ isActive: 1, category: 1 });

export const Badge = model<IBadge>('Badge', BadgeSchema);
