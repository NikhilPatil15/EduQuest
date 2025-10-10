// routes/quiz.routes.ts
import { Router } from 'express';
import {
	startQuiz,
	getNextQuestion,
	submitAnswer,
	getQuizResults,
	getQuizHistory,
	getSubjects,
	unlockSubject,
} from '../controllers/quiz.controller';
import { verifyJWT } from '../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(verifyJWT);

router.route('/subjects').get(getSubjects);
router.route('/unlock-subject').post(unlockSubject);
router.route('/history').get(getQuizHistory);
router.route('/start').post(startQuiz);
router.route('/:sessionId/next').get(getNextQuestion);
router.route('/:sessionId/answer').post(submitAnswer);
router.route('/:sessionId/results').get(getQuizResults);

export default router;
