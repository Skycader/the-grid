      // ═══════════ PROFILE: PLAYER LEVEL ═══════════
      // Button next to HARVEST on the home screen: profile icon + the player's level.
      //
      //   level = Σ over ALL the tasks of the catalog of  rank × weight
      //   weight = (1 / (11 − difficulty)) / S,   S = Σ over all the tasks of 1 / (11 − difficulty)
      //
      // That is the average of the task ranks, weighted by the difficulty: the weights add up to 1, so
      // the level is 0 … 1000 and 1000 means "every task of the catalog is at the rank 1000" (the scale
      // of the ranks, docs/ranks.md). The rank of a task is its accumulated days (walletRank, whole
      // days); a task that was never solved has the rank 0, but its weight is still in S — so a task
      // that appears in the catalog lowers the level until it is solved. The level grows with every
      // repeat solve and falls when the solution of a task is viewed (its rank is wiped).
      const profileWeight = (diff) => {
        const d = Math.min(10, Math.max(1, diff || 1));
        return 1 / (11 - d);
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

      // { level, tasks (solved), total (in the catalog) } — level is not rounded
      function profileLevel() {
        const diffs = profileDiffs();
        let S = 0,
          sum = 0,
          tasks = 0;
        for (const key in diffs) S += profileWeight(diffs[key]);
        for (const key of Object.keys(_solved)) {
          if (!(key in diffs)) continue;
          sum += walletRank(key) * profileWeight(diffs[key]);
          tasks++;
        }
        return { level: S ? sum / S : 0, tasks, total: Object.keys(diffs).length };
      }

      // The same level, task by task (the RANKS window of the player shows it):
      // { rows: [{ name, diff, weight, rank, points }] of the solved tasks (the biggest points first),
      //   S, unsolved (a number), unsolvedWeight, level }
      function profileBreakdown() {
        const found = [];
        MENU.forEach((top) => {
          const res = [];
          gatherAllTasks(top, res);
          res.forEach(({ cat, task }) => found.push({ key: `${cat.id}/${task.id}`, task }));
        });
        let S = 0;
        found.forEach(({ task }) => (S += profileWeight(task.diff)));
        const rows = [];
        let unsolved = 0,
          unsolvedWeight = 0,
          level = 0;
        found.forEach(({ key, task }) => {
          const weight = S ? profileWeight(task.diff) / S : 0;
          if (key in _solved) {
            const rank = walletRank(key);
            rows.push({ name: pfmName(task), diff: task.diff || 1, weight, rank, points: rank * weight });
            level += rank * weight;
          } else {
            unsolved++;
            unsolvedWeight += weight;
          }
        });
        rows.sort((a, b) => b.points - a.points || b.weight - a.weight);
        return { rows, S, unsolved, unsolvedWeight, level };
      }

      function profileRefresh() {
        const { level, total } = profileLevel();
        // "<level> <patch of the rank of the level>" (js/rank-badge.js): the number has the native hint
        // with the formula, the patch has its own tooltip and opens the RANKS window
        const hint = `Player level ${fmtCoins(round2(level))} — the average rank of all ${total} tasks, weighted by 1 / (11 − difficulty); 1000 = every task at the rank 1000`;
        document.getElementById("pf-lvl").innerHTML = `<span title="${hint}">${rankFmt(level, "player")}</span>${mkPlayerBadge(level)}`;
        document.getElementById("pf-btn").classList.toggle("has-level", level > 0);
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
            <div class="pfm-head">${PFM_SYMBOL}<span>${name}</span>${mkNeedMeter(key, task.diff)}</div>
            <div class="pfm-mid">${icon}</div>
            <div class="pfm-foot">
              <span class="pfm-rank">${mkRankBadge(key)}</span>
              <span title="Rank: days accumulated between repeat solves">${rankIconSvg(10)}${walletRank(key)}</span>
              <span class="ok" title="Successful runs">✓ ${st.ok}</span>
              <span class="bad" title="Failed runs">✗ ${st.fail}</span>
              <span class="coins" title="Coins earned from this task">${coinSvg(11)}${fmtCoins(st.coins)}</span>
            </div>
          </div>
          ${solved ? "" : PFM_LOCK}
        </div>`;
      }

      // The sort of the cards: the same modes and the same dropdown as the task list (SORT_MODES and
      // sortByMode, js/category.js), at the right end of the tabs, in the shape of a tab. By the name (A to Z)
      // by default; the choice is remembered.
      const PFM_SORT_KEY = "gr_pfm_sort";
      let _pfmSort = "az";
      try {
        _pfmSort = localStorage.getItem(PFM_SORT_KEY) || _pfmSort;
      } catch (e) {}
      let _pfmSortWrap = null;
      function pfmSortUpdate() {
        const btn = _pfmSortWrap.querySelector(".sort-btn");
        for (const m in SORT_MODES) btn.classList.toggle("sort-" + m, m === _pfmSort);
        btn.innerHTML = SORT_MODES[_pfmSort].icon;
        btn.title = "Sort: " + SORT_MODES[_pfmSort].label.toLowerCase();
        _pfmSortWrap.querySelectorAll(".sort-opt").forEach((o) => o.classList.toggle("active", o.dataset.mode === _pfmSort));
      }
      function pfmSortBuild() {
        if (!(_pfmSort in SORT_MODES)) _pfmSort = "az";
        const wrap = document.createElement("div");
        wrap.className = "sort-wrap pfm-sort";
        wrap.innerHTML = '<button class="sort-btn" type="button"></button><div class="sort-menu"></div>';
        const hover = attachHoverMenu(wrap, 450);
        const set = (m) => {
          _pfmSort = m;
          try {
            localStorage.setItem(PFM_SORT_KEY, m);
          } catch (e) {}
          pfmSortUpdate();
          pfmRender();
        };
        wrap.querySelector(".sort-btn").onclick = () => {
          playClick();
          set(SORT_NEXT[_pfmSort]);
        };
        const menu = wrap.querySelector(".sort-menu");
        for (const m in SORT_MODES) {
          const o = document.createElement("div");
          o.className = "sort-opt";
          o.dataset.mode = m;
          o.innerHTML = `<span class="sort-ico sort-${m}">${SORT_MODES[m].icon}</span><span>${SORT_MODES[m].label}</span>`;
          o.onclick = () => {
            playClick();
            set(m);
            hover.close();
          };
          menu.appendChild(o);
        }
        _pfmSortWrap = wrap;
        pfmSortUpdate();
      }

      function pfmRender() {
        const tops = MENU;
        if (!_pfmSortWrap) pfmSortBuild();
        _pfmTab = Math.min(_pfmTab, tops.length - 1);
        document.getElementById("pfm-tabs").innerHTML = tops
          .map((top, i) => {
            const all = pfmTasks(top);
            const done = all.filter((x) => pfmSolved(x.cat, x.task)).length;
            return `<button class="pfm-tab${i === _pfmTab ? " on" : ""}" data-t="${i}" type="button"><b>${top.name}</b><i>${done}/${all.length}</i></button>`;
          })
          .join("");
        document.getElementById("pfm-tabs").appendChild(_pfmSortWrap); // innerHTML above took it out
        const top = tops[_pfmTab];
        _pfmCards = sortByMode(pfmTasks(top), _pfmSort, (x) => `${x.cat.id}/${x.task.id}`, (x) => x.task.diff, (x) => pfmName(x.task));
        document.getElementById("pfm-grid").innerHTML =
          _pfmCards.map((x, i) => pfmCard(x, top, i)).join("") ||
          '<div class="tx-empty">// NO TASKS //</div>';
        const lv = profileLevel();
        document.getElementById("pfm-sum").innerHTML =
          `Level <b>${fmtCoins(round2(lv.level))}</b> · solved <b>${lv.tasks}</b> / <b>${Object.keys(profileDiffs()).length}</b>`;
      }

      // The URL keeps the profile window: ?profile=<id of the catalog> while it is open (the tab);
      // a reload opens it again, the browser's back / forward open or close it (js/routing.js).
      // replaceState: opening a window is not a page, it does not make a history entry.
      function pfmSyncUrl(open) {
        const url = new URL(location.href);
        if (open) url.searchParams.set("profile", MENU[_pfmTab].id);
        else url.searchParams.delete("profile");
        histReplace(url.toString());
      }
      // tabId: the id of a catalog (the URL) — absent / unknown means the first one
      // The window is as tall as its tallest tab (REGEX has many cards, the others few), so switching the tabs
      // does not change its height and the centered window does not jump. Measured by drawing every tab once.
      function pfmFitHeight() {
        const modal = pfmModal.querySelector(".modal");
        if (!modal || pfmModal.classList.contains("hide")) return;
        const keep = _pfmTab;
        modal.style.minHeight = "";
        let h = 0;
        for (let i = 0; i < MENU.length; i++) {
          _pfmTab = i;
          pfmRender();
          h = Math.max(h, modal.getBoundingClientRect().height);
        }
        _pfmTab = keep;
        pfmRender();
        modal.style.minHeight = h + "px";
      }
      window.addEventListener("resize", () => pfmFitHeight());
      // silent: the window is opened by the URL (a reload, the back / forward of the browser, the BACK of a task
      // that was opened from this window), not by a click: no click sound and no fade-in, so that it does not
      // sound like several clicks and does not flicker
      function pfmOpen(tabId, silent) {
        _pfmTab = Math.max(0, MENU.findIndex((t) => t.id === tabId)); // REGEX, the first catalog
        pfmRender();
        pfmModal.style.animation = silent ? "none" : "";
        pfmModal.classList.remove("hide");
        pfmFitHeight();
        pfmModal.querySelector(".m-content").scrollTop = 0;
        pfmSyncUrl(true);
        if (!silent) playClick();
      }
      function pfmClose(silent) {
        pfmModal.classList.add("hide");
        pfmSyncUrl(false);
        if (!silent) playClick();
      }
      document.getElementById("pf-btn").addEventListener("click", () => pfmOpen());
      pfmModal.addEventListener("click", (e) => {
        if (e.target === e.currentTarget) return pfmClose();
        const tab = e.target.closest(".pfm-tab");
        if (tab) {
          _pfmTab = +tab.dataset.t;
          playClick();
          pfmSyncUrl(true);
          pfmRender();
          pfmModal.querySelector(".m-content").scrollTop = 0;
          return;
        }
        const card = e.target.closest(".pfm-card");
        if (card) {
          const x = _pfmCards[+card.dataset.i];
          pfmModal.classList.add("hide");
          navigateToTask(x.cat, x.task);
        }
      });
