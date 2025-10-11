// src/scripts/scrape.ts
import { chromium } from "playwright";
import fs from "fs";
import { Question } from "../types/Question";

// Delay function compatible with any environment
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// All subjects, grades, and URLs
const sources = [
  { category: "Maths", grade: 10, url: "https://byjus.com/maths/class-10-maths-mcqs-chapter-1-real-numbers/" },
  { category: "Maths", grade: 11, url: "https://byjus.com/maths/class-11-maths-mcqs-chapter-1-sets/" },
  { category: "Maths", grade: 12, url: "https://byjus.com/maths/class-12-maths-mcqs-chapter-1-relations-and-functions/" },
  { category: "Science", grade: 10, url: "https://byjus.com/science/class-10-science-mcqs-chapter-1-light/" },
  { category: "Science", grade: 11, url: "https://byjus.com/science/class-11-science-mcqs-chapter-1-physical-world/" },
  { category: "Science", grade: 12, url: "https://byjus.com/science/class-12-science-mcqs-chapter-1-electricity/" },
  { category: "Coding", grade: 10, url: "https://byjus.com/coding/class-10-coding-mcqs-chapter-1-introduction-to-programming/" },
  { category: "Coding", grade: 11, url: "https://byjus.com/coding/class-11-coding-mcqs-chapter-1-data-structures/" },
  { category: "Coding", grade: 12, url: "https://byjus.com/coding/class-12-coding-mcqs-chapter-1-algorithms/" },
];

async function scrapeAll() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const allQuestions: Question[] = [];

  for (const source of sources) {
    try {
      console.log(`⏳ Scraping ${source.category} grade ${source.grade} ...`);
      await page.goto(source.url, { waitUntil: "networkidle" });

      // Wait a few seconds to ensure dynamic content loads
      await delay(2000);

      // Evaluate page and extract questions
      const questionsOnPage = await page.evaluate(() => {
        const result: any[] = [];

        document.querySelectorAll(".question-block").forEach((el) => {
          const questionText = (el.querySelector(".question-text")?.textContent || "").trim();
          const options = Array.from(el.querySelectorAll(".options li")).map((o) => o.textContent?.trim() || "");
          const answer = (el.querySelector(".answer")?.textContent || "").trim();

          if (questionText) {
            result.push({ questionText, options, answer });
          }
        });

        return result;
      });

      // Add grade/category info and compute level/rating
      questionsOnPage.forEach((q) => {
        let level: "easy" | "medium" | "hard" = "medium";
        if (q.questionText.length < 50) level = "easy";
        else if (q.questionText.length > 150) level = "hard";

        const rating = level === "easy" ? 2 : level === "medium" ? 3 : 5;

        allQuestions.push({
          category: source.category,
          grade: source.grade,
          type: q.options.length > 0 ? "mcq" : "descriptive",
          questionText: q.questionText,
          options: q.options.length > 0 ? q.options : undefined,
          answer: q.answer,
          level,
          rating,
        });
      });

      console.log(`✅ Scraped ${questionsOnPage.length} questions from ${source.url}`);
    } catch (err) {
      console.error(`❌ Error scraping ${source.url}:`, err);
    }
  }

  await browser.close();

  // Save to JSON
  fs.writeFileSync("./data/json/all_scraped_questions.json", JSON.stringify(allQuestions, null, 2));
  console.log(`✅ Total ${allQuestions.length} questions saved`);
}

// Run the scraper
scrapeAll();
