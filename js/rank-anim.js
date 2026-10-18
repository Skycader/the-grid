      // ═══════════ RANK-UP ANIMATION ═══════════
      // A small plate appears under the rank of the open task and plays TWO bars one after the other:
      //   1. the rank of the TASK: a bar from the current rank (on the left) to the next one (on the
      //      right), it fills from the old number of days to the new one;
      //   2. the LEVEL of the PLAYER: the same, for the level (js/profile.js).
      // When a bar reaches its end the rank goes up (the plate flashes, the bar starts over in the next
      // rank).
      //
      // It is played after a successful solve that counts (js/wallet.js, walletOnSolved) and from the
      // console as a test: run("animation level-up +23 days") — then the data is NOT changed.
      //
      // The ends of a bar are the first values of the current and of the next rank (docs/ranks.md); the
      // last rank has no next one, its bar is full.
      let _rkPlateRun = 0; // a new run cancels the previous one

      // { key, taskFrom, taskTo (days), levelFrom, levelTo }; false when there is nothing to show it under
      function rankAnimPlay({ key, taskFrom, taskTo, levelFrom, levelTo }) {
        if (view !== "task" || !curTask) return false;
        const anchor = document.getElementById("task-rank");
        if (!anchor) return false;

        // the two bars: the rank of the task (days) and the level of the player
        const addDays = taskTo - taskFrom,
          lvAdd = levelTo - levelFrom;
        const bars = [
          { kind: "task", title: "TASK RANK", from: taskFrom, to: taskTo, add: `+${addDays >= 1 ? Math.round(addDays) : addDays.toFixed(2)} days`, unit: "days" },
          { kind: "player", title: "PLAYER LEVEL", from: levelFrom, to: levelTo, add: `+${lvAdd.toFixed(2)}`, unit: "level" },
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
          if (view !== "task") {
            // the player left the task: the plate has nothing to stand under, stop it
            _rkPlateRun++;
            plate.classList.remove("show");
            return;
          }
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
        return true;
      }

      // the console test: run("animation level-up +23 days") — the current data plus N days, nothing is saved
      function rankAnimLevelUp(addDays) {
        if (!(addDays > 0)) return cliErr("the number of days must be positive");
        if (view !== "task" || !curTask) return cliErr("open a task first: the plate stands under its rank");
        if (!document.getElementById("task-rank")) return cliErr("this task has no rank on the bar");
        const key = `${curCat().id}/${curTask.id}`;
        const bd = profileBreakdown();
        const taskFrom = Math.floor(_rank[key] || 0),
          levelTo = bd.level + addDays * (profileWeight(curTask.diff) / bd.S);
        rankAnimPlay({ key, taskFrom, taskTo: taskFrom + addDays, levelFrom: bd.level, levelTo });
        console.log(
          `%c✓ ${key}: rank ${taskFrom} → ${taskFrom + addDays} days (${RANK_NAMES[rankStep(taskFrom)][0]} → ${RANK_NAMES[rankStep(taskFrom + addDays)][0]}); player level ${bd.level.toFixed(2)} → ${levelTo.toFixed(2)} (${RANK_NAMES[rankStep(bd.level, "player")][0]} → ${RANK_NAMES[rankStep(levelTo, "player")][0]}); the data is not changed`,
          CLI_STYLE.ok,
        );
      }
