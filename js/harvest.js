      // ═══════════ HARVEST ═══════════
      // Button next to RANDOM on the home screen. The number on it is how many
      // coins could be collected right now (sum of every task's payout, see
      // walletPayout) over the tasks that pass the hover-panel filters:
      // categories, difficulty range, min days since last solve, min reward.
      // Click opens the most overdue of those tasks (most days since lastSolved).
      // Never-solved tasks have no lastSolved, so they never count.
      const _hvWrap = document.getElementById("hv-wrap");
      attachHoverMenu(_hvWrap, 500);
      document.getElementById("hv-coin").innerHTML = coinSvg(16);
      document.getElementById("hv-bal-coin").innerHTML = coinSvg(16);

      // ── Safe icon on the button ──
      // Closed by default, opens on hover. Three states of the contents by the balance: empty
      // (cobweb) → small pile → mountain of gold above HARVEST_RICH_BALANCE. Hover shows the
      // balance; a click opens the Adjust balance modal (not the "open the most overdue task"
      // action of the button). The transactions modal is opened by the history button.
      const _hvSafe = document.getElementById("hv-safe");
      let _hvSafeState = null;
      function safeIconSvg(state, px) {
        const CY = "#00ffff",
          coin = (cx, cy) =>
            `<ellipse cx="${cx}" cy="${cy + 0.9}" rx="2.4" ry="1.15" fill="#a06a00"/><ellipse cx="${cx}" cy="${cy}" rx="2.4" ry="1.15" fill="#ffd84a"/>`;
        let inner = "";
        if (state === "empty") {
          inner =
            '<g stroke="#9fb1b1" stroke-width=".6" fill="none" stroke-linecap="round"><line x1="6" y1="9" x2="13" y2="9"/><line x1="6" y1="9" x2="11.04" y2="14.04"/><line x1="6" y1="9" x2="6" y2="16"/><polyline points="9.5,9 8.52,11.52 6,12.5"/><polyline points="13,9 11.04,14.04 6,16"/></g>';
        } else {
          const rows = state === "mountain" ? [4, 4, 3, 3, 2, 1] : [3, 2];
          rows.forEach((n, r) => {
            for (let i = 0; i < n; i++)
              inner += coin(+(13 + (i - (n - 1) / 2) * 2.9).toFixed(2), +(22.2 - r * 1.9).toFixed(2));
          });
        }
        // two layers in one icon: .sf-closed (the door shut, default) and .sf-open (the door ajar,
        // the contents visible); the CSS swaps them while the pointer is over the safe
        return `<svg class="safe-ico" width="${px}" height="${px}" viewBox="0 0 32 32" aria-hidden="true"><defs><clipPath id="hv-safe-clip"><rect x="6" y="9" width="14" height="14"/></clipPath></defs><rect x="3" y="6" width="20" height="20" rx="1" fill="none" stroke="${CY}" stroke-width="1.7"/><g class="sf-closed"><rect x="6" y="9" width="14" height="14" rx="1" fill="none" stroke="${CY}" stroke-width="1.1" opacity=".6"/><circle cx="13" cy="16" r="3" fill="none" stroke="${CY}" stroke-width="1.4"/><path d="M13 13.3V14.6M13 17.4V18.7M10.3 16H11.6M14.4 16H15.7" stroke="${CY}" stroke-width="1.1" stroke-linecap="round"/><path d="M23 10.5H24.6M23 21.5H24.6" stroke="${CY}" stroke-width="1.7" stroke-linecap="round"/></g><g class="sf-open"><g clip-path="url(#hv-safe-clip)">${inner}</g><path d="M23 6L29 3.5V28.5L23 26" fill="none" stroke="${CY}" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/><circle cx="26" cy="16" r="1.1" fill="${CY}"/></g></svg>`;
      }
      function hvRefreshSafe() {
        const state =
          _balance > HARVEST_RICH_BALANCE ? "mountain" : _balance > 0 ? "pile" : "empty";
        if (state !== _hvSafeState) {
          _hvSafeState = state;
          document.getElementById("hv-safe-ico").innerHTML = safeIconSvg(state, 24);
        }
        document.getElementById("hv-bal").textContent = fmtCoins(_balance); // the balance, right of the safe
        _hvSafe.title = `Balance: ${fmtCoins(_balance)} · click to adjust`;
      }
      _hvSafe.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation(); // the rest of the button keeps its own action
        walletAskReset();
      });
      _hvSafe.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          walletAskReset();
        }
      });

      function hvBuildCats() {
        const wrap = document.getElementById("hv-cats");
        wrap.innerHTML = "";
        MENU.forEach((cat) => {
          const id = `hv-cat-${cat.id}`;
          const label = document.createElement("label");
          label.className = "rnd-cat-item";
          label.htmlFor = id;
          label.innerHTML = `<input type="checkbox" id="${id}" value="${cat.id}" checked /> ${cat.name}`;
          wrap.appendChild(label);
        });
        wrap.addEventListener("change", hvRefresh);
      }
      hvBuildCats();

      function hvClamp(moved) {
        const minEl = document.getElementById("hv-diff-min"),
          maxEl = document.getElementById("hv-diff-max");
        let min = parseInt(minEl.value, 10),
          max = parseInt(maxEl.value, 10);
        if (min > max) {
          if (moved === "min") maxEl.value = String(min);
          else minEl.value = String(max);
          min = parseInt(minEl.value, 10);
          max = parseInt(maxEl.value, 10);
        }
        document.getElementById("hv-diff-val").textContent = `${min} – ${max}`;
      }
      ["min", "max"].forEach((w) =>
        document.getElementById("hv-diff-" + w).addEventListener("input", () => {
          hvClamp(w);
          hvRefresh();
        }),
      );
      ["hv-days", "hv-reward"].forEach((id) =>
        document.getElementById(id).addEventListener("input", hvRefresh),
      );

      const hvNum = (id, fallback) => {
        const v = parseFloat(document.getElementById(id).value);
        return Number.isFinite(v) && v >= 0 ? v : fallback;
      };

      // Tasks that pass the filters: [{cat, task, days, net}]
      function hvPool() {
        const minD = parseInt(document.getElementById("hv-diff-min").value, 10),
          maxD = parseInt(document.getElementById("hv-diff-max").value, 10),
          minDays = hvNum("hv-days", 0),
          minReward = hvNum("hv-reward", 0);
        const active = new Set(
          Array.from(document.querySelectorAll("#hv-cats input:checked")).map(
            (cb) => cb.value,
          ),
        );
        const pool = [];
        MENU.forEach((top) => {
          if (!active.has(top.id)) return;
          const res = [];
          gatherAllTasks(top, res);
          res.forEach(({ cat, task }) => {
            const days = walletNeedDays(`${cat.id}/${task.id}`);
            if (days == null) return; // never solved → nothing to harvest
            const diff = task.diff || 1;
            if (diff < minD || diff > maxD || days < minDays) return;
            const net = walletPayout(diff, days).net;
            if (net < minReward || net <= 0) return;
            pool.push({ cat, task, days, net });
          });
        });
        return pool;
      }

      // Update the number on the button (also called on a timer: rewards keep growing)
      function hvRefresh() {
        const pool = hvPool();
        const total = round2(pool.reduce((s, p) => s + p.net, 0));
        document.getElementById("hv-amt").textContent = fmtCoins(total);
        document.getElementById("hv-btn").classList.toggle("has-yield", total > 0);
        hvRefreshSafe();
        if (pool.length)
          document.getElementById("hv-empty").classList.remove("show");
      }

      function hvPick() {
        playClick();
        const pool = hvPool();
        if (!pool.length) {
          document.getElementById("hv-empty").classList.add("show");
          return;
        }
        document.getElementById("hv-empty").classList.remove("show");
        // most overdue first; ties → bigger payout
        pool.sort((a, b) => b.days - a.days || b.net - a.net);
        navigateToTask(pool[0].cat, pool[0].task);
      }
      document.getElementById("hv-btn").addEventListener("click", (e) => {
        e.preventDefault();
        hvPick();
      });

      hvClamp();
      hvRefresh();
      setInterval(hvRefresh, 10000);
