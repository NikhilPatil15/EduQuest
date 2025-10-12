import { Server, Socket } from 'socket.io';
import { Document, Model, PopulatedDoc, Types } from 'mongoose';

// --- Type Definitions for Mongoose Models ---
// NOTE: These should ideally live in your model files.

// Represents the Question document from your database
interface IQuestion extends Document {
    subject: string;
    question: string;
    options: string[];
    correctAnswer: string;
    timeLimit: number;
}

// Represents the Battle document from your database
interface IBattle extends Document {
    roomId: string;
    subject: string;
    player1: PopulatedDoc<Document & { userName: string }>;
    player2: PopulatedDoc<Document & { userName: string }>;
    player1Pokemon: PopulatedDoc<Document>;
    player2Pokemon: PopulatedDoc<Document>;
    status: 'idle' | 'searching' | 'subject_select' | 'ready' | 'active' | 'awaiting_results' | 'finished';
    player1Ready: boolean;
    player2Ready: boolean;
    player1Health: number;
    player2Health: number;
    winner: PopulatedDoc<Document> | null;
    currentQuestion: PopulatedDoc<IQuestion> | null;
}

// Assume these are your Mongoose models, now typed
const Battle: Model<IBattle> = require('../models/battle.model');
const Question: Model<IQuestion> = require('../models/question.model');

// --- Type Definitions for Socket Payloads ---

interface IPlayerAnswerPayload {
    roomId: string;
    playerId: string;
    answer: string;
    timeSpent: number;
    questionId: string;
}

interface IStoredPlayerAnswer {
    playerId: string;
    answer: string;
    time: number;
    questionId: string;
}

// In-memory store for active round data
const activeRoundAnswers: {
    [roomId: string]: {
        answers: IStoredPlayerAnswer[];
        timer: NodeJS.Timeout;
    };
} = {};

// --- Main Socket Logic ---

