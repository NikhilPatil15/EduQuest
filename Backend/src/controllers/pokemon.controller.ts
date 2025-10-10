// controllers/pokemon.controller.ts
import { asyncHandler } from '../utils/asyncHandler';
import { ErrorResponse } from '../utils/errorResponse';
import { SuccessResponse } from '../utils/successResponse';
import { Pokemon } from '../models/pokemon.model';
import { UserPokemon } from '../models/userpokemon.model';
import { User } from '../models/user.model';
import { Response } from 'express';

// Get all available Pokemon
const getAllPokemon = asyncHandler(async (req: any, res: Response) => {
	const { type, rarity, page = 1, limit = 20 } = req.query;

	const filter: any = {};
	if (type) filter.type = type;
	if (rarity) filter.rarity = rarity;

	const pokemon = await Pokemon.find(filter)
		.sort({ pokedexId: 1 })
		.limit(limit * 1)
		.skip((page - 1) * limit);

	const total = await Pokemon.countDocuments(filter);

	return res.status(200).json(
		new SuccessResponse(
			200,
			{
				pokemon,
				totalPages: Math.ceil(total / limit),
				currentPage: page,
				total,
			},
			'Pokemon fetched successfully',
		),
	);
});

// Get user's Pokemon collection
const getUserPokemon = asyncHandler(async (req: any, res: Response) => {
	const { page = 1, limit = 20, favorite } = req.query;

	const filter: any = { userId: req.user._id };
	if (favorite === 'true') filter.isFavorite = true;

	const userPokemon = await UserPokemon.find(filter)
		.populate('pokemonId')
		.sort({ isFavorite: -1, caughtAt: -1 })
		.limit(limit * 1)
		.skip((page - 1) * limit);

	const total = await UserPokemon.countDocuments(filter);

	return res.status(200).json(
		new SuccessResponse(
			200,
			{
				userPokemon,
				totalPages: Math.ceil(total / limit),
				currentPage: page,
				total,
			},
			'User Pokemon collection fetched successfully',
		),
	);
});

// Catch a new Pokemon (after quiz completion)
const catchPokemon = asyncHandler(async (req: any, res: Response) => {
	const { pokemonId, nickname } = req.body;

	// Check if Pokemon exists
	const pokemon = await Pokemon.findById(pokemonId);
	if (!pokemon) {
		throw new ErrorResponse(404, 'Pokemon not found');
	}

	// Check if user already has this Pokemon
	const existingPokemon = await UserPokemon.findOne({
		userId: req.user._id,
		pokemonId,
	});

	if (existingPokemon) {
		throw new ErrorResponse(400, 'You already have this Pokemon');
	}

	// Check if user meets unlock conditions
	const user: any = await User.findById(req.user._id);
	if (!user.canUnlockSubject(pokemon.type)) {
		throw new ErrorResponse(
			403,
			`You need to be level ${pokemon.type === 'science' ? 5 : 10} to unlock ${pokemon.type} Pokemon`,
		);
	}

	// Create user's Pokemon
	const userPokemon = await UserPokemon.create({
		userId: req.user._id,
		pokemonId,
		nickname,
		level: 1,
		currentHP: pokemon.hp,
		xp: 0,
		battlesWon: 0,
		isFavorite: false,
	});

	// Add base XP to user for catching Pokemon
	await user.addXP(pokemon.baseXP);
	await user.addCoins(20); // Coin reward for catching

	const populatedPokemon = await UserPokemon.findById(userPokemon._id).populate('pokemonId');

	return res
		.status(201)
		.json(new SuccessResponse(201, populatedPokemon, 'Pokemon caught successfully!'));
});

// Update Pokemon (nickname, favorite)
const updatePokemon = asyncHandler(async (req: any, res: Response) => {
	const { pokemonId } = req.params;
	const { nickname, isFavorite } = req.body;

	const userPokemon: any = await UserPokemon.findOne({
		_id: pokemonId,
		userId: req.user._id,
	});

	if (!userPokemon) {
		throw new ErrorResponse(404, 'Pokemon not found in your collection');
	}

	if (nickname !== undefined) userPokemon.nickname = nickname;
	if (isFavorite !== undefined) userPokemon.isFavorite = isFavorite;

	await userPokemon.save();

	const updatedPokemon = await UserPokemon.findById(userPokemon._id).populate('pokemonId');

	return res
		.status(200)
		.json(new SuccessResponse(200, updatedPokemon, 'Pokemon updated successfully'));
});

