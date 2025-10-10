// models/battleRound.model.ts
import { Schema, model } from 'mongoose';
import { IBattleRound } from '../types/battleRound.types';

const BattleRoundSchema = new Schema<IBattleRound>(
	{
		battleId: {
			type: Schema.Types.ObjectId,
			ref: 'Battle',
			required: true,
		},
		roundNumber: {
			type: Number,
			required: true,
		},
		questionId: {
			type: Schema.Types.ObjectId,
			ref: 'Quiz',
			required: true,
		},
		player1Answer: {
			type: String,
		},
		player2Answer: {
			type: String,
		},
		player1Time: {
			type: Number,
		},
		player2Time: {
			type: Number,
		},
		player1Correct: {
			type: Boolean,
		},
		player2Correct: {
			type: Boolean,
		},
		damageDealt: {
			type: Number,
			default: 0,
		},
		roundWinner: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{
		timestamps: true,
	},
);

// Index for faster battle history queries
BattleRoundSchema.index({ battleId: 1, roundNumber: 1 });

export const BattleRound = model<IBattleRound>('BattleRound', BattleRoundSchema);
