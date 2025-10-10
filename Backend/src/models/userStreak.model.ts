// models/userStreak.model.ts
import { Schema, model } from 'mongoose';
import { IUserStreak } from '../types/feedback.types';

const UserStreakSchema = new Schema<IUserStreak>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			unique: true,
		},
		currentStreak: {
			type: Number,
			default: 0,
		},
		longestStreak: {
			type: Number,
			default: 0,
		},
		lastActivityDate: {
			type: Date,
			default: Date.now,
		},
		totalDaysActive: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	},
);

export const UserStreak = model<IUserStreak>('UserStreak', UserStreakSchema);
