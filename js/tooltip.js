      // ═══════════ TOOLTIPS ═══════════
      // The native hints (the title attribute) are small, grey and slow, and they do not look like the rest
      // of the app. This replaces them for the whole page, with no change in the places that use them: write
      // title="..." (or el.title = "...") as before.
      //   - every title is moved into data-tip at once (a MutationObserver does it for the elements that appear
      //     later and for a title that is set again, e.g. the reward in the task bar every 5 seconds), so the
      //     browser never has a title to show; an element without a text and without aria-label gets the
      //     aria-label from it
      //   - the tooltip comes after a short pause over the element, in the style of the rank tooltip, above
      //     the element (below it when there is no room), the text wraps; "\n" is a new line
      //   - it goes away when the cursor leaves, on a click, a key, a scroll
      // The editor (Monaco) has its own hints and is left alone.
      (function () {
        const tip = document.createElement("div");
        tip.id = "ui-tip";
        document.body.appendChild(tip);
        let cur = null,
          timer = null;

        const skip = (el) => !!(el.closest && el.closest(".monaco-editor"));
        function convert(el) {
          if (!el || el.nodeType !== 1 || skip(el)) return;
          const t = el.getAttribute("title");
          if (t == null) return;
          el.removeAttribute("title");
          if (!t) return;
          el.dataset.tip = t;
          if (!el.hasAttribute("aria-label") && !el.textContent.trim()) el.setAttribute("aria-label", t);
          if (el === cur && tip.classList.contains("show")) tip.textContent = t; // the text changed under the cursor
        }
        function convertTree(root) {
          if (root.nodeType !== 1) return;
          convert(root);
          root.querySelectorAll("[title]").forEach(convert);
        }
        convertTree(document.body);
        new MutationObserver((muts) => {
          for (const m of muts) {
            if (m.type === "attributes") convert(m.target);
            else m.addedNodes.forEach(convertTree);
          }
        }).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["title"] });

        function hide() {
          clearTimeout(timer);
          cur = null;
          tip.classList.remove("show");
        }
        function show(el) {
          if (el !== cur || !document.body.contains(el)) return hide();
          tip.textContent = el.dataset.tip;
          tip.style.left = "0px";
          tip.style.top = "0px";
          const r = el.getBoundingClientRect(),
            t = tip.getBoundingClientRect();
          const x = Math.min(Math.max(4, r.left + r.width / 2 - t.width / 2), innerWidth - t.width - 4);
          const y = r.top - t.height - 7 >= 4 ? r.top - t.height - 7 : Math.min(r.bottom + 7, innerHeight - t.height - 4);
          tip.style.left = Math.round(x) + "px";
          tip.style.top = Math.round(y) + "px";
          tip.classList.add("show");
        }
        document.addEventListener("mouseover", (e) => {
          const el = e.target.closest && e.target.closest("[data-tip]");
          if (el === cur) return;
          hide();
          if (!el) return;
          cur = el;
          timer = setTimeout(() => show(el), 280);
        });
        document.addEventListener("mouseout", (e) => {
          if (cur && !cur.contains(e.relatedTarget)) hide();
        });
        document.addEventListener("mousedown", hide);
        document.addEventListener("keydown", hide);
        window.addEventListener("scroll", hide, true);
        window.addEventListener("blur", hide);
      })();
