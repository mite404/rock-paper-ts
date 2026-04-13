# **Game Loop:**

1. Player vs. AI (random or weighted)
2. Each round: display scores
3. Best of 5 or 7 rounds
4. AI can have difficulty levels (random vs. pattern-detection)

**Core Calculations:**
(pure fn)

- `determineWinner(playerMove, aiMove)` → WIN / LOSE / TIE
- `calculateScore(result, currentScore)` → updated score

(side efx)

- `getAiMove(difficulty, gameState?)` → weighted randomness

**State:**

- Player score / AI score
- Round history
- Move frequency (for AI to exploit patterns)

## Personal Notes & Learning Reference

## Type Design Principle

Keep external types minimal. Your type design should live in **Assignment 1 (Data)** —
define `GameState`, `Move`, `Round`, etc. That's where the domain logic lives.
Assignment 2 (Actions) mutates that state in the CLI handler.

When you start coding, ask yourself:

- "Does this function have side effects? If yes, move it to Assignment 2 or CLI."
- "Does this function depend on current time, random numbers, or file I/O?
  - If yes, pass those in as arguments."
- "Does this function mutate its input? If yes, return a new object instead."

---

## Pure Functions vs. Side Effects

A side effect is anything a function does besides returning a value.
A **pure function** takes **inputs → computes → returns an output**. That's it. No traces left behind.
A **side effect** is when the **function** also reaches outside its own scope to **read or change something in the world**:

Modifying a variable outside itself
Writing to a database or file
Making a network request
Logging to the console
Mutating a DOM element
Reading the current time or random numbers

So the distinction isn't about what it returns — it's about what else it does.

---

### Input Validation & Constraints Belong in the Action Layer

**Keep pure functions simple: assume inputs are valid.**

Pure functions like `calculateScore` should NOT validate their inputs. If there's a rule like "score
can't be negative," that constraint belongs in **Assignment 2 (the action layer)**, not in the calculation.

Here's why:

- `calculateScore` just does the math: given a current score and a result, what's the new score?
- It assumes inputs are already valid (i.e., `currentScore` is a legit number, `result` is a valid GameResult)
- The action layer is responsible for **enforcing game rules** before calling calculations, or
  validating the final state after

In practice, for rock-paper-scissors, negative scores probably won't happen anyway if you're running
  a standard best-of-7 (first to 4 wins). The game ends before you accumulate enough losses.
  But here's the pattern anyway:

```typescript
// ❌ DON'T do this in calculations.ts
function calculateScore(currentScore: number, result: GameResult): number {
  const newScore = currentScore + (result === 'WIN' ? 1 : 0);
  if (newScore < 0) throw new Error('Score cannot be negative'); // ← Wrong layer!
  return newScore;
}

// ✅ DO this in actions.ts (Assignment 2)
const newScore = calculateScore(gameState.humanScore, result);
const safeScore = Math.max(newScore, 0); // enforce the rule here, not in calculateScore

const newGameState = {
  ...gameState,
  humanScore: safeScore,
};
```

**The pattern:** Keep the pure function pure and simple. Let the action layer handle business logic
and constraints.

---

## Immutable State Updates in the Action Layer

**The core pattern:** Never mutate state directly. Always return a *new* state object with updated fields.

In `handleRound`, you're orchestrating calculations and building a new `GameState`. Here's the pattern:

### Building Return Objects with Spread

When you need to update *some* fields of an object and keep the rest unchanged:

```typescript
// ❌ BAD - mutating the input
state.humanScore = newScore;
return state;

// ✅ GOOD - returning a new object
return {
  ...state,                    // copy all fields
  humanScore: newScore,        // override this one
  aiScore: newAiScore,         // and this one
};
```

The spread (`...state`) copies all existing fields. Then you override specific fields below it.

### Adding to Arrays Immutably

When you need to add a new item to an array:

