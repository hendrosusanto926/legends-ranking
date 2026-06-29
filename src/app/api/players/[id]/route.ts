import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import type { Player } from "@/types/player";

const DATA_PATH = path.join(process.cwd(), "public", "data", "players.json");

async function readPlayers(): Promise<Player[]> {
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

function validateAuth(body: Record<string, unknown>): boolean {
  const authKey = process.env.ADD_PLAYER_KEY;
  return !!(authKey && body.authKey === authKey);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!validateAuth(body)) {
      return NextResponse.json(
        { error: "Invalid or missing authentication key" },
        { status: 401 }
      );
    }

    const players = await readPlayers();
    const index = players.findIndex((p) => p.id === Number(id));

    if (index === -1) {
      return NextResponse.json(
        { error: "Player not found" },
        { status: 404 }
      );
    }

    const requiredFields = [
      "name", "nationality", "position",
      "continentalClub", "continentalNational", "worldCup",
      "domesticLeague", "ballonDor", "worldCupRunnerUp",
      "worldCupThirdPlace", "continentalRunnerUp", "score",
    ] as const;

    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null || body[field] === "") {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    players[index] = {
      id: Number(id),
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

    await fs.writeFile(DATA_PATH, JSON.stringify(players, null, 2), "utf-8");

    return NextResponse.json(
      { message: "Player updated successfully", player: players[index] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update player:", error);
    return NextResponse.json(
      { error: "Failed to update player" },
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

    if (!validateAuth(body)) {
      return NextResponse.json(
        { error: "Invalid or missing authentication key" },
        { status: 401 }
      );
    }

    const players = await readPlayers();
    const index = players.findIndex((p) => p.id === Number(id));

    if (index === -1) {
      return NextResponse.json(
        { error: "Player not found" },
        { status: 404 }
      );
    }

    const removed = players.splice(index, 1)[0];
    await fs.writeFile(DATA_PATH, JSON.stringify(players, null, 2), "utf-8");

    return NextResponse.json(
      { message: "Player deleted successfully", player: removed },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete player:", error);
    return NextResponse.json(
      { error: "Failed to delete player" },
      { status: 500 }
    );
  }
}
