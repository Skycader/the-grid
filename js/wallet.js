      // ═══════════ WALLET / COINS ═══════════
      // Награда за решение = diff × (дней с прошлого удачного решения этой задачи),
      // минус комиссия (10 − diff) × 10 %: diff 1 → 90 %, diff 9 → 10 %, diff 10 → 0 %.
      // Чем сложнее задача, тем меньше комиссия. Потолка нет.
      // Первое решение бесплатное (только ставит метку).
      // "Удачное" = все тесты зелёные при включённом STRICT (и STRICT не провален).
      // Просмотр решения ("SHOW") считается проигрышем: lastSolved = now.
      // Хранится в localStorage: gr_wallet (баланс), gr_solved ({ "cat/task": ms }).
      const WALLET_KEY = "gr_wallet";
      const SOLVED_KEY = "gr_solved";
      const HISTORY_KEY = "gr_history"; // transaction log, its own localStorage item
      const DAY_MS = 86400000;
      const NEED_DAYS = 7; // шкала "нужды" заполняется за 7 суток

      let _balance = 0; // реальный баланс
      let _walletShown = 0; // то, что нарисовано (догоняет баланс по мере прилёта монет)
      let _solved = {};
      let _history = [];
      try {
        _balance = parseFloat(localStorage.getItem(WALLET_KEY)) || 0;
        _solved = JSON.parse(localStorage.getItem(SOLVED_KEY) || "{}") || {};
      } catch (e) {}
      try {
        const h = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
        if (Array.isArray(h)) _history = h;
      } catch (e) {}
      _walletShown = _balance;

      const round2 = (n) => Math.round(n * 100) / 100;

      // Выплата: gross = diff × дни; комиссия = (10 − diff) × 10 % (в [0..100]);
      // net = gross − комиссия. Пример: diff 9, 100 дн → 900 − 10 % = 810;
      // diff 1, 100 дн → 100 − 90 % = 10.
      function walletPayout(diff, days) {
        const gross = diff * days;
        const feePct = Math.max(0, Math.min(100, (10 - diff) * 10));
        return {
          gross: round2(gross),
          feePct,
          net: round2(gross * (1 - feePct / 100)),
        };
      }
      function saveWallet() {
        try {
          localStorage.setItem(WALLET_KEY, String(_balance));
          localStorage.setItem(SOLVED_KEY, JSON.stringify(_solved));
        } catch (e) {}
        if (typeof hvRefresh === "function") hvRefresh(); // harvest button total
        if (typeof walletRenderTaskReward === "function") walletRenderTaskReward();
      }
      // Append-only transaction log, kept in its own localStorage item (gr_history):
      //   solve: { t, type:"solve", task:"cat/task", diff, first, days, gross, feePct, net, balance }
      //          first = the free first solve (net 0); balance = balance AFTER the entry
      //   reset: { t, type:"reset", amount, balance:0 }  (amount = what was wiped)
      function walletLog(entry) {
        _history.push({ t: Date.now(), ...entry });
        try {
          localStorage.setItem(HISTORY_KEY, JSON.stringify(_history));
        } catch (e) {}
      }
      const fmtCoins = (n) =>
        n.toLocaleString("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        });

      // ── Coin: вариант №6 «edge-on» (монета с торца: диск + боковая грань) ──
      // Остальные варианты лежат в assets/coins/*.svg
      const COIN_SVG_INNER =
        '<ellipse cx="12" cy="15" rx="9" ry="4" fill="#a06a00"/>' +
        '<rect x="3" y="9" width="18" height="6" fill="#a06a00"/>' +
        '<ellipse cx="12" cy="9" rx="9" ry="4" fill="#ffd84a"/>' +
        '<ellipse cx="12" cy="9" rx="5" ry="2" fill="none" stroke="#a06a00" stroke-width="1.2"/>';
      function coinSvg(px) {
        return `<svg class="coin" width="${px}" height="${px}" viewBox="0 0 24 24" aria-hidden="true">${COIN_SVG_INNER}</svg>`;
      }

      // ── Sound ──
      const playCoin = () =>
        snd((c) => {
          [1320, 1760].forEach((fr, i) => {
            const o = c.createOscillator(),
              g = c.createGain();
            o.connect(g);
            g.connect(c.destination);
            o.type = "square";
            o.frequency.value = fr;
            const t = c.currentTime + i * 0.05;
            g.gain.setValueAtTime(0.03, t);
            g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
            o.start(t);
            o.stop(t + 0.1);
          });
        });

      // ── Widget ──
      function renderWallet() {
        const el = document.getElementById("wallet-val");
        if (el) el.textContent = fmtCoins(_walletShown);
      }
      function walletBump() {
        const w = document.getElementById("wallet");
        if (!w) return;
        w.classList.remove("bump");
        void w.offsetWidth;
        w.classList.add("bump");
      }
      function walletToast(text) {
        const w = document.getElementById("wallet");
        if (!w) return;
        const r = w.getBoundingClientRect();
        const t = document.createElement("div");
        t.className = "wallet-toast";
        t.textContent = text;
        t.style.top = r.bottom + 4 + "px";
        t.style.right = window.innerWidth - r.right + "px";
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 1600);
      }

      // ── Монетки летят из кнопки в баланс ──
      function walletFlyCoins(fromEl, amount, payout) {
        const dest = document.getElementById("wallet-coin");
        if (!dest || !fromEl) {
          _walletShown = _balance;
          renderWallet();
          return;
        }
        const a = fromEl.getBoundingClientRect(),
          b = dest.getBoundingClientRect();
        const sx = a.left + a.width / 2,
          sy = a.top + a.height / 2;
        const dx = b.left + b.width / 2 - sx,
          dy = b.top + b.height / 2 - sy;
        const n = Math.max(4, Math.min(16, Math.round(Math.sqrt(amount) * 3)));
        const start = _walletShown;
        let landed = 0;
        for (let i = 0; i < n; i++) {
          const c = document.createElement("div");
          c.className = "fly-coin";
          c.innerHTML = coinSvg(18);
          c.style.left = sx - 9 + "px";
          c.style.top = sy - 9 + "px";
          document.body.appendChild(c);
          // кнопка и баланс сидят в верхней панели — разлёт вниз, не за экран
          const bx = (Math.random() - 0.5) * 120,
            by = 30 + Math.random() * 60;
          const anim = c.animate(
            [
              { transform: "translate(0,0) scale(.4)", opacity: 0 },
              {
                transform: `translate(${bx}px,${by}px) scale(1)`,
                opacity: 1,
                offset: 0.3,
                easing: "cubic-bezier(.2,.7,.3,1)",
              },
              { transform: `translate(${dx}px,${dy}px) scale(.6)`, opacity: 1 },
            ],
            {
              duration: 900 + Math.random() * 350,
              delay: i * 55,
              easing: "cubic-bezier(.55,0,.9,.5)",
              fill: "both",
            },
          );
          anim.onfinish = () => {
            c.remove();
            landed++;
            _walletShown =
              landed === n ? _balance : round2(start + (amount / n) * landed);
            renderWallet();
            walletBump();
            playCoin();
            if (landed === n)
              walletToast(
                "+" +
                  fmtCoins(amount) +
                  (payout ? ` (fee ${payout.feePct}%)` : ""),
              );
          };
        }
        // страховка, если вкладка была в фоне и анимации не доиграли
        setTimeout(
          () => {
            _walletShown = _balance;
            renderWallet();
          },
          n * 55 + 2600,
        );
      }

      // ── Решение задачи ──
      // hasSol: у задачи есть .sol.js (тогда STRICT обязан быть подтверждён бенчмарком)
      function walletOnSolved(key, diff, hasSol, benchData, fromEl) {
        if (!_strictOn) return;
        if (hasSol) {
          if (!benchData) return;
          const ratio =
            benchData.refMinTime > 0
              ? (benchData.userMinTime - benchData.refMinTime) /
                benchData.refMinTime
              : 0;
          if (ratio > STRICT_TOLERANCE) return;
        }
        const now = Date.now(),
          prev = _solved[key];
        _solved[key] = now;
        if (prev == null) {
          saveWallet();
          walletLog({
            type: "solve",
            task: key,
            diff,
            first: true,
            days: null,
            gross: 0,
            feePct: walletPayout(diff, 0).feePct,
            net: 0,
            balance: _balance,
          });
          walletToast("FIRST CLEAR");
          return;
        }
        const days = (now - prev) / DAY_MS;
        const payout = walletPayout(diff, days);
        if (payout.net > 0) _balance = round2(_balance + payout.net);
        saveWallet();
        walletLog({
          type: "solve",
          task: key,
          diff,
          first: false,
          days: Math.round(days * 10000) / 10000,
          gross: payout.gross,
          feePct: payout.feePct,
          net: payout.net,
          balance: _balance,
        });
        if (payout.net > 0) walletFlyCoins(fromEl, payout.net, payout);
      }

      // "Смотреть решение" = проиграл: таймер идёт заново с этого момента
      function walletMarkSolutionViewed(key) {
        _solved[key] = Date.now();
        saveWallet();
      }

      // Ручная правка lastSolved (CLI). ts = ms | null (= "ни разу не решена")
      function walletSetLastSolved(key, ts) {
        const prev = _solved[key] ?? null;
        if (ts == null) delete _solved[key];
        else _solved[key] = ts;
        saveWallet();
        return prev;
      }

      // Перечитать баланс и lastSolved из localStorage (после импорта базы)
      function walletReloadFromStorage() {
        try {
          _balance = parseFloat(localStorage.getItem(WALLET_KEY)) || 0;
          _solved = JSON.parse(localStorage.getItem(SOLVED_KEY) || "{}") || {};
        } catch (e) {
          _balance = 0;
          _solved = {};
        }
        try {
          const h = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
          _history = Array.isArray(h) ? h : [];
        } catch (e) {
          _history = [];
        }
        _walletShown = _balance;
        renderWallet();
        if (typeof hvRefresh === "function") hvRefresh();
      }

      // Клик по балансу → «Хотите обнулить баланс?» (lastSolved не трогаем)
      function walletAskReset() {
        askConfirm(
          {
            icon: coinSvg(30),
            title: "RESET YOUR BALANCE?",
            yes: "YES",
            no: "NO",
          },
          () => {
            const wiped = _balance;
            _balance = 0;
            _walletShown = 0;
            saveWallet();
            if (wiped > 0) walletLog({ type: "reset", amount: wiped, balance: 0 });
            renderWallet();
            walletBump();
          },
        );
      }

      // ── Шкала "нужды": сколько суток прошло с lastSolved ──
      function walletNeedDays(key) {
        const t = _solved[key];
        return t == null ? null : Math.max(0, (Date.now() - t) / DAY_MS);
      }
      // для сортировки: ни разу не решённые НЕ нуждаются в повторе — самый низ нужды (-1)
      const walletNeedSort = (key) => {
        const d = walletNeedDays(key);
        return d == null ? -1 : d;
      };
      function mkNeedMeter(key, diff) {
        const d = walletNeedDays(key);
        if (d == null) {
          return `<span class="need-meter need-new" title="Ещё не решена"><i></i></span>`;
        }
        const lvl = d >= NEED_DAYS ? "crit" : d >= 5 ? "hot" : d >= 3 ? "warn" : "ok";
        const pct = Math.min(100, (d / NEED_DAYS) * 100).toFixed(1);
        const days = d.toFixed(1);
        const p = walletPayout(diff, d);
        const tip = `Решена ${days} дн. назад · сейчас принесла бы +${fmtCoins(p.net)} (${fmtCoins(p.gross)} − комиссия ${p.feePct}%)`;
        return `<span class="need-meter n-${lvl}" title="${tip}"><i><b style="width:${pct}%"></b></i></span>`;
      }

      // Net reward one solve of this task would pay right now (0 if never solved —
      // the first solve is free). Used for sorting by reward.
      function walletReward(key, diff) {
        const d = walletNeedDays(key);
        return d == null ? 0 : walletPayout(diff || 1, d).net;
      }

      // Coins harvestable from this task right now (net of the commission), shown
      // right of the meter in the task list. Never-solved tasks → empty placeholder
      // (keeps the columns aligned).
      function mkHarvestAmount(key, diff) {
        const d = walletNeedDays(key);
        if (d == null) return '<span class="hv-row"></span>';
        const p = walletPayout(diff, d);
        const cls = p.net < 0.01 ? "hv-row zero" : "hv-row";
        return `<span class="${cls}" title="Harvestable now: +${fmtCoins(p.net)}">${coinSvg(12)}<b>${fmtCoins(p.net)}</b></span>`;
      }

      // Reward the player would get right now for solving the OPEN task, shown right
      // of the difficulty stars in the task breadcrumb (#task-reward). First solve is
      // free (0); without STRICT there is no payout, so the amount is dimmed.
      function walletRenderTaskReward() {
        const el = document.getElementById("task-reward");
        if (!el || typeof curTask === "undefined" || !curTask) return;
        const cat = curCat();
        if (!cat) return;
        const d = walletNeedDays(`${cat.id}/${curTask.id}`);
        let net = 0,
          tip;
        if (d == null) {
          tip = "First solve is free — it only starts the timer";
        } else {
          const p = walletPayout(curTask.diff || 1, d);
          net = p.net;
          tip = `Reward for solving now: +${fmtCoins(p.net)} (${fmtCoins(p.gross)} − ${p.feePct}% fee)`;
        }
        if (!_strictOn) tip += " · STRICT is off: no reward";
        el.className =
          "breadc-reward" + (net < 0.01 ? " zero" : "") + (_strictOn ? "" : " off");
        el.title = tip;
        el.innerHTML = `${coinSvg(12)}<b>${fmtCoins(net)}</b>`;
      }
      // the reward grows with time — keep it fresh while a task is open
      setInterval(() => {
        if (view === "task") walletRenderTaskReward();
      }, 5000);

      // init
      (function () {
        const c = document.getElementById("wallet-coin");
        if (c) c.innerHTML = coinSvg(22);
        renderWallet();
      })();
