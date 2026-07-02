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

const models = ["gemini-1.5-flash", "gemini-2.5-flash", "gemini-2.0-flash"];

for (const modelName of models) {
  console.log(`\n--- Testing ${modelName} ---`);
  if (apiKey) {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });
    try {
      const result = await model.generateContent("Return ONLY: {\"status\": \"ok\"}");
      console.log("OK:", result.response.text().trim());
    } catch (e) {
      console.log("Error:", e.message?.slice(0, 200));
      console.log("Status:", e.status);
      if (e.errorDetails) {
        const quota = e.errorDetails.find(d => d.violations);
        if (quota) console.log("Quota:", JSON.stringify(quota.violations));
      }
    }
  }
}
