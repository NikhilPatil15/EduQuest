// types/battle.types.ts
import { Document, ObjectId } from 'mongoose';

export interface IBattle extends Document {
	_id: string;
	roomId: string;
	player1: ObjectId;
	player2: ObjectId;
	player1Pokemon: ObjectId;
	player2Pokemon: ObjectId;
	status: 'waiting' | 'active' | 'finished' | 'cancelled';
	currentRound: number;
	totalRounds: number;
	player1HP: number;
	player2HP: number;
	player1Score: number;
	player2Score: number;
	questions: string[];
	currentQuestion: ObjectId;
	startedAt: Date;
	finishedAt?: Date;
	timePerQuestion: number;
	winner?: string;
	xpEarned: number;
	coinsEarned: number;
	createdAt: Date;
	updatedAt: Date;
}
