# Progress charts: the rank of a task and of the player over time

Ideas that are not built yet. Written down as they were said; "Open" lists what has to be decided
before the work starts. Move an item to `changelog/` when it ships.

---

## 1. See the progress, not only the current value

Wanted: to **see** how the rank of a task, and later the overall rank (the level) of the player, grew
and fell over time: charts, scales, bars. The look is the same vertical bars as the patch of a rank
(the small squares of the notification), but standing on a time axis: the dates on the horizontal axis,
the levels on the vertical one.

The first step is **local, for the open task only**. The RANKS window that a click on the rank patch of
the task opens (`#rk-modal`, `js/rank-badge.js`) shows only the current rank today. It gets **tabs**:

- **CURRENT RANK**: what is there now (the rank, the patch, the list of the ranks);
- **PROGRESS**: the chart of this task.

Sketch from the idea (a bar is a day with a change; the empty space is the days without one):

```
...................................................|--|
.........|--|....................................|--|
.........|--|....................................|--|
01.01.2026....................05.03.2026
```

First step is built (1.6.0, `js/rank-progress.js`): the tabs CURRENT RANK / PROGRESS in the RANKS window of a task; one bar per day with a change on a linear time axis up to today, the rank (days) on the vertical axis with the starts of the ranks as thin lines, a wipe as a red hatched bar of the lost height. Still open below: the player's own chart, zoom of the range, the scale by the rank tier.

Already there:
- `gr_history` (`walletLog`, `js/wallet.js`) is append-only and has every point of the chart: a
  `solve` entry has `t`, `task`, `rankFrom` / `rankTo` (the shown integer rank before and after) and
  `levelFrom` / `levelTo` (the level of the player); a `rank` entry (the rank wiped by viewing the
  solution) has `rankFrom` / `rankTo` too, so a **fall** is in the log as well as a rise.
- The rank of a task changes only at these events (the rank is the days accumulated between counted
  solves), so between two entries it is a constant: the chart is a series of points, not a curve.
- `walletLifeStats(key)` already walks the log per task and finds the lives (a life ends with a
  `rank` entry); the same pass can give the series.
- The RANKS window and its pieces (`rkm-now`, `rkm-list`) and the patch drawing (`js/rank-badge.js`).

Not there:
- No chart code, no tabs in the RANKS window.
- The data from before the log has no `rankTo`: the chart starts from the first entry that has it.
- A series per task is a scan of the whole log on every opening (see
  `plans/storage-history-growth.md`: it lists "a chart of the rank over time" as one of the triggers
  to do something about the log).

Open:
- **What a bar is**: one bar per event (a solve or a wipe) placed on the time axis by its date, or one
  per day / per week with the last known value? The sketch has bars only at some dates, on a linear
  time scale: the first reading. A wipe is then a bar that is lower than the one before it.
- **The vertical scale**: the rank number (0 ... 1000) or the tier of the rank (the 21 named ranks, as
  the patch shows it). The number shows small steps, the tier shows the meaning; maybe a bar is
  drawn in the colour of its tier, with the tier lines as a grid.
- **Rises and falls**: how the fall is shown (a red bar, a mark under it, the reason "solution viewed"
  in the tooltip); a tooltip on a bar with the date, the rank before and after, the coins.
- **The range of the time axis**: from the first entry to now, with zoom (week / month / all)? A task
  of two solves is a chart of two bars: the empty chart needs its own message.
- **Where the chart is drawn**: SVG built by hand (the whole app is plain `<script>` files without a
  build, the patch is already drawn this way) or a canvas; it must work at a phone width
  (`plans/all-screen-sizes.md`) and be readable without the colour.
- **After the task: the player**: the same chart for the level (`levelTo` is in every `solve` and
  `rank` entry) as a tab in the RANKS window of the player (the PROFILE button), then the per-task
  charts in the cards of the profile window. Not before the local one is tried.
