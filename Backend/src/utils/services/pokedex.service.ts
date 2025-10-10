// services/pokedex.service.ts
import { PokedexEntry } from '../../models/pokedexEntry.model';
import { PokedexStats } from '../../models/pokedexStats.model';
import { Pokemon } from '../../models/pokemon.model';
import { UserPokemon } from '../../models/userpokemon.model';
import { EvolutionService } from './evolution.service';

export class PokedexService {
	// Initialize Pokédex for new user
	static async initializeUserPokedex(userId: string): Promise<void> {
		const allPokemon = await Pokemon.find({ isActive: true });

		const pokedexEntries = allPokemon.map((pokemon) => ({
			userId,
			pokemonId: pokemon._id,
			discovered: false,
			timesEncountered: 0,
			timesCaught: 0,
			researchProgress: 0,
		}));

		await PokedexEntry.insertMany(pokedexEntries);

		// Initialize stats
		await PokedexStats.create({
			userId,
			totalPokemon: allPokemon.length,
			discoveredPokemon: 0,
			caughtPokemon: 0,
			completionPercentage: 0,
		});
	}

	// Record Pokémon encounter (when seen in quizzes)
	static async recordEncounter(userId: string, pokemonId: string): Promise<void> {
		await PokedexEntry.findOneAndUpdate(
			{ userId, pokemonId },
			{
				$inc: { timesEncountered: 1 },
				$set: {
					discovered: true,
					lastEncounteredAt: new Date(),
					discoveredAt: { $ifNull: ['$discoveredAt', new Date()] },
				},
			},
			{ upsert: true },
		);

		await this.updatePokedexStats(userId);
	}

	// Record Pokémon catch
	static async recordCatch(userId: string, pokemonId: string): Promise<void> {
		await PokedexEntry.findOneAndUpdate(
			{ userId, pokemonId },
			{
				$inc: { timesCaught: 1 },
				$set: {
					discovered: true,
					lastEncounteredAt: new Date(),
					discoveredAt: { $ifNull: ['$discoveredAt', new Date()] },
					firstCaughtAt: { $ifNull: ['$firstCaughtAt', new Date()] },
				},
			},
			{ upsert: true },
		);

		await this.updatePokedexStats(userId);
	}

	// Update research progress (based on quiz performance)
	static async updateResearchProgress(
		userId: string,
		pokemonId: string,
		progress: number,
	): Promise<void> {
		await PokedexEntry.findOneAndUpdate(
			{ userId, pokemonId },
			{
				$max: { researchProgress: progress }, // Only increase progress
				$set: { discovered: true },
			},
		);

		await this.updatePokedexStats(userId);
	}

	// Toggle favorite status
	static async toggleFavorite(userId: string, pokemonId: string): Promise<boolean> {
		const entry = await PokedexEntry.findOne({ userId, pokemonId });
		if (!entry) return false;

		entry.isFavorite = !entry.isFavorite;
		await entry.save();
		await this.updatePokedexStats(userId);

		return entry.isFavorite;
	}

	// Add notes to Pokédex entry
	static async addNotes(userId: string, pokemonId: string, notes: string): Promise<void> {
		await PokedexEntry.findOneAndUpdate({ userId, pokemonId }, { $set: { notes } });
	}

	// Update Pokédex statistics
	private static async updatePokedexStats(userId: string): Promise<void> {
		const totalPokemon = await Pokemon.countDocuments({ isActive: true });
		const discoveredPokemon = await PokedexEntry.countDocuments({
			userId,
			discovered: true,
		});
		const caughtPokemon = await UserPokemon.countDocuments({ userId });

		const completionPercentage = totalPokemon > 0 ? (discoveredPokemon / totalPokemon) * 100 : 0;

		// Find favorite type
		const favoriteTypeAgg = await PokedexEntry.aggregate([
			{ $match: { userId, isFavorite: true } },
			{
				$lookup: {
					from: 'pokemons',
					localField: 'pokemonId',
					foreignField: '_id',
					as: 'pokemon',
				},
			},
			{ $unwind: '$pokemon' },
			{
				$group: {
					_id: '$pokemon.type',
					count: { $sum: 1 },
				},
			},
			{ $sort: { count: -1 } },
			{ $limit: 1 },
		]);

		const favoriteType = favoriteTypeAgg.length > 0 ? favoriteTypeAgg[0]._id : 'normal';

		// Find rarest Pokémon
		const rarestPokemonAgg = await PokedexEntry.aggregate([
			{ $match: { userId, discovered: true } },
			{
				$lookup: {
					from: 'pokemons',
					localField: 'pokemonId',
					foreignField: '_id',
					as: 'pokemon',
				},
			},
			{ $unwind: '$pokemon' },
			{
				$addFields: {
					rarityValue: {
						$switch: {
							branches: [
								{ case: { $eq: ['$pokemon.rarity', 'legendary'] }, then: 4 },
								{ case: { $eq: ['$pokemon.rarity', 'epic'] }, then: 3 },
								{ case: { $eq: ['$pokemon.rarity', 'rare'] }, then: 2 },
								{ case: { $eq: ['$pokemon.rarity', 'common'] }, then: 1 },
							],
							default: 0,
						},
					},
				},
			},
			{ $sort: { rarityValue: -1 } },
			{ $limit: 1 },
		]);

		const rarestPokemon = rarestPokemonAgg.length > 0 ? rarestPokemonAgg[0].pokemon._id : null;

		// Calculate research mastery (average research progress)
		const researchMasteryAgg = await PokedexEntry.aggregate([
			{ $match: { userId, discovered: true } },
			{ $group: { _id: null, avgProgress: { $avg: '$researchProgress' } } },
		]);

		const researchMastery = researchMasteryAgg.length > 0 ? researchMasteryAgg[0].avgProgress : 0;

		await PokedexStats.findOneAndUpdate(
			{ userId },
			{
				totalPokemon,
				discoveredPokemon,
				caughtPokemon,
				completionPercentage,
				favoriteType,
				rarestPokemon,
				researchMastery,
				lastUpdated: new Date(),
			},
			{ upsert: true },
		);
	}

