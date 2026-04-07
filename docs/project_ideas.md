# TypeScript Game Project Ideas (1–2 Afternoons)

## Why These Projects Are Good Practice

You've mastered the **ACD paradigm** (Actions, Calculations, Data). These projects will let you:

- Apply pure logic to **game mechanics** instead of warehouse orders
- Build **interactive state machines** (player turn → game state → outcome)
- Handle **randomness** in calculations (dice rolls, card draws)
- Practice **immutable state updates** as players make moves

---

## 🎲 Tier 1: Console Games (Simplest, ~4–6 hours)

### 1. **Dice Rolling & Betting Game**

A simple luck-based game where the player bets on dice rolls.

**Game Loop:**

1. Player starts with $100
2. Each round: choose a number (1–6) and a bet amount
3. Roll two dice, compare to guess
4. Win/loss multiplier on bet
5. Play until bankrupt or quit

**Core Calculations:**

- `validateBet(amount, bankroll)` → is this valid?
- `rollDice()` → returns array of two numbers
- `evaluateGuess(guess, rolls, betAmount)` → payout or loss
- `calculateNewBankroll(current, payout)`

**State:**

- Current bankroll
- Betting history/log
- Win/loss streak

**Why it's great:** Simple mechanics, clear math, teaches randomness + state.

---

### 2. **Higher/Lower Card Game**

Single-deck card game where you predict if the next card is higher or lower.

**Game Loop:**

1. Deal one card face-up
2. Player guesses: higher or lower?
3. Reveal next card
4. Track streak & payouts
5. Continue until deck is exhausted

**Core Calculations:**

- `createDeck()` → shuffled card array
- `isGuessCorrect(currentCard, nextCard, guess)` → true/false
- `calculatePayout(streakLength)` → exponential reward for streak

**State:**

- Remaining deck
- Current card
- Streak counter
- Score/bankroll

**Why it's great:** Teaches randomness, deck management, streak mechanics.

---

### 3. **Rock-Paper-Scissors Tournament**

Multi-round game with strategy tracking.

**Game Loop:**

1. Player vs. AI (random or weighted)
2. Each round: display scores
3. Best of 5 or 7 rounds
4. AI can have difficulty levels (random vs. pattern-detection)

**Core Calculations:**

- `determineWinner(playerMove, aiMove)` → WIN / LOSE / TIE
- `calculateScore(result, currentScore)` → updated score
- `generateAIMove(difficulty, playerHistory?)` → weighted randomness

**State:**

- Player score / AI score
- Round history
- Move frequency (for AI to exploit patterns)

**Why it's great:** Introduces opponent logic, history tracking, decision trees.

---

## 🎰 Tier 2: Light Strategy Games (~6–8 hours)

### 4. **Blackjack (Single Player vs. House)**

Classic card game with hit/stand decisions.

**Game Loop:**

1. Deal player + house 2 cards each
2. Player chooses: HIT or STAND
3. House follows fixed rules (hit on ≤16, stand on ≥17)
4. Compare hands → WIN / LOSE / BUST / PUSH
5. Repeat with new deck

**Core Calculations:**

- `createDeck()` → shuffled deck
- `calculateHandValue(cards)` → face cards count as 10, ace as 11 or 1
- `isBust(value)` → true if > 21
- `determineWinner(playerCards, houseCards)` → outcome
- `payout(bet, result)` → winnings

**State:**

- Player hand / house hand
- Remaining deck
- Player bankroll
- Bet history

**Why it's great:** Combines calculation (hand value with Ace logic), strategy, multi-state flow.

---

### 5. **Simple Poker Hand Evaluator + Betting**

