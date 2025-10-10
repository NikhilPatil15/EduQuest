// models/dailyQuest.model.ts
import { Schema, model } from 'mongoose';
import { IDailyQuest } from '../types/feedback.types';

const DailyQuestSchema = new Schema<IDailyQuest>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			enum: ['quiz_completion', 'streak', 'subject_mastery', 'pokemon_capture', 'battle_victory'],
			required: true,
		},
		goal: {
			type: Number,
			required: true,
		},
		progress: {
			type: Number,
			default: 0,
		},
		reward: {
			xp: {
				type: Number,
				required: true,
			},
			coins: {
				type: Number,
				required: true,
			},
			pokemonId: {
				type: Schema.Types.ObjectId,
				ref: 'Pokemon',
			},
		},
		status: {
			type: String,
			enum: ['active', 'completed', 'claimed'],
			default: 'active',
		},
		expiresAt: {
			type: Date,
			required: true,
		},
		completedAt: {
			type: Date,
		},
		claimedAt: {
			type: Date,
		},
	},
	{
		timestamps: true,
	},
);

// Index for active quests
DailyQuestSchema.index({ userId: 1, status: 1 });
DailyQuestSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-delete expired quests

export const DailyQuest = model<IDailyQuest>('DailyQuest', DailyQuestSchema);
