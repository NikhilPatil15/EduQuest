// models/leaderboard.model.ts
import { Schema, model } from 'mongoose';
import { ILeaderboard } from '../types/leaderboard.types';

const LeaderboardSchema = new Schema<ILeaderboard>(
	{
		type: {
			type: String,
			enum: ['global', 'subject', 'weekly', 'friends'],
			required: true,
		},
		subject: {
			type: String,
			enum: ['math', 'science', 'coding'],
		},
		timeframe: {
			type: String,
			enum: ['daily', 'weekly', 'monthly', 'all-time'],
		},
		rankings: [
			{
				userId: {
					type: Schema.Types.ObjectId,
					ref: 'User',
					required: true,
				},
				rank: {
					type: Number,
					required: true,
				},
				score: {
					type: Number,
					required: true,
				},
				xp: {
					type: Number,
					required: true,
				},
				level: {
					type: Number,
					required: true,
				},
				badges: {
					type: Number,
					default: 0,
				},
				pokemonCount: {
					type: Number,
					default: 0,
				},
				streak: {
					type: Number,
					default: 0,
				},
				accuracy: {
					type: Number,
					default: 0,
				},
			},
		],
		calculatedAt: {
			type: Date,
			default: Date.now,
		},
		expiresAt: {
			type: Date,
		},
	},
	{
		timestamps: true,
	},
);

// Index for efficient leaderboard queries
LeaderboardSchema.index({ type: 1, subject: 1, timeframe: 1 });
LeaderboardSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Leaderboard = model<ILeaderboard>('Leaderboard', LeaderboardSchema);
