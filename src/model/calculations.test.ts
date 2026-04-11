import { describe, it, expect } from "vitest";
import { diff } from "util";
import type { GameResult, Move } from "../types/dataTypes";
import { determineWinner, calculateScore } from "./calculations";

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
