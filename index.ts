import type { Move, GameState, Difficulty } from "./src/types/dataTypes";
import * as readline from "readline";
import { gameLoop } from "./src/controller/gameController";
import { displayRound, displayFinalResult } from "./src/view/display";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(query: string): Promise<string> {
  return new Promise((res) => {
    rl.question(query, res);
  });
}

async function getDifficulty(): Promise<Difficulty> {
  while (true) {
    console.log("Best out of 7 matches...");
    const input = await askQuestion("CHOOSE DIFFICULTY // (n)ormal | (h)ard: ");
    const difficulty: Difficulty | null = parseDifficulty(input);

    if (difficulty) return difficulty;
    console.log("Invalid difficulty. Try again.");
  }
}

async function getPlayerInput(): Promise<Move> {
  while (true) {
    const input = await askQuestion(
      "YOUR MOVE // (r)ock / (p)aper / (s)cissor: ",
    );
    const move = parsePlayerInput(input);

    if (move) return move;
    console.log("Invalid move. Try again.");
  }
}

function parsePlayerInput(input: string): Move | null {
  const normalized = input.trim().toLowerCase();
  if (normalized === "rock" || normalized === "r") return "rock";
  if (normalized === "paper" || normalized === "p") return "paper";
  if (normalized === "scissor" || normalized === "s") return "scissor";

  return null;
}

function parseDifficulty(input: string): Difficulty | null {
  const normalized = input.trim().toLowerCase();
  if (normalized === "normal" || normalized === "n")
    return normalized as Difficulty;
  if (normalized === "hard" || normalized === "h")
    return normalized as Difficulty;

  return null;
}

async function main() {
  const difficulty = await getDifficulty();

  await gameLoop(difficulty, getPlayerInput, displayRound, displayFinalResult);

  rl.close();
}

main().catch(console.error);
