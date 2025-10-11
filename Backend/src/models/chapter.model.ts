import mongoose, { Document, Schema } from 'mongoose';

export interface IChapter extends Document {
    chapter_number: number;
    chapter_name: string;
    concepts: string;
    important: string[];
}

const chapterSchema: Schema = new Schema<IChapter>(
    {
        chapter_number: { type: Number, required: true },
        chapter_name: { type: String, required: true },
        concepts: { type: String, required: true },
        important: [{ type: String }]
    },
    { timestamps: true }
);

export const Chapter = mongoose.model<IChapter>('Chapter', chapterSchema);