// Add XP to Pokemon (after battles)
const addPokemonXP = asyncHandler(async (req: any, res: Response) => {
	const { pokemonId } = req.params;
	const { xpAmount } = req.body;

	if (!xpAmount || xpAmount <= 0) {
		throw new ErrorResponse(400, 'Valid XP amount is required');
	}

	const userPokemon: any = await UserPokemon.findOne({
		_id: pokemonId,
		userId: req.user._id,
	}).populate('pokemonId');

	if (!userPokemon) {
		throw new ErrorResponse(404, 'Pokemon not found in your collection');
	}

	const result = await userPokemon.addXP(xpAmount);

	// Check for evolution
	const canEvolve = userPokemon.canEvolve(userPokemon.pokemonId);
	const evolutionInfo = canEvolve
		? {
				canEvolve: true,
				evolutionLevel: userPokemon.pokemonId.evolutionLevel,
				evolvesTo: userPokemon.pokemonId.evolvesTo,
			}
		: { canEvolve: false };

	return res.status(200).json(
		new SuccessResponse(
			200,
			{
				...result,
				...evolutionInfo,
				pokemon: userPokemon,
			},
			'Pokemon XP added successfully',
		),
	);
});

// Evolve Pokemon
const evolvePokemon = asyncHandler(async (req: any, res: Response) => {
	const { pokemonId } = req.params;

	const userPokemon: any = await UserPokemon.findOne({
		_id: pokemonId,
		userId: req.user._id,
	}).populate('pokemonId');

	if (!userPokemon) {
		throw new ErrorResponse(404, 'Pokemon not found in your collection');
	}

	const pokemonData = userPokemon.pokemonId;

	if (!userPokemon.canEvolve(pokemonData)) {
		throw new ErrorResponse(400, 'This Pokemon cannot evolve yet');
	}

	// Find the evolution Pokemon
	const evolutionPokemon = await Pokemon.findOne({ name: pokemonData.evolvesTo });
	if (!evolutionPokemon) {
		throw new ErrorResponse(404, 'Evolution Pokemon not found');
	}

	// Check if user has enough coins for evolution
	const user: any = await User.findById(req.user._id);
	const evolutionCost = 100; // Coins needed for evolution

	if (user.coins < evolutionCost) {
		throw new ErrorResponse(400, `Not enough coins. Need ${evolutionCost} coins to evolve`);
	}

	// Deduct coins and evolve
	await user.addCoins(-evolutionCost);

	// Create new evolved Pokemon
	const evolvedPokemon = await UserPokemon.create({
		userId: req.user._id,
		pokemonId: evolutionPokemon._id,
		nickname: userPokemon.nickname, // Keep the nickname
		level: userPokemon.level,
		currentHP: evolutionPokemon.hp,
		xp: 0, // Reset XP for new evolution
		battlesWon: userPokemon.battlesWon,
		isFavorite: userPokemon.isFavorite,
	});

	// Remove the old Pokemon
	await UserPokemon.findByIdAndDelete(pokemonId);

	// Add XP reward for evolving
	await user.addXP(500);

	const populatedEvolvedPokemon = await UserPokemon.findById(evolvedPokemon._id).populate(
		'pokemonId',
	);

	return res
		.status(200)
		.json(new SuccessResponse(200, populatedEvolvedPokemon, 'Pokemon evolved successfully!'));
});

// Get Pokemon by ID
const getPokemonById = asyncHandler(async (req: any, res: Response) => {
	const { pokemonId } = req.params;

	const pokemon = await Pokemon.findById(pokemonId);
	if (!pokemon) {
		throw new ErrorResponse(404, 'Pokemon not found');
	}

	return res
		.status(200)
		.json(new SuccessResponse(200, pokemon, 'Pokemon details fetched successfully'));
});

// Get user's battle team (favorite Pokemon)
const getBattleTeam = asyncHandler(async (req: any, res: Response) => {
	const battleTeam = await UserPokemon.find({
		userId: req.user._id,
		isFavorite: true,
	})
		.populate('pokemonId')
		.limit(6); // Max 6 Pokemon in battle team

	return res
		.status(200)
		.json(new SuccessResponse(200, battleTeam, 'Battle team fetched successfully'));
});

export {
	getAllPokemon,
	getUserPokemon,
	catchPokemon,
	updatePokemon,
	addPokemonXP,
	evolvePokemon,
	getPokemonById,
	getBattleTeam,
};
