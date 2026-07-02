import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const envContent = readFileSync(join(root, ".env.local"), "utf-8");
let apiKey = "";
for (const line of envContent.split("\n")) {
  const t = line.trim();
  if (t.startsWith("GOOGLE_GEMINI_API_KEY=")) {
    apiKey = t.slice("GOOGLE_GEMINI_API_KEY=".length).replace(/^["']|["']$/g, "");
    break;
  }
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const prompt = `You are a football historian. Write a short iconic description (2-3 sentences) about "Luka Modric" (Croatia, CM).

Cover: nickname/moniker, playing style, most notable achievements.
Style: legendary, evocative, like a hall of fame plaque.

Return ONLY a valid JSON object: {"description": "..."} with no markdown, no other text.`;

const result = await model.generateContent(prompt);
const text = result.response.text().trim();
console.log("RAW:", text);
console.log("---");
const cleaned = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
console.log("CLEANED:", cleaned);
try {
  const data = JSON.parse(cleaned);
  console.log("PARSED:", data);
} catch (e) {
  console.log("PARSE ERROR:", e.message);
}
