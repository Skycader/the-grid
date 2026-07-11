      // ═══════════ RANKS DRAWER ═══════════

      let _ranksFolder = null; // folder whose ranks.md is currently shown

      // Minimal MD renderer: bold, inline-code, headings, tables, paragraphs
      function renderMd(md) {
        const lines = md.split("\n");
        let html = "",
          inTable = false;

        const inlineFormat = (s) =>
          s
            .replace(/`([^`]+)`/g, '<code class="md-code">$1</code>')
            .replace(/\*\*([^*]+)\*\*/g, '<span class="md-strong">$1</span>');

        for (let i = 0; i < lines.length; i++) {
          const raw = lines[i];
          const l = raw.trimEnd();

          // Table row
          if (l.startsWith("|") && l.endsWith("|")) {
            const cells = l
              .slice(1, -1)
              .split("|")
              .map((c) => c.trim());
            // separator row?
            if (cells.every((c) => /^[-: ]+$/.test(c))) {
              continue;
            }
            if (!inTable) {
              html += '<table class="md-table"><thead><tr>';
              cells.forEach((c) => (html += `<th>${inlineFormat(c)}</th>`));
              html += "</tr></thead><tbody>";
              inTable = true;
            } else {
              html += "<tr>";
              cells.forEach((c) => (html += `<td>${inlineFormat(c)}</td>`));
              html += "</tr>";
            }
            continue;
          }

          // End table
          if (inTable) {
            html += "</tbody></table>";
            inTable = false;
          }

          // Headings
          const hm = l.match(/^(#{1,3})\s+(.*)/);
          if (hm) {
            const n = hm[1].length;
            html += `<div class="md-h${n}">${inlineFormat(hm[2])}</div>`;
            continue;
          }

          // Blank line → paragraph break (just spacing)
          if (!l.trim()) {
            html += '<div style="height:6px"></div>';
            continue;
          }

          // Paragraph
          html += `<p class="md-p">${inlineFormat(l)}</p>`;
        }
        if (inTable) html += "</tbody></table>";
        return html;
      }

      async function openRanksDrawer() {
        const cat = curCat() || (navStack.length ? navStack[0] : null);
        const folder = cat ? cat.folder : null;
        // Lazy fetch: undefined = not fetched yet
        if (folder && RANKSSTORE[folder] === undefined) {
          try {
            RANKSSTORE[folder] = await fetch(
              `grid/${folder}/ranks.md?t=${Date.now()}`,
            ).then((r) => {
              if (!r.ok) throw 0;
              return r.text();
            });
          } catch (e) {
            RANKSSTORE[folder] = null; // file absent
          }
        }
        const md = folder ? RANKSSTORE[folder] : null;
        const title = (cat ? cat.name + " // " : "") + "DIFFICULTY SCALE";
        document.getElementById("ranks-drawer-title").textContent = title;
        document.getElementById("ranks-drawer-body").innerHTML = md
          ? renderMd(md)
          : `<div style="color:var(--txd);font-family:'JetBrains Mono',monospace;font-size:.78rem;padding:16px;opacity:.6">
              // No ranks.md found for this category.<br><br>
              Create: <span style="color:var(--cd)">grid/${folder}/ranks.md</span>
             </div>`;
        document.getElementById("ranks-drawer").classList.add("open");
        document.getElementById("ranks-drawer-overlay").classList.add("open");
        playClick();
      }

      function closeRanksDrawer() {
        document.getElementById("ranks-drawer").classList.remove("open");
        document
          .getElementById("ranks-drawer-overlay")
          .classList.remove("open");
        playClick();
      }

      // Show/hide ⓘ button — always visible in category view (fallback md used if no file)
      function updateRanksBtn() {
        const btn = document.getElementById("ranks-btn-cat");
        if (btn) btn.classList.add("visible");
      }

