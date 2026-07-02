import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// Load .env.local
const envPath = join(root, ".env.local");
let apiKey = "";
try {
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("GOOGLE_GEMINI_API_KEY=")) {
      apiKey = trimmed.slice("GOOGLE_GEMINI_API_KEY=".length).replace(/^["']|["']$/g, "");
      break;
    }
  }
} catch {
  apiKey = process.env.GOOGLE_GEMINI_API_KEY || "";
}

if (!apiKey) {
  console.error("GOOGLE_GEMINI_API_KEY not found in .env.local or environment");
  process.exit(1);
}

const playersPath = join(root, "public", "data", "players.json");
const players = JSON.parse(readFileSync(playersPath, "utf-8"));

const limit = parseInt(process.argv[2] || "0", 10);

let withoutDesc = players.filter(
  (p) => !p.description || !p.description.trim()
);

if (limit > 0) {
  withoutDesc = withoutDesc.slice(0, limit);
}

if (withoutDesc.length === 0) {
  console.log("All players already have descriptions!");
  process.exit(0);
}

console.log(`Generating descriptions for ${withoutDesc.length} players...`);

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

let generated = 0;
const batchSize = 5;
const delayBetweenBatches = 70000; // 70 seconds to respect free tier limit of 5/min

for (let i = 0; i < withoutDesc.length; i += batchSize) {
  const batch = withoutDesc.slice(i, i + batchSize);
  const results = await Promise.allSettled(
    batch.map(async (player) => {
      const achievements = [
        "continentalClub", "continentalNational", "worldCup",
        "domesticLeague", "ballonDor",
      ]
        .map((k) => `${player[k]}x ${k}`)
        .filter((s) => !s.startsWith("0x"))
        .join(", ");

      const prompt = `You are a football historian. Write a short iconic description (2-3 sentences) about "${player.name}" (${player.nationality}, ${player.position}).

Cover: nickname/moniker, playing style, most notable achievements (${achievements || "various titles"}).
Style: legendary, evocative, like a hall of fame plaque.

Return ONLY a valid JSON object: {"description": "..."} with no markdown, no other text.`;

      try {
        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        const cleaned = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
        // Try to extract JSON from the response even if there's extra text
        const jsonMatch = cleaned.match(/\{"description":\s*"[^"]*"\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : cleaned;
        const data = JSON.parse(jsonStr);
        if (data.description && typeof data.description === "string") {
          return { id: player.id, description: data.description };
        }
      } catch (e) {
        console.error(`  Failed for ${player.name}:`, e.message);
      }
      return { id: player.id, description: null };
    })
  );

  for (const result of results) {
    if (result.status === "fulfilled" && result.value?.description) {
      const p = players.find((pl) => pl.id === result.value.id);
      if (p) {
        p.description = result.value.description;
        generated++;
      }
    }
  }

  // Save progress after each batch
  writeFileSync(playersPath, JSON.stringify(players, null, 2), "utf-8");

  console.log(`Progress: ${Math.min(i + batchSize, withoutDesc.length)}/${withoutDesc.length} (generated ${generated} so far)`);

  if (i + batchSize < withoutDesc.length) {
    console.log(`Waiting ${delayBetweenBatches / 1000}s for rate limit...`);
    await new Promise((r) => setTimeout(r, delayBetweenBatches));
  }
}

writeFileSync(playersPath, JSON.stringify(players, null, 2), "utf-8");
console.log(`Done! Generated descriptions for ${generated} out of ${withoutDesc.length} players.`);
