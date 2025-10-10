// models/notification.model.ts
import { Schema, model } from 'mongoose';
import { INotification } from '../types/feedback.types';

const NotificationSchema = new Schema<INotification>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		type: {
			type: String,
			enum: ['quest', 'battle', 'social', 'system', 'reward'],
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
		actionUrl: {
			type: String,
		},
		imageUrl: {
			type: String,
		},
		isRead: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	},
);

// Index for user notifications
NotificationSchema.index({ userId: 1, isRead: 1 });
NotificationSchema.index({ createdAt: -1 });

export const Notification = model<INotification>('Notification', NotificationSchema);
