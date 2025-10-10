// types/quizSession.types.ts
import { Document, ObjectId } from 'mongoose';

export interface IQuizSession extends Document {
	_id: string;
	userId: ObjectId;
	subject: string;
	difficulty: string;
	questions: string[];
	currentQuestionIndex: number;
	score: number;
	totalQuestions: number;
	correctAnswers: number;
	timeSpent: number;
	status: 'in_progress' | 'completed' | 'abandoned';
	startedAt: Date;
	completedAt?: Date;
	xpEarned: number;
	coinsEarned: number;
	pokemonReward?: string;
	createdAt: Date;
	updatedAt: Date;

	// ✅ ADDED: Instance methods
	calculateScore(): number;
	didPass(): boolean;
}
