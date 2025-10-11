// src/scripts/extractPDFs.ts
import fs from "fs";
import path from "path";
import pdf from "pdf-parse";
import { Question } from "../types/Question";

const subjects = ["Maths", "Science", "Coding"];
const grades = [10, 11, 12];

async function extractPDFs() {
  let allQuestions: Question[] = [];

  for (const subject of subjects) {
    for (const grade of grades) {
      const pdfPath = path.join(__dirname, `../../data/pdfs/${subject}/grade${grade}.pdf`);

      if (!fs.existsSync(pdfPath)) continue;

      const dataBuffer = fs.readFileSync(pdfPath);
      const data = await pdf(dataBuffer);

      // Save raw text to a .txt file
      const textDir = path.join(__dirname, "../../data/texts");
      if (!fs.existsSync(textDir)) fs.mkdirSync(textDir, { recursive: true });
      fs.writeFileSync(path.join(textDir, `${subject}_grade${grade}.txt`), data.text);

      // Split text into "descriptive" questions (you can refine splitting logic)
      const chunks = data.text.split("\n\n").filter(Boolean); // split by double newlines
      for (const chunk of chunks) {
        allQuestions.push({
          category: subject as any,
          grade: grade as any,
          type: "descriptive",
          questionText: chunk.trim(),
          answer: "Refer text", // placeholder
          level: "medium",      // you can improve level detection later
          rating: 3             // default rating
        });
      }

      console.log(`✅ Extracted ${chunks.length} questions from ${subject} grade ${grade} PDF`);
    }
  }

  // Save all extracted questions to JSON
  const jsonDir = path.join(__dirname, "../../data/json");
  if (!fs.existsSync(jsonDir)) fs.mkdirSync(jsonDir, { recursive: true });
  fs.writeFileSync(path.join(jsonDir, "pdf_questions.json"), JSON.stringify(allQuestions, null, 2));

  console.log(`✅ Total ${allQuestions.length} questions extracted from PDFs`);
}

extractPDFs();
