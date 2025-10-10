// models/evolutionHistory.model.ts
import { Schema, model } from 'mongoose';
import { IEvolutionHistory } from '../types/pokedex.types';

const EvolutionHistorySchema = new Schema<IEvolutionHistory>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		basePokemonId: {
			type: Schema.Types.ObjectId,
			ref: 'Pokemon',
			required: true,
		},
		evolvedPokemonId: {
			type: Schema.Types.ObjectId,
			ref: 'Pokemon',
			required: true,
		},
		evolutionId: {
			type: Schema.Types.ObjectId,
			ref: 'Evolution',
			required: true,
		},
		evolvedAt: {
			type: Date,
			default: Date.now,
		},
		trigger: {
			type: String,
			required: true,
		},
		triggerValue: {
			type: Number,
			required: true,
		},
		userPokemonId: {
			type: Schema.Types.ObjectId,
			ref: 'UserPokemon',
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

// Index for user's evolution history
EvolutionHistorySchema.index({ userId: 1, evolvedAt: -1 });
EvolutionHistorySchema.index({ userPokemonId: 1 });

export const EvolutionHistory = model<IEvolutionHistory>(
	'EvolutionHistory',
	EvolutionHistorySchema,
);
