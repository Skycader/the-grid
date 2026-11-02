# Achievements

Ideas that are not built yet. Written down as they were said; "Open" lists what has to be decided
before the work starts. Move an item to `changelog/` when it ships.

There are no ideas from the author yet except the first one, so the rest is a list of proposals to
pick from. Each has a name (the style: a pun on the topic), a condition and what it needs from the
data. `gr_history` (`walletLog`, `js/wallet.js`) already has `t`, `task`, `rankFrom/rankTo`,
`levelFrom/levelTo`, so most of them need no new data.

---

## From the author

- **Binary K.O.**: solve a binary search task in under 5 minutes.

## Proposals

### Speed
- **Blitz**: solve any task in under 60 seconds.
- **Speedrun Category**: solve 5 tasks of one category in a row, each under 5 minutes.
- **Late Night Commit**: a solve between 00:00 and 05:00.

### Without help
- **First Try**: a solve on the first run, no failed runs before (needs failed runs count per task).
- **Ghost**: 10 solves in a row without ever viewing a solution.
- **Pure Mind**: a hard task solved without a failed run.

### Persistence
- **Phoenix**: solve a task again after its rank was wiped by viewing the solution (a `rank` entry, then a `solve`).
- **Never Give Up**: a solve after 20+ failed runs of the same task.
- **Streak 7 / 30 / 100**: a solve every day for 7 / 30 / 100 days.
- **Comeback**: a solve after a break of 30+ days.

### Rank and level
- **Week Alive**: a task reaches the rank of a week (7 days).
- **Millennium**: a task reaches rank 1000.
- **Level Up x10**: the player level grows by 10 in one day.
- **Tier Jump**: a task goes up a whole rank tier in one solve.

### Breadth
- **Tourist**: at least one solve in every category (`algo`, `regex`, and the new ones).
- **Full Set**: all tasks of one folder (`sorting`, `search`, ...) solved.
- **Polyglot**: solves in 3 different global categories in one day.
- **Regex Whisperer**: 10 regex tasks without a viewed solution.

### Money
- **First Coin**: the first payout.
- **Rich**: the wallet balance reaches a round number (100 / 1000 / 10000).
- **Big Spender**: spend on the solutions / hints a set amount.

### Fun and rare
- **One Liner**: a solution of one line.
- **Short Cut**: a solution shorter than the reference one (`*.sol.js`).
- **Day One**: a solve in the first hour after the first launch.
- **Anniversary**: a solve on the same date a year after the first one.
- **Century**: 100 solves in total.

## Open

- Tiers: bronze / silver / gold for the numeric ones (Streak, Century, Rich), or separate achievements.
- Where they are shown: the PROFILE window, a toast at the moment of the unlock (like the payout toast), the rank animation.
- A reward: coins or only the badge.
- Hidden achievements (the condition is not shown until unlocked) vs all visible.
- Storage: a new `gr_achievements` key (id + the unlock time) computed from `gr_history`, and whether old history gives the achievements retroactively.
- What needs new data: failed runs per task, the time from opening a task to the solve, the time of the day (the last is in `t`).
