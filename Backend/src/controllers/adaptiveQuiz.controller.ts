// controllers/adaptiveQuiz.controller.ts
import { asyncHandler } from '../utils/asyncHandler';
import { ErrorResponse } from '../utils/errorResponse';
import { SuccessResponse } from '../utils/successResponse';
import { AdaptiveDifficultyService } from '../utils/services/adaptiveDifficulty.service';
import { UserPerformance } from '../models/userPerformane.model';
import { Response } from 'express';
import { QuizSession } from '../models/quizSession.model';

// Start adaptive quiz
const startAdaptiveQuiz = asyncHandler(async (req: any, res: Response) => {
	const { subject, questionCount = 8 } = req.body;

	if (!subject) {
		throw new ErrorResponse(400, 'Subject is required');
	}

	// Check if user has active session
	const activeSession = await QuizSession.findOne({
		userId: req.user._id,
		status: 'in_progress',
	});

	if (activeSession) {
		throw new ErrorResponse(400, 'You have an active quiz session. Please complete it first.');
	}

	// Get adaptive questions
	const questions = await AdaptiveDifficultyService.getAdaptiveQuestions(
		req.user._id,
		subject,
		questionCount,
	);

	if (questions.length === 0) {
		throw new ErrorResponse(404, 'No questions found for adaptive quiz');
	}

	// Get current difficulty for user
	const currentDifficulty = await AdaptiveDifficultyService.calculateUserDifficulty(
		req.user._id,
		subject,
	);

	// Create quiz session
	const quizSession = await QuizSession.create({
		userId: req.user._id,
		subject,
		difficulty: currentDifficulty, // Now this matches the type
		questions: questions.map((q) => q._id),
		totalQuestions: questions.length,
		status: 'in_progress',
		isAdaptive: true,
	});

	const currentQuestion = questions[0];

	return res.status(200).json(
		new SuccessResponse(
			200,
			{
				sessionId: quizSession._id,
				currentQuestion: {
					_id: currentQuestion._id,
					question: currentQuestion.question,
					questionType: currentQuestion.questionType,
					options: currentQuestion.options,
					timeLimit: currentQuestion.timeLimit,
					difficulty: currentQuestion.difficulty,
				},
				progress: {
					current: 1,
					total: questions.length,
				},
				adaptiveInfo: {
					currentDifficulty,
					isAdaptive: true,
				},
			},
			'Adaptive quiz started successfully',
		),
	);
});

// Update performance after adaptive quiz
const updateAdaptivePerformance = asyncHandler(async (req: any, res: Response) => {
	const { sessionId } = req.params;
	const { correctAnswers, totalQuestions, averageTime, streak } = req.body;

	// Get session to determine subject
	const session = await QuizSession.findById(sessionId);
	if (!session) {
		throw new ErrorResponse(404, 'Quiz session not found');
	}

	// Update adaptive performance
	const performance = await AdaptiveDifficultyService.updateUserPerformance(
		req.user._id,
		session.subject,
		{
			correctAnswers,
			totalQuestions,
			averageTime,
			streak,
		},
	);

	return res.status(200).json(
		new SuccessResponse(
			200,
			{
				performance: {
					accuracy: performance.accuracy,
					difficultyLevel: performance.difficultyLevel,
					streak: performance.streak,
				},
				levelUp: performance.difficultyLevel !== session.difficulty,
			},
			'Performance updated successfully',
		),
	);
});

// Get user performance analytics
const getPerformanceAnalytics = asyncHandler(async (req: any, res: Response) => {
	const { subject } = req.query;

	const filter: any = { userId: req.user._id };
	if (subject) filter.subject = subject;

	const performances = await UserPerformance.find(filter);

	const analytics = performances.map((perf) => ({
		subject: perf.subject,
		difficultyLevel: perf.difficultyLevel,
		accuracy: perf.accuracy,
		streak: perf.streak,
		totalQuestions: perf.totalQuestions,
		averageTime: perf.averageTimePerQuestion,
		nextLevelRequirements: getNextLevelRequirements(perf),
	}));

	return res.status(200).json(
		new SuccessResponse(
			200,
			{
				analytics,
				overallStats: calculateOverallStats(performances),
			},
			'Performance analytics fetched successfully',
		),
	);
});

// Helper functions
function getNextLevelRequirements(performance: any) {
	const requirements = {
		accuracy: 70,
		streak: 3,
		time: 20,
	};

	// Customize based on current level
	if (performance.difficultyLevel === 'intermediate') {
		requirements.accuracy = 75;
		requirements.streak = 4;
	} else if (performance.difficultyLevel === 'advanced') {
		requirements.accuracy = 80;
		requirements.streak = 5;
	}

	return requirements;
}

function calculateOverallStats(performances: any[]) {
	const totalAccuracy =
		performances.reduce((sum, perf) => sum + perf.accuracy, 0) / performances.length;
	const totalQuestions = performances.reduce((sum, perf) => sum + perf.totalQuestions, 0);
	const averageStreak =
		performances.reduce((sum, perf) => sum + perf.streak, 0) / performances.length;

	return {
		averageAccuracy: Math.round(totalAccuracy),
		totalQuestions,
		averageStreak: Math.round(averageStreak),
		subjectsMastered: performances.filter((p) => p.difficultyLevel === 'expert').length,
	};
}

export { startAdaptiveQuiz, updateAdaptivePerformance, getPerformanceAnalytics };
