// types/userPokemon.types.ts - UPDATED
import { Document, ObjectId, Model } from 'mongoose';

export interface IUserPokemon extends Document {
	_id: string;
	userId: ObjectId;
	pokemonId: ObjectId;
	nickname?: string;
	level: number;
	currentHP: number;
	xp: number;
	battlesWon: number;
	isFavorite: boolean;
	caughtAt: Date;
	createdAt: Date;
	updatedAt: Date;
}

// Static methods for UserPokemon model
export interface IUserPokemonModel extends Model<IUserPokemon> {
	catchPokemon(userId: string, pokemonId: string): Promise<IUserPokemon>;
	getUserCollection(userId: string): Promise<IUserPokemon[]>;
	getUserPokemonCount(userId: string): Promise<number>;
}
