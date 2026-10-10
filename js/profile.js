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

      // ── Profile modal: a collection of the tasks ──
      // Opened by the profile button. One tab per catalog (MENU), a card per task in the order
      // of the catalog. A task that is in the player's database is a normal card with its
      // statistics; a task that was never solved is blurred under a padlock — still clickable.
      const pfmModal = document.getElementById("pfm-modal");
      const PFM_SYMBOL =
        '<svg class="sym" width="13" height="13" viewBox="0 0 16 16" aria-hidden="true"><path d="M5.5 4L1.5 8L5.5 12M10.5 4L14.5 8L10.5 12M9 3L7 13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      const PFM_LOCK =
        '<svg class="pfm-lock" width="40" height="40" viewBox="0 0 32 32" aria-hidden="true"><rect x="6.5" y="14" width="19" height="14" rx="2" fill="rgba(0,20,35,.85)" stroke="#00ffff" stroke-width="1.8"/><path d="M10.5 14V10.5A5.5 5.5 0 0 1 21.5 10.5V14" fill="none" stroke="#00ffff" stroke-width="1.8" stroke-linecap="round"/><circle cx="16" cy="20.5" r="2" fill="#00ffff"/><path d="M16 22V24.5" stroke="#00ffff" stroke-width="1.8" stroke-linecap="round"/></svg>';
      let _pfmTab = 0;
      let _pfmCards = []; // cards of the open tab: { cat, task }

      // "ex1" → "EX_1"; other files: the name in capitals with "_"
      function pfmName(task) {
        const f = String(task.file || task.id);
        const m = /^ex(\d+)$/i.exec(f);
        return m ? "EX_" + m[1] : f.toUpperCase().replace(/[^A-Z0-9]+/g, "_");
      }

      function pfmTasks(top) {
        const res = [];
        gatherAllTasks(top, res);
        return res;
      }
      const pfmSolved = (cat, task) => `${cat.id}/${task.id}` in _solved;

      function pfmCard({ cat, task }, top, index) {
        const key = `${cat.id}/${task.id}`;
        const solved = pfmSolved(cat, task);
        const st = walletStat(key);
        const icon = (typeof ICONSTORE !== "undefined" && ICONSTORE[top.folder]) || FALLBACK_SVG;
        const name = pfmName(task);
        return `<div class="pfm-card${solved ? "" : " locked"}" data-i="${index}" title="${solved ? "Open " + name : "Not solved yet: open " + name}">
          <div class="pfm-inner">
            <div class="pfm-head">${PFM_SYMBOL}<span>${name}</span></div>
            <div class="pfm-mid">${icon}</div>
            <div class="pfm-foot">
              <span title="Rank">${rankIconSvg(10)}${walletRank(key)}</span>
              <span class="ok" title="Successful runs">✓ ${st.ok}</span>
              <span class="bad" title="Failed runs">✗ ${st.fail}</span>
              <span class="coins" title="Coins earned from this task">${coinSvg(11)}${fmtCoins(st.coins)}</span>
            </div>
          </div>
          ${solved ? "" : PFM_LOCK}
        </div>`;
      }

      function pfmRender() {
        const tops = MENU;
        _pfmTab = Math.min(_pfmTab, tops.length - 1);
        document.getElementById("pfm-tabs").innerHTML = tops
          .map((top, i) => {
            const all = pfmTasks(top);
            const done = all.filter((x) => pfmSolved(x.cat, x.task)).length;
            return `<button class="pfm-tab${i === _pfmTab ? " on" : ""}" data-t="${i}" type="button"><b>${top.name}</b><i>${done}/${all.length}</i></button>`;
          })
          .join("");
        const top = tops[_pfmTab];
        _pfmCards = pfmTasks(top);
        document.getElementById("pfm-grid").innerHTML =
          _pfmCards.map((x, i) => pfmCard(x, top, i)).join("") ||
          '<div class="tx-empty">// NO TASKS //</div>';
        const lv = profileLevel();
        document.getElementById("pfm-sum").innerHTML =
          `Level <b>${fmtCoins(round2(lv.level))}</b> · solved <b>${lv.tasks}</b> / <b>${Object.keys(profileDiffs()).length}</b>`;
      }

      function pfmOpen() {
        _pfmTab = 0; // REGEX, the first catalog
        pfmRender();
        pfmModal.classList.remove("hide");
        pfmModal.querySelector(".m-content").scrollTop = 0;
        playClick();
      }
      function pfmClose() {
        pfmModal.classList.add("hide");
        playClick();
      }
      document.getElementById("pf-btn").addEventListener("click", pfmOpen);
      pfmModal.addEventListener("click", (e) => {
        if (e.target === e.currentTarget) return pfmClose();
        const tab = e.target.closest(".pfm-tab");
        if (tab) {
          _pfmTab = +tab.dataset.t;
          playClick();
          return pfmRender();
        }
        const card = e.target.closest(".pfm-card");
        if (card) {
          const x = _pfmCards[+card.dataset.i];
          pfmModal.classList.add("hide");
          navigateToTask(x.cat, x.task);
        }
      });
