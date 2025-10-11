// src/scripts/generateMCQFromSamples.ts
/**
 * Free local MCQ generator from samples (Bun-friendly, no external packages)
 *
 * Output schema per question:
 * {
 *   category: "maths",
 *   grade: 10,
 *   type: "mcq",
 *   questionText: "....",
 *   options: ["A text", "B text", "C text", "D text"],
 *   answer: "B",            // letter A/B/C/D
 *   answerText: "B text",   // actual option text
 *   level: "medium",
 *   rating: 3
 * }
 *
 * Run:
 *   bun run src/scripts/generateMCQFromSamples.ts
 */

import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const SAMPLES_DIR = path.join(ROOT, "data", "questions");        // expects maths.json, science.json, coding.json
const OUTPUT_DIR = path.join(ROOT, "data", "generatedQuestions");
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// config
const SUBJECTS = ["Maths", "Science", "Coding"];
const GRADES = [10, 11, 12];
const TARGET_PER_GRADE = 100; // desired questions per subject/grade
const OPTIONS_COUNT = 4; // number of multiple choices (A-D)
const MAX_VARIANT_REPEAT = 10000; // safety

/* ---------------- Helpers ---------------- */
function log(...args: any[]) { console.log(...args); }

function readSamples(subject: string): any[] {
  const candidates = [
    path.join(SAMPLES_DIR, `${subject.toLowerCase()}.json`),
    path.join(SAMPLES_DIR, `${subject}.json`),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      try {
        const raw = fs.readFileSync(p, "utf-8");
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
        log(`Warning: sample file ${p} parsed but is not an array — ignoring.`);
      } catch (e) {
        log(`Warning: failed to parse ${p}:`, e?.message ?? e);
      }
    }
  }
  return [];
}

function saveJSON(fp: string, data: any) {
  fs.mkdirSync(path.dirname(fp), { recursive: true });
  fs.writeFileSync(fp, JSON.stringify(data, null, 2), "utf-8");
}

function shuffle<T>(arr: T[]) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function uniqStrings(arr: string[]) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const s of arr) {
    const t = (s ?? "").toString().trim();
    if (t && !seen.has(t)) {
      seen.add(t);
      out.push(t);
    }
  }
  return out;
}

function letterForIndex(i: number) {
  return String.fromCharCode(65 + i); // 0->A, 1->B...
}

/* ---------- Distractor generation ---------- */

/**
 * Build a pool of candidate distractor texts from samples:
 * - use other answers from sample set
 * - use other options from samples
 * - if still small, synthesize variations of correct answer
 */
function buildAnswerPool(samples: any[]): string[] {
  const pool: string[] = [];
  for (const s of samples) {
    if (Array.isArray(s.options)) {
      for (const o of s.options) pool.push(String(o));
    }
    if (s.answer) pool.push(String(s.answer));
    if (s.answerText) pool.push(String(s.answerText));
  }
  return uniqStrings(pool).slice(); // unique
}

function synthesizeDistractorsFromAnswer(answerText: string, needed: number): string[] {
  const out: string[] = [];
  const base = (answerText ?? "").toString().trim();
  if (!base) {
    // generic placeholders
    for (let i = 0; i < needed; i++) out.push(`Option ${i + 1}`);
    return out;
  }

  // If numeric, produce numeric variants
  const num = Number(base.replace(/[^\d.-]/g, ""));
  if (!Number.isNaN(num)) {
    for (let i = 1; i <= needed; i++) {
      out.push(String(num + i));
    }
    return out;
  }

  // Otherwise produce small textual variants:
  //  - append/prepend common modifiers
  //  - swap case, add "not", add "None of the above"
  const mods = ["(approx)", "(not)", "(commonly)", "(rarely)", "(simple)"];
  for (let i = 0; i < needed; i++) {
    const m = mods[i % mods.length];
    out.push(`${base} ${m}`);
    if (out.length >= needed) break;
  }
  // if still short, append "None of the above", "All of the above"
  const extras = ["None of the above", "All of the above", "Not sufficient information"];
  for (const e of extras) {
    if (out.length >= needed) break;
    if (!out.includes(e)) out.push(e);
  }
  return out.slice(0, needed);
}

