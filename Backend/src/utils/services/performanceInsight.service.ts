import { PerformanceInsight } from '../../models/performanceInsight.model';
import { UserPerformance } from '../../models/userPerformance.model';
import { QuizSession } from '../../models/quizSession.model';
import { User } from '../../models/user.model';

export class PerformanceInsightService {
	// Generate performance insights for user
	static async generateInsights(userId: string): Promise<void> {
		const insights = [];

		// Check for streak milestones
		const streakInsight = await this.checkStreakMilestone(userId);
		if (streakInsight) insights.push(streakInsight);

		// Check for subject improvement
		const improvementInsights = await this.checkSubjectImprovement(userId);
		insights.push(...improvementInsights);

		// Check for performance dips
		const dipInsights = await this.checkPerformanceDips(userId);
		insights.push(...dipInsights);

		// Check for activity patterns
		const activityInsight = await this.checkActivityPattern(userId);
		if (activityInsight) insights.push(activityInsight);

		// Save insights
		if (insights.length > 0) {
			await PerformanceInsight.insertMany(insights);
		}
	}

	// Check for streak milestones - USING EXISTING USER STREAK
	private static async checkStreakMilestone(userId: string) {
		const user = await User.findById(userId);
		if (!user) return null;

		const currentStreak = user.dailyStreak;
		const milestones = [3, 7, 14, 30, 60, 90];

		if (milestones.includes(currentStreak)) {
			return {
				userId,
				type: 'milestone',
				title: 'Streak Milestone!',
				message: `Amazing! You've maintained a ${currentStreak}-day learning streak!`,
				data: { streak: currentStreak, milestone: `${currentStreak}-day streak` },
				priority: 'high',
			};
		}

		return null;
	}

	// Check for level ups - USING EXISTING USER LEVEL SYSTEM
	private static async checkLevelUps(userId: string) {
		const insights: any = [];
		const user = await User.findById(userId);

		if (!user) return insights;

		// Check recent level ups (you might want to add level history to User model)
		const recentSessions = await QuizSession.find({
			userId,
			status: 'completed',
			completedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Last 24 hours
		});

		if (recentSessions.length > 0) {
			const levelUps = recentSessions.filter(
				(session) => session.xpEarned > 0 && user.level > 1, // Simple check
			);

			if (levelUps.length > 0) {
				insights.push({
					userId,
					type: 'level_up',
					title: 'Level Up!',
					message: `Congratulations! You reached level ${user.level}!`,
					data: { newLevel: user.level },
					priority: 'high',
				});
			}
		}

		return insights;
	}

	// Check for subject improvement
	private static async checkSubjectImprovement(userId: string) {
		const insights = [];
		const performances = await UserPerformance.find({ userId });

		for (const performance of performances) {
			const recentSessions = await QuizSession.find({
				userId,
				subject: performance.subject,
				status: 'completed',
				completedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // Last 7 days
			})
				.sort({ completedAt: -1 })
				.limit(5);

			if (recentSessions.length >= 3) {
				const recentAccuracy =
					recentSessions.reduce(
						(sum, session) => sum + (session.correctAnswers / session.totalQuestions) * 100,
						0,
					) / recentSessions.length;

				if (recentAccuracy > performance.accuracy + 15) {
					// 15% improvement
					insights.push({
						userId,
						type: 'subject_improvement',
						title: 'Great Improvement!',
						message: `Your ${performance.subject} accuracy improved by ${Math.round(recentAccuracy - performance.accuracy)}%!`,
						data: {
							subject: performance.subject,
							improvement: Math.round(recentAccuracy - performance.accuracy),
							currentAccuracy: Math.round(recentAccuracy),
						},
						priority: 'medium',
					});
				}
			}
		}

		return insights;
	}

	// Check for performance dips
	private static async checkPerformanceDips(userId: string) {
		const insights = [];
		const performances = await UserPerformance.find({ userId });

		for (const performance of performances) {
			const recentSessions = await QuizSession.find({
				userId,
				subject: performance.subject,
				status: 'completed',
				completedAt: { $gte: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) }, // Last 3 days
			})
				.sort({ completedAt: -1 })
				.limit(3);

			if (recentSessions.length >= 2) {
				const recentAccuracy =
					recentSessions.reduce(
						(sum, session) => sum + (session.correctAnswers / session.totalQuestions) * 100,
						0,
					) / recentSessions.length;

				if (recentAccuracy < performance.accuracy - 20) {
					// 20% dip
					insights.push({
						userId,
						type: 'performance_dip',
						title: 'Performance Notice',
						message: `Your ${performance.subject} accuracy has dropped. Consider reviewing basics.`,
						data: {
							subject: performance.subject,
							dip: Math.round(performance.accuracy - recentAccuracy),
							currentAccuracy: Math.round(recentAccuracy),
						},
						priority: 'medium',
					});
				}
			}
		}

		return insights;
	}

	// Check for activity patterns
	private static async checkActivityPattern(userId: string) {
		const sessions = await QuizSession.find({
			userId,
			status: 'completed',
			completedAt: { $gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) }, // Last 14 days
		});

		if (sessions.length >= 10) {
			const weekendSessions = sessions.filter(
				(s) => [0, 6].includes(new Date(s.completedAt!).getDay()), // Weekend days
			).length;

			const weekendPercentage = (weekendSessions / sessions.length) * 100;

			if (weekendPercentage < 20) {
				return {
					userId,
					type: 'streak_alert',
					title: 'Weekend Learning',
					message: 'Try learning on weekends too! Consistent daily practice works best.',
					data: { weekendPercentage: Math.round(weekendPercentage) },
					priority: 'low',
				};
			}
		}

		return null;
	}

	// Get user insights
	static async getUserInsights(userId: string, limit: number = 10) {
		return PerformanceInsight.find({ userId }).sort({ priority: -1, createdAt: -1 }).limit(limit);
	}

	// Mark insight as read
	static async markInsightAsRead(insightId: string, userId: string) {
		return PerformanceInsight.findOneAndUpdate(
			{ _id: insightId, userId },
			{ isRead: true },
			{ new: true },
		);
	}
}