	private static getSortCriteria(sortBy: string = 'pokedexNumber', sortOrder: string = 'asc') {
		const order = sortOrder === 'desc' ? -1 : 1;

		switch (sortBy) {
			case 'name':
				return { 'pokemonId.name': order } as any;
			case 'type':
				return { 'pokemonId.type': order, 'pokemonId.name': 1 } as any;
			case 'rarity':
				return { 'pokemonId.rarity': order, 'pokemonId.name': 1 } as any;
			case 'discoveredAt':
				return { discoveredAt: order, 'pokemonId.name': 1 } as any;
			default: // pokedexNumber
				return { 'pokemonId.pokedexNumber': order } as any;
		}
	}

	// Alternative: Use string-based sorting (more reliable)
	private static getSortCriteriaString(
		sortBy: string = 'pokedexNumber',
		sortOrder: string = 'asc',
	): string {
		const order = sortOrder === 'desc' ? -1 : 1;

		switch (sortBy) {
			case 'name':
				return `pokemonId.name`;
			case 'type':
				return `pokemonId.type pokemonId.name`;
			case 'rarity':
				return `pokemonId.rarity pokemonId.name`;
			case 'discoveredAt':
				return `discoveredAt pokemonId.name`;
			default: // pokedexNumber
				return `pokemonId.pokedexNumber`;
		}
	}

	// Updated getUserPokedex method with proper sorting
	static async getUserPokedex(userId: string, filters: any = {}) {
		const query: any = { userId };

		// Apply filters (same as before)
		if (filters.type) {
			const pokemonOfType = await Pokemon.find({ type: filters.type }).select('_id');
			query.pokemonId = { $in: pokemonOfType.map((p) => p._id) };
		}

		if (filters.rarity) {
			const pokemonOfRarity = await Pokemon.find({ rarity: filters.rarity }).select('_id');
			query.pokemonId = query.pokemonId
				? { $and: [query.pokemonId, { $in: pokemonOfRarity.map((p) => p._id) }] }
				: { $in: pokemonOfRarity.map((p) => p._id) };
		}

		if (filters.discovered !== undefined) {
			query.discovered = filters.discovered;
		}

		if (filters.favorite !== undefined) {
			query.isFavorite = filters.favorite;
		}

		// Get sort criteria
		const sortCriteria = this.getSortCriteria(filters.sortBy, filters.sortOrder);

		// Get Pokédex entries with Pokémon details
		const pokedexEntries = await PokedexEntry.find(query).populate('pokemonId').sort(sortCriteria);

		// Check caught status
		const userPokemon = await UserPokemon.find({ userId });
		const caughtPokemonIds = new Set(userPokemon.map((up) => up.pokemonId.toString()));

		const enhancedEntries = pokedexEntries.map((entry) => {
			const pokemon = entry.pokemonId as any;
			const isCaught = caughtPokemonIds.has(pokemon._id.toString());

			return {
				...entry.toObject(),
				isCaught,
				pokemon: {
					...pokemon.toObject(),
					isCaught,
				},
			};
		});

		return enhancedEntries;
	}

	// Get Pokédex statistics
	static async getPokedexStats(userId: string) {
		let stats = await PokedexStats.findOne({ userId });

		if (!stats) {
			await this.initializeUserPokedex(userId);
			stats = await PokedexStats.findOne({ userId });
		}

		return stats;
	}

	// Get Pokémon details for Pokédex
	static async getPokemonDetails(userId: string, pokemonId: string) {
		const pokedexEntry = await PokedexEntry.findOne({ userId, pokemonId }).populate('pokemonId');

		if (!pokedexEntry) {
			throw new Error('Pokémon not found in Pokédex');
		}

		const isCaught = await UserPokemon.exists({ userId, pokemonId });
		const evolutionData = await EvolutionService.getEvolutions(pokemonId);

		return {
			...pokedexEntry.toObject(),
			isCaught: !!isCaught,
			evolutionData,
		};
	}
}
