      // ═══════════ PROFILE: PLAYER LEVEL ═══════════
      // Button next to HARVEST on the home screen: profile icon + the player's level.
      //
      //   level = Σ over the tasks in the player's database (gr_solved) of 10 / (11 − difficulty)
      //   difficulty 1 → 10/10 = 1 point, difficulty 5 → 10/6 ≈ 1.67, difficulty 10 → 10/1 = 10 points
      //
      // Only tasks that exist in the catalog are counted (their difficulty is known).
      // The first version of the formula: no ranks, no recency, no coins.
      const PROFILE_POINTS_BASE = 10;

      const profilePoints = (diff) => {
        const d = Math.min(10, Math.max(1, diff || 1));
        return PROFILE_POINTS_BASE / (11 - d);
      };

      // "cat/task" → difficulty for every task of the catalog. Not cached: the task
      // lists are filled in after load, and walking a few dozen tasks is cheap.
      function profileDiffs() {
        const diffs = {};
        MENU.forEach((top) => {
          const res = [];
          gatherAllTasks(top, res);
          res.forEach(({ cat, task }) => {
            diffs[`${cat.id}/${task.id}`] = task.diff || 1;
          });
        });
        return diffs;
      }

      // { level, tasks } — level is not rounded
      function profileLevel() {
        const diffs = profileDiffs();
        let level = 0,
          tasks = 0;
        for (const key of Object.keys(_solved)) {
          if (!(key in diffs)) continue;
          level += profilePoints(diffs[key]);
          tasks++;
        }
        return { level, tasks };
      }

      function profileRefresh() {
        const { level, tasks } = profileLevel();
        const lvl = document.getElementById("pf-lvl");
        lvl.textContent = (Math.round(level * 10) / 10).toLocaleString("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 1,
        });
        document.getElementById("pf-btn").classList.toggle("has-level", level > 0);
        document.getElementById("pf-btn").title =
          `Player level ${fmtCoins(round2(level))} — sum of 10 / (11 − difficulty) over ${tasks} task${tasks === 1 ? "" : "s"} in your database`;
      }
      profileRefresh();
