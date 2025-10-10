// models/pokemon.model.ts
import { Schema, model } from 'mongoose';
import { IPokemon } from '../types/pokemon.types';

const PokemonSchema = new Schema<IPokemon>(
	{
		pokedexId: {
			type: Number,
			required: true,
			unique: true,
		},
		name: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			enum: ['math', 'science', 'coding'],
			required: true,
		},
		rarity: {
			type: String,
			enum: ['common', 'rare', 'epic', 'legendary'],
			default: 'common',
		},
		hp: {
			type: Number,
			default: 100,
		},
		attack: {
			type: Number,
			default: 50,
		},
		defense: {
			type: Number,
			default: 50,
		},
		speed: {
			type: Number,
			default: 50,
		},
		evolvesFrom: {
			type: String,
		},
		evolvesTo: {
			type: String,
		},
		evolutionLevel: {
			type: Number,
			default: 0,
		},
		image: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		unlockCondition: {
			type: String,
			default: 'Complete quizzes',
		},
		subject: {
			type: String,
			required: true,
		},
		baseXP: {
			type: Number,
			default: 100,
		},
	},
	{
		timestamps: true,
	},
);

// Index for faster queries
PokemonSchema.index({ type: 1, rarity: 1 });
PokemonSchema.index({ pokedexId: 1 });

export const Pokemon = model<IPokemon>('Pokemon', PokemonSchema);
