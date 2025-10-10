// models/friend.model.ts
import { Schema, model } from 'mongoose';
import { IFriend } from '../types/leaderboard.types';

const FriendSchema = new Schema<IFriend>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		friendId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		status: {
			type: String,
			enum: ['pending', 'accepted', 'blocked'],
			default: 'pending',
		},
		requestedAt: {
			type: Date,
			default: Date.now,
		},
		acceptedAt: {
			type: Date,
		},
	},
	{
		timestamps: true,
	},
);

// Compound index for friend relationships
FriendSchema.index({ userId: 1, friendId: 1 }, { unique: true });
FriendSchema.index({ userId: 1, status: 1 });

export const Friend = model<IFriend>('Friend', FriendSchema);
