# Manual-transaction notice + task stats next to the rank

Ideas that are not built yet. Written down as they were said; "Open" lists what has to be decided
before the work starts. Move an item to `changelog/` when it ships.

---

## 1. A short notice after a manual transaction

Today the adjust modal (the safe icon -> withdraw / deposit, `walletAdjustSubmit` in
`js/wallet.js`) just closes after OK. The player gets no confirmation except the wallet number
changing.

Wanted: a short notice that says what happened, e.g. **"Spent 200 coins"** (withdraw) or
**"Deposited 200 coins"** (deposit), shown right after the modal closes.

Already there:
- `walletToast(text)` (`js/wallet.js`) draws a `.wallet-toast` under the wallet, right-aligned, and
  removes it after 1.6 s. It is used for payouts; the same call can serve here.
- `walletAdjustSubmit` knows everything the text needs: `r.delta` (sign and amount), the new balance,
  the optional comment.

Open:
- Wording: "Spent 200" / "Withdrew 200" / "-200 coins"; the same for a deposit. Include the new
  balance ("-> 1 300") or only the amount?
- Colour: red for a withdraw and green for a deposit (as in the TRANSACTIONS table), or neutral.
- Show the comment in the notice, or only in the history.
- 1.6 s may be too short for a text with a number; a sound (`playClick` is already there) or none.

---

## 2. Solve statistics to the right of `breadc-rank`

In the task bar of the editor, to the right of the rank (`<span class="breadc-rank" id="task-rank">`,
`js/task-view.js`), show three numbers for **this task**:

| What | Meaning | Source |
| --- | --- | --- |
| Correct solves | how many times the task was solved, all time | `gr_stats[key].ok` |
| Wrong solves | how many times the rank was wiped (the solution was viewed) | new counter |
| Max term | the longest rank the task ever had, in days | new field |

"Wrong solves" are the events that **reset the rank**: `walletMarkSolutionViewed` does
`delete _rank[key]`. A failed test run (`gr_stats[key].fail`) is a different number.

Already there:
- `gr_stats` keeps `{ ok, fail, coins }` per task (`walletStat`).
- `gr_history` has a `rank` entry with `reason: "solution"`, `rankFrom` and `rankTo: 0` for every wipe,
  so the wrong-solve count and the max term can be **rebuilt from the history** for old data.

Not there:
- The max term is not stored anywhere: `_rank[key]` is deleted on a wipe and the old value is lost
  (except in the history entry above). A new `max` per task is needed, updated when the rank grows
  (`walletOnSolved`, `_rank[key] = ...`) and never lowered.

Open:
- "Correct solves": successful runs (`ok`) or only counted solves that paid out (a first free solve +
  repeat solves)? Today the two numbers differ.
- "Wrong solves": only the wipes by viewing the solution, or also failed runs (`fail`)?
- "Max term": the highest rank in days (`rankFmt`) or its named rank with a patch (`rankPatchHtml`)?
  Both fit in the tooltip.
- Look: icons with numbers (green check, red cross, a crown/arrow for the max) and a tooltip with the
  full words; how it behaves on a narrow screen next to the rank.
- Old players: backfill the counters and the max from `gr_history` once on load, or start from zero.

Done in 1.6.0: the **max term** is the "max life" of the rank tooltip (current / average / max life of
a task, `walletLifeStats` in `js/wallet.js`); see `plans/storage-history-growth.md`. The counters of
correct and wrong solves next to the rank are still open.

Overlap: `docs/PLAN.md`, section 2, already describes the same place (solves + failed runs + a
HISTORY button). Decide whether this item replaces that section or extends it, then keep one of them.