```typescript
// ❌ BAD - mutating the array
state.roundHistory.push(newRound);
return state;

// ✅ GOOD - creating a new array
return {
  ...state,
  roundHistory: [
    ...state.roundHistory,   // copy all existing rounds
    newRound                 // add the new round
  ]
};
```

### Complete Pattern: A Single Round

Here's what a complete `handleRound` return looks like:

```typescript
export function handleRound(
  playerMove: Move,
  aiMove: Move,
  state: GameState,
): GameState {
  // Step 1: Compute outcomes (pure calculations)
  const roundResult = determineWinner(playerMove, aiMove);
  const newHumanScore = calculateScore(state.humanScore, roundResult);
  
  let newAiScore = state.aiScore;
  if (roundResult === "WIN") newAiScore -= 1;
  else if (roundResult === "LOSE") newAiScore += 1;
  
  // Step 2: Build the new round record
  const newRound = {
    playerMove,
    aiMove,
    result: roundResult,
  };
  
  // Step 3: Return a new GameState (never mutate the input)
  return {
    difficultyLevel: state.difficultyLevel, // unchanged
    humanScore: newHumanScore,              // updated
    aiScore: newAiScore,                    // updated
    roundHistory: [
      ...state.roundHistory,               // keep all old rounds
      newRound                             // add the new one
    ],
  };
}
```

### Common Mistakes

**Intermediate arrays that aren't needed:**

```typescript
// ❌ BAD - creates an array, adds one item, ignores it
const updatedRoundResults = [];
updatedRoundResults.push(newRound);
// never used!

return {
  ...state,
  roundHistory: [...state.roundHistory, newRound], // should be here
};
```

**Key insight:** Every variable should serve the return statement. If it doesn't, delete it.

---

## Dependency Injection & Callbacks: Decoupling Side Effects from the Controller

The controller (`gameLoop`) needs to **perform side effects** (get player input, display results) but should NOT be tightly coupled to *how* those side effects happen. This is where **callbacks** and **dependency injection** come in.

### The Pattern: Pass Functions as Arguments

Instead of having the controller call `getPlayerInput()` directly, you **pass it in as a parameter**:

```typescript
// ❌ BAD - controller is tightly coupled to readline
export function gameLoop(difficultyLevel: Difficulty): void {
  for (let round = 0; round < 7; round++) {
    const playerMove = getPlayerInput(); // ← hardcoded function call
    // ... rest of loop
  }
}

// ✅ GOOD - controller receives the function as a parameter (dependency injection)
export function gameLoop(
  difficultyLevel: Difficulty,
  getInput: () => Move,  // ← callback parameter
): void {
  for (let round = 0; round < 7; round++) {
    const playerMove = getInput(); // ← calls whatever was passed in
    // ... rest of loop
  }
}
```

### Parameter Name vs. Implementation

This confuses a lot of people. Here's what's happening:

```typescript
// In gameController.ts
export function gameLoop(
  difficultyLevel: Difficulty,
  getInput: () => Move,  // ← parameter name is "getInput"
): void { ... }

// In view/display.ts
export function displayRound(state: GameState): void { ... }
export function displayFinalResult(state: GameState): void { ... }

// In index.ts (CLI entry point)
function getPlayerInput(): Move {
  // readline logic here
  return playerMove;
}

// When you call gameLoop, you pass the actual function
gameLoop("normal", getPlayerInput);  // pass the function itself
```

**Key distinction:**
- **`getInput`** = the parameter name in `gameLoop`. It's just a variable that holds a function reference.
- **`getPlayerInput`** = the actual function defined in `index.ts`. It contains the readline logic.
- When you call `gameLoop("normal", getPlayerInput)`, you're saying: "Here's a function that gets input. Use it."

### Why This Matters: Testing

With dependency injection, you can **swap in a mock** for testing:

