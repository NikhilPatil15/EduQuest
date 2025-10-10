// services/evolution.service.ts - UPDATED FOR YOUR POKÉMON INTERFACE
import { Evolution } from '../../models/evolution.model';
import { EvolutionHistory } from '../../models/evolutionHistory.model';
import { UserPokemon } from '../../models/userpokemon.model';
import { Pokemon } from '../../models/pokemon.model';
import { PokedexService } from './pokedex.service';
import { User } from '../../models/user.model';
import { QuizSession } from '../../models/quizSession.model';

export class EvolutionService {
	// Check for evolution opportunities - UPDATED
	static async checkEvolutions(userId: string): Promise<any[]> {
		const userPokemon = await UserPokemon.find({ userId }).populate('pokemonId');

		const evolutionOpportunities = [];

		for (const userPoke of userPokemon) {
			const pokemon = userPoke.pokemonId as any;

			// Check if this Pokémon can evolve (has evolvesTo field)
			if (pokemon.evolvesTo && pokemon.evolutionLevel) {
				const evolvedPokemon = await Pokemon.findById(pokemon.evolvesTo);

				if (evolvedPokemon) {
					const canEvolve = await this.canEvolve(userId, userPoke, pokemon, evolvedPokemon);

					if (canEvolve) {
						evolutionOpportunities.push({
							userPokemonId: userPoke._id,
							basePokemon: pokemon,
							evolvedPokemon: evolvedPokemon,
							trigger: 'level',
							triggerValue: pokemon.evolutionLevel,
							description: `Evolves at level ${pokemon.evolutionLevel}`,
						});
					}
				}
			}

			// Also check custom evolutions from Evolution model
			const customEvolutions = await Evolution.find({
				basePokemonId: pokemon._id,
				isActive: true,
			}).populate('evolvedPokemonId');

			for (const evolution of customEvolutions) {
				const canEvolve = await this.canEvolveCustom(userId, userPoke, evolution);

				if (canEvolve) {
					evolutionOpportunities.push({
						userPokemonId: userPoke._id,
						basePokemon: pokemon,
						evolvedPokemon: evolution.evolvedPokemonId,
						evolution,
						trigger: evolution.trigger,
						triggerValue: evolution.triggerValue,
						description: evolution.description,
					});
				}
			}
		}

		return evolutionOpportunities;
	}

	// Check evolution using Pokémon's built-in evolution fields
	private static async canEvolve(
		userId: string,
		userPokemon: any,
		basePokemon: any,
		evolvedPokemon: any,
	): Promise<boolean> {
		// Use the evolutionLevel from Pokémon data
		return userPokemon.level >= basePokemon.evolutionLevel;
	}

	// Check custom evolution from Evolution model
	private static async canEvolveCustom(
		userId: string,
		userPokemon: any,
		evolution: any,
	): Promise<boolean> {
		const pokemon = userPokemon.pokemonId as any;

		switch (evolution.trigger) {
			case 'level':
				return userPokemon.level >= evolution.triggerValue;

			case 'quiz_mastery':
				return await this.checkQuizMastery(userId, pokemon.subject, evolution.triggerValue);

			case 'milestone':
				return await this.checkMilestone(userId, evolution.triggerValue);

			case 'friendship':
				// Use experience as friendship proxy
				return userPokemon.experience >= evolution.triggerValue;

			case 'item':
				// Simplified item check
				return userPokemon.level >= (evolution.triggerValue || 10);

			default:
				return false;
		}
	}

	// Evolve a Pokémon - UPDATED
	static async evolvePokemon(
		userId: string,
		userPokemonId: string,
		targetPokemonId: string,
	): Promise<any> {
		const userPokemon = await UserPokemon.findById(userPokemonId).populate('pokemonId');
		if (!userPokemon) {
			throw new Error('User Pokémon not found');
		}

		const evolvedPokemon = await Pokemon.findById(targetPokemonId);
		if (!evolvedPokemon) {
			throw new Error('Evolved Pokémon not found');
		}

		const basePokemon = userPokemon.pokemonId as any;

		// Verify evolution is possible
		let canEvolve = false;
		let trigger = 'level';
		let triggerValue = 0;
		let description = '';

		// Check built-in evolution
		if (basePokemon.evolvesTo === targetPokemonId) {
			canEvolve = userPokemon.level >= basePokemon.evolutionLevel;
			trigger = 'level';
			triggerValue = basePokemon.evolutionLevel;
			description = `Evolved at level ${userPokemon.level}`;
		} else {
			// Check custom evolution
			const evolution = await Evolution.findOne({
				basePokemonId: basePokemon._id,
				evolvedPokemonId: targetPokemonId,
				isActive: true,
			});

			if (evolution) {
				canEvolve = await this.canEvolveCustom(userId, userPokemon, evolution);
				trigger = evolution.trigger;
				triggerValue = evolution.triggerValue;
				description = evolution.description;
			}
		}

		if (!canEvolve) {
			throw new Error('Evolution requirements not met');
		}

		// Create new evolved Pokémon
		const newUserPokemon = await UserPokemon.create({
			userId,
			pokemonId: evolvedPokemon._id,
			level: userPokemon.level,
			currentHP: evolvedPokemon.hp || 100, // Use evolved Pokémon's HP
			xp: userPokemon.xp,
			battlesWon: userPokemon.battlesWon,
			isFavorite: userPokemon.isFavorite,
			nickname: userPokemon.nickname ? `${userPokemon.nickname} (Evolved)` : undefined,
			caughtAt: new Date(),
		});

		// Record evolution history
		const evolutionHistory = await EvolutionHistory.create({
			userId,
			basePokemonId: basePokemon._id,
			evolvedPokemonId: evolvedPokemon._id,
			userPokemonId: newUserPokemon._id,
			trigger,
			triggerValue,
			evolvedAt: new Date(),
		});

		// Remove original Pokémon
		await UserPokemon.findByIdAndDelete(userPokemonId);

		// Update Pokédex
		await PokedexService.recordCatch(userId, evolvedPokemon._id.toString());

		return {
			evolutionHistory,
			evolvedPokemon: newUserPokemon,
			originalPokemon: basePokemon,
			newPokemon: evolvedPokemon,
			description,
		};
	}

