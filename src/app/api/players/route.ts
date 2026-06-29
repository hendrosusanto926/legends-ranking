import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import type { Player } from "@/types/player";

const DATA_PATH = path.join(process.cwd(), "public", "data", "players.json");

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
    ] as const;

    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null || body[field] === "") {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const raw = await fs.readFile(DATA_PATH, "utf-8");
    const players: Player[] = JSON.parse(raw);

    const maxId = players.reduce((max, p) => Math.max(max, p.id), 0);

    const newPlayer: Player = {
      id: maxId + 1,
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

    players.push(newPlayer);
    await fs.writeFile(DATA_PATH, JSON.stringify(players, null, 2), "utf-8");

    return NextResponse.json(
      { message: "Player added successfully", player: newPlayer },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to add player:", error);
    return NextResponse.json(
      { error: "Failed to add player" },
      { status: 500 }
    );
  }
}
