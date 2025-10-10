// routes/feedback.routes.ts
import { Router } from 'express';
import {
	getDailyQuests,
	claimQuestReward,
	getPerformanceInsights,
	markInsightAsRead,
	getUserStreak,
	getNotifications,
	markNotificationAsRead,
	markAllNotificationsAsRead,
} from '../controllers/feedback.controller';
import { verifyJWT } from '../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(verifyJWT);

// Quest routes
router.route('/quests').get(getDailyQuests);
router.route('/quests/:questId/claim').post(claimQuestReward);

// Insight routes
router.route('/insights').get(getPerformanceInsights);
router.route('/insights/:insightId/read').patch(markInsightAsRead);

// Streak routes
router.route('/streak').get(getUserStreak);

// Notification routes
router.route('/notifications').get(getNotifications);
router.route('/notifications/:notificationId/read').patch(markNotificationAsRead);
router.route('/notifications/read-all').patch(markAllNotificationsAsRead);

export default router;
