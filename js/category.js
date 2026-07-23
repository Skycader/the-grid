      // ═══════════ CATEGORY (bottom sheet) ═══════════
      function handleCatBgClick(e) {
        // clicking the backdrop (not the sheet) goes back
        if (
          e.target === e.currentTarget ||
          e.target.classList.contains("cat-backdrop")
        ) {
          playClick();
          showView("home");
        }
      }

      // Count all tasks recursively in a node
      function countTasks(node) {
        let n = (node.tasks || []).length;
        (node.children || []).forEach((c) => {
          n += countTasks(c);
        });
        return n;
      }

      function openCat(cat) {
        // Push onto nav stack (unless already the top)
        if (!navStack.length || navStack[navStack.length - 1] !== cat) {
          navStack.push(cat);
        }
        // Sync URL — category only (task param dropped)
        setQueryParams({ cat: cat.id });
        document.getElementById("cat-lbl").textContent =
          cat.name + (cat.desc ? " // " + cat.desc : "");
        const taskN = (cat.tasks || []).length;
        const subN = (cat.children || []).length;
        const meta =
          [taskN ? taskN + " TASKS" : "", subN ? subN + " FOLDERS" : ""]
            .filter(Boolean)
            .join(", ") || "EMPTY";
        document.getElementById("cat-cnt").textContent = meta;
        // Reset cat search
        const catSrch = document.getElementById("cat-srch");
        if (catSrch) catSrch.value = "";
        _vsQuery = "";
        _vsMatches = [];
        clearTimeout(_catsrchTimer);
        // Update breadcrumb
        updateCatBreadcrumb();
        renderCatContent(cat);
        showView("category");
        updateRanksBtn();
      }

      function updateCatBreadcrumb() {
        // Show path: HOME / ALGO / SORTING
        const parts = navStack.map((n, i) => {
          const isLast = i === navStack.length - 1;
          return isLast
            ? `<span class="act">${n.name}</span>`
            : `<span style="cursor:pointer;color:var(--cd)" onclick="navTo(${i})">${n.name}</span>`;
        });
        const el = document.getElementById("cat-breadc");
        if (el)
          el.innerHTML = parts.join(
            ' <span style="color:var(--txd)">/</span> ',
          );
      }

      // Navigate to a specific depth in the stack (click on breadcrumb ancestor)
      function navTo(idx) {
        navStack = navStack.slice(0, idx + 1);
        openCat(navStack[navStack.length - 1]);
      }

      // Render the current category node:
      // - subcategory cards (if any children)
      // - task list via virtual scroll (if any tasks)
      function renderCatContent(cat) {
        const subcats = cat.children || [];
        const tasks = cat.tasks || [];

        // Subcat cards
        const subArea = document.getElementById("subcat-area");
        if (subArea) {
          if (subcats.length) {
            subArea.style.display = "";
            subArea.innerHTML = "";
            subcats.forEach((sub) => {
              const el = document.createElement("div");
              el.className = "subcat-card";
              const icon = ICONSTORE[sub.folder] || FALLBACK_SVG;
              const n = countTasks(sub);
              el.innerHTML = `<div class="subcat-icon">${icon}</div>
                <div><div class="subcat-name">${sub.name}</div>
                <div class="subcat-meta">${n ? n + " TASKS" : "EMPTY"}</div></div>`;
              el.onclick = () => {
                playNav();
                openCat(sub);
              };
              subArea.appendChild(el);
            });
          } else {
            subArea.style.display = "none";
          }
        }

        // Tasks
        renderTaskList(cat);
      }

      // ── Task list state ──
      let _vsCat = null;
      let _vsQuery = ""; // current search query
      let _vsMatches = []; // indices of matching tasks (into getDisplayTasks())
      let _catsrchTimer = null;
      let _taskSortDir = "easy"; // "easy" | "hard" — sort by diff, toggled by #sort-btn

      // Current category's tasks in display order (sorted by difficulty).
      // All rendering/search indices are relative to THIS array, not cat.tasks.
      function getDisplayTasks() {
        if (!_vsCat || !_vsCat.tasks) return [];
        return _vsCat.tasks
          .slice()
          .sort((a, b) =>
            _taskSortDir === "easy" ? a.diff - b.diff : b.diff - a.diff,
          );
      }

      function toggleTaskSort() {
        playClick();
        _taskSortDir = _taskSortDir === "easy" ? "hard" : "easy";
        updateSortBtn();
        renderRows();
      }
      function updateSortBtn() {
        const btn = document.getElementById("sort-btn");
        if (!btn) return;
        const easy = _taskSortDir === "easy";
        btn.classList.toggle("sort-easy", easy);
        btn.classList.toggle("sort-hard", !easy);
        btn.innerHTML = easy ? "★▼" : "★▲";
        btn.title = easy
          ? "Сортировка: сначала лёгкие"
          : "Сортировка: сначала сложные";
      }
      document.getElementById("sort-btn").onclick = toggleTaskSort;
      updateSortBtn();

      // Wire up cat search — debounce 30ms, scroll+dim, no filter
      document.getElementById("cat-srch").addEventListener("input", (e) => {
        playType();
        clearTimeout(_catsrchTimer);
        const raw = e.target.value.trim();
        _catsrchTimer = setTimeout(() => applyTaskSearch(raw), 300);
      });
      document.getElementById("cat-srch").addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          e.target.value = "";
          clearTimeout(_catsrchTimer);
          applyTaskSearch("");
        }
      });

      function applyTaskSearch(q) {
        _vsQuery = q.toLowerCase();
        if (!_vsCat) return;
        const tasks = getDisplayTasks();
        _vsMatches = q
          ? tasks.reduce((acc, t, i) => {
              if (
                t.id.toLowerCase().includes(_vsQuery) ||
                t.title.toLowerCase().includes(_vsQuery) ||
                t.desc.toLowerCase().includes(_vsQuery)
              )
                acc.push(i);
              return acc;
            }, [])
          : [];
        // Re-render all visible rows (updates dimming)
        renderRows();
        // Scroll to first match
        if (_vsMatches.length) {
          const el = document.getElementById("task-list");
          // Scroll to first matching row by finding it in DOM
          if (el) {
            const rows = el.querySelectorAll(".task-row");
            const firstMatchRow = rows[_vsMatches[0]];
            if (firstMatchRow)
              firstMatchRow.scrollIntoView({
                block: "nearest",
                behavior: "smooth",
              });
          }
        }
        // Update count label
        const cnt = document.getElementById("cat-cnt");
        if (cnt)
          cnt.textContent =
            q && _vsMatches.length
              ? `${_vsMatches.length} / ${tasks.length} MATCHES`
              : tasks.length
                ? tasks.length + " TASKS"
                : "NO TASKS";
      }

      function renderTaskList(cat) {
        _vsCat = cat;
        focusTaskIdx = -1;
        _vsQuery = "";
        _vsMatches = [];
        renderRows();
      }

      // Simple flat render — no virtual scroll.
      // For 30–200 tasks this is faster than the virtual scroll overhead.
      function renderRows() {
        const el = document.getElementById("task-list");
        if (!el) return;
        el.innerHTML = "";

        if (!_vsCat || !_vsCat.tasks.length) {
          el.innerHTML = `<div style="font-family:'JetBrains Mono',monospace;color:var(--txd);font-size:.74rem;padding:22px;text-align:center;opacity:.45">// NO TASKS IN THIS CATEGORY YET //</div>`;
          return;
        }

        const tasks = getDisplayTasks();
        const hasSearch = _vsQuery && _vsMatches.length > 0;
        const matchSet = hasSearch ? new Set(_vsMatches) : null;

        tasks.forEach((t, i) => {
          const st = STATUS[`${_vsCat.id}/${t.id}`] || "";
          const dc = diffCls(t.diff);
          const isMatch = !hasSearch || matchSet.has(i);
          const row = document.createElement("div");
          row.className = "task-row" + (i === focusTaskIdx ? " focused" : "");
          if (hasSearch) {
            row.style.opacity = isMatch ? "1" : "0.2";
            if (isMatch) row.style.borderColor = "rgba(0,200,255,.4)";
          }
          row.dataset.idx = i;
          row.innerHTML = `<div class="trow-l">
            <div class="t-dot${st === "ok" ? " ok" : st === "ng" ? " ng" : ""}"></div>
            <div class="t-num">${String(i + 1).padStart(2, "0")}.</div>
            <div><div class="t-id">${t.id.toUpperCase()}</div><div class="t-desc">${t.desc}</div></div>
          </div>
          <div class="stars-wrap">
<span class="stars ${dc}">${mkStars(t.diff)}</span>
          </div>`;
          row.onclick = () => {
            playNav();
            openTask(_vsCat, t);
          };
          el.appendChild(row);
        });
      }

      // Fixed row-shape per difficulty (1–10) — not a flat repeat, each
      // number has its own deliberate grid: 4=2x2 square, 5=4-square with a
      // 1-star capstone, 6=2x3 tower, 7=1/3/3 capstone pyramid, 8=same
      // pyramid with a 2-star cap, 9=3x3 square, 10=9 + 1-star capstone.
      const STAR_ROWS = {
        1: [1],
        2: [2],
        3: [3],
        4: [2, 2],
        5: [1, 2, 2],
        6: [2, 2, 2],
        7: [1, 3, 3],
        8: [2, 3, 3],
        9: [3, 3, 3],
        10: [1, 3, 3, 3],
      };
      function mkStars(d) {
        const rows = STAR_ROWS[d];
        if (!rows) return "";
        return (
          '<span class="star-grid">' +
          rows
            .map(
              (n) => `<span class="star-row">${"★".repeat(n)}</span>`,
            )
            .join("") +
          "</span>"
        );
      }
      function diffCls(d) {
        return d <= 3 ? "dg-green" : d === 4 ? "dg-blue" : d <= 6 ? "dg-yellow" : "dg-red";
      }
      document.getElementById("bk-cat").onclick = (e) => {
        e.stopPropagation();
        playClick();
        navStack.pop();
        if (navStack.length) {
          openCat(navStack[navStack.length - 1]);
        } else {
          clearQueryParams();
          showView("home");
        }
      };

