      // ═══════════ FILE LOADING ═══════════
      async function loadTask(cat, task) {
        const key = `${cat.id}/${task.id}`;
        if (FILECACHE[key]) return FILECACHE[key];
        // task._folder set by processConfig (Folder items); fall back to cat.folder
        const taskFolder = task._folder || cat.folder;
        const base = `grid/${taskFolder}/${task.file}`;
        const t = Date.now(); // cache-bust: each page load gets fresh files
        const load = (u) =>
          fetch(`${u}?t=${t}`).then((r) => {
            if (!r.ok) throw 0;
            return r.text();
          });
        try {
          const [code, spec, sol] = await Promise.all([
            load(`${base}.js`),
            load(`${base}.spec.js`),
            load(`${base}.sol.js`).catch(() => null),
          ]);
          FILECACHE[key] = { code, spec, sol };
        } catch (e) {
          FILECACHE[key] = {
            code: `// ⚠ File not found: ${task.file}.js\n// Start: python3 -m http.server 8080\n`,
            spec: `// ⚠ File not found: ${task.file}.spec.js`,
            sol: null,
          };
        }
        return FILECACHE[key];
      }

      // ═══════════ SEARCH ═══════════
      let _srchTimer = null,
        _srchPage = 1,
        _srchAll = [],
        _srchFocusIdx = -1;
      const PAGE_SRCH = 5;

      document.getElementById("srch").addEventListener("input", (e) => {
        clearTimeout(_srchTimer);
        const q = e.target.value.trim();
        if (!q) {
          hideSrch();
          renderCats("");
          document.querySelector(".cat-grid-wrap").style.display = "";
          return;
        }
        document.querySelector(".cat-grid-wrap").style.display = "none";
        _srchTimer = setTimeout(() => doSearch(q), 270);
      });
      document.getElementById("srch").addEventListener("keydown", (e) => {
        playType();
        if (e.key === "Escape") {
          if (
            document.getElementById("ranks-drawer").classList.contains("open")
          ) {
            closeRanksDrawer();
            return;
          }
          e.preventDefault();
          clearSrch();
          return;
        }
        if (e.key === "Enter") {
          e.preventDefault();
          const rows = document.querySelectorAll(".srch-row");
          if (_srchFocusIdx >= 0 && rows[_srchFocusIdx]) {
            rows[_srchFocusIdx].click();
            return;
          }
          if (_srchAll.length === 1) {
            navigateToTask(_srchAll[0].cat, _srchAll[0].task);
            return;
          }
          return;
        }
        if (e.key === "ArrowDown") {
          e.preventDefault();
          const rows = document.querySelectorAll(".srch-row");
          if (!rows.length) return;
          _srchFocusIdx = Math.min(_srchFocusIdx + 1, rows.length - 1);
          rows.forEach((r, i) =>
            r.classList.toggle("focused", i === _srchFocusIdx),
          );
          return;
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          const rows = document.querySelectorAll(".srch-row");
          if (!rows.length) return;
          _srchFocusIdx = Math.max(_srchFocusIdx - 1, 0);
          rows.forEach((r, i) =>
            r.classList.toggle("focused", i === _srchFocusIdx),
          );
          return;
        }
      });
      function clearSrch() {
        document.getElementById("srch").value = "";
        _srchFocusIdx = -1;
        hideSrch();
        renderCats("");
        document.querySelector(".cat-grid-wrap").style.display = "";
        document.getElementById("srch").blur();
      }
      function hideSrch() {
        const sr = document.getElementById("srch-results");
        sr.innerHTML = "";
        sr.classList.remove("show");
        _srchAll = [];
        _srchPage = 1;
        _srchFocusIdx = -1;
      }
      // Recursively collect all {cat, task} pairs from the full menu tree
      function gatherAllTasks(node, results) {
        (node.tasks || []).forEach((t) => results.push({ cat: node, task: t }));
        (node.children || []).forEach((child) =>
          gatherAllTasks(child, results),
        );
      }

      function doSearch(q) {
        const ql = q.toLowerCase();
        _srchAll = [];
        const all = [];
        MENU.forEach((cat) => gatherAllTasks(cat, all));
        all.forEach(({ cat, task: t }) => {
          if (
            t.id.toLowerCase().includes(ql) ||
            t.title.toLowerCase().includes(ql) ||
            t.desc.toLowerCase().includes(ql)
          )
            _srchAll.push({ cat, task: t });
        });
        _srchPage = 1;
        _srchFocusIdx = -1;
        renderSrch();
        // filter categories too
        _filteredMenu = MENU.filter((cat) => {
          return (
            cat.name.toLowerCase().includes(ql) ||
            cat.desc.toLowerCase().includes(ql) ||
            cat.tasks.some(
              (t) =>
                t.id.toLowerCase().includes(ql) ||
                t.title.toLowerCase().includes(ql) ||
                t.desc.toLowerCase().includes(ql),
            )
          );
        });
        catPage = 0;
        renderCatGrid(_filteredMenu);
      }
      function renderSrch() {
        const sr = document.getElementById("srch-results");
        sr.innerHTML = "";
        if (!_srchAll.length) {
          sr.classList.remove("show");
          return;
        }
        sr.classList.add("show");
        const lbl = document.createElement("div");
        lbl.className = "srch-lbl";
        lbl.textContent = `// ${_srchAll.length} MATCH${_srchAll.length !== 1 ? "ES" : ""} FOUND //`;
        sr.appendChild(lbl);
        const slice = _srchAll.slice(0, _srchPage * PAGE_SRCH);
        slice.forEach(({ cat, task }, i) => {
          const el = document.createElement("div");
          el.className = "srch-row";
          if (i === _srchFocusIdx) el.classList.add("focused");
          el.innerHTML = `<span class="srch-cat">${cat.name}</span>
      <span class="srch-id">${task.id.toUpperCase()}</span>
      <span class="srch-desc">— ${task.desc}</span>
      <span class="srch-st ${diffCls(task.diff)}">${mkStars(task.diff)}</span>`;
          el.onclick = () => navigateToTask(cat, task);
          sr.appendChild(el);
        });
        if (_srchAll.length > slice.length) {
          const more = document.createElement("div");
          more.className = "srch-more";
          more.textContent = `▼ SHOW MORE (${_srchAll.length - slice.length} remaining)`;
          more.onclick = () => {
            _srchPage++;
            renderSrch();
          };
          sr.appendChild(more);
        }
      }
      function navigateToTask(cat, task) {
        playNav();
        clearSrch();
        openTask(cat, task);
      }

