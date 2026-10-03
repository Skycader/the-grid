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
