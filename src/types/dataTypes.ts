// what do we need to track?
// what player we are
// what round we're in
// what move each player has made
//

export interface GameState {
  difficultyLevel: Difficulty;
  humanScore: number;
  aiScore: number;
  roundHistory: Array<RoundResult>;
}

export interface RoundResult {
  humanMove: Move;
  aiMove: Move;
  result: GameResult;
}

export type GameResult = "WIN" | "LOSE" | "TIE";

export type Move = "rock" | "paper" | "scissor";
// export type Outcome = "human" | "computer" | "tie"
export type Difficulty = "normal" | "hard";