	// Get possible evolutions for a Pokémon - UPDATED
	static async getEvolutions(pokemonId: string) {
		const pokemon = await Pokemon.findById(pokemonId);
		if (!pokemon) return [];

		const evolutions = [];

		// Check built-in evolution
		if (pokemon.evolvesTo) {
			const evolvedPokemon = await Pokemon.findById(pokemon.evolvesTo);
			if (evolvedPokemon) {
				evolutions.push({
					type: 'built-in',
					basePokemon: pokemon,
					evolvedPokemon,
					trigger: 'level',
					triggerValue: pokemon.evolutionLevel,
					description: `Evolves at level ${pokemon.evolutionLevel}`,
				});
			}
		}

		// Check custom evolutions
		const customEvolutions = await Evolution.find({
			basePokemonId: pokemonId,
			isActive: true,
		}).populate('evolvedPokemonId');

		customEvolutions.forEach((evolution) => {
			evolutions.push({
				type: 'custom',
				basePokemon: pokemon,
				evolvedPokemon: evolution.evolvedPokemonId,
				trigger: evolution.trigger,
				triggerValue: evolution.triggerValue,
				description: evolution.description,
			});
		});

		return evolutions;
	}

	// Auto-evolve Pokémon based on level - UPDATED
	static async autoEvolveByLevel(userId: string, userPokemonId: string): Promise<any> {
		const userPokemon = await UserPokemon.findById(userPokemonId).populate('pokemonId');
		if (!userPokemon) return null;

		const pokemon = userPokemon.pokemonId as any;

		// Check if Pokémon can evolve based on its evolutionLevel
		if (pokemon.evolvesTo && userPokemon.level >= pokemon.evolutionLevel) {
			return await this.evolvePokemon(userId, userPokemonId, pokemon.evolvesTo);
		}

		return null;
	}

	// Rest of the methods remain the same...
	private static async checkQuizMastery(
		userId: string,
		subject: string,
		requiredMastery: number,
	): Promise<boolean> {
		const recentSessions = await QuizSession.find({
			userId,
			subject,
			status: 'completed',
			completedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
		}).limit(10);

		if (recentSessions.length === 0) return false;

		const totalCorrect = recentSessions.reduce((sum, session) => sum + session.correctAnswers, 0);
		const totalQuestions = recentSessions.reduce((sum, session) => sum + session.totalQuestions, 0);

		const accuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
		return accuracy >= requiredMastery;
	}

	private static async checkMilestone(userId: string, milestoneId: string): Promise<boolean> {
		const user = await User.findById(userId);
		return user ? user.level >= 10 : false;
	}

	static async getEvolutionHistory(userId: string, limit: number = 10) {
		const history = await EvolutionHistory.find({ userId })
			.populate('basePokemonId', 'name image type')
			.populate('evolvedPokemonId', 'name image type')
			.sort({ evolvedAt: -1 })
			.limit(limit);

		return history;
	}

	static async processAutoEvolutions(userId: string): Promise<any[]> {
		const evolutionOpportunities = await this.checkEvolutions(userId);
		const autoEvolutions = evolutionOpportunities.filter((opp) => opp.trigger === 'level');

		const results = [];
		for (const opportunity of autoEvolutions) {
			try {
				const result = await this.evolvePokemon(
					userId,
					opportunity.userPokemonId.toString(),
					opportunity.evolvedPokemon._id.toString(),
				);
				results.push(result);
			} catch (error) {
				console.error('Auto-evolution failed:', error);
			}
		}

		return results;
	}
}
