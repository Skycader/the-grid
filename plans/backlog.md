# Backlog: micro-tasks and big tasks

Written down as they were said. Move an item to `changelog/` when it ships.

---

## Micro-tasks

### 1. Rank icons in the transactions modal

Show the rank icons in the transactions table (the TRANSACTIONS modal), next to the rows that carry a rank.

### 2. Bug: Ctrl+Z sometimes does not work in the editor

Undo does not fire in some cases. To find out: when exactly (after a run, after a programmatic
`setValue`, after focus moved to another panel, after a payout?). Likely the undo stack is reset when
the editor content is replaced from code.

### 3. Bug: the text of the specs cannot be selected in the right tests panel

The spec text in the right panel of the tests cannot be selected (and so not copied). Probably
`user-select: none` on the panel or a handler that eats `mousedown`. Make the text selectable.

### 4. `res-hdr` as a progress bar of passed tests

Use `res-hdr` and fill it by the share of **successfully passed tests out of all tests**, in percent.

- The background of `res-hdr` becomes a **striped progress bar** with a CSS animation that runs in a
  loop (the stripes move, as if a load is going on).
- The fill width = passed / total, in %.
- The percentage of passed tests is shown as text in the header.
- Fit it to the existing design (colors, height, fonts of the panel).

### 5. A unique transaction id (hash of the time)

Every transaction gets a unique id built from the time.

- The hash is **not shown in the table**.
- Right click on a transaction opens a context menu; it shows a **copy icon + the hash**. A click
  copies the hash to the clipboard.
- Algorithm: SHA-1 was asked for, MD5 is also fine. Suggestion: take **SHA-1 of `timestamp + a random
  salt` (or a counter)**. A hash of the time alone is not unique for two transactions in the same
  millisecond. Alternative without a hash: `crypto.randomUUID()` (collision-free, built into the
  browser). `crypto.subtle.digest("SHA-1", ...)` is async, so the writer of the log has to wait for it.
- Old entries without an id: compute the id from their stored time on load, or leave them without one.

Open:
- SHA-1 of time + salt, or `crypto.randomUUID()`; the full hash or its first 8-12 characters in the menu.

### 6. Personal comments: the player's own notes

Introduce a system of personal comments: the player can keep notes. Open: attached to a task, to a
transaction, or both; where they are shown and edited; they have to go into Export / Import.

See also `plans/earnings-rate-and-task-notes.md` (task notes).

### 7. Transactions modal: right click, "replay the animation"

In the transactions modal the right-click menu gets an item **replay the animation**. The player can
watch again how the rank grew: from which rank to which, for **the task's own rank** and for the
**player's overall level**.

The same context menu as in micro-task 5 (copy the hash); see also `docs/PLAN.md` item 1 (the
rank-update progress bar). Needs the old and new rank to be stored in the log entry, or restored from
the entries before it.

### 8. Tell the player when the solution is slower than the reference

If the player's solution is slower than `ref` (the reference solution), inform the player **how many
times slower** it is (e.g. "3.2x slower than the reference").

Open:
- What is compared: the run time of the same tests, or the complexity (the number of steps).
- Where it is shown: in the results panel, a toast after the run, or both.
- A threshold under which nothing is shown (noise: 1.05x is not worth a message).

---

## Big tasks

### 1. Move the event log to IndexedDB (maybe the whole database?)

Move the log of events (`gr_history`) from `localStorage` to IndexedDB. Discussable: move the **whole**
database (wallet, ranks, solved times, stats), not only the log.

See `plans/storage-history-growth.md` for the options and the price: IndexedDB is asynchronous, so
every reader of the log turns async; Export / Import (`js/db.js`) and the "clear the local database"
paths have to learn the new storage; the project has no build, so a library such as Dexie is an
outside dependency.

Open:
- Only the log, or everything?
- Plain IndexedDB or Dexie.
- A migration of the existing `localStorage` data on the first start.
