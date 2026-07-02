import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const DESCRIPTION_PROMPT = (name: string, nationality: string, position: string, achievements: string) =>
  `You are a football historian and writer. Write a short, iconic description about the football player "${name}" from ${nationality} who plays as ${position}.

The description should be 2-3 sentences covering:
- Their famous nickname or moniker (if any)
- Their iconic playing style
- Their most notable achievements: ${achievements}

Write in a legendary, evocative style — like a museum plaque or hall of fame tribute.
Return ONLY a plain JSON object with a single field "description" containing the text. No markdown, no other text. Example:
{"description": "The legendary 'Kaiser' redefined the role of a defender with elegance, intelligence, and leadership..."}`;

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GOOGLE_GEMINI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const authKey = process.env.ADD_PLAYER_KEY;
    if (!authKey) {
      return NextResponse.json(
        { error: "ADD_PLAYER_KEY is not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();

    if (body.authKey !== authKey) {
      return NextResponse.json(
        { error: "Invalid authentication key" },
        { status: 401 }
      );
    }

    if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
      return NextResponse.json(
        { error: "Player name is required" },
        { status: 400 }
      );
    }

    const name = body.name.trim();
    const nationality = body.nationality || "Unknown";
    const position = body.position || "Unknown";
    const achievementsList = (body.achievements || [])
      .map((a: { label: string; value: number }) => `${a.value}x ${a.label}`)
      .filter((a: string) => !a.startsWith("0x"))
      .join(", ");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(DESCRIPTION_PROMPT(name, nationality, position, achievementsList || "various titles"));
    const response = await result.response;
    const text = response.text().trim();

    const cleaned = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();

    let data: { description: string };
    try {
      data = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "AI response was not valid JSON", raw: text },
        { status: 422 }
      );
    }

    if (!data.description || typeof data.description !== "string") {
      return NextResponse.json(
        { error: "AI response missing description field" },
        { status: 422 }
      );
    }

    return NextResponse.json({ description: data.description });
  } catch (error) {
    console.error("Generate description failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generate description failed" },
      { status: 500 }
    );
  }
}
