import { NextRequest, NextResponse } from "next/server";
import { addPlayer } from "@/lib/github";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const authKey = process.env.ADD_PLAYER_KEY;
    if (!authKey || body.authKey !== authKey) {
      return NextResponse.json(
        { error: "Invalid or missing authentication key" },
        { status: 401 }
      );
    }

    const requiredFields = [
      "name", "nationality", "position",
      "continentalClub", "continentalNational", "worldCup",
      "domesticLeague", "ballonDor", "worldCupRunnerUp",
      "worldCupThirdPlace", "continentalRunnerUp", "score",
    ];

    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null || body[field] === "") {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const playerData = {
      name: body.name,
      continentalClub: Number(body.continentalClub),
      continentalNational: Number(body.continentalNational),
      worldCup: Number(body.worldCup),
      domesticLeague: Number(body.domesticLeague),
      ballonDor: Number(body.ballonDor),
      worldCupRunnerUp: Number(body.worldCupRunnerUp),
      worldCupThirdPlace: Number(body.worldCupThirdPlace),
      continentalRunnerUp: Number(body.continentalRunnerUp),
      position: body.position,
      nationality: body.nationality,
      score: Number(body.score),
    };

    const player = await addPlayer(playerData, `Add player: ${body.name}`);

    return NextResponse.json(
      { message: "Player added successfully", player },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to add player:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to add player" },
      { status: 500 }
    );
  }
}
