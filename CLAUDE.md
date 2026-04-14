# Rock-Paper-Scissors CLI: Architecture & Learning Goals

## Project Context

Building a **Rock-Paper-Scissors tournament game** as a CLI application. This project
applies the **Actions, Calculations, Data (ACD)** paradigm from the fundamentals-drills
warehouse system to a new domain: game mechanics and turn-based state management.

---

## Why This Project Sharpens the Fundamentals

### From Warehouse to Game Logic

**What stays the same:**

- Pure calculations operate on immutable data
- State evolves through discrete events (orders → game rounds)
- Actions orchestrate: validate → compute → update state
- Event logging tracks the timeline

**What's different:**

- Instead of inventory deductions, we track **scores and move history**
- Instead of validating product IDs, we validate **move legality**
- Instead of payout math, we compute **winner determination and pattern detection**

This difference forces **sharper thinking** about what truly belongs in each layer.

---

## Architecture Through ACD

### Assignment 1: Calculations & Data (Pure Logic Layer)

**The Domain:** Determining winners and building opponent strategy.

**What calculations will handle:**

- **Move validation:** Is the player's input a legal move? (ROCK, PAPER, SCISSORS)
- **Winner determination:** Given two moves, who wins? Returns WIN / LOSE / TIE
- **Score updates:** Apply the result of a round to the current score
- **AI move generation:** Different difficulty levels should produce different decision patterns
  - Random (always 1/3 chance each)
  - Weighted to exploit patterns in player history
  - This is *calculated*, not random—it depends on data passed in

**Why this matters:** The warehouse system taught us that `calculateOrderTotal` doesn't
randomly decide discount tiers; it *applies the rules*. Similarly, an AI at "hard"
difficulty shouldn't be truly random—it should compute its move based on observable
patterns in player history. This is a calculation, not magic.

**Key insight from assignment1.ts:**
The warehouse example showed functions like `calculateRestockPriority` that turned
inventory state into a score (0/50/100). Here, we'll do the same: turn game history
into an AI decision. Both are transformations of data, not side effects.

---

### Assignment 2: Actions & Orchestration (State Management)

**The System:** Processing a sequence of game rounds.

**What the main action will do:**

1. Initialize game state (scores, move history, round count)
2. Loop through each round
3. Get player input
4. Use Assignment 1 to determine the outcome
5. Mutate state immutably (return new state, never mutate in-place)
6. Log the result
7. Check win condition (first to N, or best-of-7)

**Why this parallels assignment2.ts:**
The warehouse processed events like `placeOrder`, `restock`, `cancelOrder`. Each event:

- Validated inputs using Assignment 1
- Computed outcomes (totals, priorities)
- Updated state immutably
- Logged results

Here, each round is an event. We validate the move, compute the winner, update
score, log it. The structure is identical; only the domain changes.

**Critical constraint:** The action layer should be mostly *boring*—just gluing
calculations together. If you find yourself writing complex logic in Assignment 2, it
belongs in Assignment 1.

---

### Assignment 3: CLI Entry Point (User Interaction)

**The Layer:** Readline interface, display, user input parsing.

This is where side effects live:

- `console.log()` to display state
- `readline` to capture player input
- Main game loop that calls the action function from Assignment 2

This layer should be thin. It's not part of the ACD pattern—it's the *reason* we
execute the pattern.

---

## Data Design (Reasoning, Not Code)

**What must exist:**

- A `Move` type representing ROCK, PAPER, or SCISSORS
- A `Round` type capturing what happened (player move, AI move, outcome)
- A `GameState` type with:
  - Player score / AI score
  - Round history (to enable pattern detection for hard AI)
  - Current round number
  - Difficulty level

**What we don't bake in:**

- The actual readline object (that lives in the CLI, not in data)
- Console output functions (pure functions return data; the CLI displays it)
- Random number generators (use them in the CLI layer; pass the results into calculations)

This is exactly what assignment1.ts did: `Order`, `InventoryItem`, `OrderStatus`. The
warehouse system never imported `fs` or made HTTP calls. The data is just types, and
calculations transform it.

---

## Calculations Design (Reasoning)

**Simpler than the warehouse:**

- `determineWinner(playerMove, aiMove)` → WIN / LOSE / TIE (3 rules, clear)
- `calculateScore(current, result)` → new score (just add 1 for win, 0 for tie)

**More interesting than the warehouse:**

- `getAiMove(difficulty, gameState)` → Move
  - Random difficulty: ignore `gameState`, return random move
  - Hard difficulty: analyze `gameState.roundHistory`, find the most common player move, counter it
  - This is a pure function that *computes* strategy, not a random generator

**The key difference:** In the warehouse, `validateOrderItems` rejected bad data.
Here, `validateMove` does the same. But then `getAiMove` is *generative*—it
produces data from analysis. Both are calculations. Both take in data, output data,
change nothing.

