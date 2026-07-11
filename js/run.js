      // ═══════════ FORMAT & RUN ═══════════
      async function formatAndRun() {
        if (!curTask || view !== "task") return;
        const key = `${curCat().id}/${curTask.id}`;
        const files = FILECACHE[key];
        if (!files) {
          setStatus("⚠ Files not loaded", "err");
          return;
        }
        playRunStart();
        if (curTab !== "ed") switchTab("ed");
        const btn = document.getElementById("run-btn");
        btn.classList.add("go");
        btn.textContent = "⟳ RUNNING";
        let code = editor ? editor.getValue() : solCode;
        setStatus("⟳ Formatting...");
        const f = fmt(code);
        if (f.ok) {
          code = f.code;
          solCode = code;
          CODE[key] = code;
          _editorLoading = true;
          if (editor) {
            const pos = editor.getPosition();
            editor.setValue(code);
            if (pos) editor.setPosition(pos);
          }
          _editorLoading = false;
          setStatus("✓ Formatted", "ok");
        } else {
          setStatus("⚠ Format skipped: " + f.err.split("\n")[0], "err");
        }
        document.getElementById("res-body").innerHTML =
          `<div class="res-empty"><div style="font-size:1.2rem;animation:blk .36s infinite alternate">⟳</div><div>EXECUTING...</div></div>`;
        document.getElementById("res-sum").innerHTML = "";
        const r = await runWorker(code, files.spec);

        // ── Strict mode: multi-run benchmark ──────────────────────────
        let benchData = null;
        if (_strictOn && files.sol && !r.error) {
          const MAX_RUNS = 100,
            TIME_LIMIT = 5000;
          setStatus("⚡ STRICT — benchmarking reference…");
          btn.textContent = "⟳ REF";
          benchData = await runBenchmark(
            files.sol,
            code,
            files.spec,
            MAX_RUNS,
            TIME_LIMIT,
            () => {
              setStatus("⚡ STRICT — benchmarking your solution…");
              btn.textContent = "⟳ USR";
            },
          );
        }

        btn.classList.remove("go");
        btn.textContent = "▶ RUN";
        renderResults(r, benchData);
        openMobResults();
        if (!r.error) {
          const all = Object.values(r.suites).flat();
          const st =
            all.length > 0 && all.every((t) => t.status === "pass")
              ? "ok"
              : all.some((t) => t.status !== "pass")
                ? "ng"
                : "";
          if (st) STATUS[key] = st;
          if (st === "ok") playAllPass();
          else if (st === "ng") playFail();
        } else playError();
        setStatus("");
      }

      // ── Multi-run benchmark dispatcher ──────────────────────────────
      function runBenchmark(
        refSol,
        userSol,
        spec,
        maxRuns,
        timeLimit,
        onUserPhase,
      ) {
        return new Promise((res) => {
          const w = new Worker(getWkUrl());
          const dead = setTimeout(
            () => {
              w.terminate();
              res(null);
            },
            timeLimit * 2 + 4000,
          );
          w.onmessage = (e) => {
            const d = e.data;
            if (!d || d.error) {
              clearTimeout(dead);
              w.terminate();
              res(null);
              return;
            }
            if (d.type === "ref_done") {
              onUserPhase && onUserPhase();
              return;
            }
            if (d.type === "bench_done") {
              clearTimeout(dead);
              w.terminate();
              res({
                userMinTime: d.userMinTime,
                userRuns: d.userRuns,
                refMinTime: d.refMinTime,
                refRuns: d.refRuns,
              });
            }
          };
          w.onerror = () => {
            clearTimeout(dead);
            w.terminate();
            res(null);
          };
          w.postMessage({
            mode: "benchmark",
            sol: userSol,
            refSol,
            spec,
            maxRuns,
            timeLimit,
          });
        });
      }

