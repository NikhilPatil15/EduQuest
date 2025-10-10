// models/pokedexEntry.model.ts
import { Schema, model } from 'mongoose';
import { IPokedexEntry } from '../types/pokedex.types';

const PokedexEntrySchema = new Schema<IPokedexEntry>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		pokemonId: {
			type: Schema.Types.ObjectId,
			ref: 'Pokemon',
			required: true,
		},
		discovered: {
			type: Boolean,
			default: false,
		},
		discoveredAt: {
			type: Date,
		},
		timesEncountered: {
			type: Number,
			default: 0,
		},
		timesCaught: {
			type: Number,
			default: 0,
		},
		firstCaughtAt: {
			type: Date,
		},
		lastEncounteredAt: {
			type: Date,
		},
		isFavorite: {
			type: Boolean,
			default: false,
		},
		researchProgress: {
			type: Number,
			default: 0,
			min: 0,
			max: 100,
		},
		notes: {
			type: String,
		},
	},
	{
		timestamps: true,
	},
);

// Compound index for user's Pokédex
PokedexEntrySchema.index({ userId: 1, pokemonId: 1 }, { unique: true });
PokedexEntrySchema.index({ userId: 1, discovered: 1 });
PokedexEntrySchema.index({ userId: 1, isFavorite: 1 });

export const PokedexEntry = model<IPokedexEntry>('PokedexEntry', PokedexEntrySchema);
