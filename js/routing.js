      // ═══════════ URL ROUTING (query params) ═══════════
      // Works on any base path including GitHub Pages subfolders.
      // ?cat=regex           → open category
      // ?cat=regex&task=ex1  → open specific task
      // &sort=ranked         → the sort of the task list (js/category.js, SORT_MODES); absent = the
      //                        default one (easy). It goes with every URL that has a category.
      // ?profile=regex       → the profile window is open on that catalog's tab (js/profile.js)

      function setQueryParams(params) {
        const url = new URL(location.href);
        // Clear all first, then set new ones
        [...url.searchParams.keys()].forEach((k) => url.searchParams.delete(k));
        Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
        if (params.cat && _taskSortDir !== DEFAULT_SORT) url.searchParams.set("sort", _taskSortDir);
        history.pushState({}, "", url.toString());
      }

      // The sort of the list was changed: put it into the URL without a new history entry
      function syncSortParam() {
        const url = new URL(location.href);
        if (!url.searchParams.has("cat")) return;
        if (_taskSortDir === DEFAULT_SORT) url.searchParams.delete("sort");
        else url.searchParams.set("sort", _taskSortDir);
        history.replaceState({}, "", url.toString());
      }

      // The sort from the URL (a valid mode, else the default one)
      function applySortParam(p) {
        const s = p.get("sort");
        _taskSortDir = s && s in SORT_MODES ? s : DEFAULT_SORT;
        updateSortBtn();
      }

      // the way back to the menu: the page params go, the window params (profile) stay
      function clearQueryParams() {
        const url = new URL(location.href);
        ["cat", "task", "sort"].forEach((k) => url.searchParams.delete(k));
        history.pushState({}, "", url.toString());
      }

      // Recursively find a node by id in MENU tree
      function findNode(id, nodes) {
        for (const n of nodes) {
          if (n.id === id) return n;
          if (n.children) {
            const found = findNode(id, n.children);
            if (found) return found;
          }
        }
        return null;
      }

      // Find a task by id anywhere in a node's tasks + children
      function findTask(taskId, node) {
        for (const t of node.tasks || []) {
          if (t.id === taskId) return t;
        }
        for (const child of node.children || []) {
          const found = findTask(taskId, child);
          if (found) return found;
        }
        return null;
      }

      // the profile window follows the URL (a reload, back / forward): open / close it
      function syncProfileFromUrl(p) {
        const open = !document.getElementById("pfm-modal").classList.contains("hide");
        const id = p.get("profile");
        if (id) {
          if (!open || MENU[_pfmTab].id !== id) pfmOpen(id);
        } else if (open) pfmClose(true);
      }

      async function restoreRoute() {
        const profileId = new URLSearchParams(location.search).get("profile");
        await restorePage();
        // last: opening a page rewrites the URL, the profile param is put back by pfmOpen
        if (profileId) pfmOpen(profileId);
      }

      async function restorePage() {
        const p = new URLSearchParams(location.search);
        const catId = p.get("cat");
        const taskId = p.get("task");
        if (!catId) return;
        applySortParam(p);

        const cat = findNode(catId, MENU);
        if (!cat) return;

        if (taskId) {
          const task = findTask(taskId, cat);
          if (task) {
            openCat(cat);
            await openTask(cat, task);
            return;
          }
        }
        openCat(cat);
      }

      // Browser back/forward
      window.addEventListener("popstate", async () => {
        const p = new URLSearchParams(location.search);
        const catId = p.get("cat");
        const taskId = p.get("task");
        if (catId) applySortParam(p);
        syncProfileFromUrl(p);
        if (!catId) {
          navStack = [];
          showView("home");
          return;
        }
        const cat = findNode(catId, MENU);
        if (!cat) {
          history.replaceState({}, "", location.pathname); // unknown category: just the menu
          showView("home");
          return;
        }
        if (taskId) {
          const task = findTask(taskId, cat);
          if (task) {
            openCat(cat);
            await openTask(cat, task);
            return;
          }
        }
        navStack = [cat];
        openCat(cat);
      });

