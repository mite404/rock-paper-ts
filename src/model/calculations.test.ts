import { describe, it, expect } from "vitest";
import type { GameResult, Move } from "../types/dataTypes";
import { diff } from "util";

function createMockGameState(overrides?: Parial<GameState>): GameState {
  return {
    humanScore: 0,
    aiScore: 0,
    roundHistory: [],
    currentRound: 1,
    difficulty: "random",
    ...overrides,
  };
}