(Simplified: no Texas Hold'em community cards, just 5-card draw)

**Game Loop:**

1. Deal 5-card hand to player
2. Player chooses cards to discard/redraw
3. Compare final hand to "house" (random hand)
4. Payout based on hand rank (pair, three-of-a-kind, flush, etc.)

**Core Calculations:**

- `createDeck()` → deck of 52 cards
- `rankHand(cards)` → ROYAL_FLUSH, STRAIGHT_FLUSH, ... NOTHING
- `compareHands(playerHand, houseHand)` → WIN / LOSE / PUSH
- `payout(handRank, bet)` → winnings (escalates with better hands)

**State:**

- Player hand
- Hole cards (hidden house hand)
- Remaining deck
- Player bankroll
- Redraw choices

**Why it's great:** Heavy on hand evaluation logic (great pure function practice),
introduces multi-stage decisions.

---

### 6. **Tiny Dungeon Crawler (Turn-Based)**

A single-player roguelike where you move through rooms, encounter enemies, collect loot.

**Game Loop:**

1. Player starts in a dungeon
2. Each turn: MOVE (up/down/left/right), ATTACK, or USE_ITEM
3. Random chance of encountering enemy
4. Combat: Roll to hit, calculate damage
5. Loot/health/inventory management
6. Escape dungeon or die

**Core Calculations:**

- `movePlayer(currentPos, direction, gridSize)` → new position
- `rollToHit(playerAtk, enemyDef, modifier?)` → HIT / MISS
- `calculateDamage(weaponDamage, roll)` → total damage
- `applyDamage(health, damage)` → new health or DEAD
- `generateEnemy()` → random enemy with stats
- `evaluateLoot(roll, level)` → health potion, weapon, gold

**State:**

- Player position / health / inventory
- Enemy encounters
- Dungeon grid / rooms
- Items held / equipped

**Why it's great:** Grid-based logic, combat simulation, RNG-driven encounters,
teaches turn-order state machines.

---

## 🧩 Recommended Starting Point

**If you want quick wins:** Start with **#1 (Dice/Betting)** or **#2 (Higher/Lower)**

- Both are ~4 hours
- Clear mechanics
- Force you to think about payout math + bankroll management

**If you want more depth:** Go straight to **#4 (Blackjack)**

- Perfect use of ACD pattern
- More interesting calculation layer (hand evaluation)
- Natural action flow (HIT vs. STAND)

**If you want a full afternoon challenge:** **#6 (Dungeon Crawler)**

- Grid-based state (like warehouse inventory locations)
- Multiple subsystems (combat, loot, movement)
- Good stepping stone to larger projects

---

## Architecture Pattern (Reuse Your ACD Skills)

Every project should follow this structure:

### **Assignment 1: Game Logic (Pure Calculations)**

```typescript
// Data: Card, Hand, Dice, Player, Enemy, etc.
// Calculations:
//   - validateMove(move, gameState) → errors[]
//   - calculateOutcome(action, state) → result
//   - updateScore(current, delta) → number
```

### **Assignment 2: Game Engine (Actions)**

```typescript
// Loop through turns/events
// Use Assignment 1 to decide outcomes
// Mutate game state immutably
// Log all events
```

### **CLI Entry Point**

```typescript
// readline interface for player input
// Call game engine
// Display state after each action
```

---

## Next Steps

1. **Pick a game** (recommend: Dice Betting or Blackjack)
2. **Sketch the data model** (types for Card, Hand, Dice, etc.)
3. **List your calculations** (what pure functions do you need?)
4. **Build the state machine** (action loop)
5. **Add a CLI** (readline for input, console.log for display)

---

## Quick Feasibility Check

| Game | Calcs | State | CLI | Est. Hours |
|------|-------|-------|-----|-----------|
| Dice Betting | 3–4 | simple | ✓ easy | 3–4 |
| Higher/Lower | 3–4 | simple | ✓ easy | 3–4 |
| RPS | 2–3 | simple | ✓ easy | 2–3 |
| Blackjack | 5–6 | moderate | ✓ medium | 6–8 |
| Poker Hand | 4–5 | moderate | ✓ medium | 7–9 |
| Dungeon | 7–10 | complex | ✓ complex | 8–10 |

**Recommendation:** Pick one, give it 2–3 hours, and **iterate.** Better to finish a
simple game with polish than abandon a complex one.
