// socket/battle.socket.ts
import { Server } from 'socket.io';

// Store waiting players for matchmaking
const waitingPlayers = new Map();
const activeBattles = new Map();

export const setupBattleSocket = (io: Server): void => {
	const battleNamespace = io.of('/battle');

	battleNamespace.on('connection', (socket) => {
		console.log('✅ User connected to battle namespace:', socket.id);

		// Test immediate connection confirmation
		socket.emit('battle-connected', {
			message: 'Successfully connected to battle namespace',
			socketId: socket.id,
		});

		// Handle matchmaking request
		socket.on('matchmaking-request', async (data: { playerId: string; playerName?: string }) => {
			console.log('🎯 Matchmaking request received:', data);

			const playerData = {
				socketId: socket.id,
				playerId: data.playerId,
				playerName: data.playerName || 'Player',
				subject: null,
				ready: false,
			};

			// Add player to waiting queue
			waitingPlayers.set(socket.id, playerData);
			console.log(`👥 Players waiting: ${waitingPlayers.size}`);

			// Notify player they are in queue
			socket.emit('searching-status', {
				message: 'Looking for opponent...',
				queuePosition: waitingPlayers.size,
			});

			// Try to match players
			tryMatchPlayers();
		});

		// Handle player ready with subject
		socket.on(
			'player-ready',
			async (data: { roomId: string; playerId: string; subject: string }) => {
				const { roomId, playerId, subject } = data;
				console.log(`🎯 Player ${playerId} ready with subject: ${subject}`);

				// Update player data with subject
				const battle = activeBattles.get(roomId);
				if (battle) {
					if (battle.player1.socketId === socket.id) {
						battle.player1.ready = true;
						battle.player1.subject = subject;
					} else if (battle.player2.socketId === socket.id) {
						battle.player2.ready = true;
						battle.player2.subject = subject;
					}

					// Broadcast ready status to both players
					battleNamespace.to(roomId).emit('player-ready', {
						playerId,
						opponentReady: battle.player1.ready && battle.player2.ready,
					});

					console.log(`✅ Player ${playerId} ready in room ${roomId}`);

					// If both players are ready, start the battle
					if (battle.player1.ready && battle.player2.ready) {
						startBattle(roomId, battle);
					}
				}
			},
		);

		// Handle player answer
		socket.on(
			'player-answer',
			async (data: {
				roomId: string;
				playerId: string;
				answer: string;
				timeSpent: number;
				questionId: string;
			}) => {
				console.log('📝 Player answer received:', data);

				const { roomId, playerId, answer, timeSpent } = data;
				const battle = activeBattles.get(roomId);

				if (!battle) return;

				// Mark player as answered
				if (battle.player1.socketId === socket.id) {
					battle.player1.answered = true;
					battle.player1.answer = answer;
					battle.player1.timeSpent = timeSpent;
				} else if (battle.player2.socketId === socket.id) {
					battle.player2.answered = true;
					battle.player2.answer = answer;
					battle.player2.timeSpent = timeSpent;
				}

				// Check if both players answered
				if (battle.player1.answered && battle.player2.answered) {
					processRoundResults(roomId, battle);
				}
			},
		);

		// Handle disconnect
		socket.on('disconnect', () => {
			console.log('🔌 User disconnected from battle namespace:', socket.id);

			// Remove from waiting players
			waitingPlayers.delete(socket.id);

			// Remove from active battles
			for (const [roomId, battle] of activeBattles.entries()) {
				if (battle.player1.socketId === socket.id || battle.player2.socketId === socket.id) {
					battleNamespace.to(roomId).emit('player-disconnected', {
						playerId: socket.id,
					});
					activeBattles.delete(roomId);
					console.log(`🗑️  Removed battle room: ${roomId}`);
				}
			}
		});

		// Error handling
		socket.on('error', (error) => {
			console.error('❌ Battle socket error:', error);
		});

		// Add this inside the connection callback in battle.socket.ts:

		// Handle chat messages
		socket.on(
			'chat-message',
			async (data: { roomId: string; message: string; playerId: string }) => {
				const { roomId, message, playerId } = data;
				console.log(`💬 Chat message in room ${roomId}: ${message}`);

				// Broadcast to all in room except sender
				socket.to(roomId).emit('chat-message', {
					message,
					sender: 'opponent',
					playerId: playerId,
				});
			},
		);
	});

	// Matchmaking function
	const tryMatchPlayers = () => {
		if (waitingPlayers.size >= 2) {
			const players = Array.from(waitingPlayers.values());
			const player1 = players[0];
			const player2 = players[1];

			// Create battle room
			const roomId = `battle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

			const battle = {
				roomId,
				player1: {
					...player1,
					ready: false,
					answered: false,
					health: 100,
					score: 0,
				},
				player2: {
					...player2,
					ready: false,
					answered: false,
					health: 100,
					score: 0,
				},
				currentRound: 0,
				status: 'subject_select',
			};

			// Store battle
			activeBattles.set(roomId, battle);

			// Remove players from waiting queue
			waitingPlayers.delete(player1.socketId);
			waitingPlayers.delete(player2.socketId);

			// Join both players to the room
			const player1Socket = battleNamespace.sockets.get(player1.socketId);
			const player2Socket = battleNamespace.sockets.get(player2.socketId);

			if (player1Socket) player1Socket.join(roomId);
			if (player2Socket) player2Socket.join(roomId);

			// Notify both players about the match
			battleNamespace.to(roomId).emit('match-found', {
				roomId,
				player1: {
					_id: player1.playerId,
					userName: player1.playerName,
					level: 1,
				},
				player2: {
					_id: player2.playerId,
					userName: player2.playerName,
					level: 1,
				},
			});

			console.log(
				`🎮 Match created: ${player1.playerName} vs ${player2.playerName} in room ${roomId}`,
			);
		}
	};

	// Start battle function
	const startBattle = (roomId: string, battle: any) => {
		console.log(`⚔️ Starting battle in room: ${roomId}`);

		// Use player1's subject for the battle
		const subject = battle.player1.subject || 'general';

		const firstQuestion = generateQuestion(subject);

		battle.status = 'active';
		battle.currentRound = 1;
		battle.currentQuestion = firstQuestion;

		// Send battle update to both players
		battleNamespace.to(roomId).emit('battle-update', {
			roomId,
			status: 'active',
			player1Health: battle.player1.health,
			player2Health: battle.player2.health,
			currentQuestion: firstQuestion,
			subject: subject,
			round: 1,
			player1Ready: true,
			player2Ready: true,
		});

		console.log(`❓ First question sent to room: ${roomId}`);
	};

	// Replace your current processRoundResults function with this improved version:
	const processRoundResults = (roomId: string, battle: any) => {
		console.log(`📊 Processing round results for room: ${roomId}`);

		const player1 = battle.player1;
		const player2 = battle.player2;
		const correctAnswer = battle.currentQuestion.correctAnswer;

		// Reset answered status immediately
		player1.answered = false;
		player2.answered = false;
		player1.answer = null;
		player2.answer = null;
		player1.timeSpent = 0;
		player2.timeSpent = 0;

		// Evaluate answers
		const player1Correct = player1.answer === correctAnswer;
		const player2Correct = player2.answer === correctAnswer;

		// Calculate damage and determine attacker
		let damageDealt = 25; // Fixed damage per hit
		let attacker = null;

		if (player1Correct && !player2Correct) {
			attacker = 'player1';
			player2.health = Math.max(0, player2.health - damageDealt);
		} else if (!player1Correct && player2Correct) {
			attacker = 'player2';
			player1.health = Math.max(0, player1.health - damageDealt);
		} else if (player1Correct && player2Correct) {
			// Both correct - faster player wins
			if (player1.timeSpent < player2.timeSpent) {
				attacker = 'player1';
				player2.health = Math.max(0, player2.health - damageDealt);
			} else if (player2.timeSpent < player1.timeSpent) {
				attacker = 'player2';
				player1.health = Math.max(0, player1.health - damageDealt);
			}
			// If equal time, no damage (tie)
		}

		console.log(`❤️ Health update - P1: ${player1.health}, P2: ${player2.health}`);

		// Send round results
		battleNamespace.to(roomId).emit('round-results', {
			player1: {
				isCorrect: player1Correct,
				time: player1.timeSpent,
			},
			player2: {
				isCorrect: player2Correct,
				time: player2.timeSpent,
			},
			damageDealt: damageDealt,
			attacker: attacker,
		});

		// Check if battle should continue
		const battleShouldContinue =
			player1.health > 0 && player2.health > 0 && battle.currentRound < 5;

		if (!battleShouldContinue) {
			// End battle after delay
			setTimeout(() => {
				endBattle(roomId, battle);
			}, 3000);
		} else {
			// Continue to next round after delay
			setTimeout(() => {
				battle.currentRound++;
				battle.currentQuestion = generateQuestion(battle.player1.subject || 'general');

				console.log(`🔄 Starting round ${battle.currentRound} in room: ${roomId}`);

				battleNamespace.to(roomId).emit('battle-update', {
					roomId,
					status: 'active',
					player1Health: player1.health,
					player2Health: player2.health,
					currentQuestion: battle.currentQuestion,
					subject: battle.player1.subject,
					round: battle.currentRound,
					player1Ready: true,
					player2Ready: true,
				});
			}, 3000); // 3 second delay between rounds
		}
	};

	// End battle function
	const endBattle = (roomId: string, battle: any) => {
		console.log(`🏁 Ending battle in room: ${roomId}`);

		const winner =
			battle.player1.health > battle.player2.health
				? battle.player1.playerId
				: battle.player2.playerId;

		battleNamespace.to(roomId).emit('battle-finished', {
			winner,
			rewards: {
				xp: 100,
				coins: 50,
			},
		});

		// Clean up
		activeBattles.delete(roomId);
	};

	// Generate mock questions
	const generateQuestion = (subject: string) => {
		const questions = {
			math: [
				{
					_id: 'math1',
					question: 'What is 15 + 27?',
					options: ['42', '32', '52', '37'],
					correctAnswer: '42',
				},
				{
					_id: 'math2',
					question: 'What is 8 × 7?',
					options: ['56', '54', '64', '49'],
					correctAnswer: '56',
				},
			],
			science: [
				{
					_id: 'science1',
					question: 'What planet is known as the Red Planet?',
					options: ['Mars', 'Jupiter', 'Venus', 'Saturn'],
					correctAnswer: 'Mars',
				},
				{
					_id: 'science2',
					question: 'What is H2O?',
					options: ['Water', 'Oxygen', 'Hydrogen', 'Salt'],
					correctAnswer: 'Water',
				},
			],
			history: [
				{
					_id: 'history1',
					question: 'In which year did World War II end?',
					options: ['1945', '1939', '1950', '1941'],
					correctAnswer: '1945',
				},
				{
					_id: 'history2',
					question: 'Who was the first President of the United States?',
					options: ['George Washington', 'Thomas Jefferson', 'Abraham Lincoln', 'John Adams'],
					correctAnswer: 'George Washington',
				},
			],
		};

		const subjectQuestions = questions[subject as keyof typeof questions] || questions.math;
		return subjectQuestions[Math.floor(Math.random() * subjectQuestions.length)];
	};
};
