      // ═══════════ DEMO ═══════════
      // A task with `demo: "<name>"` in its config gets a DEMO window above the test results: the page
      // demo/<name>.html in an iframe. After every RUN the app sends it the player's code; the page records
      // what the code does and plays it. A task without a demo has no window (the results use the whole column).
      let _demoName = null,
        _demoReady = false,
        _demoPending = null;

      function demoFrame() {
        return document.getElementById("demo-frame");
      }

      // called when a task is opened
      function demoOpen(task) {
        const pane = document.getElementById("demo-pane");
        const name = task && task.demo ? task.demo : null;
        if (name === _demoName) {
          if (name) demoSend(CODE[`${curCat().id}/${task.id}`] || "");
          return;
        }
        _demoName = name;
        _demoReady = false;
        _demoPending = null;
        pane.hidden = !name;
        demoFrame().src = name ? `demo/${name}.html` : "about:blank";
      }

      // called after a run: play the code of the player
      function demoRun(code) {
        if (!_demoName) return;
        demoSend(code);
      }

      // the code the player has open right now (Play in the demo asks for it; tests are not required)
      function demoPlayerCode() {
        if (typeof editor !== "undefined" && editor) return editor.getValue();
        return typeof solCode !== "undefined" ? solCode : "";
      }

      function demoSend(code) {
        if (!code) return;
        if (!_demoReady) {
          _demoPending = code;
          return;
        }
        demoFrame().contentWindow.postMessage({ type: "crane-run", code }, "*");
      }

      window.addEventListener("message", (e) => {
        if (e.source !== demoFrame().contentWindow) return;
        if (e.data && e.data.type === "crane-ready") {
          _demoReady = true;
          if (_demoPending) {
            const c = _demoPending;
            _demoPending = null;
            demoSend(c);
          }
        }
        // Play in the demo: the editor, never the reference solution
        if (e.data && e.data.type === "crane-want") demoSend(demoPlayerCode());
      });
