// jobs/dailyQuest.job.ts
import cron from 'node-cron';
import { DailyQuestService } from '../utils/services/dailyQuest.service';
import { User } from '../models/user.model';

// Run every day at 3 AM
cron.schedule('0 3 * * *', async () => {
	try {
		console.log('Starting daily quest generation...');

		const users: any = await User.find({ isActive: true });

		for (const user of users) {
			await DailyQuestService.generateDailyQuests(user?._id.toString());
		}

		console.log(`Generated daily quests for ${users.length} users`);
	} catch (error) {
		console.error('Error generating daily quests:', error);
	}
});

export const startDailyQuestJob = () => {
	console.log('Daily quest job started');
};