export const setupBattleSocket = (io: Server): void => {
    const battleNamespace = io.of('/battle');

    /**
     * Fetches the next question for a given subject.
     * In a real app, this would also track used questions to avoid repeats.
     */
    const getNextQuestionForBattle = async (subject: string): Promise<IQuestion | null> => {
        // Mock logic: finds one question by subject.
        // For a real game, you'd want to fetch a random one from the set.
        const question = await Question.findOne({ subject });
        return question;
    };

    /**
     * Validates a player's answer against the correct answer in the database.
     */
    const validateAnswer = async (questionId: string, submittedAnswer: string): Promise<boolean> => {
        const question = await Question.findById(questionId);
        return question ? question.correctAnswer === submittedAnswer : false;
    };

    /**
     * Finalizes the battle, sets the winner, and notifies clients.
     */
    const finishBattle = async (roomId: string, winnerId: string | null): Promise<void> => {
        const battle = await Battle.findOne({ roomId });
        if (!battle || battle.status === 'finished') return;

        battle.status = 'finished';
        battle.winner = winnerId ? new Types.ObjectId(winnerId) : null;
        await battle.save();

        // TODO: Calculate and assign rewards based on performance
        const rewards = { xp: 100, coins: 50 };

        battleNamespace.to(roomId).emit('battle-finished', {
            winner: winnerId,
            rewards,
        });
    };

    /**
     * Processes the results of a round after both players have answered or the timer expires.
     */
    const processRoundResults = async (roomId: string): Promise<void> => {
        const roundData = activeRoundAnswers[roomId];
        if (!roundData) return; // Round already processed

        clearTimeout(roundData.timer); // Stop the server-side failsafe timer

        const battle = await Battle.findOne({ roomId });
        if (!battle) return;
        // Ensure populated player references exist before calling toString()
        if (!battle.player1 || !battle.player2) return;

        const player1Id = battle.player1.toString();
        const player2Id = battle.player2.toString();

        const p1Answer = roundData.answers.find(a => a.playerId === player1Id);
        const p2Answer = roundData.answers.find(a => a.playerId === player2Id);

        const p1IsCorrect = p1Answer ? await validateAnswer(p1Answer.questionId, p1Answer.answer) : false;
        const p2IsCorrect = p2Answer ? await validateAnswer(p2Answer.questionId, p2Answer.answer) : false;

        let roundWinnerId: string | null = null;
        // Determine winner: must be correct, and faster if both are correct
        if (p1IsCorrect && (!p2IsCorrect || (p2Answer && p1Answer!.time < p2Answer.time))) {
            roundWinnerId = player1Id;
        } else if (p2IsCorrect && (!p1IsCorrect || (p1Answer && p2Answer && p2Answer.time < p1Answer.time))) {
            roundWinnerId = player2Id;
        }

        const damageDealt = 20; // Base damage value
        if (roundWinnerId) {
            if (roundWinnerId === player1Id) battle.player2Health -= damageDealt;
            else battle.player1Health -= damageDealt;
        }

        const resultsPayload = {
            roomId,
            damageDealt: roundWinnerId ? damageDealt : 0,
            player1: { playerId: player1Id, isCorrect: p1IsCorrect, time: p1Answer?.time ?? 99 },
            player2: { playerId: player2Id, isCorrect: p2IsCorrect, time: p2Answer?.time ?? 99 },
        };
        battleNamespace.to(roomId).emit('round-results', resultsPayload);

        delete activeRoundAnswers[roomId]; // Clean up for the next round

        // Check for a game-ending condition
        if (battle.player1Health <= 0 || battle.player2Health <= 0) {
            const finalWinnerId = battle.player1Health > 0 ? player1Id : player2Id;
            await battle.save();
            await finishBattle(roomId, finalWinnerId);
        } else {
            // Wait for animations to finish on the client, then proceed
            setTimeout(async () => {
                await battle.save();
                battleNamespace.to(roomId).emit('battle-update', battle); // Sync health state
                await startNextRound(roomId);
            }, 3000); // 3-second delay
        }
    };

    /**
     * Initiates a new round by fetching a question and sending it to clients.
     */
    const startNextRound = async (roomId: string): Promise<void> => {
        const battle = await Battle.findOne({ roomId });
        if (!battle || battle.status !== 'active') return;

        // Clean up any lingering timers from a previous round
        if (activeRoundAnswers[roomId]) {
            clearTimeout(activeRoundAnswers[roomId].timer);
            delete activeRoundAnswers[roomId];
        }

        const question = await getNextQuestionForBattle(battle.subject);
        if (!question) {
            // Determine winner by health if questions run out
            // Only call toString() if player references exist; otherwise pass null
            const winnerId = (battle.player1 && battle.player2)
                ? (battle.player1Health >= battle.player2Health ? battle.player1.toString() : battle.player2.toString())
                : null;
            await finishBattle(roomId, winnerId);
            return;
        }

        // Store the full question document as the currentQuestion to match the IBattle type
        battle.currentQuestion = question as unknown as PopulatedDoc<IQuestion>;
        await battle.save();
        battleNamespace.to(roomId).emit('new-question', { question });

        // Start a server-side timer as a failsafe
        const roundTimer = setTimeout(() => {
            console.log(`Round timer expired for room ${roomId}.`);
            processRoundResults(roomId);
        }, (question.timeLimit || 15) * 1000 + 1000); // Add 1s buffer

        activeRoundAnswers[roomId] = { answers: [], timer: roundTimer };
    };

    // --- Socket Connection Handler ---
    battleNamespace.on('connection', (socket: Socket) => {
        console.log(`User connected to battle namespace: ${socket.id}`);

        socket.on('join-battle', async ({ roomId }: { roomId: string }) => {
            await socket.join(roomId);
            console.log(`Socket ${socket.id} joined room ${roomId}`);
            const battle = await Battle.findOne({ roomId })
                .populate<{ player1: { userName: string } }>('player1', 'userName')
                .populate<{ player2: { userName: string } }>('player2', 'userName')
                .populate('player1Pokemon')
                .populate('player2Pokemon');
            if (battle) {
                battleNamespace.to(roomId).emit('battle-update', battle);
            }
        });

        socket.on('player-ready', async ({ roomId, playerId }: { roomId: string; playerId: string }) => {
            const battle = await Battle.findOne({ roomId });
            if (!battle) return;

            if (battle.player1 && battle.player1.toString() === playerId) battle.player1Ready = true;
            else if (battle.player2 && battle.player2.toString() === playerId) battle.player2Ready = true;

            if (battle.player1Ready && battle.player2Ready) {
                battle.status = 'active';
            }
            await battle.save();

            const updatedBattle = await Battle.findById(battle._id)
                .populate<{ player1: { userName: string } }>('player1', 'userName')
                .populate<{ player2: { userName: string } }>('player2', 'userName');

            battleNamespace.to(roomId).emit('battle-update', updatedBattle);

            if (battle.status === 'active') {
                setTimeout(() => startNextRound(roomId), 2000); // Delay to allow UI transition
            }
        });

        socket.on('player-answer', async (data: IPlayerAnswerPayload) => {
            const { roomId, playerId, timeSpent } = data;
            const roundData = activeRoundAnswers[roomId];
            // Ignore answer if round is over or if player has already answered
            if (!roundData || roundData.answers.some(a => a.playerId === playerId)) return;

            roundData.answers.push({ ...data, time: timeSpent });

            // If both players have answered, process results immediately
            if (roundData.answers.length === 2) {
                await processRoundResults(roomId);
            }
        });

        socket.on('leave-battle', ({ roomId }: { roomId: string }) => {
            socket.leave(roomId);
            console.log(`User ${socket.id} left room ${roomId}`);
            // TODO: Handle forfeits if a player leaves mid-game
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected from battle namespace: ${socket.id}`);
            // TODO: Find which battle room the user was in and handle their disconnection
        });
    });
};
