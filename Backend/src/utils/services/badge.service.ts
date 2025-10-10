// services/badge.service.ts
import { Badge } from '../../models/badge.model';
import { UserBadge } from '../../models/userBadge.model';
import { User } from '../../models/user.model';
import { QuizSession } from '../../models/quizSession.model';
import { UserPokemon } from '../../models/userpokemon.model';

export class BadgeService {
	// Check and award badges to user
	static async checkAndAwardBadges(userId: string): Promise<any[]> {
		const user = await User.findById(userId);
		if (!user) return [];

		const badges = await Badge.find({ isActive: true });
		const awardedBadges = [];

		for (const badge of badges) {
			const hasBadge = await UserBadge.findOne({
				userId,
				badgeId: badge._id,
				isEarned: true,
			});

			if (!hasBadge) {
				const progress = await this.calculateBadgeProgress(userId, badge);

				if (progress >= badge.requirement.target) {
					// Award the badge
					const userBadge = await UserBadge.findOneAndUpdate(
						{ userId, badgeId: badge._id },
						{
							isEarned: true,
							earnedAt: new Date(),
							progress: badge.requirement.target,
						},
						{ upsert: true, new: true },
					).populate('badgeId');

					// Add rewards
					await User.findByIdAndUpdate(userId, {
						$inc: {
							xp: badge.rewards.xp,
							coins: badge.rewards.coins,
						},
					});

					awardedBadges.push(userBadge);
				} else {
					// Update progress
					await UserBadge.findOneAndUpdate(
						{ userId, badgeId: badge._id },
						{ progress },
						{ upsert: true, new: true },
					);
				}
			}
		}

		return awardedBadges;
	}

	private static async calculateBadgeProgress(userId: string, badge: any): Promise<number> {
		switch (badge.requirement.type) {
			case 'total_quizzes':
				return await QuizSession.countDocuments({
					userId,
					status: 'completed',
				});

			case 'correct_answers':
				const user = await User.findById(userId);
				return user?.correctAnswers || 0;

			case 'total_xp':
				const userData = await User.findById(userId);
				return userData?.xp || 0;

			case 'pokemon_caught':
				return await UserPokemon.countDocuments({ userId });

			case 'daily_streak':
				const userWithStreak = await User.findById(userId);
				return userWithStreak?.dailyStreak || 0;

			case 'subject_quizzes':
				return await QuizSession.countDocuments({
					userId,
					status: 'completed',
					subject: badge.requirement.subject,
				});

			case 'perfect_quizzes':
				return await QuizSession.countDocuments({
					userId,
					status: 'completed',
					correctAnswers: { $eq: '$totalQuestions' },
				});

			case 'battles_won':
				const userWithBattles = await User.findById(userId);
				return userWithBattles?.battlesWon || 0;

			case 'level_reached':
				const userLevel = await User.findById(userId);
				return userLevel?.level || 0;

			default:
				return 0;
		}
	}

	// Get user's badges and progress
	static async getUserBadges(userId: string) {
		const userBadges = await UserBadge.find({ userId })
			.populate('badgeId')
			.sort({ earnedAt: -1, 'badgeId.rarity': -1 });

		const allBadges = await Badge.find({ isActive: true });

		const badgeProgress = allBadges.map((badge) => {
			const userBadge = userBadges.find(
				(ub: any) => ub.badgeId?._id.toString() === badge._id.toString(),
			);

			return {
				badge,
				progress: userBadge?.progress || 0,
				isEarned: userBadge?.isEarned || false,
				earnedAt: userBadge?.earnedAt,
				shared: userBadge?.shared || false,
			};
		});

		return badgeProgress;
	}

	static async shareBadge(userId: string, badgeId: string) {
		const userBadge = await UserBadge.findOneAndUpdate(
			{ userId, badgeId, isEarned: true },
			{
				shared: true,
				$inc: { shareCount: 1 },
			},
			{ new: true },
		).populate('badgeId');

		if (!userBadge) {
			throw new Error('Badge not found or not earned');
		}

		// Use the fixed social share method
		const { SocialShareService } = await import('./socialShare.service');
		await SocialShareService.shareBadgeEarnedAlternative(userId, badgeId);

		return userBadge;
	}

	// Get badge statistics
	static async getBadgeStats(userId: string) {
		const totalBadges = await Badge.countDocuments({ isActive: true });
		const earnedBadges = await UserBadge.countDocuments({
			userId,
			isEarned: true,
		});

		const badgesByRarity = await UserBadge.aggregate([
			{ $match: { userId, isEarned: true } },
			{
				$lookup: {
					from: 'badges',
					localField: 'badgeId',
					foreignField: '_id',
					as: 'badge',
				},
			},
			{ $unwind: '$badge' },
			{
				$group: {
					_id: '$badge.rarity',
					count: { $sum: 1 },
				},
			},
		]);

		const badgesByCategory = await UserBadge.aggregate([
			{ $match: { userId, isEarned: true } },
			{
				$lookup: {
					from: 'badges',
					localField: 'badgeId',
					foreignField: '_id',
					as: 'badge',
				},
			},
			{ $unwind: '$badge' },
			{
				$group: {
					_id: '$badge.category',
					count: { $sum: 1 },
				},
			},
		]);

		return {
			totalBadges,
			earnedBadges,
			progress: totalBadges > 0 ? (earnedBadges / totalBadges) * 100 : 0,
			byRarity: badgesByRarity,
			byCategory: badgesByCategory,
		};
	}
}
