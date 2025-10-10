// models/quizSession.model.ts - UPDATED
import { Schema, model } from 'mongoose';
import { IQuizSession } from '../types/quizSession.types';

const QuizSessionSchema = new Schema<IQuizSession>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		subject: {
			type: String,
			required: true,
		},
		difficulty: {
			type: String,
			required: true,
		},
		questions: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Quiz',
			},
		],
		currentQuestionIndex: {
			type: Number,
			default: 0,
		},
		score: {
			type: Number,
			default: 0,
		},
		totalQuestions: {
			type: Number,
			required: true,
		},
		correctAnswers: {
			type: Number,
			default: 0,
		},
		timeSpent: {
			type: Number,
			default: 0,
		},
		status: {
			type: String,
			enum: ['in_progress', 'completed', 'abandoned'],
			default: 'in_progress',
		},
		startedAt: {
			type: Date,
			default: Date.now,
		},
		completedAt: {
			type: Date,
		},
		xpEarned: {
			type: Number,
			default: 0,
		},
		coinsEarned: {
			type: Number,
			default: 0,
		},
		pokemonReward: {
			type: Schema.Types.ObjectId,
			ref: 'Pokemon',
		},

		// ✅ NEW FIELDS FOR ADAPTIVE SYSTEM
		isAdaptive: {
			type: Boolean,
			default: false,
		},
		currentStreak: {
			type: Number,
			default: 0,
		},
		userAnswers: [
			{
				questionId: {
					type: Schema.Types.ObjectId,
					ref: 'Quiz',
					required: true,
				},
				answer: {
					type: String,
					required: true,
				},
				isCorrect: {
					type: Boolean,
					required: true,
				},
				timeSpent: {
					type: Number,
					required: true,
				},
			},
		],
	},
	{
		timestamps: true,
	},
);

// Index for active sessions
QuizSessionSchema.index({ userId: 1, status: 1 });

// Method to calculate final score
QuizSessionSchema.methods.calculateScore = function () {
	return (this.correctAnswers / this.totalQuestions) * 100;
};

// Method to check if user passed (60% or higher)
QuizSessionSchema.methods.didPass = function () {
	return this.calculateScore() >= 60;
};

export const QuizSession = model<IQuizSession>('QuizSession', QuizSessionSchema);
