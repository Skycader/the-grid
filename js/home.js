      // ═══════════ HOME / CAT GRID + PAGINATION ═══════════
      function renderCats(q) {
        if (q) {
          return;
        } // handled by doSearch
        _filteredMenu = MENU;
        catPage = 0;
        renderCatGrid(MENU);
      }

      function renderCatGrid(list) {
        const totalPages = Math.ceil(list.length / PAGE_SIZE);
        const pageItems = list.slice(
          catPage * PAGE_SIZE,
          (catPage + 1) * PAGE_SIZE,
        );
        const g = document.getElementById("cat-grid");
        g.innerHTML = "";
        focusCatIdx = -1;
        pageItems.forEach((cat) => {
          const el = document.createElement("div");
          el.className = "cat-card";
          const icon = ICONSTORE[cat.folder] || FALLBACK_SVG;
          const taskCount = countTasks(cat);
          const subCount = (cat.children || []).length;
          const meta = taskCount
            ? taskCount +
              " TASKS" +
              (subCount ? ", " + subCount + " FOLDERS" : "")
            : subCount
              ? subCount + " FOLDERS"
              : "COMING SOON";
          el.innerHTML = `<div class="cat-icon">${icon}</div>
      <div class="cat-name">${cat.name}</div>
      <div class="cat-meta">${meta}</div>`;
          el.onclick = () => {
            playNav();
            openCat(cat);
          };
          g.appendChild(el);
        });
        // pagination
        const pager = document.getElementById("cat-pager");
        if (totalPages <= 1) {
          pager.style.display = "none";
          return;
        }
        pager.style.display = "flex";
        document
          .getElementById("pag-prev")
          .classList.toggle("disabled", catPage === 0);
        document
          .getElementById("pag-next")
          .classList.toggle("disabled", catPage >= totalPages - 1);
        const dots = document.getElementById("pag-dots");
        dots.innerHTML = "";
        for (let i = 0; i < totalPages; i++) {
          const d = document.createElement("div");
          d.className = "pag-dot" + (i === catPage ? " active" : "");
          d.onclick = (() => {
            const p = i;
            return () => {
              catPage = p;
              renderCatGrid(_filteredMenu);
              playClick();
            };
          })();
          dots.appendChild(d);
        }
      }
      function prevCatPage() {
        if (catPage > 0) {
          catPage--;
          renderCatGrid(_filteredMenu);
          playClick();
        }
      }
      function nextCatPage() {
        const tp = Math.ceil(_filteredMenu.length / PAGE_SIZE);
        if (catPage < tp - 1) {
          catPage++;
          renderCatGrid(_filteredMenu);
          playClick();
        }
      }

