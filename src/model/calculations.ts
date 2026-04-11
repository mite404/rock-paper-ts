// Data types & pure functions

import type {
  Difficulty,
  GameResult,
  GameState,
  Move,
} from "../types/dataTypes";

export function determineWinner(humanMove: Move, aiMove: Move): GameResult {
  const rockBeats = "scissor";
  const paperBeats = "rock";
  const scissorBeats = "paper";

  if (
    (humanMove === "rock" && aiMove === rockBeats) ||
    (humanMove === "paper" && aiMove === paperBeats) ||
    (humanMove === "scissor" && aiMove === scissorBeats)
  ) {
    return "WIN";
  } else if (
    (aiMove === "rock" && humanMove === rockBeats) ||
    (aiMove === "paper" && humanMove === paperBeats) ||
    (aiMove === "scissor" && humanMove === scissorBeats)
  ) {
    return "LOSE";
  } else return "TIE";
}

export function calculateScore(
  currentScore: number,
  result: GameResult,
): number {
  if (result === "WIN") {
    return currentScore + 1;
  } else if (result === "LOSE") {
    return currentScore - 1;
  } else {
    return currentScore;
  }
}

export function generateAiMove(
  difficulty: Difficulty,
  gameState: GameState,
  randomNum: number,
): Move {
  let rockCount = 0;
  let paperCount = 0;
  let scissorCount = 0;

  // choosing truly random move as 'random' difficulty
  const moves: Move[] = ["rock", "paper", "scissor"];
  if (difficulty === "random") {
    const index = Math.floor(randomNum * moves.length);
    const move = moves[index];
    if (!move) throw new Error("Invalid random index");
    return move;
  }

  // loop over each round in roundHistory
  // for each humanMove.rock/paper/scissor add 1 to counter

  // scan roundHistory
  for (const round of gameState.roundHistory) {
    if (round.humanMove === "rock") rockCount++;
    if (round.humanMove === "paper") paperCount++;
    if (round.humanMove === "scissor") scissorCount++;
  }

  const mostCommon = Math.max(rockCount, paperCount, scissorCount);
  if (rockCount === mostCommon) {
    return "paper";
  } else if (paperCount === mostCommon) {
    return "scissor";
  } else if (scissorCount === mostCommon) {
    return "rock";
  } else {
    // if TIE, return random
    return "rock";
  }
}
