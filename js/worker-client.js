      // ═══════════ WORKER ═══════════
      function getWkUrl() {
        if (!wkBlob) {
          const src = document.getElementById("wk").textContent;
          wkBlob = URL.createObjectURL(
            new Blob([src], { type: "application/javascript" }),
          );
        }
        return wkBlob;
      }
      // A run that takes longer than this is killed (catastrophic backtracking, infinite
      // loop): the player never waits more than ~3 s for a RUN.
      const RUN_TIMEOUT_MS = 3000;
      function runWorker(sol, spec) {
        return new Promise((res) => {
          const w = new Worker(getWkUrl());
          const tid = setTimeout(() => {
            w.terminate();
            res({ error: "TIMEOUT (3s)", suites: {}, total: RUN_TIMEOUT_MS });
          }, RUN_TIMEOUT_MS);
          w.onmessage = (e) => {
            clearTimeout(tid);
            w.terminate();
            res(e.data);
          };
          w.onerror = (e) => {
            clearTimeout(tid);
            w.terminate();
            res({ error: "Worker: " + e.message, suites: {}, total: 0 });
          };
          w.postMessage({ sol, spec });
        });
      }

