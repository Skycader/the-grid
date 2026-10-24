# The history log grows: the storage

Ideas that are not built yet. Written down as they were said; "Open" lists what has to be decided
before the work starts. Move an item to `changelog/` when it ships.

---

## 1. Every write of `gr_history` rewrites the whole log

Today (`walletLog` in `js/wallet.js`) an entry is pushed into the array and the **whole** array is
serialized into `localStorage` again: `localStorage.setItem("gr_history", JSON.stringify(_history))`.
A few kilobytes now, but the cost grows with the log: ten thousand entries (about 150 bytes each) are
about 1.5 MB written on every solve, every manual transaction and every wipe. Everything that is
computed from the log also reads it from the start: the transactions table, the lives of a task
(`walletLifeStats`: max life / average life in the rank tooltip), the stats that are planned.

Why it matters now: the tooltip of the rank reads the log on every hover, and the plans (the history
modal of a task, the streak mode, more statistics) read more of it.

Options, from the smallest step:
- **A module over the log** (`statsFor(task)`, one place that reads the history and one that appends)
  so that changing the storage later is a local change, not a hunt through the files. A cache of the
  lives per task, updated on every append, removes the repeated scan.
- **Append without a rewrite**: one `localStorage` item per entry (or per month: `gr_history_2026-10`)
  and an index; a write touches one small item. Export / Import (`js/db.js`) has to gather them.
- **IndexedDB** (with or without Dexie) for the log only; the wallet, the ranks and the solved times
  stay in `localStorage`. The price: IndexedDB is asynchronous, so every reader of the log (the
  transactions table, the tooltips, the profile) turns async; Dexie is an outside dependency in a
  project of plain `<script>` files without a build; Export / Import and the "clear the local
  database" paths have to learn the second storage.

Triggers to do it: the log is over 2-3 MB, or a feature needs per-event data that is not a "solve /
wipe / withdraw" (a session log, minutes spent, a chart of the rank over time), or queries by a range.

Open:
- Cap or archive the old entries (a log older than a year is compressed into the lives per task)?
- Is the log part of what the player Exports as it is, or only a summary of it?

---

## 2. The lives of a task: what is built and what is not

Built (1.6.0): `walletLifeStats(key)` finds the lives in the log (a life ends with a "rank" entry,
its `rankFrom` is the last value), and the tooltip of the task rank shows the current rank, the
average life (the mean of all the lives, the one that goes on included) and the longest life.

Not built:
- the same numbers in the history modal of a task (see `plans/manual-transaction-toast-and-task-stats.md`,
  item 2: correct / wrong solves next to the rank);
- the window of the average (the last 12 months), if the old lives start to say too much;
- data from before the log: the lives that were lived before the entries "solve" and "rank" got the
  fields `rankTo` / `rankFrom` are not there; the numbers start from the log.
