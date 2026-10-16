# Plan

Ideas that are not built yet. Written down as they were said; "Open" lists what has to be decided
before the work starts. Move an item to `changelog/` when it ships.

---

## 1. Rank-update animation: a progress bar between two levels

When a rank changes, a thin bar appears and fills from the old value to the new one, so the player
sees the progress and is motivated to go further.

- The bar has a **dynamic range**: the left end is level **A**, the right end is level **C**, the
  current position is **B**. The ends are not fixed 0 … max, they are picked around the change.
- Example: the rank was 30, became 60. The bar:

  ```
  20 | ------(30)--------60---------- | 100
  ```

  The fill runs from 30 to 60. 20 and 100 are the ends of the range, 30 is where the player was,
  60 is where the player is now.
- Purpose: visualise the progress and motivate.

Open:
- Which rank: the task rank (days), the overall rank / player level, or both.
- How the ends (20 and 100 in the example) are chosen: a step of the dynamic range (the nearest
  round numbers around the old and new value?).
- Where it plays: in the editor after a payout, in the transactions modal, on the PROFILE button.

---

## 2. Solve statistics in the editor task bar + a per-task history modal

In the task bar of the editor, to the right of the rank:

- the **number of solves** by the player, with a **green check** icon;
- the **number of failed runs**, with a **red cross** icon;
- a **HISTORY** button. A click opens a modal for **this task only**: when the player solved it, how
  many times, on which days (dates).

Already there:
- `gr_stats` keeps `{ ok, fail, coins }` per task (`js/wallet.js`, `walletStat`) — the two counters;
- `gr_history` has a `solve` entry per payout with the time (`js/transactions.js` already draws such
  a table for all tasks) — the modal can reuse it, filtered by the task.

Open:
- "Solves": successful runs (`ok`) or counted solves that paid out (a first free solve, repeat
  solves)? The two numbers are different today.
- The modal: the same document-with-day-tabs look as TRANSACTIONS, one row per solve (time, rank,
  coins), or a calendar-like list of days with a counter.

---

## 3. Motivation: the streak mode

**Keeping the streak:** the player has to solve at least **one task every day** — not any task, but
**the most demanding one**.

**Freezes:** the player can buy a freeze (**100 coins** for one), at most **3** at a time. A freeze
saves the streak on a day without a solve.

**Reward bonus:** **n days** of the streak = **+n%** to the reward of **any** task, at most **+100%**.

Open:
- "The most demanding task": the one with the highest need (the days since the last solve), the
  highest reward, the highest difficulty, or the one HARVEST offers first?
- What a day is: the local date (midnight) or 24 hours since the last counted solve.
- A freeze is spent automatically on a missed day (and how many days in a row it can cover), or the
  player activates it.
- Where the streak is shown (next to the level on PROFILE, on the HARVEST button), and where the
  freezes are bought (the Adjust balance modal? a shop in the profile?).
- The bonus on the first solve of a task (it pays 0 today): stays 0?
- The streak, the freezes and the last counted day are new `localStorage` keys: they must go through
  Export / Import and the transaction history (a purchase of a freeze is a withdrawal with a comment).
