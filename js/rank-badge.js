      // ═══════════ RANK BADGE: the patch of a rank ═══════════
      // The rank of a task is a number of days (walletRank). The badge shows the PATCH of the
      // rank — small squares, 21 steps (docs/ranks.md) — and a pointer over it shows a tooltip:
      // the signal-bars icon with the number of days and the name of the rank (RU · EN).
      //
      //   a rank k (1-based) starts at round(1000 * ((k - 1) / 20) ^ 1.2) days;
      //   the 21st rank starts at 1000 days.
      const RANK_NAMES = [
        ["Рекрут", "Recruit"], ["Слуга", "Servant"], ["Ученик", "Apprentice"], ["Вестник", "Herald"],
        ["Посвящённый", "Initiate"], ["Охотник", "Hunter"], ["Воин", "Warrior"], ["Ветеран", "Veteran"],
        ["Мастер", "Master"], ["Ассасин", "Assassin"], ["Призрак", "Phantom"], ["Следопыт", "Tracker"],
        ["Тень", "Shadow"], ["Последняя Тень", "The Last Shadow"], ["Страж", "Sentinel"],
        ["Верховный Страж", "Supreme Sentinel"], ["Наставник", "Instructor"], ["Старейшина", "Elder"],
        ["Верховный Старейшина", "High Elder"], ["Властитель", "Overlord"],
        ["Верховный Властитель", "Supreme Overlord"],
      ];
      // the same names in Japanese (the clan is in Tokyo): kanji and romaji
      const RANK_JA = [
        "新兵 Shinpei", "従者 Jūsha", "見習い Minarai", "伝令 Denrei", "入門者 Nyūmonsha", "狩人 Kariudo",
        "戦士 Senshi", "古参兵 Kosanhei", "達人 Tatsujin", "暗殺者 Ansatsusha", "幽鬼 Yūki", "追跡者 Tsuisekisha",
        "影 Kage", "最後の影 Saigo no Kage", "哨兵 Shōhei", "大哨兵 Daishōhei", "師範 Shihan", "長老 Chōrō",
        "大長老 Daichōrō", "覇王 Haō", "覇帝 Hatei",
      ];
      const RANK_START = Array.from({ length: 21 }, (_, n) => Math.round(1000 * Math.pow(n / 20, 1.2)));
      // the patches: w white, y yellow, r red, k black, b blue; a string is a row of squares
      const RANK_PATCH = [
        ["w"], ["ww"], ["www"], ["y"], ["yy"], ["yyy"], ["yy", "yy"], ["yy", "yy", "yy"],
        ["yy", "yy", "rr"], ["yy", "rr", "rr"], ["rr", "rr", "rr"], ["k"], ["kk"], ["kkk"],
        ["kk", "kk"], ["kk", "kk", "kk"], ["kkk", "kkk"], ["kkk", "kkk", "kkk"],
        ["kkk", "kkk", "bbb"], ["kkk", "bbb", "bbb"], ["bbb", "bbb", "bbb"],
      ];

      // 0-based index of the rank for a number of days
      function rankStep(days) {
        let k = 0;
        for (let i = 0; i < RANK_START.length; i++) if (days >= RANK_START[i]) k = i;
        return k;
      }
      // { step: 1..21, name: [ru, en], from, to (null for the last one) }
      function rankInfo(days) {
        const k = rankStep(days);
        return {
          step: k + 1,
          name: RANK_NAMES[k],
          from: RANK_START[k],
          to: k === RANK_START.length - 1 ? null : RANK_START[k + 1] - 1,
        };
      }
      function rankPatchHtml(days) {
        return rankPatchStep(rankStep(days));
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

      // ── The modal with all the ranks: a click on a patch. The rank of the clicked task is marked. ──
      const rkModal = document.getElementById("rk-modal");
      const rkRange = (k) => (k === RANK_START.length - 1 ? `${RANK_START[k]}+` : `${RANK_START[k]} - ${RANK_START[k + 1] - 1}`);
      function rkOpen(days) {
        const cur = rankStep(days);
        document.getElementById("rk-head-ico").innerHTML = rankIconSvg(22);
        const next =
          cur === RANK_START.length - 1
            ? "the highest rank"
            : `next: ${RANK_NAMES[cur + 1][0]} · ${RANK_NAMES[cur + 1][1]} at ${RANK_START[cur + 1]} days (${RANK_START[cur + 1] - days} to go)`;
        document.getElementById("rkm-now").innerHTML =
          `This task: <b>${days}</b> days → <b>${RANK_NAMES[cur][0]} · ${RANK_NAMES[cur][1]}</b><br><span>${next}</span>`;
        document.getElementById("rkm-list").innerHTML = RANK_NAMES.map(
          (nm, k) =>
            `<div class="rkm-row${k === cur ? " cur" : ""}"><span class="rkm-n">${k + 1}</span><span class="rkm-p">${rankPatchStep(k)}</span><span class="rkm-nm">${nm[0]} <small>· ${nm[1]}</small></span><span class="rkm-ja">${RANK_JA[k]}</span><span class="rkm-d">${rkRange(k)}</span></div>`,
        ).join("");
        rkModal.classList.remove("hide");
        const row = rkModal.querySelector(".rkm-row.cur");
        if (row) row.scrollIntoView({ block: "center" });
        playClick();
      }
      function rkClose() {
        rkModal.classList.add("hide");
        playClick();
      }
      rkModal.addEventListener("click", (e) => {
        if (e.target === e.currentTarget) rkClose();
      });
      // capture: a click on a patch must not open the task of the row it stands in
      document.addEventListener(
        "click",
        (e) => {
          const b = e.target.closest && e.target.closest(".rank-badge");
          if (!b) return;
          e.stopPropagation();
          e.preventDefault();
          rkOpen(+b.dataset.rank);
        },
        true,
      );

      // One floating tooltip for all the badges (a tooltip inside a row would be clipped by the
      // scrolling list): the signal-bars icon and the number of days.
      (function () {
        const tip = document.createElement("div");
        tip.id = "rk-tip";
        document.body.appendChild(tip);
        const hide = () => tip.classList.remove("show");
        document.addEventListener("mouseover", (e) => {
          const b = e.target.closest && e.target.closest(".rank-badge");
          if (!b) return hide();
          const nm = rankInfo(+b.dataset.rank).name;
          tip.innerHTML = `<span class="rk-t1">${rankIconSvg(11)}<b>${b.dataset.rank}</b></span><span class="rk-t2">${nm[0]} · ${nm[1]}</span>`;
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
