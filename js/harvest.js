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

      // EXPERIMENT: the square button fills up with the total need of the tasks for a repeat solve (0-100 %)
      // and a ball with the number floats in it. How the need is counted is not decided yet (plans: the weighted
      // mean of the need meters), so for now it shows 0 until the console sets it:
      // run("override global_need 100") (nothing is saved).
      let _hvNeedOverride = null;
      const hvNeedValue = () => (_hvNeedOverride == null ? 0 : _hvNeedOverride);
      function hvNeedOverride(percent) {
        _hvNeedOverride = percent;
        hvNeedRender();
      }

      // The pool: the liquid level (--n, eased here, not in CSS, because the ball reads it) and the ball.
      // Units are px and seconds; the ball stays in the middle (x) and has the height of its centre above the
      // floor (h). Gravity pulls it down, the liquid pushes it up in proportion to how deep it is in (the surface
      // under the ball is the two wave layers of the CSS, recomputed from their running animations, so the ball
      // rides the drawn waves), the water damps it; the floor and the ceiling stop it.
      const HV_G = 520, HV_BUOY = 2 * HV_G, HV_DRAG = 20;
      const _hvPool = { el: null, fill: null, ball: null, level: 0, target: 0, h: 6.375, vy: 0,
        W: 36, H: 36, R: 6.375, raf: 0, last: 0, shown: -1, anims: null, seen: false };

      // the height of the liquid surface above the floor at x (a sum of the body and the wave layer on it)
      function hvSurface(x, tw, ts, body, k) {
        const y = 2.2 - 1.3 * Math.sin((2 * Math.PI * (x - 12 * tw)) / 12); // the wave of the drawn SVG
        const squeeze = 0.8 + 0.2 * Math.cos(2 * Math.PI * ts); // the slosh animation squeezes the layer 1 -> 0.6
        return Math.max(0, body + k * ((4 - y) * squeeze - 1));
      }
      // The waves need room above the liquid: below ~94 % the body leaves 4 px for them (k = 1), and on the last
      // 6 % the room and the waves fade out, so 100 % is a pool filled to the brim and calm (k = 0)
      function hvGeom(level, H) {
        const k = Math.min(1, Math.max(0, (100 - level) / 6));
        return { k, body: ((H - 4 * k) * level) / 100 };
      }
      // the running phases of the two CSS animations (0..1), so the ball and the picture are the same wave
      function hvWavePhase() {
        const s = _hvPool;
        if (!s.anims) {
          const all = document.getAnimations();
          const wave = all.find((a) => a.animationName === "hv-wave-a");
          const slosh = all.find((a) => a.animationName === "hv-slosh" && a.effect.pseudoElement === "::before");
          if (wave && slosh) s.anims = { wave, slosh };
        }
        const now = performance.now();
        const t = (a, period, fallback) => ((a ? Number(a.currentTime) : fallback) % period) / period;
        return { tw: t(s.anims && s.anims.wave, 1700, now), ts: t(s.anims && s.anims.slosh, 2900, now) };
      }

      function hvPoolStep(dt) {
        const s = _hvPool, R = s.R;
        s.level += (s.target - s.level) * (1 - Math.exp(-dt / 0.22));
        if (Math.abs(s.target - s.level) < 0.02) s.level = s.target;
        const water = s.el.classList.contains("on");
        const { k: kw, body } = hvGeom(s.level, s.H);
        const { tw, ts } = hvWavePhase();
        // the surface under the ball: averaged over its width, so the ball floats on the swell and does not
        // jump on every ripple
        const surf = (x, d = 0) => {
          if (!water) return 0;
          let sum = 0;
          for (let k = -2; k <= 2; k++) sum += hvSurface(x + (k * R) / 2, tw + d / 1.7, ts + d / 2.9, body, kw);
          return sum / 5;
        };
        const n = Math.max(1, Math.ceil(dt / (1 / 120))), h = dt / n;
        for (let i = 0; i < n; i++) {
          const S = surf(s.W / 2),
            sub = Math.min(1, Math.max(0, (S - (s.h - R)) / (2 * R))); // the submerged part of the ball, 0..1
          const vs = (surf(s.W / 2, 0.01) - S) / 0.01; // the speed of the surface itself
          // Archimedes (it floats half-submerged) + the water holds the ball (drag against the surface speed)
          s.vy += (-HV_G + HV_BUOY * sub - HV_DRAG * Math.min(1, sub * 4) * (s.vy - vs)) * h;
          s.h += s.vy * h;
          if (s.h < R) {
            s.h = R;
            s.vy = s.vy < -20 ? -s.vy * 0.2 : 0;
          }
          if (s.h > s.H - R) {
            s.h = s.H - R;
            if (s.vy > 0) s.vy = 0;
          }
        }
        const settled = s.level === s.target && s.vy === 0;
        // nothing moves in an empty pool and in a full one (calm water, the ball pressed to the lid)
        return !(settled && ((!water && s.level === 0 && s.h === R) || (s.level === 100 && s.h === s.H - R)));
      }
      function hvPoolDraw() {
        const s = _hvPool;
        if (s.level !== s.shown) {
          s.shown = s.level;
          s.el.style.setProperty("--n", s.level);
          s.el.style.setProperty("--k", hvGeom(s.level, s.H).k);
        }
        s.ball.style.transform = `translate(${(s.W / 2 - s.R).toFixed(2)}px, ${(s.R - s.h).toFixed(2)}px)`;
      }
      function hvPoolTick(ts) {
        const s = _hvPool;
        s.raf = 0;
        s.W = s.el.clientWidth || s.W;
        s.H = s.el.clientHeight || s.H;
        const dt = s.last ? Math.min(0.05, (ts - s.last) / 1000) : 1 / 60;
        s.last = ts;
        const alive = hvPoolStep(dt);
        s.el.classList.toggle("on", s.target > 0 || s.level > 0.02);
        hvPoolDraw();
        if (alive && s.seen) s.raf = requestAnimationFrame(hvPoolTick);
        else s.last = 0;
      }
      function hvPoolWake() {
        const s = _hvPool;
        if (HV_REDUCED.matches) {
          s.level = s.target; // no motion: the level at once, the ball on the surface (or on the floor)
          s.h = Math.min(s.H - s.R, Math.max(s.R, hvGeom(s.level, s.H).body));// it floats half-submerged: the centre is at the surface
          s.vy = 0;
          hvPoolDraw();
        } else if (!s.raf && s.seen) s.raf = requestAnimationFrame(hvPoolTick);
      }
      const HV_REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)");

      function hvNeedRender() {
        const s = _hvPool;
        if (!s.el) {
          s.el = document.getElementById("hv-need");
          if (!s.el) return;
          s.fill = s.el.querySelector("i");
          s.ball = s.el.querySelector(".hv-ball");
          // the loop runs only while the button is on the screen (the home screen)
          new IntersectionObserver((e) => {
            s.seen = e[e.length - 1].isIntersecting;
            if (s.seen) hvPoolWake();
          }).observe(s.el);
        }
        const v = hvNeedValue();
        s.target = v;
        s.el.classList.toggle("on", v > 0 || s.level > 0.02);
        const btn = document.getElementById("hv-need-btn");
        btn.title =
          `Total need for a repeat solve: ${Math.round(v)}%` +
          (_hvNeedOverride == null ? " (not measured yet)" : " (set from the console)") +
          " · click to open the most overdue task";
        hvPoolWake();
      }

      // Update the number on the button (also called on a timer: rewards keep growing)
      function hvRefresh() {
        const pool = hvPool();
        const total = round2(pool.reduce((s, p) => s + p.net, 0));
        document.getElementById("hv-amt").textContent = fmtCoins(total);
        hvNeedRender();
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
      ["hv-btn", "hv-need-btn"].forEach((id) =>
        document.getElementById(id).addEventListener("click", (e) => {
          e.preventDefault();
          hvPick();
        }),
      );

      hvClamp();
      hvRefresh();
      setInterval(hvRefresh, 10000);
