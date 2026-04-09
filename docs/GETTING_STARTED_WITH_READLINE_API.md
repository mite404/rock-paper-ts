## Getting Started with Readline API

### What You're Building

A CLI where:

1. Game prompts: "Enter your move (rock/paper/scissors): "
2. User types and hits Enter
3. You capture the input, validate it, pass it to Assignment 2
4. Display the result, loop

Readline makes step 1–3 possible.

---

### Basic Setup

```typescript
import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
```

**What this does:**

- `process.stdin` = keyboard input
- `process.stdout` = terminal output
- `rl` is your interface to talk to the user

---

### Core Pattern: Ask a Question, Get an Answer

#### Synchronous (Blocking) Way

```typescript
rl.question("Your move? ", (answer: string) => {
  console.log(`You said: ${answer}`);
  rl.close(); // Clean up when done
});
```

**What happens:**

1. Print "Your move? " to the terminal
2. **Wait** for user to type and hit Enter
3. Pass what they typed to the callback function
4. Execute the callback with `answer` = the string they typed

#### Async/Await Way (Cleaner)

```typescript
function askQuestion(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer);
    });
  });
}

// Use it:
const playerMove = await askQuestion("Your move? ");
console.log(`You entered: ${playerMove}`);
```

This is easier in a game loop because you can use `await`.

---

### For Your RPS Game: The Pattern You'll Use

```typescript
import * as readline from "readline";
import { playRound } from "./assignment2";
import type { GameState } from "./assignment1";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function main() {
  let gameState = initializeGame();

  while (!gameState.isOver) {
    // Display current state
    console.log(`\nScore: You ${gameState.playerScore} | AI ${gameState.aiScore}`);

    // Ask for input
    const playerInput = await askQuestion("Your move (rock/paper/scissors)? ");

    // Validate and parse (pure function, lives here in CLI)
    const playerMove = parsePlayerInput(playerInput);
    if (!playerMove) {
      console.log("Invalid move. Try again.");
      continue;
    }

    // Call Assignment 2 (pure logic)
    gameState = playRound(gameState, playerMove);

    // Display result
    console.log(`You played: ${playerMove}, AI played: ${gameState.lastAiMove}`);
    console.log(gameState.lastRoundResult); // WIN / LOSE / TIE
  }

  console.log(`\nGame over! Final: You ${gameState.playerScore} | AI ${gameState.aiScore}`);
  rl.close();
}

main();
```

---

### Key Readline Methods

#### `rl.question(prompt, callback)`

Asks a question and waits for an answer.

```typescript
rl.question("Continue? (y/n): ", (answer) => {
  if (answer.toLowerCase() === "y") {
    console.log("Continuing...");
  }
});
```

**Important:** The callback fires *after* the user hits Enter. Until then, your code waits.

#### `rl.close()`

Shut down the interface. Call this when the game ends.

```typescript
gameState.isOver && rl.close();
```

#### `rl.write(data)`

Programmatically send text to the interface (rare, usually you use `console.log` instead).

---

### Common Pitfall: Forgetting to Close

```typescript
// ❌ Bad: readline never closes, program hangs
async function playGame() {
  const move = await askQuestion("Your move? ");
  console.log(`You played: ${move}`);
  // ← Forgot rl.close(), so readline keeps listening forever
}

// ✅ Good: close when done
async function playGame() {
  const move = await askQuestion("Your move? ");
  console.log(`You played: ${move}`);
  rl.close(); // ← Shut down readline
}
```

---

### Input Validation: Parse Don't Trust

Readline gives you a raw string. You must validate:

```typescript
function parsePlayerInput(input: string): Move | null {
  const normalized = input.trim().toLowerCase();

  switch (normalized) {
    case "rock":
      return Move.ROCK;
    case "paper":
      return Move.PAPER;
    case "scissors":
      return Move.SCISSORS;
    default:
      return null; // Invalid input
  }
}
```

**This lives in the CLI**, not in Assignment 1 or 2. Why? Because it's parsing user
input (a side effect concern), not game logic.

---

### The Game Loop Template

```typescript
async function playGame() {
  let gameState = initializeGame();

  while (!gameState.isOver) {
    // 1. Display state
    displayGameState(gameState);

    // 2. Get player input (side effect: readline)
    const playerInput = await askQuestion("Your move? ");
    const playerMove = parsePlayerInput(playerInput);

    // 3. Handle invalid input
    if (!playerMove) {
      console.log("❌ Invalid move. Try again.");
      continue;
    }

    // 4. Call Assignment 2 (pure logic)
    gameState = playRound(gameState, playerMove);

    // 5. Display result
    displayRoundResult(gameState);
  }

  // 6. Game over
  displayGameOver(gameState);
  rl.close();
}

playGame().catch(console.error);
```

Each part has a clear responsibility:

- Steps 1, 2, 5, 6 are **side effects** (I/O)
- Step 3 is **parsing** (semi-pure, but CLI-layer)
- Step 4 is **pure logic** (calls Assignment 2)

---

### Testing vs. Running

**You can't easily unit-test readline.** So don't test it. Test Assignment 2 instead:

```typescript
// ✅ Easy to test: pure function
test("playRound updates score on win", () => {
  const state = { playerScore: 0, aiScore: 0, ... };
  const newState = playRound(state, Move.ROCK);
  expect(newState.playerScore).toBe(1);
});

// ❌ Hard to test: involves readline, user input, etc.
test("CLI asks for move and processes it", async () => {
  // This requires mocking readline, stdin, stdout...
  // Instead, make sure Assignment 2 is correct above.
});
```

---

### Summary for RPS

1. **Create** a readline interface at startup
2. **Wrap** `rl.question()` in a Promise-based helper so you can use `await`
3. **Loop:** ask for move → validate → call Assignment 2 → display result
4. **Close** readline when the game ends

This keeps your game loop clean, and your pure logic (Assignment 2) completely separated from I/O.
