      // ═══════════ DB: EXPORT / IMPORT + CONFIRM MODAL ═══════════
      // "База" = всё, что приложение хранит в localStorage под префиксом gr_
      // (баланс gr_wallet, даты решений gr_solved, размер шрифта gr_fontsize).

      // ── Универсальная модалка подтверждения (Да / Нет) ──
      let _confirmYes = null;
      let _confirmNo = null; // runs ONLY when the NO button is clicked (not on Esc / backdrop)
      function askConfirm({ icon = "", title, body, yes = "ДА", no = "НЕТ" }, onYes, onNo) {
        document.getElementById("confirm-ico").innerHTML = icon;
        document.getElementById("confirm-title").textContent = title;
        const bodyEl = document.getElementById("confirm-body");
        bodyEl.textContent = body || "";
        bodyEl.style.display = body ? "" : "none"; // title-only modals (balance reset)
        document.getElementById("confirm-modal").classList.toggle("no-body", !body);
        document.getElementById("confirm-yes").textContent = yes;
        document.getElementById("confirm-no").textContent = no;
        _confirmYes = onYes;
        _confirmNo = onNo || null;
        document.getElementById("confirm-modal").classList.remove("hide");
        playClick();
      }
      // accept=true → YES. accept=false + viaNoButton → the NO button (runs onNo);
      // accept=false alone → cancel (Esc / backdrop): nothing runs.
      function closeConfirm(accept, viaNoButton) {
        const fn = accept ? _confirmYes : viaNoButton ? _confirmNo : null;
        _confirmYes = null;
        _confirmNo = null;
        document.getElementById("confirm-modal").classList.add("hide");
        playClick();
        if (fn) fn();
      }
      document.getElementById("confirm-modal").addEventListener("click", (e) => {
        if (e.target === e.currentTarget) closeConfirm(false);
      });

      // кнопка мигает результатом и возвращает подпись
      function dbFlash(id, text, ms = 1600) {
        const b = document.getElementById(id);
        if (!b) return;
        if (!b.dataset.label) b.dataset.label = b.textContent;
        b.textContent = text;
        clearTimeout(b._t);
        b._t = setTimeout(() => (b.textContent = b.dataset.label), ms);
      }

      // ── Export ──
      // EXPORT button → "Include transaction history?" → YES / NO both export
      // (Esc / backdrop cancels the export).
      function exportDb() {
        const n = _history.length;
        askConfirm(
          {
            icon: "⇩",
            title: "EXPORT DATABASE",
            body: `Include the transaction history? (${n} transaction${n === 1 ? "" : "s"} recorded)`,
            yes: "YES",
            no: "NO",
          },
          () => doExport(true),
          () => doExport(false),
        );
      }
      function doExport(includeHistory) {
        saveWallet(); // сбросить в localStorage актуальные значения из памяти
        const data = {};
        try {
          for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (!k || !k.startsWith("gr_")) continue;
            if (k === HISTORY_KEY && !includeHistory) continue;
            const raw = localStorage.getItem(k);
            try {
              data[k] = JSON.parse(raw);
            } catch (e) {
              data[k] = raw;
            }
          }
        } catch (e) {}
        const payload = {
          app: "grid-runner",
          version: 1,
          exportedAt: new Date().toISOString(),
          includesHistory: !!includeHistory,
          data,
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], {
          type: "application/json",
        });
        const d = new Date(),
          p = (n) => String(n).padStart(2, "0");
        const name = `grid-runner-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}.json`;
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 2000);
        playClick();
        dbFlash("btn-export", "✓ EXPORTED");
      }

      // ── Import ──
      function importDb() {
        playClick();
        document.getElementById("db-file").click();
      }

      // возвращает текст ошибки или null
      function dbValidate(parsed) {
        if (!parsed || parsed.app !== "grid-runner" || typeof parsed.data !== "object" || !parsed.data)
          return "not a grid-runner export";
        const d = parsed.data;
        for (const k of Object.keys(d)) if (!k.startsWith("gr_")) return "bad key " + k;
        if ("gr_wallet" in d && !(Number.isFinite(d.gr_wallet) && d.gr_wallet >= 0))
          return "bad gr_wallet";
        if ("gr_solved" in d) {
          const s = d.gr_solved;
          if (!s || typeof s !== "object" || Array.isArray(s)) return "bad gr_solved";
          if (!Object.values(s).every((v) => Number.isFinite(v))) return "bad gr_solved";
        }
        if ("gr_rank" in d) {
          const r = d.gr_rank;
          if (!r || typeof r !== "object" || Array.isArray(r)) return "bad gr_rank";
          if (!Object.values(r).every((v) => Number.isFinite(v) && v >= 0)) return "bad gr_rank";
        }
        if ("gr_history" in d) {
          const h = d.gr_history;
          if (
            !Array.isArray(h) ||
            !h.every((e) => e && Number.isFinite(e.t) && typeof e.type === "string")
          )
            return "bad gr_history";
        }
        return null;
      }

      function dbApply(data) {
        try {
          // полная замена: сначала чистим текущую базу, потом пишем импортированную
          localStorage.removeItem(WALLET_KEY);
          localStorage.removeItem(SOLVED_KEY);
          localStorage.removeItem(RANK_KEY);
          localStorage.removeItem(HISTORY_KEY); // history is replaced too (empty if the file has none)
          for (const [k, v] of Object.entries(data))
            localStorage.setItem(k, typeof v === "string" ? v : JSON.stringify(v));
        } catch (e) {}
        walletReloadFromStorage();
        const fz = parseInt(localStorage.getItem(FZ_KEY), 10);
        if (fz >= FZ_MIN && fz <= FZ_MAX) {
          _fz = fz;
          applyFZ();
        }
        if (_vsCat) renderRows(); // обновить шкалы нужды
        dbFlash("btn-import", "✓ IMPORTED");
      }

      document.getElementById("db-file").addEventListener("change", async (e) => {
        const file = e.target.files[0];
        e.target.value = ""; // тот же файл можно выбрать повторно
        if (!file) return;
        let parsed;
        try {
          parsed = JSON.parse(await file.text());
        } catch (err) {
          return dbFlash("btn-import", "✗ BAD JSON");
        }
        const bad = dbValidate(parsed);
        if (bad) return dbFlash("btn-import", "✗ " + bad.toUpperCase(), 2600);
        const w = parsed.data.gr_wallet,
          n = Object.keys(parsed.data.gr_solved || {}).length,
          h = (parsed.data.gr_history || []).length;
        const histNote =
          "gr_history" in parsed.data
            ? ` История транзакций: ${h}.`
            : " В файле нет истории транзакций — текущая история будет очищена.";
        askConfirm(
          {
            icon: "⇧",
            title: "IMPORT DATABASE",
            body: `Текущие баланс и даты решений будут заменены данными из файла (баланс: ${w != null ? fmtCoins(w) : "—"}, задач с датой: ${n}).${histNote} Продолжить?`,
            yes: "ДА",
            no: "НЕТ",
          },
          () => dbApply(parsed.data),
        );
      });