```typescript
// In tests
describe("gameLoop", () => {
  it("plays rounds correctly", () => {
    const mockMoves = ["rock", "paper", "scissor"];
    let callCount = 0;
    
    // Pass a mock function instead of readline
    gameLoop("normal", () => {
      const move = mockMoves[callCount % mockMoves.length];
      callCount++;
      return move;
    });
    
    // Test that the game ran with predictable input
    expect(callCount).toBe(7); // looped 7 times
  });
});
```

Without dependency injection, you'd have to mock the entire readline module, which is much harder.

### Same Pattern for Display Functions

Display functions (`displayRound`, `displayFinalResult`) follow the same principle:

```typescript
// gameController.ts
export function gameLoop(
  difficultyLevel: Difficulty,
  getInput: () => Move,
  onRound: (state: GameState) => void,        // ← callback for display
  onGameEnd: (state: GameState) => void,      // ← callback for final result
): void {
  for (let round = 0; round < 7; round++) {
    const playerMove = getInput();
    currentState = handleRound(playerMove, aiMove, currentState);
    
    onRound(currentState);  // ← calls whatever was passed in
    
    if (isGameOver(currentState)) break;
  }
  onGameEnd(currentState);
}

// index.ts
gameLoop(
  "normal",
  getPlayerInput,      // get input
  displayRound,        // display each round
  displayFinalResult,  // display final score
);
```

This way, the controller **doesn't know or care** if you're displaying to console, writing to a file, or sending to a UI. It just calls the callbacks it receives.

### Summary

- **Callback** = a function passed as an argument, to be called later
- **Dependency injection** = passing a function (or object) that contains the behavior you need, rather than hardcoding it
- **Why it matters for ACD:**
  - The controller (Assignment 2) orchestrates the game flow
  - The CLI (index.ts) provides the *implementations* of I/O (readline, console.log)
  - They're decoupled: the controller doesn't import readline; the CLI does
  - Easier to test: swap in mocks without touching the controller

---

## Comparing to `fundamentals-drills`

what WILL go into calculations.ts are the **pure functions** that operate on this data:

- `determineWinner(playerMove: Move, aiMove: Move): Outcome`
- `getAiMove(difficulty: Difficulty, gameState: GameState): Move`
- `updateScore(gameState: GameState, outcome: Outcome): GameState

Let me clarify what goes where by comparing to your puzzle assignment:

**assignment1.ts had:**

```typescript
// Types (Data)
export interface InventoryItem { ... }
export interface OrderedItem { ... }
export type OrderStatus = 'fulfilled' | 'cancelled' | 'rejected';
export interface Order { ... }

// Functions (Calculations)
export function validateOrderItems(...) { ... }
export function isOrderFulfillable(...) { ... }
export function calculateOrderTotal(...) { ... }
```

**Your rock-paper-ts should follow the same pattern:**

**dataTypes.ts (Data only):**

```typescript
// ✓ Keep all of this here — these are pure type definitions
export interface GameState { ... }
export interface RoundResult { ... }
export type Move = "rock" | "paper" | "scissor";
export type Outcome = "human" | "computer" | "tie";
export type Difficulty = "normal" | "hard";
```

**calculations.ts (Functions that operate on the Data):**

```typescript
import { GameState, Move, Outcome } from './dataTypes';

// ✓ These go here — pure functions using the types
export function determineWinner(playerMove: Move, aiMove: Move): Outcome { ... }
export function getAiMove(difficulty: Difficulty, state: GameState): Move { ... }
export function updateScore(state: GameState, outcome: Outcome): GameState { ... }
```

---

## "Enforce Learning Goals" via `eslint` Rules

These rules directly support the **immutable state** and **pure functions** requirements:

### `no-var` + `prefer-const`

```typescript
// ❌ BAD - no-var catches this
var score = 0;

// ❌ BAD - prefer-const catches this (you never reassign it)
let gameState = initGame();

