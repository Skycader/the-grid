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
      function runWorker(sol, spec) {
        return new Promise((res) => {
          const w = new Worker(getWkUrl());
          const tid = setTimeout(() => {
            w.terminate();
            res({ error: "TIMEOUT (10s)", suites: {}, total: 10000 });
          }, 10000);
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

