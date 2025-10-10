// models/evolution.model.ts - SIMPLIFIED
import { Schema, model } from 'mongoose';
import { IEvolution } from '../types/pokedex.types';

const EvolutionSchema = new Schema<IEvolution>(
	{
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
		trigger: {
			type: String,
			enum: ['level', 'quiz_mastery', 'milestone', 'friendship', 'item'],
			required: true,
		},
		triggerValue: {
			type: Number,
			required: true,
		},
		description: {
			type: String,
			required: true,
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

EvolutionSchema.index({ basePokemonId: 1, isActive: 1 });

export const Evolution = model<IEvolution>('Evolution', EvolutionSchema);
