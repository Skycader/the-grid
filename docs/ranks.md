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
| 1  | 0 - 26       | Рекрут · Recruit · 新兵 Shinpei          | ◽ |
| 2  | 27 - 62      | Слуга · Servant · 従者 Jūsha             | ⬜⬜ |
| 3  | 63 - 102     | Ученик · Apprentice · 見習い Minarai     | ⬜⬜⬜ |
| 4  | 103 - 144    | Вестник · Herald · 伝令 Denrei           | 🟨 |
| 5  | 145 - 188    | Посвящённый · Initiate · 入門者 Nyūmonsha | 🟨🟨 |
| 6  | 189 - 235    | Охотник · Hunter · 狩人 Kariudo          | 🟨🟨🟨 |
| 7  | 236 - 283    | Воин · Warrior · 戦士 Senshi             | 🟨🟨<br>🟨🟨 |
| 8  | 284 - 332    | Ветеран · Veteran · 古参兵 Kosanhei       | 🟨🟨<br>🟨🟨<br>🟨🟨 |
| 9  | 333 - 383    | Мастер · Master · 達人 Tatsujin          | 🟨🟨<br>🟨🟨<br>🟥🟥 |
| 10 | 384 - 434    | Ассасин · Assassin · 暗殺者 Ansatsusha    | 🟨🟨<br>🟥🟥<br>🟥🟥 |
| 11 | 435 - 487    | Призрак · Phantom · 幽鬼 Yūki            | 🟥🟥<br>🟥🟥<br>🟥🟥 |
| 12 | 488 - 541    | Следопыт · Tracker · 追跡者 Tsuisekisha   | ⬛ |
| 13 | 542 - 595    | Тень · Shadow · 影 Kage                  | ⬛⬛ |
| 14 | 596 - 651    | Последняя Тень · The Last Shadow · 最後の影 Saigo no Kage | ⬛⬛⬛ |
| 15 | 652 - 707    | Страж · Sentinel · 哨兵 Shōhei           | ⬛⬛<br>⬛⬛ |
| 16 | 708 - 764    | Верховный Страж · Supreme Sentinel · 大哨兵 Daishōhei | ⬛⬛<br>⬛⬛<br>⬛⬛ |
| 17 | 765 - 822    | Наставник · Instructor · 師範 Shihan      | ⬛⬛⬛<br>⬛⬛⬛ |
| 18 | 823 - 880    | Старейшина · Elder · 長老 Chōrō          | ⬛⬛⬛<br>⬛⬛⬛<br>⬛⬛⬛ |
| 19 | 881 - 939    | Верховный Старейшина · High Elder · 大長老 Daichōrō | ⬛⬛⬛<br>⬛⬛⬛<br>🟦🟦🟦 |
| 20 | 940 - 999    | Властитель · Overlord · 覇王 Haō         | ⬛⬛⬛<br>🟦🟦🟦<br>🟦🟦🟦 |
| 21 | 1000+        | Верховный Властитель · Supreme Overlord · 覇帝 Hatei | 🟦🟦🟦<br>🟦🟦🟦<br>🟦🟦🟦 |

Rank 0 is the rank of a task that has just been solved for the first time (the first solve is free
and only starts the timer), so every solved task begins as a Recruit.

The EN names of 11, 12 and 17 (Phantom, Tracker, Instructor) are to be checked; the names are
collected in `PLAN.md`, section 4.

## The rank of the player

The same 21 names and patches are the ranks of the **player level** (the number on the PROFILE button:
the sum of `10 / (11 - difficulty)` over the tasks in the player's database). The PROFILE button writes
it as `<level> <patch of the rank>` (for example `19.6 ■■■`). A pointer over the patch shows the level
and the name (English only), a click opens the RANKS window for the player.

A rank k starts at `round(100 * ((k - 1) / 20) ^ 1.2, 1 decimal)` level: the steps grow smoothly from 2.7
to 6, and the 21st rank starts at level **100**. All 37 tasks of today give about 67 (the rank 15,
Sentinel), so the top ranks are for the catalog that is still to come; the scale is the constant `100`
in `RANK_SCALES.player` (`js/rank-badge.js`).

| # | Level (0 - n) | Name (rank) |
|---|---------------|-------------|
| 1 | 0 - 2.6 | Рекрут · Recruit |
| 2 | 2.7 - 6.2 | Слуга · Servant |
| 3 | 6.3 - 10.2 | Ученик · Apprentice |
| 4 | 10.3 - 14.4 | Вестник · Herald |
| 5 | 14.5 - 18.8 | Посвящённый · Initiate |
| 6 | 18.9 - 23.5 | Охотник · Hunter |
| 7 | 23.6 - 28.3 | Воин · Warrior |
| 8 | 28.4 - 33.2 | Ветеран · Veteran |
| 9 | 33.3 - 38.3 | Мастер · Master |
| 10 | 38.4 - 43.4 | Ассасин · Assassin |
| 11 | 43.5 - 48.7 | Призрак · Phantom |
| 12 | 48.8 - 54.1 | Следопыт · Tracker |
| 13 | 54.2 - 59.5 | Тень · Shadow |
| 14 | 59.6 - 65.1 | Последняя Тень · The Last Shadow |
| 15 | 65.2 - 70.7 | Страж · Sentinel |
| 16 | 70.8 - 76.4 | Верховный Страж · Supreme Sentinel |
| 17 | 76.5 - 82.2 | Наставник · Instructor |
| 18 | 82.3 - 88 | Старейшина · Elder |
| 19 | 88.1 - 93.9 | Верховный Старейшина · High Elder |
| 20 | 94 - 99.9 | Властитель · Overlord |
| 21 | 100+ | Верховный Властитель · Supreme Overlord |
