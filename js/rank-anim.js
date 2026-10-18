      // ═══════════ RANK-UP ANIMATION (a test, started from the console) ═══════════
      //   run("animation level-up +23 days")
      // A small plate appears under the rank of the open task and plays TWO bars one after the other:
      //   1. the rank of the TASK: a bar from the current rank (on the left) to the next one (on the
      //      right), it fills from the old number of days to the new one;
      //   2. the LEVEL of the PLAYER: the same, for the level (the level changes by the added days times the
      //      weight of the task, js/profile.js).
      // When a bar reaches its end the rank goes up (the plate flashes, the bar starts over in the next
      // rank). The data is NOT changed: it is only a picture.
      //
      // The ends of a bar are the first values of the current and of the next rank (docs/ranks.md); the
      // last rank has no next one, its bar is full.
      let _rkPlateRun = 0; // a new run cancels the previous one

      function rankAnimLevelUp(addDays) {
        if (!(addDays > 0)) return cliErr("the number of days must be positive");
        if (view !== "task" || !curTask) return cliErr("open a task first: the plate stands under its rank");
        const anchor = document.getElementById("task-rank");
        if (!anchor) return cliErr("this task has no rank on the bar");
        const key = `${curCat().id}/${curTask.id}`;

        // the two bars: the rank of the task (days) and the level of the player
        const bd = profileBreakdown();
        const lvFrom = bd.level,
          lvAdd = addDays * (profileWeight(curTask.diff) / bd.S),
          rkFrom = Math.floor(_rank[key] || 0);
        const bars = [
          { kind: "task", title: "TASK RANK", from: rkFrom, to: rkFrom + addDays, add: `+${addDays} days`, unit: "days" },
          { kind: "player", title: "PLAYER LEVEL", from: lvFrom, to: lvFrom + lvAdd, add: `+${lvAdd.toFixed(2)}`, unit: "level" },
        ];

        let plate = document.getElementById("rk-plate");
        if (!plate) {
          plate = document.createElement("div");
          plate.id = "rk-plate";
          document.body.appendChild(plate);
        }
        const run = ++_rkPlateRun;
        const side = (k, right) => {
          const nm = RANK_NAMES[k][0];
          return right ? `<span>${nm}</span>${rankPatchStep(k)}` : `${rankPatchStep(k)}<span>${nm}</span>`;
        };
        plate.innerHTML = bars
          .map(
            (b) =>
              `<div class="rkp-blk" data-kind="${b.kind}"><div class="rkp-top"><b class="rkp-title">${b.title}</b><b class="rkp-add">${b.add}</b><span class="rkp-val"></span></div>` +
              `<div class="rkp-row"><span class="rkp-side rkp-l"></span><span class="rkp-bar"><i class="rkp-fill"></i></span><span class="rkp-side rkp-r"></span></div></div>`,
          )
          .join("");
        const place = () => {
          const r = anchor.getBoundingClientRect();
          plate.style.left = Math.round(Math.max(4, Math.min(r.left, innerWidth - 324))) + "px";
          plate.style.top = Math.round(r.bottom + 8) + "px";
        };
        place();
        plate.classList.remove("up", "out");
        plate.classList.add("show");

        const wait = (ms) => new Promise((r) => setTimeout(r, ms));

        // one bar: fills from b.from to b.to inside the rank, goes up through the ends, returns false if cancelled
        async function playBar(b, blk) {
          const kind = b.kind,
            scale = RANK_SCALES[kind].start,
            last = scale.length - 1;
          const el = (c) => blk.querySelector(c);
          const setSides = (k) => {
            el(".rkp-l").innerHTML = side(k, false);
            el(".rkp-r").innerHTML = k === last ? "<span>MAX</span>" : side(k + 1, true);
          };
          const progress = (v, k) => (k === last ? 1 : Math.min(1, Math.max(0, (v - scale[k]) / (scale[k + 1] - scale[k]))));
          const setFill = (v, k) => {
            el(".rkp-fill").style.width = (progress(v, k) * 100).toFixed(2) + "%";
            el(".rkp-val").textContent = `${rankFmt(v, kind)} ${b.unit}`;
            place(); // the bar of the task can move (the fonts, the window): follow the rank
          };
          // a segment of the bar: from v0 to v1 inside the rank k, eased; the tone follows the progress
          const tween = (v0, v1, k, ms) =>
            new Promise((resolve) => {
              const t0 = performance.now();
              const ease = (x) => 1 - Math.pow(1 - x, 3);
              const stopTone = playRankCharge(ms, progress(v0, k), progress(v1, k), ease, kind === "player" ? 300 : 200);
              const tick = () => {
                if (run !== _rkPlateRun) {
                  stopTone();
                  return resolve(false);
                }
                const t = Math.min(1, (performance.now() - t0) / ms);
                setFill(v0 + (v1 - v0) * ease(t), k);
                if (t < 1) setTimeout(tick, 16);
                else resolve(true);
              };
              tick();
            });

          let v = b.from,
            k = rankStep(v, kind);
          setSides(k);
          setFill(v, k);
          blk.classList.add("on");
          await wait(450); // the block appears first
          while (run === _rkPlateRun) {
            const end = k === last ? Infinity : scale[k + 1];
            const seg = Math.min(b.to, end);
            const span = end === Infinity ? 1 : end - scale[k];
            const ms = 500 + 1000 * Math.min(1, (seg - v) / span);
            if (!(await tween(v, seg, k, ms))) return false;
            v = seg;
            if (v >= end && k < last) {
              // the rank goes up: a flash, the new rank on the left, the bar starts over
              k++;
              plate.classList.add("up");
              await wait(350);
              if (run !== _rkPlateRun) return false;
              plate.classList.remove("up");
              setSides(k);
              setFill(v, k);
              playRankUp();
              await wait(450);
            } else break;
          }
          return run === _rkPlateRun;
        }

        (async () => {
          const blocks = [...plate.querySelectorAll(".rkp-blk")];
          if (!(await playBar(bars[0], blocks[0]))) return;
          await wait(500);
          playNav(); // the second bar: the level of the player
          if (!(await playBar(bars[1], blocks[1]))) return;
          playRankDone();
          await wait(2600);
          if (run !== _rkPlateRun) return;
          plate.classList.add("out");
          plate.classList.remove("show");
        })();
        console.log(
          `%c✓ ${key}: rank ${rkFrom} → ${bars[0].to} days (${RANK_NAMES[rankStep(rkFrom)][0]} → ${RANK_NAMES[rankStep(bars[0].to)][0]}); player level ${lvFrom.toFixed(2)} → ${bars[1].to.toFixed(2)} (${RANK_NAMES[rankStep(lvFrom, "player")][0]} → ${RANK_NAMES[rankStep(bars[1].to, "player")][0]}); the data is not changed`,
          CLI_STYLE.ok,
        );
      }
