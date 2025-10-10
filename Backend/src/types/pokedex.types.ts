// types/pokedex.types.ts
import { Document, ObjectId } from 'mongoose';

export interface IPokedexEntry extends Document {
	_id: string;
	userId: ObjectId;
	pokemonId: ObjectId;
	discovered: boolean;
	discoveredAt?: Date;
	timesEncountered: number;
	timesCaught: number;
	firstCaughtAt?: Date;
	lastEncounteredAt?: Date;
	isFavorite: boolean;
	researchProgress: number; // 0-100%
	notes?: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface IEvolution extends Document {
	_id: string;
	basePokemonId: ObjectId;
	evolvedPokemonId: ObjectId;
	trigger: 'level' | 'item' | 'friendship' | 'milestone' | 'quiz_mastery';
	triggerValue: number; // Level number, milestone ID, etc.
	itemRequired?: string;
	description: string;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface IEvolutionHistory extends Document {
	_id: string;
	userId: ObjectId;
	basePokemonId: ObjectId;
	evolvedPokemonId: ObjectId;
	evolutionId: ObjectId;
	evolvedAt: Date;
	trigger: string;
	triggerValue: number;
	userPokemonId: ObjectId; // Reference to the specific Pokémon that evolved
	createdAt: Date;
	updatedAt: Date;
}

export interface IPokedexStats extends Document {
	_id: string;
	userId: ObjectId;
	totalPokemon: number;
	discoveredPokemon: number;
	caughtPokemon: number;
	completionPercentage: number;
	favoriteType: string;
	rarestPokemon: ObjectId;
	researchMastery: number;
	lastUpdated: Date;
	createdAt: Date;
	updatedAt: Date;
}

export interface EvolutionTrigger {
	type: 'level' | 'milestone' | 'quiz_mastery' | 'item';
	value: number;
	item?: string;
}

export interface PokedexFilters {
	type?: string;
	rarity?: string;
	discovered?: boolean;
	caught?: boolean;
	favorite?: boolean;
	sortBy?: 'pokedexNumber' | 'name' | 'type' | 'rarity' | 'discoveredAt';
	sortOrder?: 'asc' | 'desc';
}
