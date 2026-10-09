      // ═══════════ RENDER ═══════════
      function renderResults(r, benchData) {
        const body = document.getElementById("res-body"),
          sum = document.getElementById("res-sum");
        if (r.error) {
          body.innerHTML = `<div style="padding:11px"><div style="color:#dc322f;font-family:'JetBrains Mono',monospace;font-size:.74rem;border-left:2px solid #dc322f;padding-left:9px"><div style="margin-bottom:3px;color:#cb4b16">⚠ ERROR</div><div style="white-space:pre-wrap;color:#a93020">${esc(r.error)}</div></div></div>`;
          sum.innerHTML = `<span class="bf">✗ ERROR</span>`;
          return;
        }
        const suites = r.suites || {},
          all = Object.values(suites).flat();
        const pass = all.filter((t) => t.status === "pass").length,
          fail = all.filter((t) => t.status !== "pass").length;
        const mems = all.map((t) => t.mem).filter((m) => m != null);
        const totalMem = mems.length ? mems.reduce((a, b) => a + b, 0) : null;
        const memStr = totalMem != null ? fmtB(totalMem) : "";

        // Strict banner (STRICT_TOLERANCE = 10%)
        let strictBanner = "";
        if (_strictOn && benchData) {
          const { userMinTime, userRuns, refMinTime, refRuns } = benchData;
          const TOLS = 0.1; // 10% tolerance
          const ratio =
            refMinTime > 0 ? (userMinTime - refMinTime) / refMinTime : 0;
          const ok = ratio <= TOLS;
          const color = ok ? "#859900" : "#dc322f";
          strictBanner = `<div style="display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px;padding:5px 9px 6px;font-family:'JetBrains Mono',monospace;font-size:.64rem;border-bottom:1px solid var(--bd);flex-shrink:0;background:rgba(0,0,0,.2)">
      <span style="color:${color};font-weight:bold;letter-spacing:.08em">⚡ ${ok ? "STRICT PASS" : "STRICT FAIL"}</span>
      <span style="color:var(--txd)">user min:</span><span style="color:${color}">${userMinTime.toFixed(3)}ms ×${userRuns}</span>
      <span style="color:var(--txd)">ref min:</span><span style="color:#2aa198">${refMinTime.toFixed(3)}ms ×${refRuns}</span>
      <span style="color:var(--txd)">delta:</span><span style="color:${color}">${ratio >= 0 ? "+" : ""}${(ratio * 100).toFixed(1)}% (limit +${(TOLS * 100).toFixed(0)}%)</span>
    </div>`;
        } else if (
          _strictOn &&
          !benchData &&
          files &&
          FILECACHE[`${curCat().id}/${curTask.id}`]?.sol == null
        ) {
          strictBanner = `<div style="padding:4px 9px;font-family:'JetBrains Mono',monospace;font-size:.64rem;color:var(--txd);border-bottom:1px solid var(--bd)">⚡ STRICT: no .sol.js found — skipped</div>`;
        }

        sum.innerHTML = `<span class="bp">✓ ${pass}</span>${fail ? `<span class="bf"> ✗ ${fail}</span>` : ""}<span class="bt">${(r.total || 0).toFixed(2)}ms</span>${memStr ? `<span class="bt" style="color:#2aa198">${memStr}</span>` : ""}`;
        if (!all.length) {
          body.innerHTML =
            strictBanner +
            `<div class="res-empty"><div>NO TESTS FOUND</div></div>`;
          return;
        }
        let h = "";
        Object.entries(suites).forEach(([sn, tests]) => {
          if (!tests?.length) return;
          h += `<div class="r-suite">`;
          if (sn !== "__root__")
            h += `<div class="r-suite-nm">${esc(sn)}</div>`;
          tests.forEach((t) => {
            const memD =
              t.mem != null ? (t.mem >= 0 ? "+" : "") + fmtB(t.mem) : "";
            const asts = t.assertions || [];
            const astFail = asts.filter((a) => a.status === "fail").length;
            const hasAsts = asts.length > 0;
            // expand indicator
            const ico =
              t.status === "pass" ? "●" : t.status === "error" ? "⚠" : "✗";
            let expandLabel = "";
            if (hasAsts) {
              const all = asts.length;
              if (t.status === "pass")
                expandLabel = `<span class="r-expand">${all} ✓ ▸</span>`;
              else if (t.status === "fail")
                expandLabel = `<span class="r-expand">${astFail}/${all} failed ▸</span>`;
            }
            // assertion rows
            let astHtml = "";
            if (hasAsts) {
              astHtml = '<div class="r-assertions">';
              asts.forEach((a) => {
                // Always show what was asserted: the expect(...) argument, the matcher and
                // the expected value. `received` is added only when it adds information
                // (failure, or a matcher where received ≠ expected, e.g. toBeLessThan).
                const failed = a.status === "fail";
                const callPart = a.call
                  ? `<span class="r-a-call">${esc(a.call)}</span>`
                  : "";
                const expPart =
                  a.expected !== undefined
                    ? `<span class="r-a-exp">${esc(a.expected)}</span>`
                    : "";
                const showGot =
                  a.received !== undefined &&
                  (failed || a.received !== a.expected);
                const gotPart = showGot
                  ? `<span class="r-a-sep">→ received</span><span class="${failed ? "r-a-got" : "r-a-ok"}">${esc(a.received)}</span>`
                  : "";
                astHtml += `<div class="r-assert ${a.status}${a.line ? " jump" : ""}"${a.line ? ` title="Show in SPEC" onclick="rAssertClick(event, ${a.line})"` : ""}>
                  <span class="r-a-ico">${failed ? "✗" : "✓"}</span>
                  ${callPart}<span class="r-a-matcher">.${esc(a.matcher)}</span>
                  ${expPart}${gotPart}
                </div>`;
              });
              // runtime error if any
              if (t.error && t.status === "error")
                astHtml += `<div class="r-assert fail"><span class="r-a-ico">⚠</span><span style="color:#dc322f">${esc(t.error)}</span></div>`;
              astHtml += "</div>";
            } else if (t.error) {
              astHtml = `<div class="r-err">${esc(t.error)}</div>`;
            }
            h += `<div class="r-item ${t.status}"><div class="r-nr" title="Show in SPEC" onclick="rTestClick(this, ${t.line || 0})">
              <span class="r-ico">${ico}</span><span class="r-nm">${esc(t.name)}</span>
              <span class="r-ms">${t.time.toFixed(2)}ms</span>
              ${memD ? `<span class="r-mem" style="color:#2aa198">${memD}</span>` : ""}
              ${expandLabel}
            </div>${astHtml}</div>`;
          });
          h += `</div>`;
        });
        body.innerHTML = strictBanner + h;
      }
      function clearResults() {
        document.getElementById("res-body").innerHTML =
          `<div class="res-empty"><div class="ico">⬡</div><div>AWAITING EXECUTION</div><button onclick="formatAndRun()" class="run-btn" style="margin-top:18px;font-size:.85rem;padding:10px 36px;letter-spacing:.25em;box-shadow:0 0 18px rgba(0,255,255,.2)">▶ RUN</button></div>`;
        document.getElementById("res-sum").innerHTML = "";
      }
      function setStatus(msg, cls = "") {
        const el = document.getElementById("statusbar");
        el.textContent = msg;
        el.className = "statusbar" + (cls ? " " + cls : "");
      }
      function esc(s) {
        return String(s || "")
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
      }
      function fmtB(b) {
        if (Math.abs(b) < 1024) return b + "B";
        if (Math.abs(b) < 1048576) return (b / 1024).toFixed(1) + "KB";
        return (b / 1048576).toFixed(1) + "MB";
      }


      // ── Jump from a result to the spec ──
      // Clicking a test row expands it (as before) AND opens the SPEC tab at that test;
      // clicking one assertion row opens the SPEC tab at that expect(...). The target is
      // flashed for 1 s. Lines come from the worker (1-based lines of the spec text).
      function rTestClick(header, line) {
        header.parentElement.classList.toggle("open");
        specJump(line);
      }
      function rAssertClick(ev, line) {
        ev.stopPropagation();
        specJump(line);
      }

      // first and last line of the statement that starts at the given line: up to the ";" that
      // closes it (it(...); / expect(...).toBe(...);), skipping strings and comments
      function specStatementRange(spec, line) {
        const lines = spec.split("\n");
        let off = 0;
        for (let i = 0; i < line - 1 && i < lines.length; i++) off += lines[i].length + 1;
        const lim = Math.min(spec.length, off + 6000);
        let depth = 0,
          seen = false,
          q = null,
          end = off;
        for (let j = off; j < lim; j++) {
          const c = spec[j];
          if (q) {
            if (c === "\\") j++;
            else if (c === q) q = null;
            continue;
          }
          if (c === "/" && spec[j + 1] === "/") {
            while (j < lim && spec[j] !== "\n") j++;
            continue;
          }
          if (c === "/" && spec[j + 1] === "*") {
            j = spec.indexOf("*/", j + 2);
            if (j < 0) break;
            j++;
            continue;
          }
          if (c === '"' || c === "'" || c === "\x60") q = c;
          else if ("([{".includes(c)) {
            depth++;
            seen = true;
          } else if (")]}".includes(c)) depth--;
          else if (c === ";" && depth <= 0 && seen) {
            end = j;
            break;
          }
        }
        const extra = (spec.slice(off, end).match(/\n/g) || []).length;
        return { start: line, end: Math.min(lines.length, line + Math.min(extra, 80)) };
      }

      let _specFlashIds = [],
        _specFlashT1 = null,
        _specFlashT2 = null;
      function specFlash(start, end) {
        clearTimeout(_specFlashT1);
        clearTimeout(_specFlashT2);
        const range = new monaco.Range(start, 1, end, 1);
        const deco = (cls) => [
          {
            range,
            options: { isWholeLine: true, className: cls, linesDecorationsClassName: "spec-flash-bar" },
          },
        ];
        _specFlashIds = editor.deltaDecorations(_specFlashIds, deco("spec-flash"));
        _specFlashT1 = setTimeout(
          () => (_specFlashIds = editor.deltaDecorations(_specFlashIds, deco("spec-flash-fade"))),
          650,
        );
        _specFlashT2 = setTimeout(
          () => (_specFlashIds = editor.deltaDecorations(_specFlashIds, [])),
          1000,
        );
      }

      function specJump(line) {
        if (!line || !curTask || !editor) return;
        const files = FILECACHE[curCat().id + "/" + curTask.id];
        if (!files || !files.spec) return;
        if (typeof closeMobResults === "function") closeMobResults(); // phones: results cover the editor
        const r = specStatementRange(files.spec, line);
        const go = () => {
          editor.revealLineInCenter(r.start, monaco.editor.ScrollType.Immediate); // no smooth scroll: the flash must not start before the target is on screen
          editor.setPosition({ lineNumber: r.start, column: 1 });
          specFlash(r.start, r.end);
        };
        // right after switchTab() the editor still lays out the old text: wait a moment
        if (curTab !== "sp") {
          switchTab("sp");
          setTimeout(go, 60);
        } else go();
      }

      // ── STRICT "too slow" modal over the results area ──
      // Closed like any modal: the cross, Esc, a click on the dark area (and by the next run).
      function showStrictLock(b) {
        // two bars on one scale: ref, and you (the part beyond the limit is hatched red);
        // the dashed line is the limit: ref + STRICT_TOLERANCE
        const limitMs = b.refMinTime * (1 + STRICT_TOLERANCE);
        const scale = Math.max(b.userMinTime, limitMs) * 1.1;
        const w = (ms) => ((ms / scale) * 100).toFixed(2);
        const inLimit = Math.min(b.userMinTime, limitMs);
        document.getElementById("res-lock-body").innerHTML =
          `<div class="rl-row"><span class="rl-lbl"><i class="rl-sq ref"></i>ref.</span>` +
          `<div class="rl-track"><div class="rl-bar ref" style="width:${w(b.refMinTime)}%"></div></div>` +
          `<span class="rl-val">${b.refMinTime.toFixed(2)} ms</span></div>` +
          `<div class="rl-row"><span class="rl-lbl"><i class="rl-sq you"></i>your</span>` +
          `<div class="rl-track"><div class="rl-bar you" style="width:${w(inLimit)}%"></div>` +
          `<div class="rl-bar over" style="left:${w(inLimit)}%;width:${w(b.userMinTime - inLimit)}%"></div></div>` +
          `<span class="rl-val red">${b.userMinTime.toFixed(2)} ms</span></div>` +
          `<div class="rl-limit" style="left:calc(var(--rl-lbl) + 8px + (100% - var(--rl-lbl) - var(--rl-val) - 16px) * ${(limitMs / scale).toFixed(4)})"><span>limit ${limitMs.toFixed(2)} ms</span></div>`;
        document.getElementById("res-lock").classList.remove("hide");
      }
      function closeStrictLock() {
        const el = document.getElementById("res-lock");
        if (el) el.classList.add("hide");
      }
      document.getElementById("res-lock").addEventListener("click", (e) => {
        if (e.target === e.currentTarget) closeStrictLock();
      });
