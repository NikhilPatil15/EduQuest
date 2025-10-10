// controllers/pokedex.controller.ts
import { asyncHandler } from '../utils/asyncHandler';
import { ErrorResponse } from '../utils/errorResponse';
import { SuccessResponse } from '../utils/successResponse';
import { PokedexService } from '../utils/services/pokedex.service';
import { EvolutionService } from '../utils/services/evolution.service';
import { Response } from 'express';

// In pokedex.controller.ts - ensure proper typing
const getPokedex = asyncHandler(async (req: any, res: Response) => {
	const {
		type,
		rarity,
		discovered,
		favorite,
		sortBy = 'pokedexNumber',
		sortOrder = 'asc',
	} = req.query;

	const filters = {
		type: type as string,
		rarity: rarity as string,
		discovered: discovered !== undefined ? discovered === 'true' : undefined,
		favorite: favorite !== undefined ? favorite === 'true' : undefined,
		sortBy: sortBy as string,
		sortOrder: sortOrder as string,
	};

	const pokedex = await PokedexService.getUserPokedex(req.user._id.toString(), filters);

	return res
		.status(200)
		.json(new SuccessResponse(200, { pokedex }, 'Pokédex fetched successfully'));
});

// Get Pokédex statistics
const getPokedexStats = asyncHandler(async (req: any, res: Response) => {
	const stats = await PokedexService.getPokedexStats(req.user._id.toString());

	return res
		.status(200)
		.json(new SuccessResponse(200, { stats }, 'Pokédex statistics fetched successfully'));
});

// Get Pokémon details
const getPokemonDetails = asyncHandler(async (req: any, res: Response) => {
	const { pokemonId } = req.params;

	const details = await PokedexService.getPokemonDetails(req.user._id.toString(), pokemonId);

	return res
		.status(200)
		.json(new SuccessResponse(200, { details }, 'Pokémon details fetched successfully'));
});

// Toggle favorite status
const toggleFavorite = asyncHandler(async (req: any, res: Response) => {
	const { pokemonId } = req.params;

	const isFavorite = await PokedexService.toggleFavorite(req.user._id.toString(), pokemonId);

	return res
		.status(200)
		.json(new SuccessResponse(200, { isFavorite }, 'Favorite status updated successfully'));
});

// Add notes to Pokédex entry
const addNotes = asyncHandler(async (req: any, res: Response) => {
	const { pokemonId } = req.params;
	const { notes } = req.body;

	if (!notes) {
		throw new ErrorResponse(400, 'Notes are required');
	}

	await PokedexService.addNotes(req.user._id.toString(), pokemonId, notes);

	return res.status(200).json(new SuccessResponse(200, {}, 'Notes added successfully'));
});

// Check evolution opportunities
const checkEvolutions = asyncHandler(async (req: any, res: Response) => {
	const opportunities = await EvolutionService.checkEvolutions(req.user._id.toString());

	return res
		.status(200)
		.json(
			new SuccessResponse(200, { opportunities }, 'Evolution opportunities fetched successfully'),
		);
});

// Evolve a Pokémon
const evolvePokemon = asyncHandler(async (req: any, res: Response) => {
	const { userPokemonId, evolutionId } = req.body;

	if (!userPokemonId || !evolutionId) {
		throw new ErrorResponse(400, 'User Pokémon ID and Evolution ID are required');
	}

	const result = await EvolutionService.evolvePokemon(
		req.user._id.toString(),
		userPokemonId,
		evolutionId,
	);

	return res.status(200).json(new SuccessResponse(200, { result }, 'Pokémon evolved successfully'));
});

// Get evolution history
const getEvolutionHistory = asyncHandler(async (req: any, res: Response) => {
	const { limit = 10 } = req.query;

	const history = await EvolutionService.getEvolutionHistory(
		req.user._id.toString(),
		parseInt(limit),
	);

	return res
		.status(200)
		.json(new SuccessResponse(200, { history }, 'Evolution history fetched successfully'));
});

// Process auto-evolutions
const processAutoEvolutions = asyncHandler(async (req: any, res: Response) => {
	const results = await EvolutionService.processAutoEvolutions(req.user._id.toString());

	return res
		.status(200)
		.json(new SuccessResponse(200, { results }, 'Auto-evolutions processed successfully'));
});

export {
	getPokedex,
	getPokedexStats,
	getPokemonDetails,
	toggleFavorite,
	addNotes,
	checkEvolutions,
	evolvePokemon,
	getEvolutionHistory,
	processAutoEvolutions,
};
