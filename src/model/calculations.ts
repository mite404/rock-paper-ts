// Data types & pure functions

import type {
  Difficulty,
  GameResult,
  GameState,
  Move,
} from "../types/dataTypes";

/**
 * Determines the outcome of a single round.
 * @param humanMove - The human player's move
 * @param aiMove - The AI player's move
 * @returns WIN, LOSE, or TIE
 */
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

/**
 * Updates the score based on the round result.
 * @param currentScore - The current score
 * @param result - The outcome of the round
 * @returns Updated score (+1 for WIN, -1 for LOSE, unchanged for TIE)
 */
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

/**
 * Generates an AI move based on difficulty and game history.
 * - "normal": Returns a random move
 * - "hard": Analyzes player history and counters the most common move
 * @param difficulty - The AI difficulty level
 * @param gameState - The current game state (used for history analysis)
 * @returns A move (rock, paper, or scissor)
 */
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

/**
 * Selects a random move from an array of moves.
 * @param moves - Array of valid moves
 * @returns A randomly selected move
 * @throws Error if the random selection fails
 */
export function pickRandomMove(moves: Array<Move>): Move {
  const index = Math.floor(Math.random() * moves.length);
  const move = moves[index];
  if (!move) throw new Error("Invalid random index");
  return move;
}
