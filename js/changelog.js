      // ═══════════ RELEASE NOTES ═══════════
      // A click on the version tag on the home screen opens a modal like the transactions
      // one: the header is CHANGELOG; under it a tab with the file name (<version>.md) and
      // its date, then changelog/<version>.md rendered on the "document".
      const clModal = document.getElementById("cl-modal");
      const clEsc = (s) =>
        s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);

      // inline markdown: `code`, **bold**, *italic*, [text](url) → text. Input is HTML-escaped first.
      function clInline(text) {
        return clEsc(text)
          .replace(/`([^`]+)`/g, "<code>$1</code>")
          .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
          .replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, "$1<em>$2</em>")
          .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
      }

      // the subset of markdown used by changelog/*.md: # ## ### headings, "- " lists
      // (a line indented by two spaces continues the previous item), paragraphs
      function clMarkdown(md) {
        const out = [];
        let list = null; // array of item strings while inside a list
        let para = [];
        const flushPara = () => {
          if (para.length) out.push(`<p>${clInline(para.join(" "))}</p>`);
          para = [];
        };
        const flushList = () => {
          if (list) out.push("<ul>" + list.map((li) => `<li>${clInline(li)}</li>`).join("") + "</ul>");
          list = null;
        };
        for (const raw of md.replace(/\r/g, "").split("\n")) {
          const line = raw.replace(/\s+$/, "");
          let m;
          if (!line.trim()) {
            flushPara();
            flushList();
          } else if ((m = /^(#{1,3})\s+(.*)$/.exec(line))) {
            flushPara();
            flushList();
            if (m[1].length === 1) continue; // "# 1.4.0 — date": shown in the tab
            const cls = ["", "", "cl-h2", "cl-h3"][m[1].length];
            out.push(`<div class="${cls}">${clInline(m[2])}</div>`);
          } else if ((m = /^-\s+(.*)$/.exec(line))) {
            flushPara();
            (list = list || []).push(m[1]);
          } else if (list && /^\s{2,}\S/.test(line)) {
            list[list.length - 1] += " " + line.trim();
          } else {
            flushList();
            para.push(line.trim());
          }
        }
        flushPara();
        flushList();
        return out.join("");
      }

      async function clOpen() {
        // the file name is a tab on the document, like the date tabs of the transactions
        const tab = document.getElementById("cl-tab");
        tab.innerHTML = `<b>${clEsc(APP_VERSION)}.md</b>`;
        const body = document.getElementById("cl-body");
        body.innerHTML = '<div class="cl-msg">Loading…</div>';
        clModal.classList.remove("hide");
        clModal.querySelector(".m-content").scrollTop = 0;
        playClick();
        try {
          const res = await fetch(`changelog/${APP_VERSION}.md`, { cache: "no-cache" });
          if (!res.ok) throw new Error(res.status);
          const md = await res.text();
          const date = /^#\s.*?(\d{4}-\d{2}-\d{2})/m.exec(md);
          if (date) tab.innerHTML += `<i>${date[1]}</i>`;
          body.innerHTML = clMarkdown(md);
        } catch (e) {
          body.innerHTML = `<div class="cl-msg">No release notes for ${clEsc(APP_VERSION)} (changelog/${clEsc(APP_VERSION)}.md could not be loaded).</div>`;
        }
      }
      function clClose() {
        clModal.classList.add("hide");
        playClick();
      }
      clModal.addEventListener("click", (e) => {
        if (e.target === e.currentTarget) clClose();
      });
      const _vtag = document.getElementById("vtag");
      _vtag.title = "Release notes";
      _vtag.addEventListener("click", clOpen);
