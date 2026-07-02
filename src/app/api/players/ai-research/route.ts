import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { calculateScore } from "@/lib/scoring";
import { getFileContent } from "@/lib/github";

const ACHIEVEMENT_FIELDS = [
  "continentalClub", "continentalNational", "worldCup",
  "domesticLeague", "ballonDor", "worldCupRunnerUp",
  "worldCupThirdPlace", "continentalRunnerUp",
] as const;

const AI_PROMPT = (name: string) =>
  `You are a football statistics expert with comprehensive knowledge of football history.

Research the career achievements of "${name}" and return ONLY a valid JSON object (no markdown, no other text) with the following structure:

{
  "name": "Full official name of the player",
  "nationality": "Country name (e.g., Argentina, Brazil, Germany, Italy, England, France, Netherlands)",
  "position": "Best-known position from: GK, CB, LB, RB, DM, CM, AM, RM, LM, RW, LW, CF, SS",
  "continentalClub": number (count of UEFA Champions League / Copa Libertadores / equivalent continental club titles),
  "continentalNational": number (count of UEFA Euro / Copa America / AFC Asian Cup / equivalent continental national team titles),
  "worldCup": number (count of FIFA World Cup titles),
  "domesticLeague": number (count of top-tier domestic league titles),
  "ballonDor": number (count of Ballon d'Or awards),
  "worldCupRunnerUp": number (count of FIFA World Cup runner-up finishes),
  "worldCupThirdPlace": number (count of FIFA World Cup third-place finishes),
  "continentalRunnerUp": number (count of continental national team runner-up finishes, e.g., Euro runner-up, Copa America runner-up),
  "description": "A short iconic description (2-3 sentences) about the player covering their nickname, playing style, and most notable achievements — written in a legendary, evocative style",
  "achievementDetails": {
    "continentalClub": "List each title with year (e.g., UEFA Champions League 2006, 2008, 2016)",
    "continentalNational": "List each title with year (e.g., UEFA Euro 2008)",
    "worldCup": "List each title with year (e.g., FIFA World Cup 2010)",
    "domesticLeague": "List league + year for each (e.g., La Liga 2005, 2006, 2009, 2010, 2011)",
    "ballonDor": "List each award with year (e.g., Ballon d'Or 2009, 2010, 2011, 2012)",
    "worldCupRunnerUp": "List each with year (e.g., FIFA World Cup runner-up 2014)",
    "worldCupThirdPlace": "List each with year",
    "continentalRunnerUp": "List each with year (e.g., Copa America runner-up 2007)"
  }
}

Guidelines:
- Only count MAJOR titles. For continentalClub, only the premier continental club competition (UCL, Libertadores, etc.), not domestic cups or super cups.
- For domesticLeague, count only top-flight league titles.
- For ballonDor, count only official Ballon d'Or awards.
- Be precise and accurate. Make your best estimate if unsure.
- achievementDetails must have the same count of items as the number values above.
- If a count is 0, achievementDetails for that field should be an empty string "".
- description should be 2-3 sentences covering nickname, playing style, and key achievements.
- Return ONLY the JSON object, no other text, no markdown.`;

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

    if (!body.playerName || typeof body.playerName !== "string" || !body.playerName.trim()) {
      return NextResponse.json(
        { error: "Player name is required" },
        { status: 400 }
      );
    }

    const playerName = body.playerName.trim();

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(AI_PROMPT(playerName));
    const response = await result.response;
    const text = response.text().trim();

    const cleaned = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();

    let aiData: Record<string, unknown>;
    try {
      aiData = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "AI response was not valid JSON", raw: text },
        { status: 422 }
      );
    }

    const requiredFields = [
      "name", "nationality", "position",
      "continentalClub", "continentalNational", "worldCup",
      "domesticLeague", "ballonDor", "worldCupRunnerUp",
      "worldCupThirdPlace", "continentalRunnerUp",
    ] as const;

    for (const field of requiredFields) {
      if (aiData[field] === undefined || aiData[field] === null) {
        return NextResponse.json(
          { error: `AI response missing field: ${field}`, raw: aiData },
          { status: 422 }
        );
      }
    }

    const description = aiData.description && String(aiData.description).trim()
      ? String(aiData.description).trim()
      : "";

    const playerData = {
      name: String(aiData.name),
      nationality: String(aiData.nationality),
      position: String(aiData.position),
      continentalClub: Number(aiData.continentalClub),
      continentalNational: Number(aiData.continentalNational),
      worldCup: Number(aiData.worldCup),
      domesticLeague: Number(aiData.domesticLeague),
      ballonDor: Number(aiData.ballonDor),
      worldCupRunnerUp: Number(aiData.worldCupRunnerUp),
      worldCupThirdPlace: Number(aiData.worldCupThirdPlace),
      continentalRunnerUp: Number(aiData.continentalRunnerUp),
    };

    const { players } = await getFileContent();
    const exists = players.some(
      (p) =>
        p.name.trim().toLowerCase() === playerData.name.trim().toLowerCase() &&
        p.nationality.trim().toLowerCase() === playerData.nationality.trim().toLowerCase()
    );
    if (exists) {
      return NextResponse.json(
        {
          error: `Player "${playerData.name}" (${playerData.nationality}) already exists in the database`,
        },
        { status: 409 }
      );
    }

    const rawDetails = aiData.achievementDetails as Record<string, unknown> | undefined;
    const achievementDetails: Record<string, string> = {};
    for (const field of ACHIEVEMENT_FIELDS) {
      const val = rawDetails?.[field];
      achievementDetails[field] = val && String(val).trim() ? String(val).trim() : "";
    }

    const score = calculateScore(playerData);

    return NextResponse.json({
      playerData,
      achievementDetails,
      description,
      score,
    });
  } catch (error) {
    console.error("AI research failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "AI research failed" },
      { status: 500 }
    );
  }
}
