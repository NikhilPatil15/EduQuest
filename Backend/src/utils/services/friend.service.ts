// services/friend.service.ts
import { Friend } from '../../models/friend.model';
import { User } from '../../models/user.model';
import { Notification } from '../../models/notification.model';

export class FriendService {
	// Send friend request
	static async sendFriendRequest(userId: string, friendUsername: string) {
		const friend: any = await User.findOne({ userName: friendUsername });
		if (!friend) {
			throw new Error('User not found');
		}

		if (userId === friend._id.toString()) {
			throw new Error('Cannot send friend request to yourself');
		}

		// Check if request already exists
		const existingRequest = await Friend.findOne({
			$or: [
				{ userId, friendId: friend._id },
				{ userId: friend._id, friendId: userId },
			],
		});

		if (existingRequest) {
			if (existingRequest.status === 'pending') {
				throw new Error('Friend request already pending');
			}
			if (existingRequest.status === 'accepted') {
				throw new Error('Already friends with this user');
			}
			if (existingRequest.status === 'blocked') {
				throw new Error('Cannot send request to blocked user');
			}
		}

		// Create friend request
		const friendRequest = await Friend.create({
			userId,
			friendId: friend._id,
			status: 'pending',
			requestedAt: new Date(),
		});

		// Send notification to friend
		const requestingUser = await User.findById(userId);
		await Notification.create({
			userId: friend._id,
			type: 'social',
			title: 'New Friend Request',
			message: `${requestingUser?.userName} wants to be your friend!`,
			actionUrl: `/friends/requests`,
		});

		return friendRequest;
	}

	// Accept friend request
	static async acceptFriendRequest(userId: string, requestId: string) {
		const friendRequest = await Friend.findOne({
			_id: requestId,
			friendId: userId,
			status: 'pending',
		});

		if (!friendRequest) {
			throw new Error('Friend request not found');
		}

		friendRequest.status = 'accepted';
		friendRequest.acceptedAt = new Date();
		await friendRequest.save();

		// Send notification to requester
		const acceptingUser = await User.findById(userId);
		await Notification.create({
			userId: friendRequest.userId,
			type: 'social',
			title: 'Friend Request Accepted',
			message: `${acceptingUser?.userName} accepted your friend request!`,
			actionUrl: `/friends`,
		});

		return friendRequest;
	}

	// Decline friend request
	static async declineFriendRequest(userId: string, requestId: string) {
		const friendRequest = await Friend.findOneAndDelete({
			_id: requestId,
			friendId: userId,
			status: 'pending',
		});

		if (!friendRequest) {
			throw new Error('Friend request not found');
		}

		return friendRequest;
	}

	// Remove friend
	static async removeFriend(userId: string, friendId: string) {
		const friendship = await Friend.findOneAndDelete({
			$or: [
				{ userId, friendId },
				{ userId: friendId, friendId: userId },
			],
			status: 'accepted',
		});

		if (!friendship) {
			throw new Error('Friendship not found');
		}

		return friendship;
	}

	// Get user's friends
	static async getUserFriends(userId: string) {
		const friends = await Friend.find({
			$or: [
				{ userId, status: 'accepted' },
				{ friendId: userId, status: 'accepted' },
			],
		})
			.populate('userId', 'userName level xp avatar')
			.populate('friendId', 'userName level xp avatar');

		return friends.map((friendship: any) => {
			const isRequester = friendship.userId?._id.toString() === userId;
			const friend = isRequester ? friendship.friendId : friendship.userId;

			return {
				friendshipId: friendship._id,
				friend,
				isRequester,
				acceptedAt: friendship.acceptedAt,
			};
		});
	}

	// Get pending friend requests
	static async getPendingRequests(userId: string) {
		const requests = await Friend.find({
			friendId: userId,
			status: 'pending',
		})
			.populate('userId', 'userName level xp avatar')
			.sort({ requestedAt: -1 });

		return requests;
	}

	// Get friend suggestions
	static async getFriendSuggestions(userId: string, limit: number = 10) {
		// Get users who are not already friends or have pending requests
		const existingRelationships = await Friend.find({
			$or: [{ userId }, { friendId: userId }],
		});

		const excludedUserIds = [
			userId,
			...existingRelationships.map((r) =>
				r.userId.toString() === userId ? r.friendId.toString() : r.userId.toString(),
			),
		];

		// Find users with similar levels and activity
		const suggestions = await User.aggregate([
			{ $match: { _id: { $nin: excludedUserIds } } },
			{
				$lookup: {
					from: 'quizsessions',
					localField: '_id',
					foreignField: 'userId',
					as: 'sessions',
				},
			},
			{
				$addFields: {
					sessionCount: { $size: '$sessions' },
					levelDifference: { $abs: { $subtract: ['$level', 10] } }, // Adjust based on user's level
				},
			},
			{ $match: { sessionCount: { $gt: 0 } } },
			{ $sort: { levelDifference: 1, sessionCount: -1 } },
			{ $limit: limit },
			{
				$project: {
					userName: 1,
					level: 1,
					xp: 1,
					avatar: 1,
					sessionCount: 1,
				},
			},
		]);

		return suggestions;
	}
}
