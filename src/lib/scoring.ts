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

  if (achievements.domesticLeague > 9) {
    score += 2;
  } else if (achievements.domesticLeague > 5) {
    score += 1.5;
  } else if (achievements.domesticLeague > 0) {
    score += 1;
  }

  if (achievements.ballonDor > 0) {
    score += 1;
  }

  score += achievements.worldCupRunnerUp * 1.5;
  score += achievements.worldCupThirdPlace * 0.75;
  score += achievements.continentalRunnerUp * 0.75;

  if (
    achievements.continentalClub > 0 &&
    achievements.continentalNational > 0 &&
    achievements.worldCup > 0 &&
    achievements.domesticLeague > 0 &&
    achievements.ballonDor > 0
  ) {
    score += 5;
  }

  return Math.round(score * 100) / 100;
}
