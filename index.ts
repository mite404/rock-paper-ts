import type { Move, GameState, Difficulty } from "./src/types/dataTypes";
import * as readline from "readline";

import { gameLoop } from "./src/controller/gameController";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(query: string): Promise<string> {
  return new Promise((res) => {
    rl.question(query, res)
  })
}

function getDifficulty(query: string): Promise<string> {
  while(true) {
    const input = await askQuestion('Choose your difficulty: normal | hard: ')
    const difficulty: Difficulty = parseDifficulty(input)

    if (difficulty) return difficulty;
    console.log("Invalid difficulty. Try again.")
  }
}

function getPlayerInput(): Promise<Move> {
  while (!gameState.isOver) {
    const input = await askQuestion("Your move (rock/paper/scissors): ")
    const move = parsePlayerInput(input)

  if (move) return move;
  console.log('Invalid move. Try again.')
}

function parsePlayerInput(input: string): Move | null {
  const normalized = input.trim().toLowerCase()
  if (normalized === 'rock' || normalized === 'paper' || normalized === 'scissor') {
    return normalized
  }
  return null;
}

function parseDifficulty(input: string): Difficulty | null {
  const normalized = input.trim().toLowerCase()
  if (normalized === 'normal' || normalized === 'hard') {
    return normalized
  }
  return null;
}

// CLI entry point
gameLoop(difficulty, getPlayerInput, displayRound, displayFinalResult);
