// models/battle.model.ts
import { Schema, model } from 'mongoose';
import { IBattle } from '../types/battle.types';

const BattleSchema = new Schema<IBattle>(
	{
		roomId: {
			type: String,
			required: true,
			unique: true,
		},
		player1: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		player2: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		player1Pokemon: {
			type: Schema.Types.ObjectId,
			ref: 'UserPokemon',
			required: true,
		},
		player2Pokemon: {
			type: Schema.Types.ObjectId,
			ref: 'UserPokemon',
		},
		status: {
			type: String,
			enum: ['waiting', 'active', 'finished', 'cancelled'],
			default: 'waiting',
		},
		currentRound: {
			type: Number,
			default: 1,
		},
		totalRounds: {
			type: Number,
			default: 5,
		},
		player1HP: {
			type: Number,
			default: 100,
		},
		player2HP: {
			type: Number,
			default: 100,
		},
		player1Score: {
			type: Number,
			default: 0,
		},
		player2Score: {
			type: Number,
			default: 0,
		},
		questions: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Quiz',
			},
		],
		currentQuestion: {
			type: Schema.Types.ObjectId,
			ref: 'Quiz',
		},
		startedAt: {
			type: Date,
		},
		finishedAt: {
			type: Date,
		},
		timePerQuestion: {
			type: Number,
			default: 20,
		},
		winner: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		xpEarned: {
			type: Number,
			default: 0,
		},
		coinsEarned: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	},
);

// Indexes
BattleSchema.index({ roomId: 1 });
BattleSchema.index({ status: 1 });
BattleSchema.index({ player1: 1, player2: 1 });

export const Battle = model<IBattle>('Battle', BattleSchema);
