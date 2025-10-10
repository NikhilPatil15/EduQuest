// models/performanceInsight.model.ts
import { Schema, model } from 'mongoose';
import { IPerformanceInsight } from '../types/feedback.types';

const PerformanceInsightSchema = new Schema<IPerformanceInsight>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		type: {
			type: String,
			enum: ['streak_alert', 'level_up', 'subject_improvement', 'performance_dip', 'milestone'],
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		message: {
			type: String,
			required: true,
		},
		data: {
			type: Schema.Types.Mixed,
			default: {},
		},
		isRead: {
			type: Boolean,
			default: false,
		},
		priority: {
			type: String,
			enum: ['low', 'medium', 'high'],
			default: 'medium',
		},
		expiresAt: {
			type: Date,
		},
	},
	{
		timestamps: true,
	},
);

// Index for user insights
PerformanceInsightSchema.index({ userId: 1, isRead: 1 });
PerformanceInsightSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const PerformanceInsight = model<IPerformanceInsight>(
	'PerformanceInsight',
	PerformanceInsightSchema,
);
