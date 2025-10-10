// types/quiz.types.ts
import { Document, Model } from 'mongoose';

export interface IQuiz extends Document {
	_id: string;
	subject: 'math' | 'science' | 'coding';
	chapter: string;
	difficulty: 'easy' | 'medium' | 'hard';
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
	getRandomQuizzes(subject: string, difficulty: string, limit?: number): Promise<IQuiz[]>;
}