---

## Difficulty Progression

### Why RPS is ideal for this learning

1. **Core mechanics are trivial** (3 moves, 3 rules for winning)
   - This frees your mind to focus on ACD structure, not game complexity

2. **Opponent logic scales with difficulty**
   - Random AI: 3 lines of code
   - Hard AI: analyze move history, pick the counter-move
   - This teaches how to encode *strategy* as calculation

3. **Multiplayer variant is natural**
   - Tournament bracket, best-of-N rounds
   - Multiple rounds accumulate state
   - State transitions are predictable (similar to warehouse events)

---

## Implementation Order

1. **Assignment 1 (Data & Calculations):**
   - Define Move, GameState, Round types
   - Implement determineWinner
   - Implement getAiMove (both difficulties)
   - Implement score calculation
   - Test edge cases (tie → no score change, hard AI on empty history, etc.)

2. **Assignment 2 (Actions):**
   - Initialize game state
   - Round loop: get moves → determine winner → update state → log
   - End condition: best-of-7 (first to 4 wins)
   - Return final game state

3. **CLI (index.ts):**
   - Readline setup
   - Main loop calling Assignment 2
   - Display game state after each round
   - Handle player input (validate, parse, pass to action)

---

## Type Decisions

**What you need:**

- TypeScript strict mode (already enabled by bun init)
- `@types/node` (optional; readline APIs are more ergonomic with types)
- Bun built-ins (fs, readline)

**What you don't need:**

- Game engine libraries
- UI frameworks
- State management libraries (you're writing the state machine yourself)

The point: **ACD is the design pattern, TypeScript is the implementation language.**
The types are just a vehicle to clarify the domain model.

---

## Success Criteria (Learning-Focused)

- [ ] Assignment 1 has no side effects, no randomness (RNG passed in as argument)
- [ ] Assignment 1 is testable without running the game
- [ ] Assignment 2 calls Assignment 1 for all decisions; contains no game logic
- [ ] Game state transitions are immutable (never mutate objects, always return new copies)
- [ ] CLI layer is clear and separated from game logic
- [ ] Hard AI demonstrably beats random AI over 100+ rounds
- [ ] You can explain *why* each function belongs in its layer

---

## References

- `fundamentals-drills/puzzles/problems/assignment1.ts` — Warehouse calculations model
- `fundamentals-drills/puzzles/problems/assignment2.ts` — Warehouse actions model
- `/project_ideas.md` → Rock-Paper-Scissors description (#3 in Tier 1)

---

## Next Steps

1. Read assignment1.ts and assignment2.ts again, this time asking: "What would this
   look like for game state?"
2. Sketch the data types (no implementation, just types)
3. List the 3–4 core calculations needed
4. Write tests for Assignment 1 (before writing implementation)
5. Implement Assignment 1
6. Build Assignment 2 (the easy part once calc is done)
7. Wire up CLI

---

## 🧠 Educational Persona: The Senior Mentor

Treat every interaction as a tutoring session for a visual learner with a
background in Film/TV production and Graphic Design. You are a senior software engineer expert who's
passing knowledge down to a junior software engineer (me). You double checks things, you are
skeptical and you do research. I'm not always right. Neither are you, but we both strive for accuracy.

- **Concept First, Code Second:** Never provide a code snippet without first
  explaining the _pattern_ or _strategy_ behind it.
- **The "Why" and "How":** Explicitly explain _why_ a specific approach was chosen
  over alternatives and _how_ it fits into the larger architecture.
- **Analogy Framework:** Use analogies related to film sets, post-production
  pipelines, or design layers. (e.g., "The Database is the footage vault, the API
  is the editor, the Frontend is the theater screen").

## 🗣️ Explanation Style

- **Avoid Jargon:** Define technical terms immediately with plain language.
- **Visual Descriptions:** Describe code flow visually (e.g., "Imagine data
  flowing like a signal chain on a soundboard").
- **Scaffolding:** Break complex logic into "scenes" or "beats" rather
  than a wall of text.
- **Avoid Being Overcomplimentary:** Strip "Great question" from any response where it's present.

## 📚 The "FOR_ETHAN.md" Learning Log

Maintain a living document at `docs/FOR_ETHAN.md`.
Update this file after every major feature implementation or refactor.

- **Structure:**
  1. **The Story So Far:** High-level narrative of the project.
  2. **Cast & Crew (Architecture):** How components talk to each other (using film analogies).
  3. **Behind the Scenes (Decisions):** Why we chose Stack X over Stack Y.
  4. **Bloopers (Bugs & Fixes):** Detailed breakdown of bugs, why they
     happened, and the logic used to solve them.
  5. **Director's Commentary:** Best practices and "Senior Engineer" mindset
     tips derived from the current work.
- **Tone:** Engaging, magazine-style, memorable. Not a textbook.
