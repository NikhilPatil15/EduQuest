// types/quizSession.types.ts - UPDATED
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

	// ✅ NEW FIELDS FOR ADAPTIVE SYSTEM
	isAdaptive: boolean;
	currentStreak: number;
	userAnswers: {
		questionId: ObjectId;
		answer: string;
		isCorrect: boolean;
		timeSpent: number;
	}[];

	// ✅ ADDED: Instance methods
	calculateScore(): number;
	didPass(): boolean;
}
