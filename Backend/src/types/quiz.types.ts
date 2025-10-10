// types/quiz.types.ts - UPDATE EXISTING
import { Document, Model } from 'mongoose';

// Define a union type for difficulties that works across both systems
export type DifficultyLevel =
	| 'beginner'
	| 'intermediate'
	| 'advanced'
	| 'expert'
	| 'easy'
	| 'medium'
	| 'hard';

export interface IQuiz extends Document {
	_id: string;
	subject: 'math' | 'science' | 'coding';
	chapter: string;
	difficulty: DifficultyLevel; // Updated to use union type
	question: string;
	questionType: 'multiple_choice' | 'true_false' | 'fill_blank';
	options: string[];
	correctAnswer: string;
	explanation: string;
	timeLimit: number;
	xpReward: number;
	coinReward: number;
	pokemonType: string;
	tags: string[];
	createdBy?: string;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

// Static methods for Quiz model
export interface IQuizModel extends Model<IQuiz> {
	getRandomQuizzes(subject: string, difficulty: DifficultyLevel, limit?: number): Promise<IQuiz[]>;
}
