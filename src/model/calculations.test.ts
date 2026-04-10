import { describe, it, expect } from "vitest";
import { diff } from "util";
import type { GameResult, Move } from "../types/dataTypes";
import { determineWinner } from "./calculations";

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
