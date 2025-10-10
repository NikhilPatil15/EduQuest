// socket/battle.socket.ts
import { Server } from 'socket.io';
import { Battle } from '../models/battle.model';

export const setupBattleSocket = (io: Server) => {
	const battleNamespace = io.of('/battle');

	battleNamespace.on('connection', (socket) => {
		console.log('User connected to battle namespace:', socket.id);

		// Join a battle room
		socket.on('join-battle', async (data: { roomId: string }) => {
			const { roomId } = data;

			socket.join(roomId);
			console.log(`User ${socket.id} joined battle room: ${roomId}`);

			// Send battle update to all in room
			const battle = await Battle.findOne({ roomId })
				.populate('player1', 'userName fullName avatar')
				.populate('player2', 'userName fullName avatar')
				.populate('player1Pokemon')
				.populate('player2Pokemon')
				.populate('currentQuestion');

			if (battle) {
				battleNamespace.to(roomId).emit('battle-update', battle);
			}
		});

		// Handle player ready status
		socket.on('player-ready', async (data: { roomId: string; playerId: string }) => {
			const { roomId, playerId } = data;
			battleNamespace.to(roomId).emit('player-ready', { playerId });
		});

		// Handle new question
		socket.on('new-question', async (data: { roomId: string; question: any }) => {
			const { roomId, question } = data;
			battleNamespace.to(roomId).emit('new-question', question);
		});

		// Handle player answer
		socket.on(
			'player-answer',
			async (data: { roomId: string; playerId: string; isCorrect: boolean; timeSpent: number }) => {
				const { roomId, playerId, isCorrect, timeSpent } = data;
				battleNamespace.to(roomId).emit('player-answer', {
					playerId,
					isCorrect,
					timeSpent,
				});
			},
		);

		// Handle round results
		socket.on('round-results', async (data: { roomId: string; results: any }) => {
			const { roomId, results } = data;
			battleNamespace.to(roomId).emit('round-results', results);
		});

		// Handle battle finished
		socket.on('battle-finished', async (data: { roomId: string; winner: string; rewards: any }) => {
			const { roomId, winner, rewards } = data;
			battleNamespace.to(roomId).emit('battle-finished', {
				winner,
				rewards,
			});
		});

		// Leave battle room
		socket.on('leave-battle', (data: { roomId: string }) => {
			const { roomId } = data;
			socket.leave(roomId);
			console.log(`User ${socket.id} left battle room: ${roomId}`);
		});

		socket.on('disconnect', () => {
			console.log('User disconnected from battle namespace:', socket.id);
		});
	});
};
