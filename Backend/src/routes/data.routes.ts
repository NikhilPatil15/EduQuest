import express from "express";
import { getChapters, getQuestions } from "../controllers/data.controller";

const router = express.Router();

// Routes
router.get("/chapters", getChapters);
router.get("/questions", getQuestions);

export default router;
