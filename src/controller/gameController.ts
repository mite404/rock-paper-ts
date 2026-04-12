// Event loop orchestration
// calls calculations, updates state, logs results

import type { GameState, Move } from "../types/dataTypes";
import {
  determineWinner,
  calculateScore,
  generateAiMove,
} from "../model/calculations";

// manage a single round of gameplay
export function handleRound(
  humanMove: Move,
  aiMove: Move,
  state: GameState,
): GameState {
  // take in player move + aiMove
  const winnerOfRound = determineWinner(humanMove, aiMove); // determine winner

  // update score
  // add previous moves & resulting score to round history
}

// manage the full game
// init game state
// loop: get player input => play round => check if game is over
// return final gameState
