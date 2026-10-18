      // ═══════════ RANK-UP ANIMATION (a test, started from the console) ═══════════
      //   run("animation level-up +23 days")
      // A small plate appears under the rank of the open task: a progress bar from the current rank
      // (on the left) to the next one (on the right). The bar fills from the old number of days to the
      // new one; when it reaches the end the rank goes up (the plate flashes, the bar starts over in
      // the next rank). The data of the task is NOT changed: it is only a picture.
      //
      // The ends of the bar are the first days of the current and of the next rank (docs/ranks.md);
      // the last rank has no next one, its bar is full.
      let _rkPlateRun = 0; // a new run cancels the previous one

      function rankAnimLevelUp(addDays) {
        if (!(addDays > 0)) return cliErr("the number of days must be positive");
        if (view !== "task" || !curTask) return cliErr("open a task first: the plate stands under its rank");
        const anchor = document.getElementById("task-rank");
        if (!anchor) return cliErr("this task has no rank on the bar");
        const key = `${curCat().id}/${curTask.id}`;
        const from = Math.floor(_rank[key] || 0),
          to = from + addDays;

        let plate = document.getElementById("rk-plate");
        if (!plate) {
          plate = document.createElement("div");
          plate.id = "rk-plate";
          document.body.appendChild(plate);
        }
        const run = ++_rkPlateRun;
        const scale = RANK_SCALES.task.start;
        const side = (k, right) => {
          const nm = RANK_NAMES[k][0];
          return right ? `<span>${nm}</span>${rankPatchStep(k)}` : `${rankPatchStep(k)}<span>${nm}</span>`;
        };
        plate.innerHTML =
          `<div class="rkp-top"><b class="rkp-add">+${addDays} days</b><span class="rkp-val"></span></div>` +
          `<div class="rkp-row"><span class="rkp-side rkp-l"></span><span class="rkp-bar"><i class="rkp-fill"></i></span><span class="rkp-side rkp-r"></span></div>`;
        const el = (c) => plate.querySelector(c);
        const place = () => {
          const r = anchor.getBoundingClientRect();
          plate.style.left = Math.round(Math.max(4, Math.min(r.left, innerWidth - 324))) + "px";
          plate.style.top = Math.round(r.bottom + 8) + "px";
        };
        place();
        plate.classList.remove("up", "out");
        plate.classList.add("show");

        const setSides = (k) => {
          el(".rkp-l").innerHTML = side(k, false);
          el(".rkp-r").innerHTML = k === scale.length - 1 ? "<span>MAX</span>" : side(k + 1, true);
        };
        const setFill = (v, k) => {
          const a = scale[k],
            b = k === scale.length - 1 ? null : scale[k + 1];
          const p = b === null ? 1 : Math.min(1, Math.max(0, (v - a) / (b - a)));
          el(".rkp-fill").style.width = (p * 100).toFixed(2) + "%";
          el(".rkp-val").textContent = `${Math.floor(v)} days`;
          place(); // the bar of the task can move (the fonts, the window): follow the rank
        };

        // one segment of the bar: from v0 to v1 inside the rank k, eased, then the next one
        const wait = (ms) => new Promise((r) => setTimeout(r, ms));
        const tween = (v0, v1, k, ms) =>
          new Promise((resolve) => {
            const t0 = performance.now();
            // the tone rises with the bar: the pitch follows the progress inside the rank
            const a = scale[k],
              b = k === scale.length - 1 ? null : scale[k + 1];
            const prog = (v) => (b === null ? 1 : Math.min(1, Math.max(0, (v - a) / (b - a))));
            const stopTone = playRankCharge(ms, prog(v0), prog(v1), (x) => 1 - Math.pow(1 - x, 3));
            const tick = () => {
              if (run !== _rkPlateRun) {
                stopTone();
                return resolve(false);
              }
              const t = Math.min(1, (performance.now() - t0) / ms),
                e = 1 - Math.pow(1 - t, 3); // ease-out
              setFill(v0 + (v1 - v0) * e, k);
              if (t < 1) setTimeout(tick, 16);
              else resolve(true);
            };
            tick();
          });

        (async () => {
          let v = from,
            k = rankStep(v);
          setSides(k);
          setFill(v, k);
          await wait(450); // the plate appears first
          while (run === _rkPlateRun) {
            const end = k === scale.length - 1 ? Infinity : scale[k + 1];
            const seg = Math.min(to, end);
            const span = end === Infinity ? 1 : end - scale[k];
            const ms = 500 + 1000 * Math.min(1, (seg - v) / span);
            if (!(await tween(v, seg, k, ms))) return;
            v = seg;
            if (v >= end && k < scale.length - 1) {
              // the rank goes up: a flash, the new rank on the left, the bar starts over
              k++;
              plate.classList.add("up");
              await wait(350);
              if (run !== _rkPlateRun) return;
              plate.classList.remove("up");
              setSides(k);
              setFill(v, k);
              playRankUp();
              await wait(450);
            } else break;
          }
          if (k === rankStep(to) && to < (k === scale.length - 1 ? Infinity : scale[k + 1])) playRankDone();
          await wait(2600);
          if (run !== _rkPlateRun) return;
          plate.classList.add("out");
          plate.classList.remove("show");
        })();
        console.log(
          `%c✓ ${key}: rank ${from} → ${to} days (${RANK_NAMES[rankStep(from)][0]} → ${RANK_NAMES[rankStep(to)][0]}), the data is not changed`,
          CLI_STYLE.ok,
        );
      }
