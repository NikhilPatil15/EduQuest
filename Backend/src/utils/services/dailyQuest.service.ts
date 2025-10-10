// services/dailyQuest.service.ts
import { DailyQuest } from '../../models/dailyQuest.model';
import { User } from '../../models/user.model';
import { Pokemon } from '../../models/pokemon.model';
import { UserPokemon } from '../../models/userpokemon.model';
import { Notification } from '../../models/notification.model';

export class DailyQuestService {
	// Generate daily quests for a user
	static async generateDailyQuests(userId: string): Promise<void> {
		const questTemplates = [
			{
				title: 'Complete 3 Quizzes',
				description: 'Complete any 3 quizzes to earn rewards',
				type: 'quiz_completion' as const,
				goal: 3,
				reward: { xp: 150, coins: 25 },
			},
			{
				title: 'Maintain 3-Day Streak',
				description: 'Learn for 3 consecutive days',
				type: 'streak' as const,
				goal: 3,
				reward: { xp: 200, coins: 50 },
			},
			{
				title: 'Master a Subject',
				description: 'Achieve 80% accuracy in any subject',
				type: 'subject_mastery' as const,
				goal: 1,
				reward: { xp: 300, coins: 75 },
			},
			{
				title: 'Catch a Pokémon',
				description: 'Capture a new Pokémon from quiz rewards',
				type: 'pokemon_capture' as const,
				goal: 1,
				reward: { xp: 100, coins: 15 },
			},
			{
				title: 'Win a Battle',
				description: 'Win one multiplayer quiz battle',
				type: 'battle_victory' as const,
				goal: 1,
				reward: { xp: 250, coins: 40 },
			},
		];

		// Clear old active quests
		await DailyQuest.deleteMany({
			userId,
			status: 'active',
			expiresAt: { $lt: new Date() },
		});

		// Create new quests
		const quests = questTemplates.map((template) => ({
			userId,
			...template,
			expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
		}));

		await DailyQuest.insertMany(quests);

		// Send notification
		await Notification.create({
			userId,
			type: 'quest',
			title: 'New Daily Quests Available!',
			message: 'Check out your new daily quests and start earning rewards!',
			actionUrl: '/quests',
		});
	}

	static async updateQuestProgress(
		userId: string,
		questType: string,
		progress: number = 1,
	): Promise<void> {
		const user = await User.findById(userId);
		if (!user) return;

		const quests = await DailyQuest.find({
			userId,
			type: questType,
			status: 'active',
			expiresAt: { $gt: new Date() },
		});

		for (const quest of quests) {
			const newProgress = quest.progress + progress;
			quest.progress = Math.min(newProgress, quest.goal);

			if (quest.progress >= quest.goal && quest.status === 'active') {
				quest.status = 'completed';
				quest.completedAt = new Date();

				// SPECIAL STREAK QUEST HANDLING
				if (quest.type === 'streak') {
					// Use existing user streak for validation
					const currentStreak = await user.updateDailyStreak();
					if (currentStreak >= quest.goal) {
						// Send completion notification
						await Notification.create({
							userId,
							type: 'quest',
							title: 'Quest Completed!',
							message: `You completed "${quest.title}"! Claim your reward.`,
							actionUrl: '/quests',
						});
					} else {
						// Reset if streak doesn't meet goal
						quest.progress = currentStreak;
						quest.status = 'active';
					}
				} else {
					// Send completion notification for other quest types
					await Notification.create({
						userId,
						type: 'quest',
						title: 'Quest Completed!',
						message: `You completed "${quest.title}"! Claim your reward.`,
						actionUrl: '/quests',
					});
				}
			}

			await quest.save();
		}
	}
	// Claim quest reward
	static async claimQuestReward(questId: string, userId: string): Promise<any> {
		const quest = await DailyQuest.findOne({
			_id: questId,
			userId,
			status: 'completed',
		});

		if (!quest) {
			throw new Error('Quest not found or not completed');
		}

		const user = await User.findById(userId);
		if (!user) throw new Error('User not found');

		// Add rewards
		await user.addXP(quest.reward.xp);
		await user.addCoins(quest.reward.coins);

		// Add Pokémon reward if exists
		if (quest.reward.pokemonId) {
			const pokemon = await Pokemon.findById(quest.reward.pokemonId);
			if (pokemon) {
				await UserPokemon.catchPokemon(userId, pokemon._id.toString());
			}
		}

		// Update quest status
		quest.status = 'claimed';
		quest.claimedAt = new Date();
		await quest.save();

		return {
			xp: quest.reward.xp,
			coins: quest.reward.coins,
			pokemon: quest.reward.pokemonId ? true : false,
		};
	}

	// Get user's daily quests
	static async getUserQuests(userId: string) {
		return DailyQuest.find({
			userId,
			expiresAt: { $gt: new Date() },
		}).sort({ status: 1, createdAt: -1 });
	}
}
