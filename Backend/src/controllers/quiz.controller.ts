import { asyncHandler } from '../utils/asyncHandler';
import { ErrorResponse } from '../utils/errorResponse';
import { SuccessResponse } from '../utils/successResponse';
import { Quiz } from '../models/quiz.model';
import { QuizSession } from '../models/quizSession.model';
import { User } from '../models/user.model';
import { Pokemon } from '../models/pokemon.model';
import { UserPokemon } from '../models/userpokemon.model';
import { AdaptiveDifficultyService } from '../utils/services/adaptiveDifficulty.service';
import { DailyQuestService } from '../utils/services/dailyQuest.service';
import { PerformanceInsightService } from '../utils/services/performanceInsight.service';
import { Response } from 'express';
import { IQuizSession } from '../types/quizSession.types';
import { MapRegion } from '../models/mapRegion.model';
import { WorldMapService } from '../utils/services/worldMap.service';
import { BadgeService } from '../utils/services/badge.service';
import { SocialShareService } from '../utils/services/socialShare.service';
import { PokedexService } from '../utils/services/pokedex.service';

const startQuiz = asyncHandler(async (req: any, res: Response) => {
	const { subject, difficulty, questionCount = 10, useAdaptive = false } = req.body;

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

	let questions;
	let finalDifficulty = difficulty;
	let isAdaptive = false;

	if (useAdaptive) {
		// Use adaptive difficulty system
		questions = await AdaptiveDifficultyService.getAdaptiveQuestions(
			req.user._id.toString(),
			subject,
			questionCount,
		);
		finalDifficulty = await AdaptiveDifficultyService.calculateUserDifficulty(
			req.user._id.toString(),
			subject,
		);
		isAdaptive = true;
	} else {
		// Use traditional fixed difficulty
		if (!difficulty) {
			throw new ErrorResponse(400, 'Difficulty is required for non-adaptive quizzes');
		}
		questions = await Quiz.getRandomQuizzes(subject, difficulty, questionCount);
	}

	if (questions.length === 0) {
		throw new ErrorResponse(404, 'No questions found for this subject and difficulty');
	}

	// Create quiz session with proper typing
	const quizSessionData = {
		userId: req.user._id,
		subject,
		difficulty: finalDifficulty,
		questions: questions.map((q) => q._id),
		totalQuestions: questions.length,
		status: 'in_progress' as const,
		isAdaptive: isAdaptive,
		currentStreak: 0,
		userAnswers: [],
	};

	const quizSession = await QuizSession.create(quizSessionData);

	// Return first question
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
					isAdaptive,
					currentDifficulty: finalDifficulty,
				},
			},
			'Quiz started successfully',
		),
	);
});

// controllers/quiz.controller.ts - FIXED
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

	// Use adaptive difficulty system directly
	const questions = await AdaptiveDifficultyService.getAdaptiveQuestions(
		req.user._id.toString(),
		subject,
		questionCount,
	);

	const finalDifficulty = await AdaptiveDifficultyService.calculateUserDifficulty(
		req.user._id.toString(),
		subject,
	);

	if (questions.length === 0) {
		throw new ErrorResponse(404, 'No questions found for adaptive quiz');
	}

	// Create quiz session
	const quizSessionData = {
		userId: req.user._id,
		subject,
		difficulty: finalDifficulty,
		questions: questions.map((q) => q._id),
		totalQuestions: questions.length,
		status: 'in_progress' as const,
		isAdaptive: true,
		currentStreak: 0,
		userAnswers: [],
	};

	const quizSession = await QuizSession.create(quizSessionData);

	// Return first question
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
					isAdaptive: true,
					currentDifficulty: finalDifficulty,
				},
			},
			'Adaptive quiz started successfully',
		),
	);
});

// Get next question in current session
const getNextQuestion = asyncHandler(async (req: any, res: Response) => {
	const { sessionId } = req.params;

	const quizSession = await QuizSession.findOne({
		_id: sessionId,
		userId: req.user._id,
		status: 'in_progress',
	}).populate('questions');

	if (!quizSession) {
		throw new ErrorResponse(404, 'Quiz session not found or completed');
	}

	if (quizSession.currentQuestionIndex >= quizSession.questions.length) {
		throw new ErrorResponse(400, 'No more questions in this session');
	}

	const currentQuestion: any = quizSession.questions[quizSession.currentQuestionIndex];

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
					current: quizSession.currentQuestionIndex + 1,
					total: quizSession.questions.length,
				},
			},
			'Next question fetched successfully',
		),
	);
});

