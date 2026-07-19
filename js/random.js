      // ═══════════ RANDOM TASK ═══════════
      // Button next to the home search bar: hover reveals a filter panel
      // (difficulty range + top-level categories), click opens a random
      // task matching the currently selected filters.

      // Panel visibility is JS-driven (not plain CSS :hover) so leaving the
      // button for the panel below it has a grace period instead of the
      // panel vanishing the instant the cursor crosses the gap between them.
      const _rndWrap = document.getElementById("rnd-wrap");
      let _rndHideTimer = null;
      function rndShowPanel() {
        clearTimeout(_rndHideTimer);
        _rndWrap.classList.add("open");
      }
      function rndScheduleHidePanel() {
        clearTimeout(_rndHideTimer);
        _rndHideTimer = setTimeout(() => {
          _rndWrap.classList.remove("open");
        }, 500);
      }
      _rndWrap.addEventListener("mouseenter", rndShowPanel);
      _rndWrap.addEventListener("mouseleave", rndScheduleHidePanel);
      _rndWrap.addEventListener("focusin", rndShowPanel);
      _rndWrap.addEventListener("focusout", rndScheduleHidePanel);

      function rndBuildCats() {
        const wrap = document.getElementById("rnd-cats");
        if (!wrap) return;
        wrap.innerHTML = "";
        MENU.forEach((cat) => {
          const id = `rnd-cat-${cat.id}`;
          const label = document.createElement("label");
          label.className = "rnd-cat-item";
          label.htmlFor = id;
          label.innerHTML = `<input type="checkbox" id="${id}" value="${cat.id}" checked /> ${cat.name}`;
          wrap.appendChild(label);
        });
      }
      rndBuildCats();

      function rndClampSliders(moved) {
        const minEl = document.getElementById("rnd-diff-min"),
          maxEl = document.getElementById("rnd-diff-max");
        if (!minEl || !maxEl) return;
        let min = parseInt(minEl.value, 10),
          max = parseInt(maxEl.value, 10);
        if (min > max) {
          if (moved === "min") maxEl.value = String(min);
          else minEl.value = String(max);
          min = parseInt(minEl.value, 10);
          max = parseInt(maxEl.value, 10);
        }
        const lbl = document.getElementById("rnd-diff-val");
        if (lbl) lbl.textContent = `${min} – ${max}`;
      }
      document
        .getElementById("rnd-diff-min")
        .addEventListener("input", () => rndClampSliders("min"));
      document
        .getElementById("rnd-diff-max")
        .addEventListener("input", () => rndClampSliders("max"));
      rndClampSliders();

      // Flat pool of {cat, task} across checked categories, filtered by diff range.
      // Reuses gatherAllTasks (SEARCH section) so nested/virtual folders work too.
      function rndGatherPool() {
        const minD = parseInt(document.getElementById("rnd-diff-min").value, 10);
        const maxD = parseInt(document.getElementById("rnd-diff-max").value, 10);
        const activeCats = new Set(
          Array.from(document.querySelectorAll("#rnd-cats input:checked")).map(
            (cb) => cb.value,
          ),
        );
        const pool = [];
        MENU.forEach((topCat) => {
          if (!activeCats.has(topCat.id)) return;
          const results = [];
          gatherAllTasks(topCat, results);
          results.forEach(({ cat, task }) => {
            const d = task.diff || 1;
            if (d >= minD && d <= maxD) pool.push({ cat, task });
          });
        });
        return pool;
      }

      function rndPick() {
        playClick();
        const empty = document.getElementById("rnd-empty");
        const pool = rndGatherPool();
        if (!pool.length) {
          if (empty) empty.classList.add("show");
          return;
        }
        if (empty) empty.classList.remove("show");
        const pick = pool[Math.floor(Math.random() * pool.length)];
        navigateToTask(pick.cat, pick.task);
      }
      document.getElementById("rnd-btn").addEventListener("click", (e) => {
        e.preventDefault();
        rndPick();
      });
