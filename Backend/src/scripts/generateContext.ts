// src/scripts/generateContextAllGemini.ts
/**
 * Expand minimal chapter content for ALL JSON files in data/json/ using Gemini.
 *
 * Input:  data/json/<Subject>.json   (array of { chapter_number?, chapter_name?, content })
 * Output: data/contextual/<Subject>_context.json
 *
 * Env:
 * GEMINI_API_KEY       (required)
 * GEMINI_MODEL         (optional) default "gemini-1.5-flash"
 * GEMINI_API_ENDPOINT  (optional) default "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
 *
 * Run:
 * bun run src/scripts/generateContextAllGemini.ts
 */

import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const INPUT_DIR = path.join(ROOT, "data", "json");
const OUTPUT_DIR = path.join(ROOT, "data", "contextual");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error("Error: GEMINI_API_KEY environment variable not set.");
  process.exit(1);
}

// NOTE: Updated defaults to reflect the standard Google Gemini API.
// If you use a proxy service that mimics OpenAI's API, you may need to change these back.
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-1.5-flash-latest";
// This is the corrected line
const GEMINI_API_ENDPOINT =
  process.env.GEMINI_API_ENDPOINT ??
  `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;


type ChapterIn = {
  chapter_number?: number;
  chapter_name?: string;
  content?: string;
};

type ChapterOut = {
  chapter_number: number;
  chapter_name: string;
  content: string;
  important: string[];
};

function sleep(ms = 600) {
  return new Promise((r) => setTimeout(r, ms));
}

function safeParseJSON<T = any>(s: string): T | null {
  try {
    return JSON.parse(s) as T;
  } catch {
    return null;
  }
}

function extractJSON(candidate: string): any | null {
  const whole = safeParseJSON(candidate);
  if (whole) return whole;

  const firstArr = candidate.indexOf("[");
  const lastArr = candidate.lastIndexOf("]");
  if (firstArr !== -1 && lastArr !== -1 && lastArr > firstArr) {
    const slice = candidate.slice(firstArr, lastArr + 1);
    const parsed = safeParseJSON(slice);
    if (parsed) return parsed;
  }

  const firstObj = candidate.indexOf("{");
  const lastObj = candidate.lastIndexOf("}");
  if (firstObj !== -1 && lastObj !== -1 && lastObj > firstObj) {
    const slice = candidate.slice(firstObj, lastObj + 1);
    const parsed = safeParseJSON(slice);
    if (parsed) return parsed;
  }

  return null;
}

function extractImportantFromText(text: string): string[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const headerIdx = lines.findIndex((l) => /(^important[:\s-]|^key concepts|^key points|^formulas)/i.test(l));
  if (headerIdx >= 0) {
    const out: string[] = [];
    for (let i = headerIdx + 1; i < Math.min(lines.length, headerIdx + 20); i++) {
      const cleaned = lines[i].replace(/^[-•\d\.\)\s]+/, "").trim();
      if (cleaned) out.push(cleaned);
      if (out.length >= 12) break;
    }
    if (out.length) return out;
  }

  const short = lines.filter((l) => l.length <= 140 && l.split(" ").length <= 12);
  return short.slice(0, 10);
}

async function callGemini(prompt: string, maxTokens = 900, retries = 2): Promise<string> {
    // NOTE: Body format updated for Google's standard Gemini API.
    const body = {
        contents: [{
            parts: [{ text: prompt }]
        }],
        generationConfig: {
            temperature: 0.2,
            maxOutputTokens: maxTokens,
        },
    };

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(GEMINI_API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // NOTE: Bearer token is not needed if the API key is in the URL.
          // Authorization: `Bearer ${GEMINI_API_KEY}`,
        },
        body: JSON.stringify(body),
      });

      // ✅ FIX: Added a check for HTTP errors. The fetch API does not throw for
      // non-2xx status codes, so we must check `res.ok` manually.
      if (!res.ok) {
        const errorBody = await res.text().catch(() => "Could not read error body");
        // This error will be caught by the outer catch block and trigger a retry.
        throw new Error(`HTTP error! Status: ${res.status} ${res.statusText}. Body: ${errorBody}`);
      }

      const txt = await res.text();
      
      try {
        const env = JSON.parse(txt);
        // NOTE: Parsing logic is updated for the standard Google Gemini API response format.
        const content = env?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
        if (typeof content === "string") return content;
        
        // If content is not found, it might be due to a safety block or other issue.
        console.warn("Could not find content in Gemini response:", txt);
        return txt; // Return the full text for debugging.
      } catch {
        // This catches cases where the response is not valid JSON.
        return txt;
      }
    } catch (err) {
      if (attempt < retries) {
        const backoff = 500 + attempt * 800;
        console.warn(`Gemini call failed (attempt ${attempt + 1}): ${String(err)} — retrying in ${backoff}ms`);
        await sleep(backoff);
        continue;
      }
      throw err; // Re-throw the error after all retries have failed.
    }
  }
  // ✅ FIX: Improved the final error message for clarity.
  throw new Error("Gemini call failed after all retries.");
}

function buildPrompt(subjectLabel: string, ch: ChapterIn) {
  const safeContent = (ch.content ?? "").replace(/\s+/g, " ").trim();
  return `You are a knowledgeable ${subjectLabel} tutor.

