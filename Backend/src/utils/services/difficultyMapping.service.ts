// services/difficultyMapping.service.ts
import { DifficultyLevel } from '../../types/quiz.types';

export class DifficultyMappingService {
	// Map between adaptive difficulties and quiz difficulties
	private static readonly difficultyMap: Record<string, DifficultyLevel> = {
		beginner: 'easy',
		intermediate: 'medium',
		advanced: 'hard',
		expert: 'hard',
		easy: 'beginner',
		medium: 'intermediate',
		hard: 'advanced',
	};

	// Convert adaptive difficulty to quiz difficulty
	static toQuizDifficulty(adaptiveDifficulty: DifficultyLevel): DifficultyLevel {
		return this.difficultyMap[adaptiveDifficulty] || 'easy';
	}

	// Convert quiz difficulty to adaptive difficulty
	static toAdaptiveDifficulty(quizDifficulty: DifficultyLevel): DifficultyLevel {
		return this.difficultyMap[quizDifficulty] || 'beginner';
	}

	// Normalize any difficulty string to our union type
	static normalizeDifficulty(difficulty: string): DifficultyLevel {
		const normalized = difficulty.toLowerCase() as DifficultyLevel;
		if (
			['beginner', 'intermediate', 'advanced', 'expert', 'easy', 'medium', 'hard'].includes(
				normalized,
			)
		) {
			return normalized;
		}
		return 'beginner'; // Default fallback
	}

	// Get all adaptive difficulties (for performance tracking)
	static getAdaptiveDifficulties(): DifficultyLevel[] {
		return ['beginner', 'intermediate', 'advanced', 'expert'];
	}

	// Get all quiz difficulties (for question filtering)
	static getQuizDifficulties(): DifficultyLevel[] {
		return ['easy', 'medium', 'hard'];
	}
}