// Submit answer for current question
const submitAnswer = asyncHandler(async (req: any, res: Response) => {
	const { sessionId } = req.params;
	const { answer, timeSpent } = req.body;

	if (!answer) {
		throw new ErrorResponse(400, 'Answer is required');
	}

	const quizSession = await QuizSession.findOne({
		_id: sessionId,
		userId: req.user._id,
		status: 'in_progress',
	}).populate('questions');

	if (!quizSession) {
		throw new ErrorResponse(404, 'Quiz session not found or completed');
	}

	const currentQuestion: any = quizSession.questions[quizSession.currentQuestionIndex];
	const isCorrect = answer === currentQuestion.correctAnswer;

	// Track streak for adaptive system
	let currentStreak = quizSession.currentStreak;
	if (isCorrect) {
		quizSession.correctAnswers += 1;
		quizSession.score += currentQuestion.xpReward;
		// Calculate streak (consecutive correct answers)
		quizSession.currentStreak = currentStreak + 1;
		currentStreak = quizSession.currentStreak;
	} else {
		quizSession.currentStreak = 0; // Reset streak on wrong answer
		currentStreak = 0;
	}

	// Track user answer
	quizSession.userAnswers.push({
		questionId: currentQuestion._id,
		answer,
		isCorrect,
		timeSpent: timeSpent || 0,
	});

	quizSession.timeSpent += timeSpent || 0;
	quizSession.currentQuestionIndex += 1;

	// Check if session is completed
	const isCompleted = quizSession.currentQuestionIndex >= quizSession.questions.length;

	if (isCompleted) {
		const result = await completeQuizSession(quizSession, currentStreak);

		// Send real-time feedback for completed quiz
		await sendQuizCompletionFeedback(req.user._id.toString(), quizSession, result);
	} else {
		await quizSession.save();
	}

	const nextQuestion: any = !isCompleted
		? quizSession.questions[quizSession.currentQuestionIndex]
		: null;

	return res.status(200).json(
		new SuccessResponse(
			200,
			{
				isCorrect,
				correctAnswer: currentQuestion.correctAnswer,
				explanation: currentQuestion.explanation,
				xpEarned: isCorrect ? currentQuestion.xpReward : 0,
				coinsEarned: isCorrect ? currentQuestion.coinReward : 0,
				currentStreak: quizSession.currentStreak,
				isCompleted,
				nextQuestion: nextQuestion
					? {
							_id: nextQuestion._id,
							question: nextQuestion.question,
							questionType: nextQuestion.questionType,
							options: nextQuestion.options,
							timeLimit: nextQuestion.timeLimit,
							difficulty: nextQuestion.difficulty,
						}
					: null,
				progress: {
					current: quizSession.currentQuestionIndex + (isCompleted ? 0 : 1),
					total: quizSession.questions.length,
				},
				sessionId: quizSession._id,
			},
			'Answer submitted successfully',
		),
	);
});

