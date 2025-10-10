// models/pokedexStats.model.ts
import { Schema, model } from 'mongoose';
import { IPokedexStats } from '../types/pokedex.types';

const PokedexStatsSchema = new Schema<IPokedexStats>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			unique: true,
		},
		totalPokemon: {
			type: Number,
			default: 0,
		},
		discoveredPokemon: {
			type: Number,
			default: 0,
		},
		caughtPokemon: {
			type: Number,
			default: 0,
		},
		completionPercentage: {
			type: Number,
			default: 0,
			min: 0,
			max: 100,
		},
		favoriteType: {
			type: String,
			default: 'normal',
		},
		rarestPokemon: {
			type: Schema.Types.ObjectId,
			ref: 'Pokemon',
		},
		researchMastery: {
			type: Number,
			default: 0,
			min: 0,
			max: 100,
		},
		lastUpdated: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
	},
);

export const PokedexStats = model<IPokedexStats>('PokedexStats', PokedexStatsSchema);
