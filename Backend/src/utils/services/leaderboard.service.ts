// services/leaderboard.service.ts
import { Leaderboard } from '../../models/leaderboard.models';
import { User } from '../../models/user.model';
import { UserPokemon } from '../../models/userpokemon.model';
import { UserBadge } from '../../models/userBadge.model';
import { QuizSession } from '../../models/quizSession.model';
import { Friend } from '../../models/friend.model';

export class LeaderboardService {
	// Calculate and cache leaderboards
	static async calculateLeaderboard(
		type: 'global' | 'subject' | 'weekly' | 'friends',
		subject?: string,
		timeframe: string = 'all-time',
	): Promise<any> {
		// Check for cached leaderboard
		const cached = await Leaderboard.findOne({
			type,
			subject,
			timeframe,
			expiresAt: { $gt: new Date() },
		});

		if (cached) {
			return cached;
		}

		let pipeline: any[] = [];

		switch (type) {
			case 'global':
				pipeline = await this.getGlobalLeaderboardPipeline(timeframe);
				break;
			case 'subject':
				if (!subject) throw new Error('Subject required for subject leaderboard');
				pipeline = await this.getSubjectLeaderboardPipeline(subject, timeframe);
				break;
			case 'weekly':
				pipeline = await this.getWeeklyLeaderboardPipeline();
				break;
			case 'friends':
				pipeline = await this.getFriendsLeaderboardPipeline(subject!);
				break;
		}

		const rankings = await User.aggregate(pipeline);

		// Calculate ranks
		const rankedResults = rankings.map((user: any, index: number) => ({
			userId: user._id,
			rank: index + 1,
			score: user.totalScore,
			xp: user.xp,
			level: user.level,
			badges: user.badgeCount,
			pokemonCount: user.pokemonCount,
			streak: user.dailyStreak,
			accuracy: user.accuracy,
		}));

		// Cache for 1 hour
		const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

		const leaderboard = await Leaderboard.findOneAndUpdate(
			{ type, subject, timeframe },
			{
				rankings: rankedResults,
				calculatedAt: new Date(),
				expiresAt,
			},
			{ upsert: true, new: true },
		).populate('rankings.userId', 'userName level xp avatar');

		return leaderboard;
	}

	private static async getGlobalLeaderboardPipeline(timeframe: string) {
		const dateFilter = this.getDateFilter(timeframe);

		return [
			{
				$lookup: {
					from: 'userpokemons',
					localField: '_id',
					foreignField: 'userId',
					as: 'pokemon',
				},
			},
			{
				$lookup: {
					from: 'userbadges',
					localField: '_id',
					foreignField: 'userId',
					as: 'badges',
					pipeline: [{ $match: { isEarned: true } }],
				},
			},
			{
				$lookup: {
					from: 'quizsessions',
					localField: '_id',
					foreignField: 'userId',
					as: 'sessions',
					pipeline: [
						{ $match: { status: 'completed', ...dateFilter } },
						{
							$group: {
								_id: '$userId',
								totalCorrect: { $sum: '$correctAnswers' },
								totalQuestions: { $sum: '$totalQuestions' },
								totalScore: { $sum: '$xpEarned' },
							},
						},
					],
				},
			},
			{
				$addFields: {
					pokemonCount: { $size: '$pokemon' },
					badgeCount: { $size: '$badges' },
					sessionStats: { $arrayElemAt: ['$sessions', 0] },
					accuracy: {
						$cond: {
							if: { $gt: [{ $arrayElemAt: ['$sessions.totalQuestions', 0] }, 0] },
							then: {
								$multiply: [
									{
										$divide: [
											{ $arrayElemAt: ['$sessions.totalCorrect', 0] },
											{ $arrayElemAt: ['$sessions.totalQuestions', 0] },
										],
									},
									100,
								],
							},
							else: 0,
						},
					},
					totalScore: { $ifNull: [{ $arrayElemAt: ['$sessions.totalScore', 0] }, 0] },
				},
			},
			{
				$project: {
					userName: 1,
					level: 1,
					xp: 1,
					dailyStreak: 1,
					pokemonCount: 1,
					badgeCount: 1,
					accuracy: 1,
					totalScore: 1,
				},
			},
			{ $sort: { totalScore: -1, level: -1, xp: -1 } },
			{ $limit: 100 },
		];
	}