/* ---------- Core: generate MCQ from a single sample entry ---------- */
function normalizeSampleEntry(e: any): { questionText: string; options?: string[]; answerText?: string; level?: string; rating?: number } {
  const q = (e.questionText ?? e.question ?? e.q ?? "").toString().trim();
  let options: string[] | undefined = undefined;
  if (Array.isArray(e.options) && e.options.length > 0) options = e.options.map((o: any) => String(o));
  else if (Array.isArray(e.choices) && e.choices.length > 0) options = e.choices.map((o: any) => String(o));
  const answerText = e.answerText ?? e.answer ?? e.correct ?? e.key ?? undefined;
  const level = e.level ?? "medium";
  const rating = Number(e.rating ?? 3) || 3;
  return { questionText: q, options, answerText: answerText ? String(answerText) : undefined, level, rating };
}

function makeMCQFromSample(base: any, pool: string[], subject: string, grade: number, variantIndex: number): any {
  // Normalize
  const n = normalizeSampleEntry(base);
  let qText = n.questionText || `(${subject} grade ${grade} auto-generated question)`;
  // create options
  let opts: string[] = [];
  let correctText = n.answerText ? n.answerText.toString().trim() : undefined;

  // Case A: sample already has options
  if (Array.isArray(n.options) && n.options.length >= 2) {
    opts = uniqStrings(n.options.map((o) => String(o)));
    // If no answerText given, try pick one (first)
    if (!correctText && opts.length > 0) correctText = opts[0];
    // rotate options to create variants
    const shift = variantIndex % opts.length;
    opts = opts.slice(shift).concat(opts.slice(0, shift));
  } else {
    // No suitable options: build from pool + synthesized distractors
    const candidates = pool.filter((p) => (correctText ? p !== correctText : true));
    const pickPool = shuffle(candidates);
    const chosen: string[] = [];
    // add some from pool
    for (const c of pickPool) {
      if (chosen.length >= Math.max(0, OPTIONS_COUNT - 1)) break;
      if (!chosen.includes(c) && c && (!correctText || c !== correctText)) chosen.push(c);
    }
    // synthesize if pool not enough
    if (chosen.length < Math.max(0, OPTIONS_COUNT - 1)) {
      const synth = synthesizeDistractorsFromAnswer(correctText ?? "Option", Math.max(0, OPTIONS_COUNT - 1) - chosen.length);
      for (const s of synth) if (!chosen.includes(s)) chosen.push(s);
    }
    // final assemble: ensure correct included
    if (correctText) {
      opts = uniqStrings([correctText, ...chosen]).slice(0, OPTIONS_COUNT);
      // if correct got bumped out (rare), ensure it is present
      if (!opts.includes(correctText)) {
        opts[opts.length - 1] = correctText;
      }
    } else {
      // no correct known: pick first as placeholder
      opts = uniqStrings([...(chosen.length ? chosen : ["Option A", "Option B", "Option C", "Option D"])]).slice(0, OPTIONS_COUNT);
      correctText = opts[0];
    }
  }

  // Ensure exact OPTIONS_COUNT; if less, pad with placeholders
  if (opts.length < OPTIONS_COUNT) {
    const padIdx = 1;
    while (opts.length < OPTIONS_COUNT) {
      const pad = `Option ${opts.length + 1}`;
      if (!opts.includes(pad)) opts.push(pad);
    }
  }
  // If more, truncate
  opts = opts.slice(0, OPTIONS_COUNT);

  // Now shuffle a bit more to randomize correct position, but keep deterministic-ish by variantIndex
  // We'll do a rotation by variantIndex to vary position.
  const rotate = variantIndex % opts.length;
  opts = opts.slice(rotate).concat(opts.slice(0, rotate));

  // Make sure correctText exists in opts; if not, replace index 0
  if (!opts.includes(correctText!)) {
    opts[0] = correctText!;
  }

  // determine answer letter
  const correctIndex = opts.findIndex((o) => o === correctText);
  const answerLetter = letterForIndex(correctIndex >= 0 ? correctIndex : 0);

  // normalize question text: remove excessive whitespace
  qText = qText.replace(/\s+/g, " ").trim();

  return {
    category: subject.toLowerCase(),
    grade,
    type: "mcq",
    questionText: qText,
    options: opts,
    answer: answerLetter,
    answerText: opts[correctIndex >= 0 ? correctIndex : 0],
    level: n.level ?? "medium",
    rating: n.rating ?? 3,
  };
}

