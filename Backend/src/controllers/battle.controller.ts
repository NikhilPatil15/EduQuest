// controllers/battle.controller.ts
import { asyncHandler } from '../utils/asyncHandler';
import { ErrorResponse } from '../utils/errorResponse';
import { SuccessResponse } from '../utils/successResponse';
import { Battle } from '../models/battle.model';
import { BattleRound } from '../models/battleRound.model';
import { User } from '../models/user.model';
import { UserPokemon } from '../models/userpokemon.model';
import { Quiz } from '../models/quiz.model';
import { Response } from 'express';

// Create a new battle (waiting for opponent)
const createBattle = asyncHandler(async (req: any, res: Response) => {
	const { pokemonId, totalRounds = 5, timePerQuestion = 20 } = req.body;

	// Check if user has this Pokemon
	const userPokemon = await UserPokemon.findOne({
		_id: pokemonId,
		userId: req.user._id,
	}).populate('pokemonId');

	if (!userPokemon) {
		throw new ErrorResponse(404, 'Pokemon not found in your collection');
	}

	// Generate unique room ID
	const roomId = `battle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

	// Create battle
	const battle = await Battle.create({
		roomId,
		player1: req.user._id,
		player1Pokemon: pokemonId,
		totalRounds,
		timePerQuestion,
		player1HP: userPokemon.currentHP,
		status: 'waiting',
	});

	return res.status(201).json(
		new SuccessResponse(
			201,
			{
				battleId: battle._id,
				roomId: battle.roomId,
				status: battle.status,
			},
			'Battle created successfully. Waiting for opponent...',
		),
	);
});

// Join an existing battle
const joinBattle = asyncHandler(async (req: any, res: Response) => {
	const { roomId } = req.params;
	const { pokemonId } = req.body;

	const battle = await Battle.findOne({ roomId, status: 'waiting' });

	if (!battle) {
		throw new ErrorResponse(404, 'Battle not found or already started');
	}

	if (battle.player1.toString() === req.user._id.toString()) {
		throw new ErrorResponse(400, 'Cannot join your own battle');
	}

	// Check if user has this Pokemon
	const userPokemon = await UserPokemon.findOne({
		_id: pokemonId,
		userId: req.user._id,
	}).populate('pokemonId');

	if (!userPokemon) {
		throw new ErrorResponse(404, 'Pokemon not found in your collection');
	}

	// Get random questions for the battle
	const questions = await Quiz.getRandomQuizzes('math', 'medium', battle.totalRounds);

	if (questions.length < battle.totalRounds) {
		throw new ErrorResponse(400, 'Not enough questions available for battle');
	}

	// Update battle with player2 and questions
	battle.player2 = req.user._id;
	battle.player2Pokemon = pokemonId;
	battle.player2HP = userPokemon.currentHP;
	battle.questions = questions.map((q) => q._id);
	battle.currentQuestion = questions[0]._id as any;
	battle.status = 'active';
	battle.startedAt = new Date();

	await battle.save();

	const populatedBattle = await Battle.findById(battle._id)
		.populate('player1', 'userName fullName avatar')
		.populate('player2', 'userName fullName avatar')
		.populate('player1Pokemon')
		.populate('player2Pokemon')
		.populate('currentQuestion');

	return res
		.status(200)
		.json(new SuccessResponse(200, populatedBattle, 'Joined battle successfully'));
});

// Get current battle status
const getBattleStatus = asyncHandler(async (req: any, res: Response) => {
	const { battleId } = req.params;

	const battle: any = await Battle.findById(battleId)
		.populate('player1', 'userName fullName avatar level')
		.populate('player2', 'userName fullName avatar level')
		.populate('player1Pokemon')
		.populate('player2Pokemon')
		.populate('currentQuestion')
		.populate('questions');

	if (!battle) {
		throw new ErrorResponse(404, 'Battle not found');
	}

	// Check if user is part of this battle
	const isPlayer =
		battle.player1._id.toString() === req.user._id.toString() ||
		battle.player2._id.toString() === req.user._id.toString();

	if (!isPlayer) {
		throw new ErrorResponse(403, 'You are not part of this battle');
	}

	return res
		.status(200)
		.json(new SuccessResponse(200, battle, 'Battle status fetched successfully'));
});

// Submit answer for current round
const submitBattleAnswer = asyncHandler(async (req: any, res: Response) => {
	const { battleId } = req.params;
	const { answer, timeSpent } = req.body;

	if (!answer || !timeSpent) {
		throw new ErrorResponse(400, 'Answer and time spent are required');
	}

	const battle: any = await Battle.findById(battleId)
		.populate('currentQuestion')
		.populate('player1Pokemon')
		.populate('player2Pokemon');

	if (!battle) {
		throw new ErrorResponse(404, 'Battle not found');
	}

	if (battle.status !== 'active') {
		throw new ErrorResponse(400, 'Battle is not active');
	}

	// Check if user is player1 or player2
	const isPlayer1 = battle.player1.toString() === req.user._id.toString();
	const isPlayer2 = battle.player2.toString() === req.user._id.toString();

	if (!isPlayer1 && !isPlayer2) {
		throw new ErrorResponse(403, 'You are not part of this battle');
	}

	const currentQuestion: any = battle.currentQuestion;
	const isCorrect = answer === currentQuestion.correctAnswer;

	// Create or update battle round
	let battleRound = await BattleRound.findOne({
		battleId: battle._id,
		roundNumber: battle.currentRound,
	});

	if (!battleRound) {
		battleRound = await BattleRound.create({
			battleId: battle._id,
			roundNumber: battle.currentRound,
			questionId: currentQuestion._id,
		});
	}

	// Update player's answer
	if (isPlayer1) {
		battleRound.player1Answer = answer;
		battleRound.player1Time = timeSpent;
		battleRound.player1Correct = isCorrect;

		if (isCorrect) {
			battle.player1Score += currentQuestion.xpReward;
		}
	} else {
		battleRound.player2Answer = answer;
		battleRound.player2Time = timeSpent;
		battleRound.player2Correct = isCorrect;

		if (isCorrect) {
			battle.player2Score += currentQuestion.xpReward;
		}
	}

	await battleRound.save();

	// Check if both players have answered
	const bothAnswered = battleRound.player1Answer && battleRound.player2Answer;

	if (bothAnswered) {
		await processRoundResults(battle, battleRound);
	}

	await battle.save();

	return res.status(200).json(
		new SuccessResponse(
			200,
			{
				isCorrect,
				correctAnswer: currentQuestion.correctAnswer,
				explanation: currentQuestion.explanation,
				bothAnswered,
				roundCompleted: bothAnswered,
				battleStatus: battle.status,
			},
			'Answer submitted successfully',
		),
	);
});

// Process round results and calculate damage
const processRoundResults = async (battle: any, battleRound: any) => {
	const player1Correct = battleRound.player1Correct;
	const player2Correct = battleRound.player2Correct;

	let damageDealt = 0;
	let roundWinner = null;

	// Calculate damage based on correctness and speed
	if (player1Correct && !player2Correct) {
		// Player 1 wins the round
		damageDealt = calculateDamage(battle.player1Pokemon.attack, battle.player2Pokemon.defense);
		battle.player2HP = Math.max(0, battle.player2HP - damageDealt);
		roundWinner = battle.player1;
		battle.player1Score += 50; // Bonus for winning round
	} else if (!player1Correct && player2Correct) {
		// Player 2 wins the round
		damageDealt = calculateDamage(battle.player2Pokemon.attack, battle.player1Pokemon.defense);
		battle.player1HP = Math.max(0, battle.player1HP - damageDealt);
		roundWinner = battle.player2;
		battle.player2Score += 50;
	} else if (player1Correct && player2Correct) {
		// Both correct - faster player wins
		if (battleRound.player1Time < battleRound.player2Time) {
			damageDealt =
				calculateDamage(battle.player1Pokemon.attack, battle.player2Pokemon.defense) / 2;
			battle.player2HP = Math.max(0, battle.player2HP - damageDealt);
			roundWinner = battle.player1;
			battle.player1Score += 25;
		} else {
			damageDealt =
				calculateDamage(battle.player2Pokemon.attack, battle.player1Pokemon.defense) / 2;
			battle.player1HP = Math.max(0, battle.player1HP - damageDealt);
			roundWinner = battle.player2;
			battle.player2Score += 25;
		}
	}

	battleRound.damageDealt = damageDealt;
	battleRound.roundWinner = roundWinner;
	await battleRound.save();

	// Check if battle should continue
	if (battle.player1HP <= 0 || battle.player2HP <= 0) {
		await finishBattle(battle);
	} else if (battle.currentRound >= battle.totalRounds) {
		await finishBattle(battle);
	} else {
		// Move to next round
		battle.currentRound += 1;
		battle.currentQuestion = battle.questions[battle.currentRound - 1];
	}
};

// Calculate damage using Pokemon-style formula
const calculateDamage = (attack: number, defense: number): number => {
	const baseDamage = 20;
	const modifier = (attack / defense) * 0.5;
	return Math.floor(baseDamage * modifier) + 10;
};

// Finish battle and distribute rewards
const finishBattle = async (battle: any) => {
	battle.status = 'finished';
	battle.finishedAt = new Date();

	// Determine winner
	if (battle.player1HP > battle.player2HP) {
		battle.winner = battle.player1;
	} else if (battle.player2HP > battle.player1HP) {
		battle.winner = battle.player2;
	} else {
		// Tie - higher score wins
		battle.winner = battle.player1Score >= battle.player2Score ? battle.player1 : battle.player2;
	}

	// Calculate rewards
	const baseXP = 200;
	const baseCoins = 100;

	battle.xpEarned = baseXP;
	battle.coinsEarned = baseCoins;

	// Update players' stats and give rewards
	const winner: any = await User.findById(battle.winner);
	const loser: any = await User.findById(
		battle.winner.toString() === battle.player1.toString() ? battle.player2 : battle.player1,
	);

	if (winner) {
		await winner.addXP(baseXP);
		await winner.addCoins(baseCoins);
		winner.battlesWon += 1;
		winner.totalBattles += 1;
		await winner.save();

		// Update winner's Pokemon
		const winnerPokemon: any = await UserPokemon.findById(
			battle.winner.toString() === battle.player1.toString()
				? battle.player1Pokemon
				: battle.player2Pokemon,
		);
		if (winnerPokemon) {
			winnerPokemon.battlesWon += 1;
			await winnerPokemon.addXP(50); // XP for winning battle
			await winnerPokemon.save();
		}
	}

	if (loser) {
		await loser.addXP(baseXP / 2); // Half XP for loser
		await loser.addCoins(baseCoins / 2); // Half coins for loser
		loser.totalBattles += 1;
		await loser.save();

		// Update loser's Pokemon
		const loserPokemon: any = await UserPokemon.findById(
			loser._id.toString() === battle.player1.toString()
				? battle.player1Pokemon
				: battle.player2Pokemon,
		);
		if (loserPokemon) {
			await loserPokemon.addXP(25); // Less XP for losing
			await loserPokemon.save();
		}
	}

	await battle.save();
};

// Get user's battle history
const getBattleHistory = asyncHandler(async (req: any, res: Response) => {
	const { page = 1, limit = 10 } = req.query;

	const battles = await Battle.find({
		$or: [{ player1: req.user._id }, { player2: req.user._id }],
		status: 'finished',
	})
		.populate('player1', 'userName fullName avatar')
		.populate('player2', 'userName fullName avatar')
		.populate('player1Pokemon')
		.populate('player2Pokemon')
		.populate('winner', 'userName fullName avatar')
		.sort({ finishedAt: -1 })
		.limit(limit * 1)
		.skip((page - 1) * limit);

	const total = await Battle.countDocuments({
		$or: [{ player1: req.user._id }, { player2: req.user._id }],
		status: 'finished',
	});

	return res.status(200).json(
		new SuccessResponse(
			200,
			{
				battles,
				totalPages: Math.ceil(total / limit),
				currentPage: page,
				total,
			},
			'Battle history fetched successfully',
		),
	);
});

// Get available battles (waiting for players)
const getAvailableBattles = asyncHandler(async (req: any, res: Response) => {
	const battles = await Battle.find({
		status: 'waiting',
		player1: { $ne: req.user._id }, // Don't show user's own battles
	})
		.populate('player1', 'userName fullName avatar level')
		.populate('player1Pokemon')
		.sort({ createdAt: -1 })
		.limit(20);

	return res
		.status(200)
		.json(new SuccessResponse(200, battles, 'Available battles fetched successfully'));
});

export {
	createBattle,
	joinBattle,
	getBattleStatus,
	submitBattleAnswer,
	getBattleHistory,
	getAvailableBattles,
};
