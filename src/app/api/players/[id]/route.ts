import { NextRequest, NextResponse } from "next/server";
import { updatePlayer, deletePlayer } from "@/lib/github";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const player = await updatePlayer(
      Number(id),
      playerData,
      `Update player: ${body.name}`
    );

    return NextResponse.json(
      { message: "Player updated successfully", player },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update player:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update player" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const authKey = process.env.ADD_PLAYER_KEY;
    if (!authKey || body.authKey !== authKey) {
      return NextResponse.json(
        { error: "Invalid or missing authentication key" },
        { status: 401 }
      );
    }

    const player = await deletePlayer(Number(id), `Delete player: ${body.playerName || `Player #${id}`}`);

    return NextResponse.json(
      { message: "Player deleted successfully", player },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete player:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete player" },
      { status: 500 }
    );
  }
}
