// what do we need to track?
// what player we are
// what round we're in
// what move each player has made
//

export interface GameState {
  playerScore: number;
  computerScore: number;
  currentPlayerMove: Move;
}

export interface Move {
  playerHand: "rock" | "paper" | "scissor";
}

export interface Round {
  playerRound: number;
}
