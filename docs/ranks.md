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
