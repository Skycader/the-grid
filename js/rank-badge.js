      // ═══════════ RANK BADGE: the patch of a rank ═══════════
      // Two kinds of ranks share one set of 21 names and patches (docs/ranks.md):
      //   task   — the rank of a task is a number of days (walletRank);
      //   player — the level of the player (profileLevel), the PROFILE button.
      // The badge shows the PATCH of the rank — small squares — and a pointer over it shows a tooltip:
      // an icon with the number (days / level) and the name of the rank (EN · RU). A click opens the
      // RANKS window with all the ranks.
      //
      //   task:   a rank k (1-based) starts at round(1000 * ((k - 1) / 20) ^ 1.2) days;
      //           the 21st rank starts at 1000 days.
      //   player: the same ranges, as a level (the level is the average rank of all the tasks, weighted
      //           by 1 / (11 − difficulty), js/profile.js): the 21st rank starts at level 1000.
      const RANK_NAMES = [
        ["Recruit", "Рекрут"], ["Servant", "Слуга"], ["Apprentice", "Ученик"], ["Herald", "Вестник"],
        ["Initiate", "Посвящённый"], ["Hunter", "Охотник"], ["Warrior", "Воин"], ["Veteran", "Ветеран"],
        ["Master", "Мастер"], ["Assassin", "Ассасин"], ["Ghost", "Призрак"], ["Tracker", "Следопыт"],
        ["Shadow", "Тень"], ["The Last Shadow", "Последняя Тень"], ["Sentinel", "Страж"],
        ["Supreme Sentinel", "Верховный Страж"], ["Instructor", "Наставник"], ["Elder", "Старейшина"],
        ["High Elder", "Верховный Старейшина"], ["Overlord", "Властитель"],
        ["Supreme Overlord", "Верховный Властитель"],
      ];
      // the same names in Japanese (the clan is in Tokyo): kanji and romaji
      const RANK_JA = [
        "新兵 Shinpei", "従者 Jūsha", "見習い Minarai", "伝令 Denrei", "入門者 Nyūmonsha", "狩人 Kariudo",
        "戦士 Senshi", "古参兵 Kosanhei", "達人 Tatsujin", "暗殺者 Ansatsusha", "幽鬼 Yūki", "追跡者 Tsuisekisha",
        "影 Kage", "最後の影 Saigo no Kage", "哨兵 Shōhei", "大哨兵 Daishōhei", "師範 Shihan", "長老 Chōrō",
        "大長老 Daichōrō", "覇王 Haō", "覇帝 Hatei",
      ];
      // where each rank starts (a number of days / a level) and how a value is written
      const RANK_SCALES = {
        task: {
          start: Array.from({ length: 21 }, (_, n) => Math.round(1000 * Math.pow(n / 20, 1.2))),
          decimals: 0,
        },
        player: {
          start: Array.from({ length: 21 }, (_, n) => Math.round(1000 * Math.pow(n / 20, 1.2))),
          decimals: 1,
        },
      };
      // the patches: w white, y yellow, r red, k black, b blue; a string is a row of squares
      const RANK_PATCH = [
        ["w"], ["ww"], ["www"], ["y"], ["yy"], ["yyy"], ["yy", "yy"], ["yy", "yy", "yy"],
        ["yy", "yy", "rr"], ["yy", "rr", "rr"], ["rr", "rr", "rr"], ["k"], ["kk"], ["kkk"],
        ["kk", "kk"], ["kk", "kk", "kk"], ["kkk", "kkk"], ["kkk", "kkk", "kkk"],
        ["kkk", "kkk", "bbb"], ["kkk", "bbb", "bbb"], ["bbb", "bbb", "bbb"],
      ];

      // a value as it is written: whole days, a level with at most one decimal
      function rankFmt(v, kind = "task") {
        return RANK_SCALES[kind].decimals ? (Math.round(v * 10) / 10).toLocaleString("en-US", { maximumFractionDigits: 1 }) : String(Math.floor(v));
      }
      // 0-based index of the rank for a number of days / a level
      function rankStep(v, kind = "task") {
        const start = RANK_SCALES[kind].start;
        let k = 0;
        for (let i = 0; i < start.length; i++) if (v >= start[i]) k = i;
        return k;
      }
      // { step: 1..21, name: [ru, en], from, to (null for the last one) }
      function rankInfo(v, kind = "task") {
        const start = RANK_SCALES[kind].start;
        const k = rankStep(v, kind);
        const gap = RANK_SCALES[kind].decimals ? 0.1 : 1;
        return {
          step: k + 1,
          name: RANK_NAMES[k],
          from: start[k],
          to: k === start.length - 1 ? null : Math.round((start[k + 1] - gap) * 10) / 10,
        };
      }
      function rankPatchHtml(v, kind = "task") {
        return rankPatchStep(rankStep(v, kind));
      }
      // the patch of a rank by its 0-based step
      function rankPatchStep(k) {
        const rows = RANK_PATCH[k];
        const single = rows.length === 1 && rows[0].length === 1; // ◽ 🟨 ⬛: one bigger square
        return (
          '<span class="rk">' +
          rows
            .map((r) => '<span class="rk-r">' + [...r].map((c) => `<i class="${c}${single ? " one" : ""}"></i>`).join("") + "</span>")
            .join("") +
          "</span>"
        );
      }

      // the badge of the PLAYER (the level) for the PROFILE button; the task badge is mkRankBadge
      function mkPlayerBadge(level) {
        return `<span class="rank-badge${level > 0 ? "" : " zero"}" data-kind="player" data-rank="${level}" aria-label="Player level ${rankFmt(level, "player")}">${rankPatchHtml(level, "player")}</span>`;
      }

      // ── The modal with all the ranks: a click on a patch. The rank of the clicked task / player is marked. ──
      const rkModal = document.getElementById("rk-modal");
      function rkRange(k, kind) {
        const i = rankInfo(RANK_SCALES[kind].start[k], kind);
        return i.to === null ? `${rankFmt(i.from, kind)}+` : `${rankFmt(i.from, kind)} - ${rankFmt(i.to, kind)}`;
      }
      function rkOpen(value, kind = "task") {
        const start = RANK_SCALES[kind].start;
        const player = kind === "player";
        const cur = rankStep(value, kind);
        document.getElementById("rk-head-ico").innerHTML = rankIconSvg(22);
        const unit = player ? "level" : "days";
        const next =
          cur === start.length - 1
            ? "the highest rank"
            : `next: ${RANK_NAMES[cur + 1][0]} · ${RANK_NAMES[cur + 1][1]} at ${rankFmt(start[cur + 1], kind)} ${unit} (${rankFmt(start[cur + 1] - value, kind)} to go)`;
        const formula = player ? "<br><span>the level is the average rank of all the tasks, weighted by 1 / (11 − difficulty); 1000 = every task at the rank 1000</span>" : "";
        document.getElementById("rkm-now").innerHTML =
          `${player ? "Your level" : "This task"}: <b>${rankFmt(value, kind)}</b> ${player ? "" : "days "}→ <b>${RANK_NAMES[cur][0]} · ${RANK_NAMES[cur][1]}</b><br><span>${next}</span>${formula}`;
        // the progress inside the current rank: how far from its first value to the first value of the next
        const pct = cur === start.length - 1 ? 100 : Math.round(((value - start[cur]) / (start[cur + 1] - start[cur])) * 100);
        document.getElementById("rkm-list").innerHTML = RANK_NAMES.map(
          (nm, k) =>
            `<div class="rkm-row${k === cur ? " cur" : ""}"${k === cur ? ` style="--p:${pct}%" title="${pct}% of the way to the next rank"` : ""}><span class="rkm-n">${k + 1}</span><span class="rkm-p">${rankPatchStep(k)}</span><span class="rkm-nm">${nm[0]} <small>· ${nm[1]}</small></span><span class="rkm-ja">${RANK_JA[k]}</span><span class="rkm-d">${rkRange(k, kind)}</span></div>`,
        ).join("");
        rkRenderCalc(player);
        rkModal.classList.remove("hide");
        const row = rkModal.querySelector(".rkm-row.cur");
        if (row) row.scrollIntoView({ block: "center" });
        playClick();
      }
      // The level of the player, task by task (an expandable list): rank × weight of every solved task
      // and the sum. Hidden in the window of a task.
      function rkRenderCalc(player) {
        const el = document.getElementById("rkm-calc");
        el.hidden = !player;
        el.open = false;
        if (!player) return;
        const b = profileBreakdown();
        const f2 = (v) => v.toFixed(3); // 3 decimals: the rows add up to the level without a visible gap
        const pct = (v) => (v * 100).toFixed(2) + "%";
        const rows = b.rows
          .map((r) => `<div class="rkc-r"><span class="rkc-t">${r.name}</span><span class="rkc-d">${r.diff}</span><span class="rkc-w">${pct(r.weight)}</span><span class="rkc-k">${r.rank}</span><span class="rkc-p">${f2(r.points)}</span></div>`)
          .join("");
        el.innerHTML =
          `<summary>How the level is counted: ${rankFmt(b.level, "player")}</summary>` +
          `<div class="rkc-f">level = Σ rank × weight &nbsp;·&nbsp; weight = (1 / (11 − difficulty)) / S &nbsp;·&nbsp; S = ${b.S.toFixed(3)} (the sum over all ${b.rows.length + b.unsolved} tasks)</div>` +
          `<div class="rkc-r rkc-h"><span class="rkc-t">Task</span><span class="rkc-d">Diff</span><span class="rkc-w">Weight</span><span class="rkc-k">Rank</span><span class="rkc-p">Points</span></div>` +
          rows +
          `<div class="rkc-r rkc-u"><span class="rkc-t">${b.unsolved} unsolved tasks</span><span class="rkc-d"></span><span class="rkc-w">${pct(b.unsolvedWeight)}</span><span class="rkc-k">0</span><span class="rkc-p">0.000</span></div>` +
          `<div class="rkc-r rkc-s"><span class="rkc-t">Level</span><span class="rkc-d"></span><span class="rkc-w">100%</span><span class="rkc-k"></span><span class="rkc-p">${f2(b.level)}</span></div>`;
      }

      function rkClose() {
        rkModal.classList.add("hide");
        playClick();
      }
      rkModal.addEventListener("click", (e) => {
        if (e.target === e.currentTarget) rkClose();
      });
      // capture: a click on a patch must not open the task of the row / the profile it stands in
      document.addEventListener(
        "click",
        (e) => {
          const b = e.target.closest && e.target.closest(".rank-badge");
          if (!b) return;
          e.stopPropagation();
          e.preventDefault();
          rkOpen(+b.dataset.rank, b.dataset.kind || "task");
        },
        true,
      );

      // One floating tooltip for all the badges (a tooltip inside a row would be clipped by the
      // scrolling list): an icon with the number (the signal bars for a task, the profile for the
      // player) and the name of the rank.
      (function () {
        const tip = document.createElement("div");
        tip.id = "rk-tip";
        document.body.appendChild(tip);
        const hide = () => tip.classList.remove("show");
        document.addEventListener("mouseover", (e) => {
          const b = e.target.closest && e.target.closest(".rank-badge");
          if (!b) return hide();
          const kind = b.dataset.kind || "task";
          const nm = rankInfo(+b.dataset.rank, kind).name;
          const ico = kind === "player" ? txProfileSvg(12) : rankIconSvg(11);
          tip.innerHTML = `<span class="rk-t1">${ico}<b>${rankFmt(+b.dataset.rank, kind)}</b></span><span class="rk-t2">${kind === "player" ? nm[0] : `${nm[0]} · ${nm[1]}`}</span>`;
          tip.style.left = "0px";
          tip.style.top = "0px";
          const r = b.getBoundingClientRect(),
            t = tip.getBoundingClientRect();
          const x = Math.min(Math.max(4, r.left + r.width / 2 - t.width / 2), innerWidth - t.width - 4);
          const y = r.top - t.height - 7 >= 4 ? r.top - t.height - 7 : r.bottom + 7;
          tip.style.left = Math.round(x) + "px";
          tip.style.top = Math.round(y) + "px";
          tip.classList.add("show");
        });
        document.addEventListener("mousedown", hide);
        document.addEventListener("click", hide);
        window.addEventListener("scroll", hide, true);
      })();
