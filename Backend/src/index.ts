import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { connectDatabase } from './database/dbConnection';
import { corsOrigin } from './config/settings';

import { setupSocketIO } from './socket';

const app = express();

dotenv.config({ path: './.env' });
const PORT = process.env.PORT || 5000;

const server = createServer(app);

const io = new SocketServer(server, {
	cors: {
		origin: corsOrigin!,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
		credentials: true,
	},
	pingTimeout: 60000,
	pingInterval: 25000,
});

setupSocketIO(io);

connectDatabase().then(() => {
	console.log('✅ Database Connected');
});

console.log('CORS Origin:', corsOrigin);

app.use(
	cors({
		origin: corsOrigin!,
		credentials: true,
	}),
);

app.use(express.json());
app.use(express.static('public'));

import userRouter from './routes/user.routes';
import BattleRouter from './routes/battle.routes';
import PokemonRouter from './routes/pokemon.routes';
import QuizRouter from './routes/quiz.routes';
import LeaderboardRouter from './routes/leaderboard.routes';
import FeedbackRouter from './routes/feedback.routes';
import WorldMapRouter from './routes/worldMap.routes';
import AdaptiveLearningRouter from './routes/adaptive.routes';
import PokedexRouter from './routes/pokedex.routes';

app.use('/api/v1/users', userRouter);
app.use('/api/v1/pokemons', PokemonRouter);
app.use('/api/v1/battles', BattleRouter);
app.use('/api/v1/quizzes', QuizRouter);
app.use('/api/v1/leaderboard', LeaderboardRouter);
app.use('/api/v1/feedback', FeedbackRouter);
app.use('/api/v1/world-map', WorldMapRouter);
app.use('/api/v1/adaptive-learning', AdaptiveLearningRouter);
app.use('/api/v1/pokedex', PokedexRouter);

app.get('/api/v1/health', (req, res) => {
	res.json({
		status: 'OK',
		message: 'EduQuest API is running!',
		timestamp: new Date().toISOString(),
		environment: process.env.NODE_ENV || 'development',
	});
});

app.get('/', (req, res) => {
	res.json({
		message: 'Welcome to EduQuest API',
		version: '1.0.0',
		endpoints: {
			auth: '/api/v1/users',
			pokemon: '/api/v1/pokemons',
			battles: '/api/v1/battles',
			quizzes: '/api/v1/quizzes',
			health: '/api/v1/health',
		},
		socket: {
			available: true,
			namespace: '/battle',
		},
	});
});

server.listen(PORT, () => {
	console.log(` App is started and is running on http://localhost:${PORT}`);
	console.log(` Socket.io server is running on port ${PORT}`);
	console.log(` Battle socket available at /battle namespace`);
});

process.on('SIGTERM', () => {
	console.log('SIGTERM received, shutting down gracefully');
	server.close(() => {
		console.log('Process terminated');
	});
});
