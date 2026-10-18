# Ranks

The rank of a task is a number of days (1 day = 1, a week = 7, see the task rank in the app). It is
the time a task has been kept alive by repeat solves: 1000 days of a daily solve and 3 solves in 3
years give the same rank (~1000), so a rank cannot be farmed faster than the calendar. The name and
the badge show where that number lies. 21 steps.

The day ranges are a **proposal**. A rank k starts at `round(1000 * ((k - 1) / 20) ^ 1.2)` days: the steps
grow smoothly from 27 days (the first one, as in the player's sketch) to 60 days, and the last rank, the
21st, starts at exactly **1000 days** (~2.7 years).

| #  | Days (0 - n) | Name (rank)                            | Rank icon |
|----|--------------|----------------------------------------|-----------|
| 1  | 0 - 26       | Recruit · Рекрут · 新兵 Shinpei          | ◽ |
| 2  | 27 - 62      | Servant · Слуга · 従者 Jūsha             | ⬜⬜ |
| 3  | 63 - 102     | Apprentice · Ученик · 見習い Minarai     | ⬜⬜⬜ |
| 4  | 103 - 144    | Herald · Вестник · 伝令 Denrei           | 🟨 |
| 5  | 145 - 188    | Initiate · Посвящённый · 入門者 Nyūmonsha | 🟨🟨 |
| 6  | 189 - 235    | Hunter · Охотник · 狩人 Kariudo          | 🟨🟨🟨 |
| 7  | 236 - 283    | Warrior · Воин · 戦士 Senshi             | 🟨🟨<br>🟨🟨 |
| 8  | 284 - 332    | Veteran · Ветеран · 古参兵 Kosanhei       | 🟨🟨<br>🟨🟨<br>🟨🟨 |
| 9  | 333 - 383    | Master · Мастер · 達人 Tatsujin          | 🟨🟨<br>🟨🟨<br>🟥🟥 |
| 10 | 384 - 434    | Assassin · Ассасин · 暗殺者 Ansatsusha    | 🟨🟨<br>🟥🟥<br>🟥🟥 |
| 11 | 435 - 487    | Ghost · Призрак · 幽鬼 Yūki            | 🟥🟥<br>🟥🟥<br>🟥🟥 |
| 12 | 488 - 541    | Tracker · Следопыт · 追跡者 Tsuisekisha   | ⬛ |
| 13 | 542 - 595    | Shadow · Тень · 影 Kage                  | ⬛⬛ |
| 14 | 596 - 651    | The Last Shadow · Последняя Тень · 最後の影 Saigo no Kage | ⬛⬛⬛ |
| 15 | 652 - 707    | Sentinel · Страж · 哨兵 Shōhei           | ⬛⬛<br>⬛⬛ |
| 16 | 708 - 764    | Supreme Sentinel · Верховный Страж · 大哨兵 Daishōhei | ⬛⬛<br>⬛⬛<br>⬛⬛ |
| 17 | 765 - 822    | Instructor · Наставник · 師範 Shihan      | ⬛⬛⬛<br>⬛⬛⬛ |
| 18 | 823 - 880    | Elder · Старейшина · 長老 Chōrō          | ⬛⬛⬛<br>⬛⬛⬛<br>⬛⬛⬛ |
| 19 | 881 - 939    | High Elder · Верховный Старейшина · 大長老 Daichōrō | ⬛⬛⬛<br>⬛⬛⬛<br>🟦🟦🟦 |
| 20 | 940 - 999    | Overlord · Властитель · 覇王 Haō         | ⬛⬛⬛<br>🟦🟦🟦<br>🟦🟦🟦 |
| 21 | 1000+        | Supreme Overlord · Верховный Властитель · 覇帝 Hatei | 🟦🟦🟦<br>🟦🟦🟦<br>🟦🟦🟦 |

Rank 0 is the rank of a task that has just been solved for the first time (the first solve is free
and only starts the timer), so every solved task begins as a Recruit.

The EN names of 11, 12 and 17 (Ghost, Tracker, Instructor) are to be checked; the names are
collected in `PLAN.md`, section 4.

## The rank of the player

The same 21 names and patches, with the same ranges as in the table above (read the column as a
**level** instead of days), are the ranks of the **player level**: the number on the PROFILE button.

The level is the **average rank of all the tasks of the catalog, weighted by the difficulty**:

```
level  = sum over ALL the tasks of   rank of the task (whole days) * weight
weight = (1 / (11 - difficulty)) / S
S      = sum over ALL the tasks of 1 / (11 - difficulty)      (today S = 6.696, 37 tasks)
```

The weights add up to 1, so the level is 0 ... 1000, and **1000 means that every task of the catalog is at
the rank 1000** (the 21st rank, Supreme Overlord). A harder task weighs more: the weight of a task of
difficulty 9 is 7.47%, of difficulty 1 is 1.49%. A task that has never been solved again has the rank 0 but
its weight stays in S: the unsolved tasks are 61.7% of the level for the sample below, and a new task of the
catalog lowers every level until it is solved (the total weight grows).

The level grows with every repeat solve (a task of difficulty 9 gets +0.075 level for every day of its rank)
and falls when the solution of a task is viewed (its rank is wiped). The sample export of 2026-10-18 (12 of
37 tasks) gives 24.38: the rank 1, Recruit (the 2nd rank starts at 27). The three tasks with the ranks 357,
223 and 148 give 21.1 of it.

The RANKS window of the player has an expandable list **How the level is counted**: every solved task with its
difficulty, weight, rank and points (rank × weight), the unsolved tasks as one line, and the sum — the level.

The PROFILE button writes it as `<level> <patch of the rank>` (for example `24.4 ▫`). A pointer over the patch
shows the level and the name (English only), a click opens the RANKS window for the player.
