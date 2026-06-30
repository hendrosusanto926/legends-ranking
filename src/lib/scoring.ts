export function calculateScore(achievements: {
  continentalClub: number;
  continentalNational: number;
  worldCup: number;
  domesticLeague: number;
  ballonDor: number;
  worldCupRunnerUp: number;
  worldCupThirdPlace: number;
  continentalRunnerUp: number;
}): number {
  let score = 0;

  score += achievements.continentalClub * 1.5;
  score += achievements.continentalNational * 1.75;
  score += achievements.worldCup * 2;

  if (achievements.domesticLeague >= 10) {
    score += 2;
  } else if (achievements.domesticLeague >= 5) {
    score += 1.5;
  } else if (achievements.domesticLeague >= 1) {
    score += 1;
  }

  if (achievements.ballonDor >= 1) {
    score += 1;
  }

  score += achievements.worldCupRunnerUp * 1.5;
  score += achievements.worldCupThirdPlace * 0.75;
  score += achievements.continentalRunnerUp * 0.75;

  if (
    achievements.continentalClub >= 1 &&
    achievements.continentalNational >= 1 &&
    achievements.worldCup >= 1 &&
    achievements.domesticLeague >= 1 &&
    achievements.ballonDor >= 1
  ) {
    score += 5;
  }

  return Math.round(score * 100) / 100;
}
