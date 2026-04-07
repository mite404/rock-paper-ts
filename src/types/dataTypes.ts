// what do we need to track?
// what player we are
// what round we're in
// what move each player has made
//

export interface GameState {
  currentPlayer: "human" | "computer";
  difficultyLevel: Difficulty;
  humanScore: number;
  computerScore: number;
  move: Move;
  roundHistory: RoundResult;
}

export interface RoundResult {
  humanMove: Move;
  computerMove: Move;
  outcome: Outcome;
  roundNumber: number;
}

export type Move = "rock" | "paper" | "scissor";
export type Outcome = "human" | "computer" | "tie";
export type Difficulty = "normal" | "hard";