Expand the following chapter summary into a clear, student-friendly explanation of about 2–3 short paragraphs (concise).
Include one short worked example where applicable. End with a short "Important" list (3–8 items) containing formulas, definitions, or quick facts.

Input chapter name: "${(ch.chapter_name ?? "").replace(/"/g, '\\"')}"
Input minimal content: "${safeContent.replace(/"/g, '\\"')}"

Return EXACTLY a JSON object (no extra text, no markdown backticks) with two keys:
{
  "content": "<2-3 paragraph explanatory text (use \\n\\n between paragraphs)>",
  "important": ["formula or brief point 1", "point 2", ...]
}
`;
}


async function expandChaptersForFile(inputFile: string) {
  const base = path.basename(inputFile); // e.g., Maths.json
  const subjectLabel = path.parse(base).name; // e.g., Maths
  let raw: string;
  try {
    raw = fs.readFileSync(inputFile, "utf-8");
  } catch (err) {
    console.error(`Failed to read ${inputFile}:`, err);
    return;
  }

  const arr = safeParseJSON<any[]>(raw);
  if (!arr || !Array.isArray(arr)) {
    console.error(`Input ${inputFile} must be a JSON array of chapters. Skipping.`);
    return;
  }

  const outChapters: ChapterOut[] = [];
  console.log(`\nProcessing ${base} → expanding ${arr.length} chapters...`);

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i] as ChapterIn;
    const chapter_number = Number(item.chapter_number ?? (i + 1));
    const chapter_name = (item.chapter_name ?? `Chapter ${chapter_number}`).toString();
    const contentMin = (item.content ?? "").toString().trim();

    console.log(`  • Expanding [${chapter_number}] ${chapter_name} ...`);
    try {
      const prompt = buildPrompt(subjectLabel, { chapter_number, chapter_name, content: contentMin });
      const modelRaw = await callGemini(prompt, 900, 2);

      const parsed = extractJSON(modelRaw);
      if (parsed && typeof parsed === "object") {
        const content =
          String(parsed.content ?? parsed.concepts ?? parsed.description ?? parsed.text ?? "").trim() || contentMin;
        const importantRaw = parsed.important ?? parsed.keyPoints ?? parsed.key_concepts ?? parsed.bullets ?? [];
        const important = Array.isArray(importantRaw)
          ? importantRaw.map(String).map((s) => s.trim()).filter(Boolean)
          : extractImportantFromText(String(importantRaw));
        outChapters.push({
          chapter_number,
          chapter_name,
          content,
          important: important.length ? important : extractImportantFromText(content || contentMin),
        });
        console.log(`    ✔ expanded (important: ${outChapters[outChapters.length - 1].important.length})`);
      } else {
        const fallbackContent = (modelRaw && modelRaw.trim()) || contentMin;
        const important = extractImportantFromText(fallbackContent);
        outChapters.push({ chapter_number, chapter_name, content: fallbackContent, important });
        console.log(`    ⚠ parsed raw text fallback (important: ${important.length})`);
      }
    } catch (err) {
      console.error(`    ✖ Failed to expand chapter ${chapter_name}:`, err);
      outChapters.push({ chapter_number, chapter_name, content: contentMin, important: [] });
    }

    await sleep(700);
  }

  // package full output with subject and metadata
  const finalObj = {
    subject: subjectLabel,
    sourceFile: base,
    generatedAt: new Date().toISOString(),
    chapters: outChapters,
  };

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const outFile = path.join(OUTPUT_DIR, `${subjectLabel}_context.json`);
  fs.writeFileSync(outFile, JSON.stringify(finalObj, null, 2), "utf-8");
  console.log(`\n✅ Saved expanded contextual data to ${outFile}`);
}

async function main() {
  if (!fs.existsSync(INPUT_DIR)) {
    console.error(`Input directory not found: ${INPUT_DIR}`);
    process.exit(1);
  }
  const files = fs.readdirSync(INPUT_DIR).filter((f) => f.toLowerCase().endsWith(".json"));
  if (files.length === 0) {
    console.error(`No .json files found in ${INPUT_DIR}. Place Maths.json / Science.json / Coding.json there.`);
    process.exit(1);
  }

  for (const f of files) {
    const inputPath = path.join(INPUT_DIR, f);
    await expandChaptersForFile(inputPath);
    await sleep(800);
  }

  console.log("\nAll files processed.");
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});