// ✅ GOOD - const signals "this doesn't change"
const gameState = initGame();
```

**Why it matters for your project:**

- Your Assignment 2 should return *new* game states, never mutate the existing one
- `const` is a contract that says "I won't modify this object"
- When you see all `const`, you know you're thinking immutably
- This is the **opposite** of warehouse code that might mutate inventory in-place

#### `no-param-reassign` (with `props: true`)

```typescript
// ❌ BAD - modifies the input
function getAiMove(difficulty: "easy" | "hard", state: GameState): Move {
  state.roundHistory = []; // MUTATED!
  return randomMove();
}

// ✅ GOOD - pure function, reads state, returns result
function getAiMove(difficulty: "easy" | "hard", state: GameState): Move {
  const history = state.roundHistory; // read-only
  return computeMove(history, difficulty);
}
```

**Why it matters:**

- Assignment 1 (calculations) must be *pure* — no side effects
- If you're reassigning parameters, you're violating the contract
- This catches accidental mutations that would break the ACD pattern

---

## "TypeScript-Specific Best Practices"

These catch bugs that are silent or subtle without ESLint:

### `explicit-function-return-types`

```typescript
// ⚠️ WARNING - what does this return?
function determineWinner(p: Move, ai: Move) {
  if (p === ai) return "TIE";
  if (p === "ROCK" && ai === "SCISSORS") return "WIN";
  // ...forgot a return!
}

// ✅ GOOD - return type is explicit
function determineWinner(p: Move, ai: Move): Outcome {
  if (p === ai) return "TIE";
  if (p === "ROCK" && ai === "SCISSORS") return "WIN";
  // ...TypeScript won't compile without returning Outcome
}
```

**Why it matters:**

- In a CLI that runs once, a missing return is a silent bug
- Explicit return types force you to **think about the contract** before coding
- This is part of the "clarity" aspect: your calculations should have clear input/output contracts

#### `no-unused-vars`

```typescript
// ❌ BAD - what's this for?
function initGame(playerName: string, difficulty: "easy" | "hard"): GameState {
  const playerName = playerName; // unused copy
  const config = {}; // defined but never used
  return {
    score: { player: 0, ai: 0 },
    // ...
  };
}

// ✅ GOOD - every declaration serves a purpose
function initGame(difficulty: "easy" | "hard"): GameState {
  return {
    score: { player: 0, ai: 0 },
    difficulty,
    roundHistory: [],
  };
}
```

**Why it matters:**

- Unused variables are noise that obscures intent
- For a learning project, clean code = clear understanding
- The rule has an escape hatch: prefix unused params with `_` if needed

```typescript
// This is fine:
function handleEvent(_event: GameEvent): void {
  // ... I'm ignoring event for now
}
```

#### `no-floating-promises` + `require-await` + `await-thenable`

These catch async mistakes:

```typescript
// ❌ BAD - promise created but never awaited
async function playRound(state: GameState): Promise<GameState> {
  const playerMove = getPlayerInput(); // returns Promise, forgot await!
  const aiMove = getAiMove(state.difficulty, state);
  return updateState(state, playerMove, aiMove);
}

// ✅ GOOD
async function playRound(state: GameState): Promise<GameState> {
  const playerMove = await getPlayerInput();
  const aiMove = getAiMove(state.difficulty, state);
  return updateState(state, playerMove, aiMove);
}
```

**Why it matters:**

- CLI with unhandled promises = game breaks mysteriously
- `require-await` prevents marking functions `async` if you don't use `await` (wastes a microtask)
- These rules catch the async bugs that are hardest to debug

---

### Quick Summary: Why These Rules Matter for **Your** Project

| Rule | Catches | Why It Helps ACD |
|------|---------|-----------------|
| `no-var` / `prefer-const` | Code that reassigns variables | Forces immutable thinking |
| `no-param-reassign` | Mutating function inputs | Pure functions can't modify args |
| `explicit-function-return-types` | Functions with unclear contracts | Calculations must have clear I/O |
| `no-unused-vars` | Dead code and noise | Every line should have a purpose |
| `no-floating-promises` | Forgotten `await` | CLI needs proper async handling |