	private static async getSubjectLeaderboardPipeline(subject: string, timeframe: string) {
		const dateFilter = this.getDateFilter(timeframe);

		return [
			{
				$lookup: {
					from: 'quizsessions',
					localField: '_id',
					foreignField: 'userId',
					as: 'sessions',
					pipeline: [
						{
							$match: {
								status: 'completed',
								subject: subject,
								...dateFilter,
							},
						},
						{
							$group: {
								_id: '$userId',
								totalCorrect: { $sum: '$correctAnswers' },
								totalQuestions: { $sum: '$totalQuestions' },
								totalScore: { $sum: '$xpEarned' },
								sessionCount: { $sum: 1 },
							},
						},
					],
				},
			},
			{
				$addFields: {
					sessionStats: { $arrayElemAt: ['$sessions', 0] },
					accuracy: {
						$cond: {
							if: { $gt: [{ $arrayElemAt: ['$sessions.totalQuestions', 0] }, 0] },
							then: {
								$multiply: [
									{
										$divide: [
											{ $arrayElemAt: ['$sessions.totalCorrect', 0] },
											{ $arrayElemAt: ['$sessions.totalQuestions', 0] },
										],
									},
									100,
								],
							},
							else: 0,
						},
					},
					totalScore: { $ifNull: [{ $arrayElemAt: ['$sessions.totalScore', 0] }, 0] },
					sessionCount: { $ifNull: [{ $arrayElemAt: ['$sessions.sessionCount', 0] }, 0] },
				},
			},
			{
				$match: {
					sessionCount: { $gt: 0 }, // Only include users with sessions in this subject
				},
			},
			{
				$project: {
					userName: 1,
					level: 1,
					xp: 1,
					dailyStreak: 1,
					accuracy: 1,
					totalScore: 1,
					sessionCount: 1,
				},
			},
			{ $sort: { totalScore: -1, accuracy: -1, sessionCount: -1 } },
			{ $limit: 100 },
		];
	}

	private static async getWeeklyLeaderboardPipeline() {
		const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

		return [
			{
				$lookup: {
					from: 'quizsessions',
					localField: '_id',
					foreignField: 'userId',
					as: 'sessions',
					pipeline: [
						{
							$match: {
								status: 'completed',
								completedAt: { $gte: oneWeekAgo },
							},
						},
						{
							$group: {
								_id: '$userId',
								totalScore: { $sum: '$xpEarned' },
								sessionCount: { $sum: 1 },
							},
						},
					],
				},
			},
			{
				$addFields: {
					totalScore: { $ifNull: [{ $arrayElemAt: ['$sessions.totalScore', 0] }, 0] },
					sessionCount: { $ifNull: [{ $arrayElemAt: ['$sessions.sessionCount', 0] }, 0] },
				},
			},
			{
				$match: {
					sessionCount: { $gt: 0 },
				},
			},
			{
				$project: {
					userName: 1,
					level: 1,
					xp: 1,
					dailyStreak: 1,
					totalScore: 1,
					sessionCount: 1,
				},
			},
			{ $sort: { totalScore: -1, sessionCount: -1 } },
			{ $limit: 50 },
		];
	}

	private static async getFriendsLeaderboardPipeline(userId: string) {
		// Get user's friends
		const friends = await Friend.find({
			$or: [
				{ userId, status: 'accepted' },
				{ friendId: userId, status: 'accepted' },
			],
		});

		const friendIds = friends.map((f: any) =>
			f.userId.toString() === userId ? f.friendId : f.userId,
		);

		if (friendIds.length === 0) {
			return [{ $match: { _id: userId } }]; // Just return the user if no friends
		}

		friendIds.push(userId); // Include self in friends leaderboard

		return [
			{ $match: { _id: { $in: friendIds } } },
			{
				$lookup: {
					from: 'userpokemons',
					localField: '_id',
					foreignField: 'userId',
					as: 'pokemon',
				},
			},
			{
				$lookup: {
					from: 'userbadges',
					localField: '_id',
					foreignField: 'userId',
					as: 'badges',
					pipeline: [{ $match: { isEarned: true } }],
				},
			},
			{
				$addFields: {
					pokemonCount: { $size: '$pokemon' },
					badgeCount: { $size: '$badges' },
					totalScore: { $add: ['$xp', { $multiply: ['$level', 1000] }] },
				},
			},
			{
				$project: {
					userName: 1,
					level: 1,
					xp: 1,
					dailyStreak: 1,
					pokemonCount: 1,
					badgeCount: 1,
					totalScore: 1,
				},
			},
			{ $sort: { totalScore: -1, level: -1 } },
		];
	}

	private static getDateFilter(timeframe: string) {
		const now = new Date();
		let startDate: Date;

		switch (timeframe) {
			case 'daily':
				startDate = new Date(now.setHours(0, 0, 0, 0));
				break;
			case 'weekly':
				startDate = new Date(now.setDate(now.getDate() - 7));
				break;
			case 'monthly':
				startDate = new Date(now.setMonth(now.getMonth() - 1));
				break;
			default:
				return {};
		}

		return { completedAt: { $gte: startDate } };
	}

	// Get user's rank in a leaderboard
	static async getUserRank(
		userId: string,
		leaderboardType: string,
		subject?: string,
	): Promise<number> {
		const leaderboard = await this.calculateLeaderboard(
			leaderboardType as any,
			subject,
			'all-time',
		);

		const userRanking = leaderboard.rankings.find((r: any) => r.userId._id.toString() === userId);

		return userRanking ? userRanking.rank : -1;
	}
}
