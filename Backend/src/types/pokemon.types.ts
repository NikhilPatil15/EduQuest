// types/pokemon.types.ts
export interface IPokemon {
	_id: string;
	pokedexId: number;
	name: string;
	type: 'math' | 'science' | 'coding';
	rarity: 'common' | 'rare' | 'epic' | 'legendary';
	hp: number;
	attack: number;
	defense: number;
	speed: number;
	evolvesFrom?: string;
	evolvesTo?: string;
	evolutionLevel: number;
	image: string;
	description: string;
	unlockCondition: string;
	subject: string;
	baseXP: number;
	pokedexNumber: number;
	createdAt: Date;
	updatedAt: Date;
}
