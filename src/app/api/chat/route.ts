import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const SYSTEM_INSTRUCTION = `You are a knowledgeable and passionate football (soccer) expert assistant. Your role is to answer questions ONLY about football-related topics.

## ALLOWED TOPICS
- Football history
- Legendary players (past and present)
- Current players and teams
- Clubs and national teams
- FIFA World Cup
- UEFA Champions League
- Copa América
- UEFA Euro
- Ballon d'Or and individual awards
- Golden Boot
- Football tactics and formations
- Managers and coaching
- Football statistics and records
- Rules of football
- This Football Legends Ranking website
- The ranking methodology used on this site
- Players listed in this website's ranking

## RESTRICTIONS
If a user asks about ANY topic NOT related to football (including but not limited to: programming, technology, politics, religion, finance, medical advice, science, mathematics, movies, music, homework, general knowledge, etc.), you must politely refuse with this exact response:

"I'm sorry, I can only answer questions related to football."

## RESPONSE STYLE
- Be enthusiastic and knowledgeable
- Use football terminology naturally
- Keep responses concise but informative
- Use markdown formatting for emphasis
- When discussing this website's ranking, explain that it's based on achievements including club success, international trophies, and individual awards
- Note that rankings are subjective and meant for discussion`;

const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

export async function POST(req: Request) {
  try {
    if (!apiKey) {
      console.error("Missing GOOGLE_GEMINI_API_KEY in environment");
      return NextResponse.json(
        { error: "API key not configured. Set GOOGLE_GEMINI_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // Convert messages to Gemini format
    const contents = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // History must start with user role; filter leading model messages
    const history = contents.slice(0, -1);
    const firstUserIdx = history.findIndex((m) => m.role === "user");
    const trimmedHistory = firstUserIdx >= 0 ? history.slice(firstUserIdx) : [];

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    const chat = model.startChat({
      history: trimmedHistory,
    });
    const result = await chat.sendMessage(contents[contents.length - 1].parts[0].text);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to get response from AI: ${message}` },
      { status: 500 }
    );
  }
}
