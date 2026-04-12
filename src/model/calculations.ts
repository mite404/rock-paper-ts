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
): Move {
  const moves: Move[] = ["rock", "paper", "scissor"];

  if (difficulty === "normal") {
    const move = pickRandomMove(moves);
    return move;
  }

  let rockCount = 0;
  let paperCount = 0;
  let scissorCount = 0;

  // loop over each round in roundHistory
  // for each humanMove.rock/paper/scissor add 1 to counter
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
    // if TIE, pick randomly
    const move = pickRandomMove(moves);
    return move;
  }
}

export function pickRandomMove(moves: Array<Move>): Move {
  const index = Math.floor(Math.random() * moves.length);
  const move = moves[index];
  if (!move) throw new Error("Invalid random index");
  return move;
}
