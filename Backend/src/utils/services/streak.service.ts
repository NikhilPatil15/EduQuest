// services/streak.service.ts - UPDATED (REPLACEMENT)
// This service now works with your existing User model
import { User } from '../../models/user.model';

export class StreakService {
	// Update user streak using existing method
	static async updateUserStreak(userId: string): Promise<number> {
		const user = await User.findById(userId);
		if (!user) return 0;

		const streak = await user.updateDailyStreak();
		return streak;
	}

	// Get user streak info from existing user data
	static async getUserStreak(userId: string) {
		const user = await User.findById(userId);
		if (!user) {
			return {
				currentStreak: 0,
				longestStreak: 0,
				lastActivityDate: new Date(),
				totalDaysActive: 0,
			};
		}

		// Calculate longest streak (you might want to add this field to User model)
		const longestStreak = user.dailyStreak; // Simple implementation

		return {
			currentStreak: user.dailyStreak,
			longestStreak: longestStreak,
			lastActivityDate: user.lastActive,
			totalDaysActive: await this.calculateTotalDaysActive(userId),
		};
	}

	private static async calculateTotalDaysActive(userId: string): Promise<number> {
		// You can implement this based on quiz sessions or keep it simple
		const user = await User.findById(userId);
		return user?.dailyStreak || 0; // Simple implementation
	}
}
