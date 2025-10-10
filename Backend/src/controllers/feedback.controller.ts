// controllers/feedback.controller.ts
import { asyncHandler } from '../utils/asyncHandler';
import { ErrorResponse } from '../utils/errorResponse';
import { SuccessResponse } from '../utils/successResponse';
import { DailyQuestService } from '../utils/services/dailyQuest.service';
import { PerformanceInsightService } from '../utils/services/performanceInsight.service';
import { StreakService } from '../utils/services/streak.service';
import { Notification } from '../models/notification.model';
import { Response } from 'express';
import { User } from '../models/user.model';

// Get daily quests
const getDailyQuests = asyncHandler(async (req: any, res: Response) => {
	const quests = await DailyQuestService.getUserQuests(req.user._id);

	return res
		.status(200)
		.json(new SuccessResponse(200, { quests }, 'Daily quests fetched successfully'));
});

// Claim quest reward
const claimQuestReward = asyncHandler(async (req: any, res: Response) => {
	const { questId } = req.params;

	const reward = await DailyQuestService.claimQuestReward(questId, req.user._id);

	return res
		.status(200)
		.json(new SuccessResponse(200, { reward }, 'Quest reward claimed successfully'));
});

// Get performance insights
const getPerformanceInsights = asyncHandler(async (req: any, res: Response) => {
	const { limit = 10 } = req.query;

	const insights = await PerformanceInsightService.getUserInsights(req.user._id, parseInt(limit));

	return res
		.status(200)
		.json(new SuccessResponse(200, { insights }, 'Performance insights fetched successfully'));
});

// Mark insight as read
const markInsightAsRead = asyncHandler(async (req: any, res: Response) => {
	const { insightId } = req.params;

	const insight = await PerformanceInsightService.markInsightAsRead(insightId, req.user._id);

	if (!insight) {
		throw new ErrorResponse(404, 'Insight not found');
	}

	return res.status(200).json(new SuccessResponse(200, { insight }, 'Insight marked as read'));
});

// Get user streak

const getUserStreak = asyncHandler(async (req: any, res: Response) => {
	const user = await User.findById(req.user._id);

	if (!user) {
		throw new ErrorResponse(404, 'User not found');
	}

	const streakInfo = {
		currentStreak: user.dailyStreak,
		longestStreak: user.longestStreak || user.dailyStreak,
		lastActivityDate: user.lastActive,
		totalDaysActive: user.dailyStreak, // Simple implementation
	};

	return res
		.status(200)
		.json(new SuccessResponse(200, { streak: streakInfo }, 'User streak fetched successfully'));
});
// Get notifications
const getNotifications = asyncHandler(async (req: any, res: Response) => {
	const { limit = 20, unreadOnly = false } = req.query;

	const filter: any = { userId: req.user._id };
	if (unreadOnly) filter.isRead = false;

	const notifications = await Notification.find(filter)
		.sort({ createdAt: -1 })
		.limit(parseInt(limit));

	const unreadCount = await Notification.countDocuments({
		userId: req.user._id,
		isRead: false,
	});

	return res
		.status(200)
		.json(
			new SuccessResponse(
				200,
				{ notifications, unreadCount },
				'Notifications fetched successfully',
			),
		);
});

// Mark notification as read
const markNotificationAsRead = asyncHandler(async (req: any, res: Response) => {
	const { notificationId } = req.params;

	const notification = await Notification.findOneAndUpdate(
		{ _id: notificationId, userId: req.user._id },
		{ isRead: true },
		{ new: true },
	);

	if (!notification) {
		throw new ErrorResponse(404, 'Notification not found');
	}

	return res
		.status(200)
		.json(new SuccessResponse(200, { notification }, 'Notification marked as read'));
});

// Mark all notifications as read
const markAllNotificationsAsRead = asyncHandler(async (req: any, res: Response) => {
	await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });

	return res.status(200).json(new SuccessResponse(200, {}, 'All notifications marked as read'));
});

export {
	getDailyQuests,
	claimQuestReward,
	getPerformanceInsights,
	markInsightAsRead,
	getUserStreak,
	getNotifications,
	markNotificationAsRead,
	markAllNotificationsAsRead,
};
