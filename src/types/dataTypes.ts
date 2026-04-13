export interface GameState {
  difficultyLevel: Difficulty;
  playerScore: number;
  aiScore: number;
  roundResults: Array<RoundResult>;
  isOver: boolean;
}

export interface RoundResult {
  playerMove: Move;
  aiMove: Move;
  result: GameResult;
}

export type GameResult = "WIN" | "LOSE" | "TIE";

export type Move = "rock" | "paper" | "scissor";
export type Difficulty = "normal" | "hard";
