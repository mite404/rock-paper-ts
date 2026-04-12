import { describe, it, expect } from "vitest";
import { diff } from "util";
import type { GameResult, GameState, Move } from "../types/dataTypes";
import { determineWinner, calculateScore, getAiMove } from "./calculations";

describe("determineWinner", () => {
  it("human wins: rock beats scissor", () => {
    const result = determineWinner("rock", "scissor");
    expect(result).toBe("WIN");
  });

  it("human loses: rock loses to paper", () => {
    const result = determineWinner("rock", "paper");
    expect(result).toBe("LOSE");
  });

  it("tie when both play rock", () => {
    const result = determineWinner("rock", "rock");
    expect(result).toBe("TIE");
  });
});

describe("calculateScore", () => {
  it("adds to currentScore when result is 'WIN'", () => {
    const result = calculateScore(0, "WIN");
    expect(result).toBe(1);
  });

  it("subtracts from currentScore when result is 'LOSE'", () => {
    const result = calculateScore(2, "LOSE");
    expect(result).toBe(1);
  });

  it("has not affect on score when result is 'TIE'", () => {
    const result = calculateScore(2, "TIE");
    expect(result).toBe(2);
  });
});

describe("generate a move for AI opponent", () => {
  it("normal difficulty returns a valid move", () => {
    const gameState: GameState = {
      difficultyLevel: "normal",
      humanScore: 0,
      aiScore: 0,
      roundResults: [],
    };

    const result = getAiMove("normal", gameState);
    expect(["rock", "paper", "scissor"]).toContain(result);
  });

  it("hard difficulty with empty history returns a valid move", () => {
    const gameState: GameState = {
      difficultyLevel: "hard",
      humanScore: 0,
      aiScore: 0,
      roundResults: [],
    };

    const result = getAiMove("hard", gameState);
    expect(["rock", "paper", "scissor"]).toContain(result);
  });

  it("hard difficulty counters most common player move", () => {
    const gameState: GameState = {
      difficultyLevel: "hard",
      humanScore: 0,
      aiScore: 0,
      roundResults: [
        { playerMove: "rock", aiMove: "scissor", result: "WIN" },
        { playerMove: "rock", aiMove: "scissor", result: "WIN" },
        { playerMove: "rock", aiMove: "paper", result: "LOSE" },
      ],
    };

    const result = getAiMove("hard", gameState);
    expect(result).toBe("paper");
  });

  it("hard difficulty handles tie in frequencies by returning a valid move", () => {
    const gameState: GameState = {
      difficultyLevel: "hard",
      humanScore: 0,
      aiScore: 0,
      roundResults: [
        { playerMove: "rock", aiMove: "paper", result: "LOSE" },
        { playerMove: "paper", aiMove: "scissor", result: "LOSE" },
      ],
    };
    const result = getAiMove("hard", gameState);
    expect(["rock", "paper", "scissor"]).toContain(result);
  });
});