// In the completeQuizSession function - FIXED
const completeQuizSession = async (quizSession: IQuizSession, finalStreak: number) => {
	quizSession.status = 'completed';
	quizSession.completedAt = new Date();

	const user = await User.findById(quizSession.userId);
	if (!user) {
		throw new Error('User not found');
	}

	const score = quizSession.calculateScore();

	// Calculate rewards based on performance
	const baseXP = quizSession.score;
	const baseCoins = quizSession.correctAnswers * 10;

	// Bonus for speed (faster = more bonus)
	const avgTimePerQuestion = quizSession.timeSpent / quizSession.totalQuestions;
	const timeBonus = Math.max(0, 100 - avgTimePerQuestion);
	const speedBonus = Math.round(timeBonus * 0.5); // Up to 50% bonus

	// Bonus for accuracy
	const accuracyBonus = score >= 80 ? 50 : score >= 60 ? 25 : 0;

	// Bonus for streak
	const streakBonus = finalStreak >= 3 ? finalStreak * 5 : 0;

	quizSession.xpEarned = baseXP + speedBonus + accuracyBonus + streakBonus;
	quizSession.coinsEarned = baseCoins + Math.round(accuracyBonus / 2) + Math.round(streakBonus / 2);

	// Add rewards to user - PROPERLY HANDLE RETURN TYPES
	const rewardResult = await user.addXP(quizSession.xpEarned);
	await user.addCoins(quizSession.coinsEarned);

	// Update user quiz stats
	user.totalQuizzes += 1;
	user.correctAnswers += quizSession.correctAnswers;

	// Update daily streak
	await user.updateDailyStreak();

	await user.save();
	await quizSession.save();

	// UPDATE ADAPTIVE PERFORMANCE SYSTEM
	if (quizSession.isAdaptive) {
		await AdaptiveDifficultyService.updateUserPerformance(
			quizSession.userId.toString(),
			quizSession.subject,
			{
				correctAnswers: quizSession.correctAnswers,
				totalQuestions: quizSession.totalQuestions,
				averageTime: avgTimePerQuestion,
				streak: finalStreak,
			},
		);
	}

	// UPDATE QUEST PROGRESS
	await DailyQuestService.updateQuestProgress(quizSession.userId.toString(), 'quiz_completion');

	if (score >= 80) {
		await DailyQuestService.updateQuestProgress(quizSession.userId.toString(), 'subject_mastery');
	}

	// UPDATE WORLD MAP PROGRESS
	const region = await MapRegion.findOne({ subject: quizSession.subject });
	if (region) {
		await WorldMapService.updateRegionProgress(
			quizSession.userId.toString(),
			region._id.toString(),
			{
				score: score,
				timeSpent: quizSession.timeSpent,
			},
		);
	}

	// Check for Pokemon reward (if score is high enough)
	let pokemonReward = null;
	if (score >= 80) {
		const availablePokemon = await Pokemon.find({
			type: quizSession.subject,
			rarity: { $in: ['common', 'rare'] },
		});

		if (availablePokemon.length > 0) {
			const randomPokemon = availablePokemon[Math.floor(Math.random() * availablePokemon.length)];
			quizSession.pokemonReward = randomPokemon._id;
			await quizSession.save();
			pokemonReward = randomPokemon;

			// Update pokemon capture quest
			await DailyQuestService.updateQuestProgress(quizSession.userId.toString(), 'pokemon_capture');

			// ✅ FIXED: Record in Pokédex - USE pokemonReward VARIABLE, NOT result.pokemonReward
			await PokedexService.recordCatch(
				quizSession.userId.toString(),
				pokemonReward._id.toString(), // Use the local variable
			);

			// ✅ FIXED: Update research progress based on quiz performance
			await PokedexService.updateResearchProgress(
				quizSession.userId.toString(),
				pokemonReward._id.toString(), // Use the local variable
				Math.min(100, score), // Use quiz score as research progress
			);
		}
	} else {
		// ✅ FIXED: Record encounter for subject-related Pokémon (only if no Pokémon was caught)
		const subjectPokemon = await Pokemon.findOne({ subject: quizSession.subject });
		if (subjectPokemon) {
			await PokedexService.recordEncounter(
				quizSession.userId.toString(),
				subjectPokemon._id.toString(),
			);
		}
	}

	// ✅ FIXED: Check for badge awards
	const awardedBadges = await BadgeService.checkAndAwardBadges(quizSession.userId.toString());

	// ✅ FIXED: Auto-share if score is high
	if (score >= 90) {
		await SocialShareService.shareVictory(quizSession.userId.toString(), {
			score,
			subject: quizSession.subject,
			correctAnswers: quizSession.correctAnswers,
			totalQuestions: quizSession.totalQuestions,
		});
	}

	// ✅ FIXED: GENERATE PERFORMANCE INSIGHTS (async)
	PerformanceInsightService.generateInsights(quizSession.userId.toString()).catch(console.error);

	return {
		xpEarned: quizSession.xpEarned,
		coinsEarned: quizSession.coinsEarned,
		pokemonReward: pokemonReward, // This is the variable we defined
		score,
		passed: quizSession.didPass(),
		leveledUp: rewardResult.leveledUp,
		newLevel: rewardResult.newLevel,
		awardedBadges, // Include awarded badges in response
	};
};
// Real-time feedback for quiz completion
const sendQuizCompletionFeedback = async (
	userId: string,
	quizSession: IQuizSession,
	result: any,
) => {
	const { Notification } = await import('../models/notification.model');

	let message = '';
	let title = '';

	if (result.score >= 90) {
		title = 'Outstanding Performance! 🎉';
		message = `You scored ${Math.round(result.score)}% in ${quizSession.subject}! Amazing work!`;
	} else if (result.score >= 70) {
		title = 'Great Job! 👍';
		message = `You scored ${Math.round(result.score)}% in ${quizSession.subject}. Keep it up!`;
	} else {
		title = 'Quiz Completed 📚';
		message = `You scored ${Math.round(result.score)}% in ${quizSession.subject}. Practice makes perfect!`;
	}

	if (result.leveledUp) {
		title = `Level Up! 🚀 Level ${result.newLevel}`;
		message = `Congratulations! You've reached level ${result.newLevel} after your ${quizSession.subject} quiz.`;
	}

	if (result.pokemonReward) {
		title = 'New Pokémon Captured! 🎣';
		message = `You caught a ${result.pokemonReward.name} after mastering ${quizSession.subject}!`;
	}

	await Notification.create({
		userId,
		type: 'reward',
		title,
		message,
		actionUrl: `/quiz/results/${quizSession._id}`,
	});
};

