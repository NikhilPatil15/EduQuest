// models/userPokemon.model.ts
import { Schema, model } from 'mongoose';
import { IUserPokemon } from '../types/userpokemon.types';

const UserPokemonSchema = new Schema<IUserPokemon>(
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
		nickname: {
			type: String,
		},
		level: {
			type: Number,
			default: 1,
		},
		currentHP: {
			type: Number,
			default: 100,
		},
		xp: {
			type: Number,
			default: 0,
		},
		battlesWon: {
			type: Number,
			default: 0,
		},
		isFavorite: {
			type: Boolean,
			default: false,
		},
		caughtAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
	},
);

// Compound index for faster queries
UserPokemonSchema.index({ userId: 1, pokemonId: 1 });
UserPokemonSchema.index({ userId: 1, isFavorite: 1 });

// Method to check if Pokemon can evolve
UserPokemonSchema.methods.canEvolve = function (pokemonData: any): boolean {
	return this.level >= pokemonData.evolutionLevel && pokemonData.evolvesTo;
};

// Method to add XP and check for level up
UserPokemonSchema.methods.addXP = async function (xpAmount: number) {
	this.xp += xpAmount;

	// Simple level up: 100 XP per level
	const xpNeededForNextLevel = this.level * 100;
	if (this.xp >= xpNeededForNextLevel) {
		this.level += 1;
		this.xp -= xpNeededForNextLevel;

		// Increase stats on level up
		this.currentHP += 10;
	}

	await this.save();
	return { newLevel: this.level, newXP: this.xp };
};

export const UserPokemon = model<IUserPokemon>('UserPokemon', UserPokemonSchema);
