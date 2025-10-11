import path from "path";
import fs from "fs/promises";
import mongoose from "mongoose";
import { connectDatabase } from "../database/dbConnection";
import { Question } from "../models/question.model";
import { Chapter } from "../models/chapter.model";

const processJsonFilesRecursive = async <T>(
  folderPath: string,
  processor: (jsonContent: any, filePath: string) => T | null
): Promise<T[]> => {
  const entries = await fs.readdir(folderPath, { withFileTypes: true });
  const processedData: T[] = [];

  for (const entry of entries) {
    const fullPath = path.join(folderPath, entry.name);
    if (entry.isDirectory()) {
      const nestedData = await processJsonFilesRecursive(fullPath, processor);
      processedData.push(...nestedData);
    } else if (entry.isFile() && entry.name.endsWith(".json")) {
      const content = await fs.readFile(fullPath, "utf-8");
      try {
        const parsedJson = JSON.parse(content);

        // --- THIS IS THE FIX ---
        // Check if the parsed content is an array.
        if (Array.isArray(parsedJson)) {
          // If it's an array, process each item within it.
          for (const item of parsedJson) {
            const processedItem = processor(item, fullPath);
            if (processedItem) {
              processedData.push(processedItem);
            }
          }
        } else {
          // Otherwise, process it as a single object.
          const processedItem = processor(parsedJson, fullPath);
          if (processedItem) {
            processedData.push(processedItem);
          }
        }
        // --- END OF FIX ---

      } catch (err) {
        console.error(`Error parsing or processing JSON file: ${fullPath}`, err);
      }
    }
  }

  return processedData;
};

const seedData = async () => {
  await connectDatabase();

  try {
    console.log("Starting the seeding process...");

    console.log("Deleting existing questions and chapters...");
    await Question.deleteMany({});
    await Chapter.deleteMany({});
    console.log("Existing data cleared.");

    // --- Seed Chapters (No changes needed here) ---
    const chapterFolder = path.join(process.cwd(), "data/json");
    const chapters = await processJsonFilesRecursive(chapterFolder, (chap) => {
      if (chap.chapter_number !== undefined && chap.chapter_name && chap.concepts) {
        return chap;
      }
      console.warn("Skipping invalid chapter (missing required fields):", chap);
      return null;
    });

    if (chapters.length > 0) {
      console.log(`Found ${chapters.length} valid chapters. Inserting...`);
      await Chapter.insertMany(chapters);
      console.log(`Successfully inserted ${chapters.length} chapters.`);
    } else {
      console.log("No valid chapters found to seed.");
    }

    // --- Seed Questions (No changes needed here) ---
    const questionFolder = path.join(process.cwd(), "data/generatedQuestions");
    const questions = await processJsonFilesRecursive(questionFolder, (obj, fullPath) => {
        const parts = fullPath.split(path.sep);
        const categoryIndex = parts.findIndex((p) =>
            ["coding", "maths", "science"].includes(p.toLowerCase())
        );

        if (categoryIndex !== -1) {
            obj.category = parts[categoryIndex].toLowerCase();
            const gradeFolder = parts[categoryIndex + 1];
            if (gradeFolder && !isNaN(Number(gradeFolder))) {
                obj.grade = Number(gradeFolder);
            }
        }

        obj.type = obj.type?.toLowerCase();
        obj.level = obj.level?.toLowerCase() || "easy";

        if (!obj.type || !obj.questionText || !obj.answer || !obj.options) {
            // This log will now correctly show the specific failing object, not the filename
            console.warn(`Skipping invalid question (missing required fields):`, obj);
            return null;
        }
        return obj;
    });
    
    if (questions.length > 0) {
        console.log(`Found ${questions.length} valid questions. Inserting one by one for robustness...`);
        let insertedCount = 0;
        for (const question of questions) {
            try {
                await Question.create(question);
                insertedCount++;
            } catch (err) {
                console.error("Failed to insert question:", question.questionText);
                console.error("Reason:", err);
            }
        }
        console.log(`Successfully inserted ${insertedCount} out of ${questions.length} questions.`);
    } else {
        console.log("No valid questions found to seed.");
    }

    console.log("✅ Seeding complete!");

  } catch (err) {
    console.error("❌ An error occurred during the seeding process:", err);
  } finally {
    console.log("Closing database connection.");
    await mongoose.connection.close();
  }
};

// Run the seeder
seedData();