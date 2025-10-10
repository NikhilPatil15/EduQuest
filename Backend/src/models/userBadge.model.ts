// models/userBadge.model.ts
import { Schema, model } from 'mongoose';
import { IUserBadge } from '../types/leaderboard.types';

const UserBadgeSchema = new Schema<IUserBadge>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		badgeId: {
			type: Schema.Types.ObjectId,
			ref: 'Badge',
			required: true,
		},
		earnedAt: {
			type: Date,
		},
		progress: {
			type: Number,
			default: 0,
		},
		isEarned: {
			type: Boolean,
			default: false,
		},
		shared: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	},
);

// Compound index for user badges
UserBadgeSchema.index({ userId: 1, badgeId: 1 }, { unique: true });
UserBadgeSchema.index({ userId: 1, isEarned: 1 });

export const UserBadge = model<IUserBadge>('UserBadge', UserBadgeSchema);
