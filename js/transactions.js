      // ═══════════ TRANSACTIONS MODAL ═══════════
      // Opened by the safe icon on the HARVEST button. Shows gr_history (_history),
      // newest first: solves, manual withdrawals / deposits, legacy resets and,
      // optionally, rank changes. Entry formats are documented in js/wallet.js.
      const TX_MAX_ROWS = 500;

      const txModal = document.getElementById("tx-modal");
      const txPad = (n) => String(n).padStart(2, "0");
      function txDate(ms) {
        const d = new Date(ms);
        return `${d.getFullYear()}-${txPad(d.getMonth() + 1)}-${txPad(d.getDate())} ${txPad(d.getHours())}:${txPad(d.getMinutes())}`;
      }
      const txEsc = (s) =>
        String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
      const txTask = (key) => txEsc(String(key || "").split("/").pop().toUpperCase());
      const txSigned = (n) => (n > 0 ? "+" : n < 0 ? "−" : "") + fmtCoins(Math.abs(n));

      // one history entry → { label, detail, delta, balance, cls } (null = not shown)
      function txRow(e, showRank) {
        switch (e.type) {
          case "solve":
            if (e.first)
              return { label: "FIRST CLEAR", detail: txTask(e.task), delta: 0, balance: e.balance, cls: "muted" };
            return {
              label: "SOLVE",
              detail: `${txTask(e.task)}${e.days != null ? ` · ${fmtCoins(e.days)} d` : ""}`,
              delta: e.net,
              balance: e.balance,
              cls: e.net > 0 ? "in" : "muted",
            };
          case "withdraw":
            return { label: "WITHDRAW", detail: e.comment ? txEsc(e.comment) : "", delta: -e.amount, balance: e.balance, cls: "out" };
          case "deposit":
            return { label: "DEPOSIT", detail: e.comment ? txEsc(e.comment) : "", delta: e.amount, balance: e.balance, cls: "in" };
          case "reset":
            return { label: "RESET", detail: "", delta: -e.amount, balance: e.balance, cls: "out" };
          case "rank":
            if (!showRank) return null;
            return {
              label: "RANK",
              detail: `${txTask(e.task)} · ${e.from} → ${e.to} (${txEsc(e.reason)})`,
              delta: null,
              balance: null,
              cls: e.to > e.from ? "rank-up" : "rank-down",
            };
          default:
            return { label: txEsc(String(e.type).toUpperCase()), detail: "", delta: null, balance: null, cls: "muted" };
        }
      }

      function txRender() {
        const showRank = document.getElementById("tx-rank").checked;
        document.getElementById("tx-balance").textContent = fmtCoins(_balance);
        const rows = [];
        for (let i = _history.length - 1; i >= 0; i--) {
          const r = txRow(_history[i], showRank);
          if (r) rows.push({ t: _history[i].t, ...r });
        }
        const list = document.getElementById("tx-list");
        if (!rows.length) {
          list.innerHTML = '<div class="tx-empty">// NO TRANSACTIONS YET //</div>';
          return;
        }
        const shown = rows.slice(0, TX_MAX_ROWS);
        list.innerHTML =
          shown
            .map(
              (r) =>
                `<div class="tx-row ${r.cls}"><span class="tx-t">${txDate(r.t)}</span><span class="tx-l">${r.label}</span><span class="tx-d" title="${r.detail.replace(/<[^>]*>/g, "")}">${r.detail}</span><span class="tx-a">${r.delta == null ? "" : txSigned(r.delta)}</span><span class="tx-b">${r.balance == null ? "" : fmtCoins(r.balance)}</span></div>`,
            )
            .join("") +
          (rows.length > shown.length
            ? `<div class="tx-empty">${rows.length - shown.length} older entries not shown</div>`
            : "");
      }

      function txOpen() {
        txRender();
        txModal.classList.remove("hide");
        document.getElementById("tx-list").scrollTop = 0;
        playClick();
      }
      function txClose() {
        txModal.classList.add("hide");
        playClick();
      }
      document.getElementById("tx-rank").addEventListener("change", txRender);
      txModal.addEventListener("click", (e) => {
        if (e.target === e.currentTarget) txClose();
      });
