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

console.log("API Key present:", !!apiKey);
console.log("API Key length:", apiKey.length);
console.log("API Key prefix:", apiKey.slice(0, 10) + "...");

if (apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  try {
    const result = await model.generateContent("Return ONLY: {\"status\": \"ok\"}");
    console.log("Response:", result.response.text().trim());
  } catch (e) {
    console.log("Error:", e.message);
    console.log("Status:", e.status);
    if (e.errorDetails) {
      console.log("Details:", JSON.stringify(e.errorDetails));
    }
  }
}
