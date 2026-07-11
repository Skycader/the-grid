      // ═══════════ URL ROUTING (query params) ═══════════
      // Works on any base path including GitHub Pages subfolders.
      // ?cat=regex           → open category
      // ?cat=regex&task=ex1  → open specific task

      function setQueryParams(params) {
        const url = new URL(location.href);
        // Clear all first, then set new ones
        [...url.searchParams.keys()].forEach((k) => url.searchParams.delete(k));
        Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
        history.pushState({}, "", url.toString());
      }

      function clearQueryParams() {
        const url = new URL(location.href);
        [...url.searchParams.keys()].forEach((k) => url.searchParams.delete(k));
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

      async function restoreRoute() {
        const p = new URLSearchParams(location.search);
        const catId = p.get("cat");
        const taskId = p.get("task");
        if (!catId) return;

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
        if (!catId) {
          navStack = [];
          showView("home");
          return;
        }
        const cat = findNode(catId, MENU);
        if (!cat) {
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

