// Data types & pure functions

import type { GameResult, Move } from "../types/dataTypes";

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

export function calculateScore(currentScore: number, result: GameResult) {}

export function generateAiMove(difficulty, gameState) {}
