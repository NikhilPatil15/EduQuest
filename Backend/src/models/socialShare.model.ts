// models/socialShare.model.ts
import { Schema, model } from 'mongoose';
import { ISocialShare } from '../types/leaderboard.types';

const SocialShareSchema = new Schema<ISocialShare>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		type: {
			type: String,
			enum: ['badge', 'victory', 'level_up', 'pokemon_catch'],
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		message: {
			type: String,
			required: true,
		},
		imageUrl: {
			type: String,
		},
		data: {
			type: Schema.Types.Mixed,
			default: {},
		},
		shareCount: {
			type: Number,
			default: 0,
		},
		lastSharedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
	},
);

// Index for user shares
SocialShareSchema.index({ userId: 1, type: 1 });

export const SocialShare = model<ISocialShare>('SocialShare', SocialShareSchema);