// Get quiz session results
const getQuizResults = asyncHandler(async (req: any, res: Response) => {
	const { sessionId } = req.params;

	const quizSession = await QuizSession.findOne({
		_id: sessionId,
		userId: req.user._id,
	})
		.populate('questions')
		.populate('pokemonReward');

	if (!quizSession) {
		throw new ErrorResponse(404, 'Quiz session not found');
	}

	// Get adaptive performance data if applicable
	let adaptiveProgress = null;
	if (quizSession.isAdaptive) {
		adaptiveProgress = await AdaptiveDifficultyService.getUserProgress(
			req.user._id.toString(),
			quizSession.subject,
		);
	}

	const results = {
		sessionId: quizSession._id,
		subject: quizSession.subject,
		difficulty: quizSession.difficulty,
		score: quizSession.calculateScore(),
		correctAnswers: quizSession.correctAnswers,
		totalQuestions: quizSession.totalQuestions,
		timeSpent: quizSession.timeSpent,
		xpEarned: quizSession.xpEarned,
		coinsEarned: quizSession.coinsEarned,
		pokemonReward: quizSession.pokemonReward,
		passed: quizSession.didPass(),
		completedAt: quizSession.completedAt,
		isAdaptive: quizSession.isAdaptive,
		adaptiveProgress,
		questions: quizSession.questions.map((q: any) => ({
			question: q.question,
			correctAnswer: q.correctAnswer,
			explanation: q.explanation,
			difficulty: q.difficulty,
		})),
		userAnswers: quizSession.userAnswers,
	};

	return res
		.status(200)
		.json(new SuccessResponse(200, results, 'Quiz results fetched successfully'));
});

// Get user's quiz history
const getQuizHistory = asyncHandler(async (req: any, res: Response) => {
	const { page = 1, limit = 10, subject } = req.query;

	const filter: any = { userId: req.user._id, status: 'completed' };
	if (subject) filter.subject = subject;

	const sessions = await QuizSession.find(filter)
		.sort({ completedAt: -1 })
		.limit(limit * 1)
		.skip((page - 1) * limit)
		.populate('pokemonReward', 'name image')
		.select('-questions -userAnswers'); // Exclude large fields

	const total = await QuizSession.countDocuments(filter);

	return res.status(200).json(
		new SuccessResponse(
			200,
			{
				sessions,
				totalPages: Math.ceil(total / limit),
				currentPage: page,
				total,
			},
			'Quiz history fetched successfully',
		),
	);
});

