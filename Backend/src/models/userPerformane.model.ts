// models/userPerformance.model.ts
import { Schema, model } from 'mongoose';
import { IUserPerformance } from '../types/adaptive.types';

const UserPerformanceSchema = new Schema<IUserPerformance>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		subject: {
			type: String,
			enum: ['math', 'science', 'coding'],
			required: true,
		},
		difficultyLevel: {
			type: String,
			enum: ['beginner', 'intermediate', 'advanced', 'expert'],
			default: 'beginner',
		},
		correctAnswers: {
			type: Number,
			default: 0,
		},
		totalQuestions: {
			type: Number,
			default: 0,
		},
		streak: {
			type: Number,
			default: 0,
		},
		averageTimePerQuestion: {
			type: Number,
			default: 0,
		},
		lastPerformanceUpdate: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
	},
);

// Compound index
UserPerformanceSchema.index({ userId: 1, subject: 1 }, { unique: true });

// Virtual for accuracy percentage
UserPerformanceSchema.virtual('accuracy').get(function () {
	return this.totalQuestions > 0 ? (this.correctAnswers / this.totalQuestions) * 100 : 0;
});

// Ensure virtual fields are serialized
UserPerformanceSchema.set('toJSON', { virtuals: true });

export const UserPerformance = model<IUserPerformance>('UserPerformance', UserPerformanceSchema);
