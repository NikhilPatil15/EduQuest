// services/adaptiveDifficulty.service.ts - UPDATED
import { UserPerformance } from '../../models/userPerformane.model';
import { AdaptiveConfig } from '../../models/adaptiveConfig.model';
import { Quiz } from '../../models/quiz.model';
import { IUserPerformance } from '../../types/adaptive.types';
import { DifficultyMappingService } from './difficultyMapping.service';
import { DifficultyLevel } from '../../types/quiz.types';

export class AdaptiveDifficultyService {
	// Calculate user's appropriate difficulty level
	static async calculateUserDifficulty(userId: string, subject: string): Promise<DifficultyLevel> {
		let performance = await UserPerformance.findOne({ userId, subject });

		if (!performance) {
			performance = await UserPerformance.create({
				userId,
				subject,
				difficultyLevel: 'beginner',
			});
			return 'beginner';
		}

		const accuracy = performance.accuracy;
		const streak = performance.streak;
		const avgTime = performance.averageTimePerQuestion;

		// Get configuration for current level
		const config = await AdaptiveConfig.findOne({
			subject,
			difficulty: performance.difficultyLevel,
		});

		if (!config) return performance.difficultyLevel;

		// Check if user should level up
		if (
			accuracy >= config.accuracyThreshold &&
			streak >= config.streakRequired &&
			avgTime <= config.timeThreshold
		) {
			return this.getNextDifficulty(performance.difficultyLevel);
		}

		// Check if user should level down
		if (accuracy < 50 && performance.difficultyLevel !== 'beginner') {
			return this.getPreviousDifficulty(performance.difficultyLevel);
		}

		return performance.difficultyLevel;
	}

	// Get adaptive quiz questions
	static async getAdaptiveQuestions(
		userId: string,
		subject: string,
		questionCount: number = 8,
	): Promise<any[]> {
		const adaptiveDifficulty = await this.calculateUserDifficulty(userId, subject);

		// Convert to quiz difficulty for database query
		const quizDifficulty = DifficultyMappingService.toQuizDifficulty(adaptiveDifficulty);

		// Get base questions for calculated difficulty
		const baseQuestions = await Quiz.getRandomQuizzes(subject, quizDifficulty, questionCount - 2);

		// Add challenge/reinforcement questions based on performance
		const performance = await UserPerformance.findOne({ userId, subject });
		if (!performance) return baseQuestions;

		const mixedQuestions = await this.getMixedDifficultyQuestions(
			baseQuestions,
			performance,
			subject,
			adaptiveDifficulty,
		);

		return mixedQuestions;
	}

	// Update user performance after quiz
	static async updateUserPerformance(
		userId: string,
		subject: string,
		updateData: {
			correctAnswers: number;
			totalQuestions: number;
			averageTime: number;
			streak: number;
		},
	): Promise<IUserPerformance> {
		const { correctAnswers, totalQuestions, averageTime, streak } = updateData;

		const performance = await UserPerformance.findOneAndUpdate(
			{ userId, subject },
			{
				$inc: {
					correctAnswers,
					totalQuestions,
				},
				streak,
				averageTimePerQuestion: averageTime,
				lastPerformanceUpdate: new Date(),
			},
			{ new: true, upsert: true },
		);

		// Recalculate and update difficulty level
		const newDifficulty = await this.calculateUserDifficulty(userId, subject);
		performance.difficultyLevel = newDifficulty;
		await performance.save();

		return performance;
	}

	// Mix questions with different difficulties for adaptive learning
	private static async getMixedDifficultyQuestions(
		baseQuestions: any[],
		performance: IUserPerformance,
		subject: string,
		currentDifficulty: DifficultyLevel,
	): Promise<any[]> {
		const questions = [...baseQuestions];
		const accuracy = performance.accuracy;

		// Add challenge question if performing well
		if (accuracy > 75 && currentDifficulty !== 'expert') {
			const nextDifficulty = this.getNextDifficulty(currentDifficulty);
			const quizDifficulty = DifficultyMappingService.toQuizDifficulty(nextDifficulty);

			const challengeQuestion = await Quiz.findOne({
				subject,
				difficulty: quizDifficulty,
				isActive: true,
			});
			if (challengeQuestion) questions.push(challengeQuestion);
		}

		// Add reinforcement question if struggling
		if (accuracy < 60 && currentDifficulty !== 'beginner') {
			const prevDifficulty = this.getPreviousDifficulty(currentDifficulty);
			const quizDifficulty = DifficultyMappingService.toQuizDifficulty(prevDifficulty);

			const reinforcementQuestion = await Quiz.findOne({
				subject,
				difficulty: quizDifficulty,
				isActive: true,
			});
			if (reinforcementQuestion) questions.push(reinforcementQuestion);
		}

		return questions.sort(() => Math.random() - 0.5); // Shuffle
	}

	private static getNextDifficulty(current: DifficultyLevel): DifficultyLevel {
		const difficulties: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced', 'expert'];
		const currentIndex = difficulties.indexOf(current);
		return difficulties[Math.min(currentIndex + 1, difficulties.length - 1)];
	}

	private static getPreviousDifficulty(current: DifficultyLevel): DifficultyLevel {
		const difficulties: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced', 'expert'];
		const currentIndex = difficulties.indexOf(current);
		return difficulties[Math.max(currentIndex - 1, 0)];
	}

	// Get user's current level progress
	static async getUserProgress(userId: string, subject: string) {
		const performance = await UserPerformance.findOne({ userId, subject });
		const currentDifficulty = await this.calculateUserDifficulty(userId, subject);
		const config = await AdaptiveConfig.findOne({ subject, difficulty: currentDifficulty });

		if (!performance || !config) {
			return null;
		}

		return {
			currentLevel: currentDifficulty,
			accuracy: performance.accuracy,
			streak: performance.streak,
			averageTime: performance.averageTimePerQuestion,
			nextLevelRequirements: {
				accuracy: config.accuracyThreshold,
				streak: config.streakRequired,
				time: config.timeThreshold,
			},
			progressToNextLevel: this.calculateProgress(performance, config),
		};
	}

	private static calculateProgress(performance: IUserPerformance, config: any) {
		const accuracyProgress = Math.min(100, (performance.accuracy / config.accuracyThreshold) * 100);
		const streakProgress = Math.min(100, (performance.streak / config.streakRequired) * 100);
		const timeProgress = Math.min(
			100,
			(1 - performance.averageTimePerQuestion / config.timeThreshold) * 100,
		);

		return Math.round((accuracyProgress + streakProgress + timeProgress) / 3);
	}
}
