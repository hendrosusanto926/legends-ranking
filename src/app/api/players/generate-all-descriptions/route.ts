import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { getFileContent, commitFile } from "@/lib/github";
import type { Player } from "@/types/player";

const DESCRIPTION_PROMPT = (name: string, nationality: string, position: string, achievements: string) =>
  `You are a football historian. Write a short iconic description (2-3 sentences) about "${name}" (${nationality}, ${position}).

Cover: nickname/moniker, playing style, most notable achievements (${achievements || "various titles"}).
Style: legendary, evocative, like a hall of fame plaque.

Return ONLY: {"description": "..."}`;

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GOOGLE_GEMINI_API_KEY is not configured" }, { status: 500 });
    }

    const authKey = process.env.ADD_PLAYER_KEY;
    if (!authKey) {
      return NextResponse.json({ error: "ADD_PLAYER_KEY is not configured" }, { status: 500 });
    }

    const body = await request.json();
    if (body.authKey !== authKey) {
      return NextResponse.json({ error: "Invalid authentication key" }, { status: 401 });
    }

    const { players } = await getFileContent();

    const withoutDesc = players.filter((p) => !p.description || !p.description.trim());
    if (withoutDesc.length === 0) {
      return NextResponse.json({ message: "All players already have descriptions", total: players.length, generated: 0 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let generated = 0;
    const batchSize = 5;

    for (let i = 0; i < withoutDesc.length; i += batchSize) {
      const batch = withoutDesc.slice(i, i + batchSize);
      const results = await Promise.allSettled(
        batch.map(async (player) => {
          const achievementLabels = [
            { key: "continentalClub" as const, label: "Continental Club" },
            { key: "continentalNational" as const, label: "Continental National" },
            { key: "worldCup" as const, label: "World Cup" },
            { key: "domesticLeague" as const, label: "Domestic League" },
            { key: "ballonDor" as const, label: "Ballon d'Or" },
          ];
          const achievements = achievementLabels
            .map((a) => `${player[a.key]}x ${a.label}`)
            .filter((s) => !s.startsWith("0x"))
            .join(", ");

          const result = await model.generateContent(
            DESCRIPTION_PROMPT(player.name, player.nationality, player.position, achievements)
          );
          const text = result.response.text().trim();
          const cleaned = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
          const data = JSON.parse(cleaned);
          return { id: player.id, description: data.description };
        })
      );

      for (const result of results) {
        if (result.status === "fulfilled" && result.value.description) {
          const p = players.find((pl) => pl.id === result.value.id);
          if (p) {
            p.description = result.value.description;
            generated++;
          }
        }
      }
    }

    await commitFile(players, `Generate descriptions for ${generated} players`);

    return NextResponse.json({
      message: `Generated descriptions for ${generated} out of ${withoutDesc.length} players`,
      total: players.length,
      generated,
    });
  } catch (error) {
    console.error("Batch generation failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Batch generation failed" },
      { status: 500 }
    );
  }
}
