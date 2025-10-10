// models/quiz.model.ts
import { Schema, model } from 'mongoose';
import { IQuiz, IQuizModel } from '../types/quiz.types';

const QuizSchema = new Schema<IQuiz, IQuizModel>(
	{
		subject: {
			type: String,
			enum: ['math', 'science', 'coding'],
			required: true,
		},
		chapter: {
			type: String,
			required: true,
		},
		difficulty: {
			type: String,
			enum: ['easy', 'medium', 'hard'],
			default: 'easy',
		},
		question: {
			type: String,
			required: true,
			trim: true,
		},
		questionType: {
			type: String,
			enum: ['multiple_choice', 'true_false', 'fill_blank'],
			default: 'multiple_choice',
		},
		options: [
			{
				type: String,
			},
		],
		correctAnswer: {
			type: String,
			required: true,
		},
		explanation: {
			type: String,
			required: true,
		},
		timeLimit: {
			type: Number,
			default: 30,
		},
		xpReward: {
			type: Number,
			default: 100,
		},
		coinReward: {
			type: Number,
			default: 10,
		},
		pokemonType: {
			type: String,
			required: true,
		},
		tags: [
			{
				type: String,
			},
		],
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	},
);

// Indexes for faster queries
QuizSchema.index({ subject: 1, difficulty: 1 });
QuizSchema.index({ subject: 1, chapter: 1 });
QuizSchema.index({ isActive: 1 });

// ✅ FIXED: Static method to get random quizzes
QuizSchema.statics.getRandomQuizzes = async function (
	subject: string,
	difficulty: string,
	limit: number = 10,
): Promise<IQuiz[]> {
	return this.aggregate([
		{
			$match: {
				subject,
				difficulty,
				isActive: true,
			},
		},
		{ $sample: { size: limit } },
	]);
};

export const Quiz = model<IQuiz, IQuizModel>('Quiz', QuizSchema);
