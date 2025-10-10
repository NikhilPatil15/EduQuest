// services/worldMap.service.ts
import { WorldMap } from '../../models/worldMap.model';
import { MapRegion } from '../../models/mapRegion.model';
import { UserWorldProgress } from '../../models/userWorldProgress.model';
import { User } from '../../models/user.model';
import { QuizSession } from '../../models/quizSession.model';

export class WorldMapService {
	// Get user's world map progress
	static async getUserWorldProgress(userId: string): Promise<any> {
		const user = await User.findById(userId);
		if (!user) throw new Error('User not found');

		const worlds = await WorldMap.find({ isActive: true }).sort({ order: 1 });

		const worldProgress = await Promise.all(
			worlds.map(async (world) => {
				const regions = await MapRegion.find({
					worldMapId: world._id,
					isActive: true,
				}).sort({ order: 1 });

				const userProgress = await UserWorldProgress.find({
					userId,
					regionId: { $in: regions.map((r) => r._id) },
				}).populate('regionId');

				// Calculate overall progress for this world
				const unlockedRegions = userProgress.filter((up) => up.isUnlocked).length;
				const completedRegions = userProgress.filter((up) => up.isCompleted).length;
				const totalRegions = regions.length;
				const overallProgress = totalRegions > 0 ? (completedRegions / totalRegions) * 100 : 0;

				return {
					world,
					regions: regions.map((region) => {
						const progress = userProgress.find(
							(up) => up.regionId.toString() === region._id.toString(),
						);

						return {
							...region.toObject(),
							userProgress: progress || null,
							canUnlock: user.level >= region.requiredLevel && (!progress || !progress.isUnlocked),
						};
					}),
					stats: {
						unlockedRegions,
						completedRegions,
						totalRegions,
						overallProgress: Math.round(overallProgress),
					},
				};
			}),
		);

		return worldProgress;
	}

	// Unlock a region for user
	static async unlockRegion(userId: string, regionId: string): Promise<any> {
		const user = await User.findById(userId);
		const region = await MapRegion.findById(regionId);

		if (!user || !region) {
			throw new Error('User or region not found');
		}

		if (user.level < region.requiredLevel) {
			throw new Error(`Level ${region.requiredLevel} required to unlock this region`);
		}

		// Check if already unlocked
		const existingProgress = await UserWorldProgress.findOne({
			userId,
			regionId,
		});

		if (existingProgress && existingProgress.isUnlocked) {
			throw new Error('Region already unlocked');
		}

		// Create or update progress
		const userProgress = await UserWorldProgress.findOneAndUpdate(
			{ userId, regionId },
			{
				isUnlocked: true,
				unlockedAt: new Date(),
				totalQuizzes: region.totalQuizzes,
			},
			{ upsert: true, new: true },
		).populate('regionId');

		return userProgress;
	}

	// Update region progress after quiz completion - FIXED
	static async updateRegionProgress(
		userId: string,
		regionId: string,
		quizResult: any,
	): Promise<void> {
		const progress = await UserWorldProgress.findOne({
			userId,
			regionId,
		});

		if (!progress) return;

		// ✅ FIXED: Use the instance method
		await progress.updateProgress(quizResult.score, quizResult.timeSpent);

		// Check if region is completed and award rewards
		if (progress.isCompleted && progress.completedAt) {
			const region = await MapRegion.findById(regionId);
			if (region) {
				await User.findByIdAndUpdate(userId, {
					$inc: {
						xp: region.rewards.xp,
						coins: region.rewards.coins,
					},
				});

				// Award Pokemon if available
				if (region.rewards.pokemonId) {
					const { UserPokemon } = await import('../../models/userpokemon.model');
					await UserPokemon.catchPokemon(userId, region.rewards.pokemonId.toString());
				}
			}
		}
	}
	// Get recommended region for user
	static async getRecommendedRegion(userId: string): Promise<any> {
		const user = await User.findById(userId);
		if (!user) return null;

		const userProgress = await UserWorldProgress.find({ userId })
			.populate('regionId')
			.sort({ mastery: 1, lastActivity: 1 }); // Prioritize low mastery and old activity

		// Find first region that needs improvement
		for (const progress of userProgress) {
			if (progress.mastery < 80 && progress.isUnlocked) {
				return progress.regionId;
			}
		}

		// If all mastered regions, find next unlockable region
		const allRegions = await MapRegion.find({ isActive: true })
			.populate('worldMapId')
			.sort({ requiredLevel: 1, order: 1 });

		for (const region of allRegions) {
			const hasProgress = userProgress.some(
				(up) => up.regionId.toString() === region._id.toString(),
			);

			if (!hasProgress && user.level >= region.requiredLevel) {
				return region;
			}
		}

		return null;
	}

	// Get region leaderboard
	static async getRegionLeaderboard(regionId: string, limit: number = 10): Promise<any> {
		const leaderboard = await UserWorldProgress.aggregate([
			{
				$match: {
					regionId: regionId,
					completedQuizzes: { $gt: 0 },
				},
			},
			{
				$lookup: {
					from: 'users',
					localField: 'userId',
					foreignField: '_id',
					as: 'user',
				},
			},
			{
				$unwind: '$user',
			},
			{
				$project: {
					userName: '$user.userName',
					level: '$user.level',
					mastery: '$mastery',
					bestScore: '$bestScore',
					completedQuizzes: '$completedQuizzes',
					averageTime: '$averageTime',
				},
			},
			{
				$sort: {
					mastery: -1,
					bestScore: -1,
					averageTime: 1,
				},
			},
			{
				$limit: limit,
			},
		]);

		return leaderboard;
	}
}
