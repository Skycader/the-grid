      // ═══════════ BOOT ═══════════
      (function () {
        const BL = [
          "INITIALIZING GRID RUNTIME v1.3.0...",
          "LOADING MONACO EDITOR ENGINE...",
          "MOUNTING PRETTIER FORMATTER v2.8.8...",
          "SPAWNING WORKER SANDBOX...",
          "LOADING TASK REGISTRY...",
          "ALL SYSTEMS NOMINAL — WELCOME TO THE GRID",
        ];
        const logo = document.getElementById("boot-logo"),
          lines = document.getElementById("boot-lines");
        setTimeout(() => {
          logo.style.opacity = "1";
          logo.style.transition = "opacity .5s";
        }, 100);
        BL.forEach((t, i) =>
          setTimeout(
            () => {
              const d = document.createElement("div");
              d.className = "boot-line";
              d.textContent = "> " + t;
              lines.appendChild(d);
            },
            200 + i * 185,
          ),
        );
        setTimeout(
          () => {
            document.getElementById("boot").classList.add("done");
            setTimeout(() => document.getElementById("boot").remove(), 700);
          },
          200 + BL.length * 185 + 280,
        );
      })();

      // ═══════════ STATE ═══════════
      let view = "home",
        curTask = null,
        curTab = "ed";
      // navStack — open path through the category tree
      // navStack[0] = top-level cat, navStack[last] = currently viewed node
      let navStack = [];
      function curCat() {
        return navStack[navStack.length - 1] || null;
      }
      let editor = null,
        solCode = "",
        wkBlob = null,
        _editorLoading = false;
      let focusCatIdx = -1,
        focusTaskIdx = -1;

      function showView(id) {
        document
          .querySelectorAll(".view")
          .forEach((v) => v.classList.remove("active"));
        document.getElementById("view-" + id).classList.add("active");
        view = id;
        document.getElementById("hud").style.display =
          id === "home" ? "flex" : "none";
        if (id === "home") {
          focusCatIdx = -1;
        }
        if (id === "category") {
          focusTaskIdx = -1;
        }
      }

      // ═══════════════════════════════════════════════════════
      // BOOT LOADER — recursive, handles arbitrary depth
      // For every node (category or subcategory):
      //   1. grid/{folder}/icon.svg  → ICONSTORE
      //   2. config/{folder}.js      → window.CFG_{id} → node.tasks
      //   3. Recurse into node.children[]
      // ═══════════════════════════════════════════════════════

      async function bootNode(node) {
        // Icon
        try {
          const svg = await fetch(`grid/${node.folder}/icon.svg`).then((r) => {
            if (!r.ok) throw 0;
            return r.text();
          });
          ICONSTORE[node.folder] = svg;
        } catch (e) {
          ICONSTORE[node.folder] = FALLBACK_SVG;
        }
        // ranks.md loaded lazily on first drawer open
        // Config: tasks from window.CFG_{id}
        node.tasks = node.tasks || [];
        await new Promise((resolve) => {
          const key = `CFG_${node.id}`;
          if (window[key]) {
            processConfig(node, window[key]);
            resolve();
            return;
          }
          const s = document.createElement("script");
          s.src = `config/${node.folder}.js`;
          s.onload = () => {
            processConfig(node, window[key] || []);
            resolve();
          };
          s.onerror = () => resolve();
          document.head.appendChild(s);
        });
        // Recurse into children (from menu.js + virtual Folder nodes from config)
        if (node.children && node.children.length) {
          await Promise.all(node.children.map(bootNode));
        }
      }

      // processConfig: plain tasks → node.tasks; {type:"Folder"} → virtual children
      function processConfig(node, entries) {
        node.tasks = node.tasks || [];
        node.children = node.children || [];
        for (const entry of entries) {
          if (entry.type === "Folder") {
            const folderPath =
              entry.path ||
              node.folder +
                "/" +
                entry.name
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[^a-z0-9\-\/]/g, "");
            const tasks = (entry.files || []).map((t) => ({
              ...t,
              _folder: folderPath,
            }));
            const childId = "vf_" + folderPath.replace(/\//g, "_");
            // avoid duplicates if bootNode is called multiple times
            if (!node.children.find((c) => c.id === childId)) {
              node.children.push({
                id: childId,
                name: entry.name,
                desc: entry.desc || "",
                folder: folderPath,
                tasks,
                children: [],
                _virtual: true,
              });
            }
          } else {
            node.tasks.push({ ...entry, _folder: node.folder });
          }
        }
      }

      (async () => {
        await Promise.all(MENU.map(bootNode));
        renderCats("");
        // After boot: try to restore state from URL query params
        restoreRoute();
      })();

