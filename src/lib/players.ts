import { Player, PlayerStats, FilterState } from "@/types/player";

export async function getPlayers(): Promise<Player[]> {
  try {
    const res = await fetch("/data/players.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch players");
    return res.json();
  } catch {
    return [];
  }
}

export function calculateStats(players: Player[]): PlayerStats {
  const scores = players.map((p) => p.score);
  return {
    totalPlayers: players.length,
    countriesRepresented: new Set(players.map((p) => p.nationality)).size,
    positionsRepresented: new Set(players.map((p) => p.position)).size,
    averageScore: scores.length
      ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100) / 100
      : 0,
    highestScore: scores.length ? Math.max(...scores) : 0,
    lowestScore: scores.length ? Math.min(...scores) : 0,
  };
}

export function filterPlayers(players: Player[], filters: FilterState): Player[] {
  const searchTerms = filters.search.toLowerCase().split(/\s+/).filter(Boolean);

  return players.filter((player) => {
    const playerStr =
      `${player.name} ${player.nationality} ${player.position} ${player.score}`
        .toLowerCase();

    const matchesSearch =
      !filters.search ||
      searchTerms.every((term) => playerStr.includes(term));

    const matchesNationality =
      !filters.nationality || player.nationality === filters.nationality;
    const matchesPosition =
      !filters.position || player.position === filters.position;
    const matchesMinScore = player.score >= (filters.minScore || 0);
    const matchesMaxScore = filters.maxScore
      ? player.score <= filters.maxScore
      : true;

    return (
      matchesSearch &&
      matchesNationality &&
      matchesPosition &&
      matchesMinScore &&
      matchesMaxScore
    );
  });
}

export function getUniqueValues(players: Player[], key: keyof Player): string[] {
  return [...new Set(players.map((p) => String(p[key])))].sort();
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function getPlayerBySlug(players: Player[], slug: string): Player | undefined {
  return players.find((p) => slugify(p.name) === slug);
}

export const ACHIEVEMENT_CONFIG = [
  { key: "continentalClub" as const, label: "Continental Club", icon: "Trophy", color: "#FFD700", maxValue: 5 },
  { key: "continentalNational" as const, label: "Continental National", icon: "Earth", color: "#1B5E20", maxValue: 2 },
  { key: "worldCup" as const, label: "World Cup", icon: "Globe", color: "#1B5E20", maxValue: 3 },
  { key: "domesticLeague" as const, label: "Domestic League", icon: "Award", color: "#FFD700", maxValue: 12 },
  { key: "ballonDor" as const, label: "Ballon d'Or", icon: "Star", color: "#FFD700", maxValue: 8 },
  { key: "worldCupRunnerUp" as const, label: "World Cup Runner-up", icon: "Medal", color: "#C0C0C0", maxValue: 2 },
  { key: "worldCupThirdPlace" as const, label: "World Cup Third Place", icon: "Medal", color: "#CD7F32", maxValue: 2 },
  { key: "continentalRunnerUp" as const, label: "Continental Runner-up", icon: "Medal", color: "#C0C0C0", maxValue: 2 },
] as const;

export const ACHIEVEMENT_LABELS: Record<string, string> = {
  continentalClub: "Continental Club",
  continentalNational: "Continental National",
  worldCup: "World Cup",
  domesticLeague: "Domestic League",
  ballonDor: "Ballon d'Or",
  worldCupRunnerUp: "World Cup Runner-up",
  worldCupThirdPlace: "World Cup Third Place",
  continentalRunnerUp: "Continental Runner-up",
};
