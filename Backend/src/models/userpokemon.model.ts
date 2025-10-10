// models/userPokemon.model.ts - UPDATED TO MATCH YOUR TYPES
import { Schema, model } from 'mongoose';
import { IUserPokemon, IUserPokemonModel } from '../types/userpokemon.types';

const UserPokemonSchema = new Schema<IUserPokemon, IUserPokemonModel>(
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

// Index for user's pokemon collection
UserPokemonSchema.index({ userId: 1, pokemonId: 1 }, { unique: true });

// ✅ ADDED: Static method to catch a Pokemon
UserPokemonSchema.statics.catchPokemon = async function (
	userId: string,
	pokemonId: string,
): Promise<IUserPokemon> {
	// Check if user already has this Pokemon
	const existingPokemon = await this.findOne({ userId, pokemonId });

	if (existingPokemon) {
		// If user already has this Pokemon, increase XP and level up if needed
		existingPokemon.xp += 50;

		// Level up logic: every 100 XP = 1 level
		const newLevel = Math.floor(existingPokemon.xp / 100) + 1;
		if (newLevel > existingPokemon.level) {
			existingPokemon.level = newLevel;
			existingPokemon.currentHP = 100; // Heal when leveling up
		}

		await existingPokemon.save();
		return existingPokemon;
	}

	// Create new Pokemon for user
	const userPokemon = await this.create({
		userId,
		pokemonId,
		level: 1,
		currentHP: 100,
		xp: 100, // Base XP for new catch
		battlesWon: 0,
		isFavorite: false,
		caughtAt: new Date(),
	});

	return userPokemon;
};

// ✅ ADDED: Static method to get user's Pokemon collection
UserPokemonSchema.statics.getUserCollection = async function (
	userId: string,
): Promise<IUserPokemon[]> {
	return this.find({ userId }).populate('pokemonId').sort({ caughtAt: -1 });
};

// ✅ ADDED: Static method to get user's Pokemon count
UserPokemonSchema.statics.getUserPokemonCount = async function (userId: string): Promise<number> {
	return this.countDocuments({ userId });
};

// ✅ ADDED: Instance method to add XP
UserPokemonSchema.methods.addXP = async function (xpAmount: number): Promise<void> {
	this.xp += xpAmount;
	const newLevel = Math.floor(this.xp / 100) + 1;

	if (newLevel > this.level) {
		this.level = newLevel;
		this.currentHP = 100; // Full heal on level up
	}

	await this.save();
};

// ✅ ADDED: Instance method to update battle stats
UserPokemonSchema.methods.updateBattleStats = async function (won: boolean): Promise<void> {
	if (won) {
		this.battlesWon += 1;
		await this.addXP(25); // XP for winning
	} else {
		await this.addXP(10); // XP for participating
	}

	await this.save();
};

// ✅ ADDED: Instance method to heal Pokemon
UserPokemonSchema.methods.heal = async function (): Promise<void> {
	this.currentHP = 100;
	await this.save();
};

// ✅ ADDED: Instance method to take damage
UserPokemonSchema.methods.takeDamage = async function (damage: number): Promise<boolean> {
	this.currentHP = Math.max(0, this.currentHP - damage);
	await this.save();
	return this.currentHP > 0; // Return true if still alive
};
// Add to models/userPokemon.model.ts - ENHANCE WITH EVOLUTION SUPPORT
UserPokemonSchema.methods.levelUp = async function (): Promise<boolean> {
	const oldLevel = this.level;
	const newLevel = Math.floor(this.experience / 100) + 1;

	if (newLevel > this.level) {
		this.level = newLevel;
		this.currentHP = 100; // Full heal on level up
		await this.save();

		// Check for auto-evolution
		const { EvolutionService } = await import('../utils/services/evolution.service');
		EvolutionService.autoEvolveByLevel(this.userId.toString(), this._id.toString()).catch(
			console.error,
		);

		return true;
	}

	return false;
};

// Update the addExperience method to trigger level ups
UserPokemonSchema.methods.addExperience = async function (exp: number): Promise<boolean> {
	this.experience += exp;
	return await this.levelUp();
};

export const UserPokemon = model<IUserPokemon, IUserPokemonModel>('UserPokemon', UserPokemonSchema);
