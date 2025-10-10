// types/battleRound.types.ts
import { Document, ObjectId } from 'mongoose';

export interface IBattleRound extends Document {
	_id: string;
	battleId: ObjectId;
	roundNumber: number;
	questionId: ObjectId;
	player1Answer: string;
	player2Answer: string;
	player1Time: number;
	player2Time: number;
	player1Correct: boolean;
	player2Correct: boolean;
	damageDealt: number;
	roundWinner?: string;
	createdAt: Date;
}
