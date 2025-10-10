// controllers/quiz.controller.ts
import { asyncHandler } from '../utils/asyncHandler';
import { ErrorResponse } from '../utils/errorResponse';
import { SuccessResponse } from '../utils/successResponse';
import { Quiz } from '../models/quiz.model';
import { QuizSession } from '../models/quizSession.model';
import { User } from '../models/user.model';
import { Pokemon } from '../models/pokemon.model';
import { UserPokemon } from '../models/userpokemon.model';
import { Response } from 'express';

// Start a new quiz session
const startQuiz = asyncHandler(async (req: any, res: Response) => {
	const { subject, difficulty, questionCount = 10 } = req.body;

	if (!subject || !difficulty) {
		throw new ErrorResponse(400, 'Subject and difficulty are required');
	}

	// Check if user has active session
	const activeSession = await QuizSession.findOne({
		userId: req.user._id,
		status: 'in_progress',
	});

	if (activeSession) {
		throw new ErrorResponse(400, 'You have an active quiz session. Please complete it first.');
	}

	// Get random questions
	const questions = await Quiz.getRandomQuizzes(subject, difficulty, questionCount);

	if (questions.length === 0) {
		throw new ErrorResponse(404, 'No questions found for this subject and difficulty');
	}

	// Create quiz session
	const quizSession = await QuizSession.create({
		userId: req.user._id,
		subject,
		difficulty,
		questions: questions.map((q) => q._id),
		totalQuestions: questions.length,
		status: 'in_progress',
	});

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
				},
				progress: {
					current: 1,
					total: questions.length,
				},
			},
			'Quiz started successfully',
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

	const quizSession: any = await QuizSession.findOne({
		_id: sessionId,
		userId: req.user._id,
		status: 'in_progress',
	}).populate('questions');

	if (!quizSession) {
		throw new ErrorResponse(404, 'Quiz session not found or completed');
	}

	const currentQuestion: any = quizSession.questions[quizSession.currentQuestionIndex];
	const isCorrect = answer === currentQuestion.correctAnswer;

	// Update session
	if (isCorrect) {
		quizSession.correctAnswers += 1;
		quizSession.score += currentQuestion.xpReward;
	}

	quizSession.timeSpent += timeSpent || 0;
	quizSession.currentQuestionIndex += 1;

	// Check if session is completed
	const isCompleted = quizSession.currentQuestionIndex >= quizSession.questions.length;

	if (isCompleted) {
		await completeQuizSession(quizSession);
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
				isCompleted,
				nextQuestion: nextQuestion
					? {
							_id: nextQuestion._id,
							question: nextQuestion.question,
							questionType: nextQuestion.questionType,
							options: nextQuestion.options,
							timeLimit: nextQuestion.timeLimit,
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

// Complete quiz session and give rewards
const completeQuizSession = async (quizSession: any) => {
	quizSession.status = 'completed';
	quizSession.completedAt = new Date();

	const user: any = await User.findById(quizSession.userId);
	const score = quizSession.calculateScore();

	// Calculate rewards based on performance
	const baseXP = quizSession.score;
	const baseCoins = quizSession.correctAnswers * 10;

	// Bonus for speed (faster = more bonus)
	const timeBonus = Math.max(0, 100 - quizSession.timeSpent / quizSession.questions.length);
	const speedBonus = Math.round(timeBonus * 0.5); // Up to 50% bonus

	// Bonus for accuracy
	const accuracyBonus = score >= 80 ? 50 : score >= 60 ? 25 : 0;

	quizSession.xpEarned = baseXP + speedBonus + accuracyBonus;
	quizSession.coinsEarned = baseCoins + Math.round(accuracyBonus / 2);

	// Add rewards to user
	await user.addXP(quizSession.xpEarned);
	await user.addCoins(quizSession.coinsEarned);

	// Update user quiz stats
	user.totalQuizzes += 1;
	user.correctAnswers += quizSession.correctAnswers;

	await user.save();
	await quizSession.save();

	// Check for Pokemon reward (if score is high enough)
	if (score >= 80) {
		const availablePokemon = await Pokemon.find({
			type: quizSession.subject,
			rarity: { $in: ['common', 'rare'] },
		});

		if (availablePokemon.length > 0) {
			const randomPokemon = availablePokemon[Math.floor(Math.random() * availablePokemon.length)];
			quizSession.pokemonReward = randomPokemon._id;
			await quizSession.save();

			return {
				xpEarned: quizSession.xpEarned,
				coinsEarned: quizSession.coinsEarned,
				pokemonReward: randomPokemon,
				score,
				passed: quizSession.didPass(),
			};
		}
	}

	return {
		xpEarned: quizSession.xpEarned,
		coinsEarned: quizSession.coinsEarned,
		pokemonReward: null,
		score,
		passed: quizSession.didPass(),
	};
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
		questions: quizSession.questions.map((q: any) => ({
			question: q.question,
			correctAnswer: q.correctAnswer,
			explanation: q.explanation,
		})),
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
		.populate('pokemonReward', 'name image');

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

	const subjects = [
		{
			name: 'math',
			title: 'Mathematics',
			description: 'Master numbers and calculations',
			icon: '🧮',
			color: 'blue',
			unlocked: user.unlockedSubjects.includes('math'),
			requiredLevel: 1,
			totalQuizzes: await Quiz.countDocuments({ subject: 'math', isActive: true }),
			userQuizzes: await QuizSession.countDocuments({ userId: req.user._id, subject: 'math' }),
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
			userQuizzes: await QuizSession.countDocuments({ userId: req.user._id, subject: 'science' }),
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
			userQuizzes: await QuizSession.countDocuments({ userId: req.user._id, subject: 'coding' }),
		},
	];

	return res.status(200).json(new SuccessResponse(200, subjects, 'Subjects fetched successfully'));
});

// Unlock a new subject
const unlockSubject = asyncHandler(async (req: any, res: Response) => {
	const { subject } = req.body;

	const user: any = await User.findById(req.user._id);

	if (user.unlockedSubjects.includes(subject)) {
		throw new ErrorResponse(400, 'Subject already unlocked');
	}

	if (!user.canUnlockSubject(subject)) {
		throw new ErrorResponse(
			403,
			`You need to be level ${subject === 'science' ? 5 : 10} to unlock this subject`,
		);
	}

	user.unlockedSubjects.push(subject);
	await user.save();

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
};
