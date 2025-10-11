import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion extends Document {
    category: string;
    grade: number;
    type: 'mcq';
    questionText: string;
    options: string[];
    answer: string;
    answerText?: string;
    level: 'easy' | 'medium' | 'hard';
    rating?: number;
}

const questionSchema: Schema = new Schema<IQuestion>(
    {
        category: { type: String, required: true },
        grade: { type: Number, required: true },
        type: { type: String, enum: ['mcq', 'short', 'long'], required: true },
        questionText: { type: String, required: true },
        options: [{ type: String }],
        answer: { type: String, required: true },
        answerText: { type: String },
        level: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
        rating: { type: Number, default: 0 }
    },
    { timestamps: true }
);

export const Question = mongoose.model<IQuestion>('Question', questionSchema);
