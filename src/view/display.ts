import type { GameState } from "../types/dataTypes";

export function displayRound(state: GameState): void {
  // TODO: show the most recent round result and current scores
  // Hint: the latest round is state.roundResults[state.roundResults.length - 1]
  const playerMove =
    state.roundResults[state.roundResults.length - 1]?.playerMove;
  const aiMove = state.roundResults[state.roundResults.length - 1]?.aiMove;
  const playerScore = state.playerScore;
  const aiScore = state.aiScore;

  console.log();
  console.log(`MATCH UP // ${playerMove} vs ${aiMove}`);
  console.log(`SCORE // Player: ${playerScore} |  AI: ${aiScore}`);
}

export function displayFinalResult(state: GameState): void {
  // TODO: show who won the game and the final score
  // Hint: compare state.playerScore vs state.aiScore

  if (state.playerScore > state.aiScore)
    return console.log(`Rejoice, humans have won!`);
  else return console.log(`Skynet wins`);
}
