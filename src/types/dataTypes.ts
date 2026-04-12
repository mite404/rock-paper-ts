export interface GameState {
  difficultyLevel: Difficulty;
  humanScore: number;
  aiScore: number;
  roundResults: Array<RoundResult>;
}

export interface RoundResult {
  playerMove: Move;
  aiMove: Move;
  result: GameResult;
}

export type GameResult = "WIN" | "LOSE" | "TIE";

export type Move = "rock" | "paper" | "scissor";
export type Difficulty = "normal" | "hard";
