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

- `generateAIMove(difficulty, gameState?)` → weighted randomness

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

## Comparing to `fundamentals-drills`

what WILL go into calculations.ts are the **pure functions** that operate on this data:

- `determineWinner(playerMove: Move, aiMove: Move): Outcome`
- `generateAIMove(difficulty: Difficulty, gameState: GameState): Move`
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
export function generateAIMove(difficulty: Difficulty, state: GameState): Move { ... }
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
function generateAIMove(difficulty: "easy" | "hard", state: GameState): Move {
  state.roundHistory = []; // MUTATED!
  return randomMove();
}

// ✅ GOOD - pure function, reads state, returns result
function generateAIMove(difficulty: "easy" | "hard", state: GameState): Move {
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
  const aiMove = generateAIMove(state.difficulty, state);
  return updateState(state, playerMove, aiMove);
}

// ✅ GOOD
async function playRound(state: GameState): Promise<GameState> {
  const playerMove = await getPlayerInput();
  const aiMove = generateAIMove(state.difficulty, state);
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
