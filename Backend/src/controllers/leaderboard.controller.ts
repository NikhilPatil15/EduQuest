// controllers/leaderboard.controller.ts
import { asyncHandler } from '../utils/asyncHandler';
import { ErrorResponse } from '../utils/errorResponse';
import { SuccessResponse } from '../utils/successResponse';
import { LeaderboardService } from '../utils/services/leaderboard.service';
import { BadgeService } from '../utils/services/badge.service';
import { FriendService } from '../utils/services/friend.service';
import { SocialShareService } from '../utils/services/socialShare.service';
import { Response } from 'express';

// Get leaderboard
const getLeaderboard = asyncHandler(async (req: any, res: Response) => {
	const { type = 'global', subject, timeframe = 'all-time', limit = 100 } = req.query;

	if (!['global', 'subject', 'weekly', 'friends'].includes(type)) {
		throw new ErrorResponse(400, 'Invalid leaderboard type');
	}

	if (type === 'subject' && !subject) {
		throw new ErrorResponse(400, 'Subject required for subject leaderboard');
	}

	const leaderboard = await LeaderboardService.calculateLeaderboard(type, subject, timeframe);

	// Get user's rank
	const userRank = await LeaderboardService.getUserRank(req.user._id.toString(), type, subject);

	return res.status(200).json(
		new SuccessResponse(
			200,
			{
				leaderboard,
				userRank,
				filters: { type, subject, timeframe },
			},
			'Leaderboard fetched successfully',
		),
	);
});

// Get user's badges
const getUserBadges = asyncHandler(async (req: any, res: Response) => {
	const badges = await BadgeService.getUserBadges(req.user._id.toString());

	return res
		.status(200)
		.json(new SuccessResponse(200, { badges }, 'User badges fetched successfully'));
});

// Get badge statistics
const getBadgeStats = asyncHandler(async (req: any, res: Response) => {
	const stats = await BadgeService.getBadgeStats(req.user._id.toString());

	return res
		.status(200)
		.json(new SuccessResponse(200, { stats }, 'Badge statistics fetched successfully'));
});

const shareBadge = asyncHandler(async (req: any, res: Response) => {
	const { badgeId } = req.body;

	if (!badgeId) {
		throw new ErrorResponse(400, 'Badge ID is required');
	}

	const userBadge = await BadgeService.shareBadge(req.user._id.toString(), badgeId);

	return res.status(200).json(new SuccessResponse(200, { userBadge }, 'Badge shared successfully'));
});

// Send friend request
const sendFriendRequest = asyncHandler(async (req: any, res: Response) => {
	const { friendUsername } = req.body;

	if (!friendUsername) {
		throw new ErrorResponse(400, 'Friend username is required');
	}

	const friendRequest = await FriendService.sendFriendRequest(
		req.user._id.toString(),
		friendUsername,
	);

	return res
		.status(200)
		.json(new SuccessResponse(200, { friendRequest }, 'Friend request sent successfully'));
});

// Accept friend request
const acceptFriendRequest = asyncHandler(async (req: any, res: Response) => {
	const { requestId } = req.params;

	const friendRequest = await FriendService.acceptFriendRequest(req.user._id.toString(), requestId);

	return res
		.status(200)
		.json(new SuccessResponse(200, { friendRequest }, 'Friend request accepted successfully'));
});

// Decline friend request
const declineFriendRequest = asyncHandler(async (req: any, res: Response) => {
	const { requestId } = req.params;

	const friendRequest = await FriendService.declineFriendRequest(
		req.user._id.toString(),
		requestId,
	);

	return res
		.status(200)
		.json(new SuccessResponse(200, { friendRequest }, 'Friend request declined successfully'));
});

// Remove friend
const removeFriend = asyncHandler(async (req: any, res: Response) => {
	const { friendId } = req.params;

	const friendship = await FriendService.removeFriend(req.user._id.toString(), friendId);

	return res
		.status(200)
		.json(new SuccessResponse(200, { friendship }, 'Friend removed successfully'));
});

// Get user's friends
const getUserFriends = asyncHandler(async (req: any, res: Response) => {
	const friends = await FriendService.getUserFriends(req.user._id.toString());

	return res
		.status(200)
		.json(new SuccessResponse(200, { friends }, 'Friends list fetched successfully'));
});

// Get pending friend requests
const getPendingRequests = asyncHandler(async (req: any, res: Response) => {
	const requests = await FriendService.getPendingRequests(req.user._id.toString());

	return res
		.status(200)
		.json(new SuccessResponse(200, { requests }, 'Pending requests fetched successfully'));
});

// Get friend suggestions
const getFriendSuggestions = asyncHandler(async (req: any, res: Response) => {
	const { limit = 10 } = req.query;

	const suggestions = await FriendService.getFriendSuggestions(
		req.user._id.toString(),
		parseInt(limit),
	);

	return res
		.status(200)
		.json(new SuccessResponse(200, { suggestions }, 'Friend suggestions fetched successfully'));
});

// Share victory
const shareVictory = asyncHandler(async (req: any, res: Response) => {
	const { quizData } = req.body;

	if (!quizData) {
		throw new ErrorResponse(400, 'Quiz data is required');
	}

	const share = await SocialShareService.shareVictory(req.user._id.toString(), quizData);

	return res.status(200).json(new SuccessResponse(200, { share }, 'Victory shared successfully'));
});

// Share level up
const shareLevelUp = asyncHandler(async (req: any, res: Response) => {
	const { newLevel } = req.body;

	if (!newLevel) {
		throw new ErrorResponse(400, 'New level is required');
	}

	const share = await SocialShareService.shareLevelUp(req.user._id.toString(), newLevel);

	return res.status(200).json(new SuccessResponse(200, { share }, 'Level up shared successfully'));
});

const sharePokemonCatch = asyncHandler(async (req: any, res: Response) => {
	const { pokemonId } = req.body;

	if (!pokemonId) {
		throw new ErrorResponse(400, 'Pokémon ID is required');
	}

	const { SocialShareService } = await import('../utils/services/socialShare.service');
	const share = await SocialShareService.sharePokemonCatch(req.user._id.toString(), pokemonId);

	return res
		.status(200)
		.json(new SuccessResponse(200, { share }, 'Pokémon catch shared successfully'));
});

// Get user's shares
const getUserShares = asyncHandler(async (req: any, res: Response) => {
	const { limit = 20 } = req.query;

	const shares = await SocialShareService.getUserShares(req.user._id.toString(), parseInt(limit));

	return res
		.status(200)
		.json(new SuccessResponse(200, { shares }, 'User shares fetched successfully'));
});

// Get popular shares
const getPopularShares = asyncHandler(async (req: any, res: Response) => {
	const { limit = 10 } = req.query;

	const shares = await SocialShareService.getPopularShares(parseInt(limit));

	return res
		.status(200)
		.json(new SuccessResponse(200, { shares }, 'Popular shares fetched successfully'));
});

// Increment share count
const incrementShareCount = asyncHandler(async (req: any, res: Response) => {
	const { shareId } = req.params;

	const share = await SocialShareService.incrementShareCount(shareId);

	return res
		.status(200)
		.json(new SuccessResponse(200, { share }, 'Share count incremented successfully'));
});

export {
	getLeaderboard,
	getUserBadges,
	getBadgeStats,
	shareBadge,
	sendFriendRequest,
	acceptFriendRequest,
	declineFriendRequest,
	removeFriend,
	getUserFriends,
	getPendingRequests,
	getFriendSuggestions,
	shareVictory,
	shareLevelUp,
	sharePokemonCatch,
	getUserShares,
	getPopularShares,
	incrementShareCount,
};
