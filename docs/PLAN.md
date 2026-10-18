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

---

## 4. Rank names (instead of a bare number)

The rank of a task gets a name and a badge; the number stays next to it. The ladder has 21 steps.
The names are the clan's (影身, Tokyo); the badges are the patches of the clan: white → yellow → red →
black → blue (a `/` is a new row of the patch).

| # | RU | EN | 漢字 · Rōmaji | Badge |
|---|---|---|---|---|
| 1 | Рекрут | Recruit | 新兵 Shinpei | ◽ |
| 2 | Слуга | Servant | 従者 Jūsha | ⬜⬜ |
| 3 | Ученик | Apprentice | 見習い Minarai | ⬜⬜⬜ |
| 4 | Вестник | Herald | 伝令 Denrei | 🟨 |
| 5 | Посвящённый | Initiate | 入門者 Nyūmonsha | 🟨🟨 |
| 6 | Охотник | Hunter | 狩人 Kariudo | 🟨🟨🟨 |
| 7 | Воин | Warrior | 戦士 Senshi | 🟨🟨 / 🟨🟨 |
| 8 | Ветеран | Veteran | 古参兵 Kosanhei | 🟨🟨 / 🟨🟨 / 🟨🟨 |
| 9 | Мастер | Master | 達人 Tatsujin | 🟨🟨 / 🟨🟨 / 🟥🟥 |
| 10 | Ассасин | Assassin | 暗殺者 Ansatsusha | 🟨🟨 / 🟥🟥 / 🟥🟥 |
| 11 | Призрак | Phantom | 幽鬼 Yūki | 🟥🟥 / 🟥🟥 / 🟥🟥 |
| 12 | Следопыт | Tracker | 追跡者 Tsuisekisha | ⬛ |
| 13 | Тень | Shadow | 影 Kage | ⬛⬛ |
| 14 | Последняя Тень | The Last Shadow | 最後の影 Saigo no Kage | ⬛⬛⬛ |
| 15 | Страж | Sentinel | 哨兵 Shōhei | ⬛⬛ / ⬛⬛ |
| 16 | Верховный Страж | Supreme Sentinel | 大哨兵 Daishōhei | ⬛⬛ / ⬛⬛ / ⬛⬛ |
| 17 | Наставник | Instructor | 師範 Shihan | ⬛⬛⬛ / ⬛⬛⬛ |
| 18 | Старейшина | Elder | 長老 Chōrō | ⬛⬛⬛ / ⬛⬛⬛ / ⬛⬛⬛ |
| 19 | Верховный Старейшина | High Elder | 大長老 Daichōrō | ⬛⬛⬛ / ⬛⬛⬛ / 🟦🟦🟦 |
| 20 | Властитель | Overlord | 覇王 Haō | ⬛⬛⬛ / 🟦🟦🟦 / 🟦🟦🟦 |
| 21 | Верховный Властитель | Supreme Overlord | 覇帝 Hatei | 🟦🟦🟦 / 🟦🟦🟦 / 🟦🟦🟦 |

Open:
- The thresholds: how many days of rank a step needs. Non-linear (fast in the beginning, a year at the
  top?) or the even 25-day step of the first idea (300 days = the last step)?
- Where the name is shown: the task list and the search rows (next to the signal bars?), the editor
  task bar, the rank-update bar (item 1), the PROFILE cards. The badge could replace the signal bars.
- The language of the name in the UI: RU, EN or kanji (a setting, or EN with the kanji in the tooltip).
- The EN names of 11, 12 and 17 are mine (Phantom, Tracker, Instructor) — to be checked.

---

## 5. Languages (the UI only)

A language system for the **interface only**: buttons, titles, hints. The tasks (statements, specs,
solutions, titles and descriptions in `config/*.js`) stay as they are.

Estimate (a look at the code, 2026-10-18):
- about 300 strings: `index.html` ~53 text nodes + 31 attributes (`title`, `placeholder`,
  `aria-label`); `js/` ~200 strings in 20 files (most in `results.js` 36, `transactions.js` 25,
  `wallet.js` 25, `cli.js` 15, `task-view.js` 13);
- about 5 hours of work in three blocks: the base (dictionary, `t(key, params)`, a switch, `gr_lang`
  in `localStorage`, `data-i18n` for the static HTML) and the static HTML 1-1.5 h; the strings of
  `js/` 1.5-2 h; plurals, dates and numbers, redrawing, CLI, layout, checking both languages 1-2 h;
- about 0.6-1.2 M tokens.

What makes it expensive:
- plurals (Russian has three forms: 1 задача / 2 задачи / 5 задач) in strings like "N MATCHES FOUND"
  and "5 TASKS, 4 FOLDERS";
- dates and numbers are hard-coded to `en-US` (`profile.js`, `transactions.js`, `wallet.js`);
- lists and modals are built from templates: a live switch needs a redraw of each of them;
- longer Russian strings can overflow the buttons (HUD, tabs, wallet): CSS fixes and a check of every
  screen;
- the side texts: the output of the CLI console, the statuses of the runner inside the worker
  (`TIMEOUT (3s)` and the like), the changelog (one markdown per language).

Ways to make it cheaper:
- the language changes with a page reload, without a live redraw: about a third cheaper and simpler;
- English stays the main language, Russian is the second one;
- the rank names (with the kanji) are data (columns of a table), not interface strings;
- a script that complains about a key missing in one of the languages, so a new feature cannot break
  the translation.

After the launch every new button costs two strings instead of one.

Open:
- Is it for the player only (one language is enough) or for other people (then it pays off)?
- Which languages: RU + EN only, or a place for more (JA for the rank names)?
