      // ═══════════ RANK PROGRESS: the rank of a task over time ═══════════
      // The PROGRESS tab of the RANKS window of a task (js/rank-badge.js). Vertical bars on a time axis: the dates
      // from the first solve to today on the horizontal axis, the rank (days) on the vertical one. One bar is one
      // DAY on which something happened to the rank, with the rank at the end of that day; the empty space is the
      // days when it did not change. A day that ended with the rank wiped (the solution was viewed) is a red bar:
      // its height is what was lost. The thin lines are the starts of the ranks (RANK_SCALES), so the height
      // reads as a rank, not only as a number.
      // The points come from the transaction log (walletRankSeries, js/wallet.js).
      const RKP_DAY = 86400000;
      const rkpDay = (t) => {
        const d = new Date(t);
        return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      };
      const rkpDate = (t) => {
        const d = new Date(t);
        return String(d.getDate()).padStart(2, "0") + "." + String(d.getMonth() + 1).padStart(2, "0") + "." + d.getFullYear();
      };
      // the log grouped by day: { day, from, to, shown (the height of the bar), wipe (the day ends with a wipe), solves }
      function rkpDays(key) {
        const out = [];
        let prev = 0;
        for (const e of walletRankSeries(key)) {
          const day = rkpDay(e.t);
          let g = out[out.length - 1];
          if (!g || g.day !== day) {
            g = { day, from: e.from ?? prev, to: 0, shown: 0, wipe: false, wiped: 0, solves: 0, lost: 0 };
            out.push(g);
          }
          if (e.wipe) {
            g.wiped++;
            g.lost = e.from;
          } else g.solves++;
          g.wipe = e.wipe;
          g.to = e.to;
          prev = e.to;
        }
        for (const g of out) g.shown = g.wipe ? g.lost : g.to;
        return out;
      }
      function rkpTip(g) {
        const lines = [rkpDate(g.day)];
        if (g.solves) lines.push(`${g.solves} ${g.solves === 1 ? "solve" : "solves"}`);
        if (g.wipe) lines.push(`solution viewed: rank ${rankFmt(g.lost)} → 0 days`);
        else {
          lines.push(`rank ${rankFmt(g.from)} → ${rankFmt(g.to)} days`);
          if (g.wiped) lines.push("(the rank was wiped earlier that day)");
        }
        return lines.join("\n");
      }
      // draws the chart of the task into #rkm-prog; returns the number of the days on the chart
      function rkpRender(key) {
        const el = document.getElementById("rkm-prog");
        const days = rkpDays(key);
        if (!days.length) {
          el.innerHTML = '<div class="rkg-empty">Nothing to draw yet: the chart starts with the first counted solve of this task.</div>';
          return 0;
        }
        const t0 = days[0].day;
        const t1 = Math.max(days[days.length - 1].day, rkpDay(Date.now()));
        const span = t1 - t0;
        const peak = Math.max(1, ...days.map((g) => g.shown));
        const ymax = Math.ceil(peak * 1.1);
        // a bar is as wide as the days allow: 12 px at most, 4 px at least
        const bw = Math.max(4, Math.min(12, Math.floor((520 / (span / RKP_DAY + 1)) * 0.8)));
        const start = RANK_SCALES.task.start;
        const tiers = [];
        for (let k = 1; k < start.length && start[k] <= ymax; k++)
          tiers.push(`<div class="rkg-tier" style="bottom:${(start[k] / ymax) * 100}%"><span>${RANK_NAMES[k][0]}</span></div>`);
        const bars = days
          .map((g) => {
            const x = span ? (g.day - t0) / span : 0.5;
            const h = Math.max((g.shown / ymax) * 100, 0);
            return `<div class="rkg-bar${g.wipe ? " wipe" : ""}" style="--x:${x};--h:${h}%" title="${rkpTip(g)}"></div>`;
          })
          .join("");
        const wipes = days.reduce((a, g) => a + g.wiped, 0);
        const ticks = span ? [0, 0.5, 1] : [0.5];
        const labels = ticks.map((f, i) => `<span style="--x:${f}"${i === 0 && span ? ' class="l"' : i === ticks.length - 1 && span ? ' class="r"' : ""}>${rkpDate(t0 + Math.round(span * f))}</span>`).join("");
        el.innerHTML =
          `<div class="rkg-sum"><b>${days.length}</b> ${days.length === 1 ? "day" : "days"} with a change · peak <b>${rankFmt(peak)}</b> days${wipes ? ` · wiped <b>${wipes}</b>×` : ""}</div>` +
          `<div class="rkg-chart" style="--bw:${bw}px">` +
          `<div class="rkg-y"><span style="bottom:100%">${ymax}</span><span style="bottom:0">0</span></div>` +
          `<div class="rkg-plot">${tiers.join("")}${bars}</div>` +
          `<div class="rkg-x">${labels}</div>` +
          `</div>` +
          `<div class="rkg-key"><i class="up"></i>rank at the end of the day <i class="wipe"></i>wiped: the solution was viewed (the bar is what was lost)</div>`;
        return days.length;
      }
