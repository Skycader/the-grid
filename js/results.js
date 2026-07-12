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
                const gotPart =
                  a.received !== undefined
                    ? `<span class="r-a-sep">→ received</span><span class="r-a-got">${esc(a.received)}</span>`
                    : "";
                const expPart =
                  a.expected !== undefined && a.status === "fail"
                    ? `<span class="r-a-sep">expected</span><span class="r-a-exp">${esc(a.expected)}</span>`
                    : "";
                astHtml += `<div class="r-assert ${a.status}">
                  <span class="r-a-ico">${a.status === "pass" ? "✓" : "✗"}</span>
                  <span class="r-a-matcher">.${esc(a.matcher)}</span>
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
            h += `<div class="r-item ${t.status}" onclick="this.classList.toggle('open')"><div class="r-nr">
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

