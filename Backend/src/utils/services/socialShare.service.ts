// services/socialShare.service.ts
import { Badge } from '../../models/badge.model';
import { Pokemon } from '../../models/pokemon.model';
import { SocialShare } from '../../models/socialShare.model';
import { User } from '../../models/user.model';
import { UserBadge } from '../../models/userBadge.model';
import { UserPokemon } from '../../models/userpokemon.model';

export class SocialShareService {
	// Share a victory
	static async shareVictory(userId: string, quizData: any) {
		const user = await User.findById(userId);
		if (!user) throw new Error('User not found');

		const share = await SocialShare.create({
			userId,
			type: 'victory',
			title: 'Quiz Victory! 🎉',
			message: `I scored ${Math.round(quizData.score)}% in ${quizData.subject}! Can you beat my score?`,
			data: quizData,
			shareCount: 1,
			lastSharedAt: new Date(),
		});

		return share;
	}

	// Alternative method for badge sharing
	static async shareBadgeEarnedAlternative(userId: string, badgeId: string) {
		const userBadge = await UserBadge.findOne({
			userId,
			badgeId,
			isEarned: true,
		});

		if (!userBadge) {
			throw new Error('Badge not earned by user');
		}

		// Get badge details directly
		const badge = await Badge.findById(badgeId);
		if (!badge) {
			throw new Error('Badge details not found');
		}

		const share = await SocialShare.create({
			userId,
			type: 'badge',
			title: 'New Badge Earned! 🏆',
			message: `I earned the "${badge.name}" badge! ${badge.description}`,
			imageUrl: badge.icon,
			data: {
				badge: {
					_id: badge._id,
					name: badge.name,
					description: badge.description,
					icon: badge.icon,
					color: badge.color,
					rarity: badge.rarity,
					category: badge.category,
				},
			},
			shareCount: 1,
			lastSharedAt: new Date(),
		});

		return share;
	}

	// Share level up
	static async shareLevelUp(userId: string, newLevel: number) {
		const user = await User.findById(userId);
		if (!user) throw new Error('User not found');

		const share = await SocialShare.create({
			userId,
			type: 'level_up',
			title: 'Level Up! 🚀',
			message: `I reached level ${newLevel}! The learning journey continues!`,
			data: { newLevel },
			shareCount: 1,
			lastSharedAt: new Date(),
		});

		return share;
	}

	// Share a badge - SAFE VERSION
	static async shareBadgeEarned(userId: string, badgeId: string) {
		const userBadge = await UserBadge.findOne({
			userId,
			badgeId,
			isEarned: true,
		});

		if (!userBadge) {
			throw new Error('Badge not earned by user');
		}

		// Get badge details directly
		const badge = await Badge.findById(badgeId);
		if (!badge) {
			throw new Error('Badge details not found');
		}

		// Safe field access
		const badgeName = badge.name || 'Unknown Badge';
		const badgeDescription = badge.description || 'An amazing achievement!';
		const badgeIcon = badge.icon || '🏆';

		const share = await SocialShare.create({
			userId,
			type: 'badge',
			title: 'New Badge Earned! 🏆',
			message: `I earned the "${badgeName}" badge! ${badgeDescription}`,
			imageUrl: badgeIcon,
			data: {
				badge: {
					_id: badge._id,
					name: badgeName,
					description: badgeDescription,
					icon: badgeIcon,
					color: badge.color || '#000000',
					rarity: badge.rarity || 'common',
					category: badge.category || 'quiz',
				},
			},
			shareCount: 1,
			lastSharedAt: new Date(),
		});

		return share;
	}

	// Share Pokémon catch - SAFE VERSION
	static async sharePokemonCatch(userId: string, pokemonId: string) {
		const userPokemon = await UserPokemon.findOne({
			userId,
			pokemonId,
		});

		if (!userPokemon) {
			throw new Error('Pokémon not found in user collection');
		}

		// Get Pokémon details directly
		const pokemon = await Pokemon.findById(pokemonId);
		if (!pokemon) {
			throw new Error('Pokémon details not found');
		}

		// Safe field access with fallbacks
		const pokemonName = (pokemon as any).name || 'Unknown Pokémon';
		const pokemonDescription = (pokemon as any).description || 'A mysterious creature!';
		const pokemonImage = (pokemon as any).image || '/default-pokemon.png';
		const pokemonType = (pokemon as any).type || 'normal';
		const pokemonRarity = (pokemon as any).rarity || 'common';
		const pokedexNumber = (pokemon as any).pokedexNumber || 0; // Fallback for missing field

		const share = await SocialShare.create({
			userId,
			type: 'pokemon_catch',
			title: 'New Pokémon Caught! 🎣',
			message: `I caught a ${pokemonName}! ${pokemonDescription}`,
			imageUrl: pokemonImage,
			data: {
				pokemon: {
					_id: pokemon._id,
					name: pokemonName,
					type: pokemonType,
					image: pokemonImage,
					rarity: pokemonRarity,
					pokedexNumber: pokedexNumber,
				},
			},
			shareCount: 1,
			lastSharedAt: new Date(),
		});

		return share;
	}

	// Alternative method if populate doesn't work:
	static async sharePokemonCatchAlternative(userId: string, pokemonId: string) {
		const userPokemon = await UserPokemon.findOne({
			userId,
			pokemonId,
		});

		if (!userPokemon) {
			throw new Error('Pokémon not found in user collection');
		}

		// Get Pokémon details directly
		const pokemon = await Pokemon.findById(pokemonId);
		if (!pokemon) {
			throw new Error('Pokémon details not found');
		}

		const share = await SocialShare.create({
			userId,
			type: 'pokemon_catch',
			title: 'New Pokémon Caught! 🎣',
			message: `I caught a ${pokemon.name}! ${pokemon.description}`,
			imageUrl: pokemon.image,
			data: {
				pokemon: {
					_id: pokemon._id,
					name: pokemon.name,
					type: pokemon.type,
					image: pokemon.image,
					rarity: pokemon.rarity,
				},
			},
			shareCount: 1,
			lastSharedAt: new Date(),
		});

		return share;
	}
	// Get user's share history
	static async getUserShares(userId: string, limit: number = 20) {
		const shares = await SocialShare.find({ userId }).sort({ lastSharedAt: -1 }).limit(limit);

		return shares;
	}

	// Increment share count
	static async incrementShareCount(shareId: string) {
		const share = await SocialShare.findByIdAndUpdate(
			shareId,
			{
				$inc: { shareCount: 1 },
				lastSharedAt: new Date(),
			},
			{ new: true },
		);

		return share;
	}

	// Get popular shares (for social feed)
	static async getPopularShares(limit: number = 10) {
		const popularShares = await SocialShare.aggregate([
			{
				$lookup: {
					from: 'users',
					localField: 'userId',
					foreignField: '_id',
					as: 'user',
				},
			},
			{ $unwind: '$user' },
			{
				$project: {
					type: 1,
					title: 1,
					message: 1,
					data: 1,
					shareCount: 1,
					lastSharedAt: 1,
					'user.userName': 1,
					'user.level': 1,
					'user.avatar': 1,
				},
			},
			{ $sort: { shareCount: -1, lastSharedAt: -1 } },
			{ $limit: limit },
		]);

		return popularShares;
	}
}
