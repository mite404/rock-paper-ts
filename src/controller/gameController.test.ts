import { describe, it, expect, beforeEach } from "vitest";

import { handleRound, gameLoop } from "./gameController";
import type { GameState } from "../types/dataTypes";

describe("handleRound", () => {
  let mockState: GameState;

  beforeEach(() => {
    mockState = {
      difficultyLevel: "normal",
      playerScore: 1,
      aiScore: 0,
      roundResults: [{ playerMove: "rock", aiMove: "scissor", result: "WIN" }],
    };
  });

  it("properly spreads difficultyLevel from previous state", () => {
    const result = handleRound("rock", "scissor", mockState);
    expect(result.difficultyLevel).toBe("normal");
  });

  it("properly updates playerScore on WIN", () => {
    const result = handleRound("rock", "scissor", mockState);
    expect(result.playerScore).toBe(2);
  });

  it("properly updates aiScore on WIN", () => {
    const result = handleRound("rock", "scissor", mockState);
    expect(result.aiScore).toBe(-1);
    expect(result.playerScore).toBe(2);
  });

  it("properly updates playerScore on LOSE", () => {
    const result = handleRound("rock", "paper", mockState);
    expect(result.aiScore).toBe(1);
    expect(result.playerScore).toBe(0);
  });

  it("handles TIE correctly (no score change)", () => {
    const result = handleRound("rock", "rock", mockState);
    expect(result.playerScore).toBe(1);
    expect(result.aiScore).toBe(0);
  });

  it("does not mutate the input state", () => {
    const originalLength = mockState.roundResults.length;
    handleRound("rock", "paper", mockState);
    expect(mockState.roundResults.length).toBe(originalLength); // unchanged length
  });
});
