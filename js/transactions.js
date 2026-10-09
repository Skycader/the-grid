      // ═══════════ TRANSACTIONS MODAL ═══════════
      // Opened by the safe icon on the HARVEST button. A document-like table over
      // gr_history (_history): newest first, split into chapters by day (each day is a
      // tab / document spine). Columns:
      //   TIME  |  TASK (click → open it)  |  TASK RANK x → y  |  COINS +n (balance x → y)  |  OVERALL RANK x → y
      // Entry formats (balanceFrom, rankFrom/rankTo, levelFrom/levelTo) are documented in
      // js/wallet.js; entries written before that format get what can be derived.
      const TX_MAX_ROWS = 500;

      const txModal = document.getElementById("tx-modal");
      const txPad = (n) => String(n).padStart(2, "0");
      const txTime = (d) => `${txPad(d.getHours())}:${txPad(d.getMinutes())}`;
      const txDayKey = (d) => `${d.getFullYear()}-${txPad(d.getMonth() + 1)}-${txPad(d.getDate())}`;
      const txEsc = (s) =>
        String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
      const txSigned = (n) => (n > 0 ? "+" : n < 0 ? "−" : "") + fmtCoins(Math.abs(n));
      const txNum = (v) => (v == null ? null : Number(v));

      // "cat/task" → { cat, task } for every task of the catalog (to make task ids clickable)
      function txCatalog() {
        const map = {};
        MENU.forEach((top) => {
          const res = [];
          gatherAllTasks(top, res);
          res.forEach(({ cat, task }) => {
            map[`${cat.id}/${task.id}`] = { cat, task };
          });
        });
        return map;
      }

      // icons of the table: task rank (signal bars), coin, overall rank (avatar + bars)
      const txProfileSvg = (px) =>
        `<svg width="${px}" height="${px}" viewBox="0 0 32 32" aria-hidden="true"><circle cx="13" cy="10.5" r="4.8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M3.5 27C3.5 21 7.5 17.5 13 17.5C14.7 17.5 16.2 17.8 17.5 18.4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><g fill="currentColor"><rect x="19.5" y="23" width="2.4" height="4.5" rx=".5"/><rect x="23" y="19.5" width="2.4" height="8" rx=".5"/><rect x="26.5" y="16" width="2.4" height="11.5" rx=".5"/></g></svg>`;
      // the HARVEST safe, closed: the balance after the entry is locked in the safe
      const txSafeClosedSvg = (px) =>
        `<svg width="${px}" height="${px}" viewBox="0 0 32 32" aria-hidden="true"><rect x="4" y="5" width="24" height="22" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="8" y="9" width="16" height="14" rx="1" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".65"/><circle cx="16" cy="16" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M16 13.2V14.6M16 17.4V18.8M13.2 16H14.6M17.4 16H18.8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><rect x="8" y="27" width="3.5" height="2" fill="currentColor"/><rect x="20.5" y="27" width="3.5" height="2" fill="currentColor"/></svg>`;
      const TX_ICONS = {
        rank: () => rankIconSvg(11),
        lvl: () => txProfileSvg(13),
        coin: () => coinSvg(12),
      };
      // column headers get the same icons as the cells
      document.querySelector(".tx-head .tx-r").innerHTML = `<span class="tx-ico rank">${TX_ICONS.rank()}</span>TASK RANK`;
      document.querySelector(".tx-head .tx-c").innerHTML = `<span class="tx-ico coin">${TX_ICONS.coin()}</span>COINS (BALANCE)`;
      document.querySelector(".tx-head .tx-o").innerHTML = `<span class="tx-ico lvl">${TX_ICONS.lvl()}</span>OVERALL RANK`;

      // "x → y" cell with the icon of its column (coins carry theirs on the amount instead): grew = violet, fell = orange, equal = dim;
      // blank when unknown
      function txArrow(from, to, fmt, cls) {
        if (from == null || to == null || Number.isNaN(from) || Number.isNaN(to)) return '<span class="tx-na">—</span>';
        const dir = to > from ? "up" : to < from ? "down" : "same";
        return `<span class="tx-arrow ${cls} ${dir}">${cls === "coin" ? "" : `<span class="tx-ico ${cls}">${TX_ICONS[cls]()}</span>`}${fmt(from)}<i>→</i>${fmt(to)}${cls === "coin" ? `<span class="tx-ico safe" title="Balance">${txSafeClosedSvg(15)}</span>` : ""}</span>`;
      }
      // the coin next to an earned / spent amount
      const txAmtIcon = `<span class="tx-ico coin">${coinSvg(12)}</span>`;

      // balance before the entry: stored, or derived for entries from the old format
      function txBalanceFrom(e) {
        if (e.balanceFrom != null) return e.balanceFrom;
        if (e.balance == null) return null;
        if (e.type === "solve") return round2(e.balance - (e.net || 0));
        if (e.type === "withdraw") return round2(e.balance + e.amount);
        if (e.type === "deposit") return round2(e.balance - e.amount);
        if (e.type === "reset") return e.amount;
        return e.balance;
      }

      // one history entry → the five cells of a table row
      function txRow(e, catalog) {
        const rankFrom = txNum(e.rankFrom ?? e.from),
          rankTo = txNum(e.rankTo ?? e.to);
        const balFrom = txBalanceFrom(e),
          balTo = e.balance ?? null;
        const taskKey = e.task;
        const hit = taskKey ? catalog[taskKey] : null;
        const taskName = taskKey ? txEsc(taskKey.split("/").pop().toUpperCase()) : "";
        const taskCell = taskKey
          ? hit
            ? `<a class="tx-task" data-key="${txEsc(taskKey)}" title="Open ${taskName}">${taskName}</a>`
            : `<span class="tx-task gone" title="This task is no longer in the catalog">${taskName}</span>`
          : "";
        let cell1 = taskCell,
          coins = "",
          cls = "";
        switch (e.type) {
          case "solve": {
            const net = e.net || 0;
            cls = net > 0 ? "in" : "muted";
            coins = `<b class="tx-amt ${net > 0 ? "in" : ""}">${e.first ? "first clear" : txSigned(net) + txAmtIcon}</b>${txArrow(balFrom, balTo, fmtCoins, "coin")}`;
            break;
          }
          case "withdraw":
          case "deposit": {
            const out = e.type === "withdraw";
            cls = out ? "out" : "in";
            cell1 = `<span class="tx-evt ${cls}">${out ? "WITHDRAW" : "DEPOSIT"}</span>${e.comment ? `<em class="tx-note" title="${txEsc(e.comment)}">${txEsc(e.comment)}</em>` : ""}`;
            coins = `<b class="tx-amt ${cls}">${txSigned(out ? -e.amount : e.amount)}${txAmtIcon}</b>${txArrow(balFrom, balTo, fmtCoins, "coin")}`;
            break;
          }
          case "reset":
            cls = "out";
            cell1 = '<span class="tx-evt out">RESET</span>';
            coins = `<b class="tx-amt out">${txSigned(-e.amount)}${txAmtIcon}</b>${txArrow(balFrom, balTo, fmtCoins, "coin")}`;
            break;
          case "rank":
            cls = "rank";
            coins = `<span class="tx-note">${e.reason === "solution" ? "solution viewed" : "rank change"}</span>`;
            break;
          default:
            cell1 = `<span class="tx-evt">${txEsc(String(e.type).toUpperCase())}</span>`;
        }
        const rankCell = rankFrom == null ? '<span class="tx-na">—</span>' : txArrow(rankFrom, rankTo, String, "rank");
        const lvlCell = txArrow(txNum(e.levelFrom), txNum(e.levelTo), fmtCoins, "lvl");
        return { cls, cells: [txTime(new Date(e.t)), cell1, rankCell, coins, lvlCell] };
      }

      function txRender() {
        document.getElementById("tx-balance").textContent = fmtCoins(_balance);
        const list = document.getElementById("tx-list");
        if (!_history.length) {
          list.innerHTML = '<div class="tx-empty">// NO TRANSACTIONS YET //</div>';
          return;
        }
        const catalog = txCatalog();
        const shown = Math.min(_history.length, TX_MAX_ROWS);
        let html = "",
          day = null;
        for (let n = 0; n < shown; n++) {
          const e = _history[_history.length - 1 - n];
          const d = new Date(e.t);
          const key = txDayKey(d);
          if (key !== day) {
            if (day !== null) html += "</div></section>";
            day = key;
            const wd = d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
            html += `<section class="tx-day"><div class="tx-tab"><b>${key}</b><i>${wd}</i></div><div class="tx-rows">`;
          }
          const r = txRow(e, catalog);
          html += `<div class="tx-row ${r.cls}"><span class="tx-t">${r.cells[0]}</span><span class="tx-k">${r.cells[1]}</span><span class="tx-r">${r.cells[2]}</span><span class="tx-c">${r.cells[3]}</span><span class="tx-o">${r.cells[4]}</span></div>`;
        }
        html += "</div></section>";
        if (_history.length > shown)
          html += `<div class="tx-empty">${_history.length - shown} older entries not shown</div>`;
        list.innerHTML = html;
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
      // the history button on the home screen (the safe icon on HARVEST opens it too)
      document.getElementById("tx-btn").addEventListener("click", txOpen);
      // click on a task id → close the modal and open that task
      document.getElementById("tx-list").addEventListener("click", (ev) => {
        const a = ev.target.closest(".tx-task[data-key]");
        if (!a) return;
        const hit = txCatalog()[a.dataset.key];
        if (!hit) return;
        txModal.classList.add("hide");
        navigateToTask(hit.cat, hit.task);
      });
      txModal.addEventListener("click", (e) => {
        if (e.target === e.currentTarget) txClose();
      });
