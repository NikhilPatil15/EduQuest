import { Request, Response } from "express";
import { Question } from "../models/question.model";
import { Chapter } from "../models/chapter.model";

// Get all chapters
export const getChapters = async (req: Request, res: Response) => {
  try {
    const chapters = await Chapter.find().sort({ chapter_number: 1 });
    res.status(200).json({ success: true, data: chapters });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch chapters" });
  }
};

// Get all questions
export const getQuestions = async (req: Request, res: Response) => {
  try {
    const questions = await Question.find();
    res.status(200).json({ success: true, data: questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch questions" });
  }
};