// Get available subjects and progress
const getSubjects = asyncHandler(async (req: any, res: Response) => {
	const user: any = await User.findById(req.user._id);

	const subjectsData = [
		{
			name: 'math',
			title: 'Mathematics',
			description: 'Master numbers and calculations',
			icon: '🧮',
			color: 'blue',
			unlocked: user.unlockedSubjects.includes('math'),
			requiredLevel: 1,
			totalQuizzes: await Quiz.countDocuments({ subject: 'math', isActive: true }),
			userQuizzes: await QuizSession.countDocuments({
				userId: req.user._id,
				subject: 'math',
				status: 'completed',
			}),
		},
		{
			name: 'science',
			title: 'Science',
			description: 'Explore the world of science',
			icon: '🔬',
			color: 'green',
			unlocked: user.unlockedSubjects.includes('science'),
			requiredLevel: 5,
			totalQuizzes: await Quiz.countDocuments({ subject: 'science', isActive: true }),
			userQuizzes: await QuizSession.countDocuments({
				userId: req.user._id,
				subject: 'science',
				status: 'completed',
			}),
		},
		{
			name: 'coding',
			title: 'Coding',
			description: 'Learn programming fundamentals',
			icon: '💻',
			color: 'purple',
			unlocked: user.unlockedSubjects.includes('coding'),
			requiredLevel: 10,
			totalQuizzes: await Quiz.countDocuments({ subject: 'coding', isActive: true }),
			userQuizzes: await QuizSession.countDocuments({
				userId: req.user._id,
				subject: 'coding',
				status: 'completed',
			}),
		},
	];

	// Enhance with adaptive difficulty data
	const enhancedSubjects = await Promise.all(
		subjectsData.map(async (subject) => {
			const adaptiveProgress = await AdaptiveDifficultyService.getUserProgress(
				req.user._id.toString(),
				subject.name,
			);

			// Calculate user performance in this subject
			const userSessions = await QuizSession.find({
				userId: req.user._id,
				subject: subject.name,
				status: 'completed',
			});

			const totalCorrect = userSessions.reduce((sum, session) => sum + session.correctAnswers, 0);
			const totalQuestions = userSessions.reduce((sum, session) => sum + session.totalQuestions, 0);
			const userAccuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

			return {
				...subject,
				adaptiveLevel: adaptiveProgress?.currentLevel || 'beginner',
				accuracy: Math.round(userAccuracy),
				progressToNextLevel: adaptiveProgress?.progressToNextLevel || 0,
				totalUserQuizzes: userSessions.length,
			};
		}),
	);

	return res
		.status(200)
		.json(new SuccessResponse(200, enhancedSubjects, 'Subjects fetched successfully'));
});

// Unlock a new subject
const unlockSubject = asyncHandler(async (req: any, res: Response) => {
	const { subject } = req.body;

	const user: any = await User.findById(req.user._id);

	if (!user) {
		throw new ErrorResponse(404, 'User not found');
	}

	if (user.unlockedSubjects.includes(subject)) {
		throw new ErrorResponse(400, 'Subject already unlocked');
	}

	if (!user.canUnlockSubject(subject)) {
		const requiredLevels: { [key: string]: number } = {
			math: 1,
			science: 5,
			coding: 10,
		};
		throw new ErrorResponse(
			403,
			`You need to be level ${requiredLevels[subject]} to unlock this subject. Current level: ${user.level}`,
		);
	}

	user.unlockedSubjects.push(subject);
	await user.save();

	// Send notification
	const { Notification } = await import('../models/notification.model');
	await Notification.create({
		userId: user._id,
		type: 'system',
		title: 'New Subject Unlocked! 🎉',
		message: `You've unlocked ${subject.toUpperCase()}! Start exploring new challenges.`,
		actionUrl: `/subjects/${subject}`,
	});

	return res
		.status(200)
		.json(
			new SuccessResponse(
				200,
				{ unlockedSubjects: user.unlockedSubjects },
				'Subject unlocked successfully',
			),
		);
});

export {
	startQuiz,
	getNextQuestion,
	submitAnswer,
	getQuizResults,
	getQuizHistory,
	getSubjects,
	unlockSubject,
	startAdaptiveQuiz,
};
