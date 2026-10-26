# Coin income rate + personal notes of a task

Ideas that are not built yet. Written down as they were said; "Open" lists what has to be decided
before the work starts. Move an item to `changelog/` when it ships.

---

## 1. The speed of the coin income: per hour, per day

Show how fast the coins come: **coins per hour** and **coins per day**. How and where to show it is
not decided yet ("I will decide later how").

Already there:
- `gr_history` (`walletLog`, `js/wallet.js`) has a `solve` entry for every counted solve with `t`
  (time, ms), `net` (what was paid after the fee), `gross`, `feePct`, `days` and `first` (the first
  solve of a task is free: `net: 0`). Manual transactions (withdraw / deposit / reset) are other
  entry types, so the income can be told from them.
- The TRANSACTIONS modal (`js/transactions.js`) already reads the whole log; the balance and the
  safe are on the HARVEST button (`js/harvest.js`); the HARVEST button already shows the coins
  that can be collected right now (a number that is not a rate).

Not there:
- Nothing computes a rate. It would be one function over the log (`walletIncomeRate()`) that sums
  `net` of `solve` entries in a window and divides by the window.

Open:
- The window: the last 60 minutes / the last 24 hours (a plain sum, per day = the sum; per hour = the
  sum / 24), the average over the **active** time (hours in which at least one solve happened), or
  the whole life (since the first solve)? A trailing hour is noisy: one solve makes a spike and then
  zero.
- What counts: only `net` of solves, or also what could be harvested now (a forecast)? The manual
  deposits are not an income; a withdraw is not a loss of the rate.
- Per hour as `net / hours`, or `net / (time between the first and the last solve in the window)`?
- Where: a tooltip of the balance (the safe), a line in the TRANSACTIONS header next to the
  balance, a small number on the HARVEST button, the profile window, or a chart (a sparkline of the
  income by hour / by day) in the TRANSACTIONS modal.
- A new player has one or two solves: show `-` until there is enough data, or a rate from the
  first solve.
- The cost: the log is read from the start on every call; cache the sums per hour / per day when
  `plans/storage-history-growth.md` is done, or recompute only when the log changes (`_history.length`
  is already used as a cache key in `walletLifeStats`).

---

## 2. Personal notes of a task

The player can write and update **their own thoughts about a task**: a note per task ("the idea with
`\b`", "I forgot that `g` is needed", "do it again with lookbehind"), edited any time, kept in the
`localStorage` of the browser.

Already there:
- The storage is plain `localStorage` keys (`gr_wallet`, `gr_solved`, `gr_rank`, `gr_stats`,
  `gr_history`, `gr_fontsize`, `gr_settings`, `gr_pfm_sort`); a task has the key `"cat/task"`
  (`regex/regex_15`), the same everywhere. The set of the keys and their validation for
  **Export / Import** is in `js/db.js` (`gr_wallet`, `gr_solved`, `gr_rank`, `gr_stats` are
  checked there), so a new key has to be added there to survive a move to another browser.
- The task view has the bar with the rank and the reward (`breadc`, `js/task-view.js`) and the
  tabs EDITOR / SPEC / SOLUTIONS (`switchTab`); the profile window has a card per task
  (`js/profile.js`).

Not there:
- No notes anywhere. The player's code of a task is kept only in memory during the session (`CODE`
  in `js/config.js`), it is not written to `localStorage` either.

Sketch of the data: one key `gr_notes` = `{ "cat/task": { text, updated } }` (`updated` in ms), or one
key per task (`gr_note:regex/regex_15`); the first is simpler to export, the second does not rewrite
all the notes on every keystroke.

Open:
- Where it lives: a fourth tab NOTES next to EDITOR / SPEC / SOLUTIONS, a drawer / panel beside the
  editor, or an icon in the task bar that opens a small window. Whether a note is visible while the
  editor is open (it is a thought you want to see while you solve).
- Saving: on every keystroke with a debounce, or an explicit SAVE; an "unsaved" mark; the last
  change time shown ("edited 3 days ago").
- Plain text only, or a little Markdown (lists, `code`); the length limit (`localStorage` is about
  5 MB for the whole site, and `gr_history` grows too).
- A sign that a task has a note: an icon in the task list row and on the card of the profile window;
  a search in the notes (the global search looks at the id / title / description only today).
- What happens to a note when the rank is wiped (a note is not a rank: it stays) or when an Import
  replaces the data (`js/db.js` removes the keys it replaces): the notes should be asked about
  separately, not wiped silently.
- Export / Import: the key goes into the exported file and its validation (the text is a string,
  the time a finite number).
- Several notes per task (a thread, a note per attempt) or exactly one text.
