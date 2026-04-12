// Event loop orchestration
// calls calculations, updates state, logs results

import type { Difficulty, GameState, Move } from "../types/dataTypes";
import {
  determineWinner,
  calculateScore,
  getAiMove,
} from "../model/calculations";
import type { SHA512_256 } from "bun";

// manage a single round of gameplay
export function handleRound(
  playerMove: Move,
  aiMove: Move,
  state: GameState,
): GameState {
  // take in player move + aiMove
  const roundResult = determineWinner(playerMove, aiMove); // determine winner

  const newHumanScore = calculateScore(state.humanScore, roundResult);

  let newAiScore = state.aiScore;
  if (roundResult === "WIN") newAiScore -= 1;
  else if (roundResult === "LOSE") newAiScore += 1;

  // update this round's result object
  const updatedRoundResult = {
    playerMove,
    aiMove,
    result: roundResult,
  };

  // add previous moves & resulting score to round history
  return {
    difficultyLevel: state.difficultyLevel,
    humanScore: newHumanScore,
    aiScore: newAiScore,
    roundResults: [...state.roundResults, updatedRoundResult],
  };
}

// manage the full game
export function gameLoop(difficultyLevel: Difficulty): void {
  // init game state
  let currentState: GameState = {
    difficultyLevel,
    humanScore: 0,
    aiScore: 0,
    roundResults: [],
  };

  // loop: get player input => play round => check if game is over
  // loop rounds until best out of 7 or game over
  for (let round = 0; round < 7; round++) {
    const playerMove = getPlayerInput();
    const aiMove = getAiMove(currentState.difficultyLevel, currentState);
    currentState = handleRound(playerMove, aiMove, currentState);

    displayRound(currentState);

    if (currentState.humanScore === 4 || currentState.aiScore === 4) {
      break;
    }
  }
  displayFinalResult(currentState);
}
