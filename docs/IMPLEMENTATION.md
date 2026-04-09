# Rock, Paper, TypeScript - Implementation Notes

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
    if (round.humanMove === "rock") rockCount++;
    if (round.humanMove === "paper") paperCount++;
    if (round.humanMove === "scissor") scissorCount++;
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
