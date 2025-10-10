import { ObjectId } from 'mongoose';

// types/userPokemon.types.ts
export interface IUserPokemon {
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
