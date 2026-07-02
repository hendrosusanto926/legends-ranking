export interface Player {
  id: number;
  name: string;
  continentalClub: number;
  continentalNational: number;
  worldCup: number;
  domesticLeague: number;
  ballonDor: number;
  worldCupRunnerUp: number;
  worldCupThirdPlace: number;
  continentalRunnerUp: number;
  position: string;
  nationality: string;
  score: number;
  rank?: number;
  description?: string;
}

export interface PlayerStats {
  totalPlayers: number;
  countriesRepresented: number;
  positionsRepresented: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
}

export type SortField = keyof Player;
export type SortDirection = 'asc' | 'desc';

export interface FilterState {
  search: string;
  nationality: string;
  position: string;
  minScore: number;
  maxScore: number;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