/* ---------- High-level generation ---------- */
function dedupeByQuestion(existing: any[], incoming: any[]) {
  const seen = new Set<string>();
  const out: any[] = [];
  for (const q of existing.concat(incoming)) {
    const key = (q.questionText ?? "").toString().trim();
    if (!seen.has(key) && key.length > 0) {
      seen.add(key);
      out.push(q);
    }
  }
  return out;
}

function generateFor(subject: string, grade: number, target: number) {
  log(`\nGenerating for ${subject} Grade ${grade} (target ${target})`);
  const samples = readSamples(subject);
  const pool = buildAnswerPool(samples);
  // fallback: if pool too small, gather other sample question texts as distractors
  if (pool.length < 10) {
    for (const s of samples) {
      const maybeAns = s.answer ?? s.answerText ?? (Array.isArray(s.options) ? s.options[0] : undefined);
      if (maybeAns) pool.push(String(maybeAns));
    }
  }

  const outFile = path.join(OUTPUT_DIR, `${subject}${grade}.json`);
  const existing = fs.existsSync(outFile) ? JSON.parse(fs.readFileSync(outFile, "utf-8")) : [];

  const need = Math.max(0, target - existing.length);
  if (need <= 0) {
    log(`Already have ${existing.length} >= ${target}, skipping.`);
    return;
  }

  const generated: any[] = [];
  let attempts = 0;
  let variantIndex = 0;

  // Use each sample as seed; if not enough, loop and create variants
  while (generated.length < need && attempts < MAX_VARIANT_REPEAT) {
    const seed = samples.length ? samples[variantIndex % samples.length] : null;
    let qObj;
    if (seed) {
      qObj = makeMCQFromSample(seed, pool, subject, grade, variantIndex);
    } else {
      // no samples, create placeholder MCQ
      qObj = {
        category: subject.toLowerCase(),
        grade,
        type: "mcq",
        questionText: `Auto question for ${subject} grade ${grade} #${variantIndex + 1}`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        answer: "A",
        answerText: "Option A",
        level: "medium",
        rating: 3,
      };
    }

    // validate qObj
    const ok =
      qObj &&
      typeof qObj.questionText === "string" &&
      Array.isArray(qObj.options) &&
      qObj.options.length === OPTIONS_COUNT &&
      typeof qObj.answer === "string" &&
      /^[A-D]$/.test(qObj.answer);

    if (ok) {
      // ensure no duplicate questionText in generated
      if (!generated.some((g) => g.questionText === qObj.questionText) && !existing.some((e) => e.questionText === qObj.questionText)) {
        generated.push(qObj);
      }
    } else {
      // fallback simple MCQ
      const fallback = {
        category: subject.toLowerCase(),
        grade,
        type: "mcq",
        questionText: qObj.questionText || `Auto fallback question ${variantIndex + 1}`,
        options: qObj.options && qObj.options.length >= OPTIONS_COUNT ? qObj.options.slice(0, OPTIONS_COUNT) : ["Option A", "Option B", "Option C", "Option D"],
        answer: qObj.answer && /^[A-D]$/.test(qObj.answer) ? qObj.answer : "A",
        answerText: qObj.answerText ?? (qObj.options ? qObj.options[0] : "Option A"),
        level: qObj.level ?? "medium",
        rating: qObj.rating ?? 3,
      };
      if (!generated.some((g) => g.questionText === fallback.questionText) && !existing.some((e) => e.questionText === fallback.questionText)) {
        generated.push(fallback);
      }
    }

    variantIndex++;
    attempts++;
  }

  const merged = dedupeByQuestion(existing, generated);
  saveJSON(outFile, merged);
  log(`Saved ${generated.length} new questions; merged total: ${merged.length} -> ${outFile}`);
}

/* ---------- Run ---------- */
(function main() {
  log("Starting MCQ generation from samples (free, local).");
  for (const subject of SUBJECTS) {
    for (const grade of GRADES) {
      try {
        generateFor(subject, grade, TARGET_PER_GRADE);
      } catch (e) {
        log(`Error generating for ${subject} ${grade}:`, e);
      }
    }
  }
  log("\nAll done.");
})();
