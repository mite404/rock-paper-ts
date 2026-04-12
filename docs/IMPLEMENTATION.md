# Rock, Paper, TypeScript - Implementation Notes

---

## Broad Overview

Looking at the CLAUDE.md, it outlines the project structure as:

1. Assignment 1: Calculations & Data (done - they have calculations.ts)
2. Assignment 2: Actions & Orchestration (state management/game loop)
3. Assignment 3: CLI Entry Point (user interaction)

Let me think about what needs to happen in order:

**What's done:**

- Data types (dataTypes.ts) ✓
- Calculations layer (calculations.ts) ✓
- Tests for calculations (mostly done)

**What's next:**

1. **Complete calculation tests** - Finish the test suite for getAiMove and make sure all
calculations pass

2. **Build the actions layer** - This is the orchestration/state management:

- Create a function that handles a single round (take player input, get AI move, determine winner,
update score)
- Create a function that manages the game loop (initialize state, loop through rounds, check win
condition)
  - This is Assignment 2 from the warehouse analogy

3. **Create CLI entry point** - User interaction:
   - Set up readline for player input
   - Display game state/results
   - Wire up the action functions
   - Handle input validation and parsing

4. **Test the full game** - Integration testing:
   - Play through a full game
   - Verify difficulty levels work as expected
   - Check score tracking
   - Verify win conditions

5. **Polish** - Optional:
   - Better formatting/UI
   - Error handling
   - Edge cases

## Phases

Phase 1: Solidify the Pure Logic Layer**

1. Finish tests for `getAiMove()` — verify all difficulty levels and edge cases pass
2. Run full test suite for calculations — all tests green before moving on

**Phase 2: Build the Orchestration Layer (Assignment 2)**

3. Create action function(s) that manage one round:

- Take player move + AI move
- Determine winner
- Update score
- Add result to round history

4. Create action function that manages the full game:

- Initialize game state
- Loop: get player input → play round → check if game is over
- Return final game state

5. Test the action layer — verify state transitions work correctly

**Phase 3: Wire the CLI (Assignment 3)**

6. Set up readline for user input
7. Display game state after each round (scores, move history, etc.)
8. Main loop that calls the action function
9. Input validation and error handling

**Phase 4: Integration & Polish**

10. Play a full game end-to-end — verify all layers work together
11. Test each difficulty level in practice
12. Edge cases and error scenarios

---

The key insight: **Each phase builds on the previous one.** Phase 2 consumes your calculation
functions. Phase 3 consumes your orchestration. Don't move to Phase 3 until Phase 2 is solid.

---

## Hardmode AI

```typescript
// Hard AI function (pseudocode):
function generateHardAIMove(gameState: GameState): Move {
  // Local counters (in memory, temporary)
  let rockCount = 0;
  let paperCount = 0;
  let scissorCount = 0;

  // Scan roundHistory
  for (const round of gameState.roundHistory) {
    if (round.playerMove === "rock") rockCount++;
    if (round.playerMove === "paper") paperCount++;
    if (round.playerMove === "scissor") scissorCount++;
  }

  // Find most common
  const mostCommon = Math.max(rockCount, paperCount, scissorCount);
  if (rockCount === mostCommon) return "paper";  // Counter rock
  if (paperCount === mostCommon) return "scissor";  // Counter paper
  if (scissorCount === mostCommon) return "rock";  // Counter scissor

  // Tie? Return random
  return "rock";
}
```

This is clean because:**

- `GameState` stays simple (no `moveFrequency` field)
- The counters live *inside the function*, local scope
- Every time the AI runs, it recalculates from current history
- No redundancy—single source of truth is `roundHistory`

This is **Assignment 1 territory**—pure calculation that takes data (GameState)
and returns data (Move). No side effects, no persistent state beyond what's passed in.

---
