      // ═══════════ TASK ═══════════
      async function openTask(cat, task) {
        curTask = task;
        // Sync URL — uses task.id as the task param (stable, matches config)
        setQueryParams({ cat: cat.id, task: task.id });
        // Ensure cat is on the navStack
        if (!navStack.length || navStack[navStack.length - 1] !== cat) {
          navStack.push(cat);
        }
        curTab = "ed";
        // Strict: lock if task.strict===true
        _strictLocked = task.strict === true;
        if (_strictLocked) _strictOn = true;
        updateStrictUI();
        // Font size
        applyFZ();
        const starsHtml = task.diff
          ? ` <span class="breadc-stars ${diffCls(task.diff)}">${mkStars(task.diff)}</span>` +
            ` <button class="ranks-btn visible" onclick="openRanksDrawer()" title="Difficulty scale" style="margin-left:4px">` +
            `<svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">` +
            `<circle cx="10" cy="10" r="8.5" stroke="currentColor" stroke-width="1.3"/>` +
            `<rect x="9.15" y="8.5" width="1.7" height="6" rx=".85" fill="currentColor"/>` +
            `<circle cx="10" cy="6.2" r=".95" fill="currentColor"/>` +
            `</svg></button>`
          : "";
        document.getElementById("breadc").innerHTML =
          `<span>${cat.name}</span> <span style="color:var(--txd)">/</span> <span class="act">${task.id.toUpperCase()}</span>${starsHtml}`;
        setTabs("ed");
        hideSolOverlay();
        clearResults();
        setStatus("⟳ Loading…");
        showView("task");
        _editorLoading = true;
        if (editor) {
          editor.setValue("// Loading…");
          editor.updateOptions({ readOnly: true });
        }
        const files = await loadTask(cat, task);
        _editorLoading = false;
        const key = `${cat.id}/${task.id}`;
        solCode = CODE[key] !== undefined ? CODE[key] : files.code;
        if (editor) {
          editor.setValue(solCode);
          editor.updateOptions({ readOnly: false });
          editor.focus();
        }
        setStatus("");
      }
      function setTabs(t) {
        document.getElementById("tab-ed").classList.toggle("on", t === "ed");
        document.getElementById("tab-sp").classList.toggle("on", t === "sp");
        document.getElementById("tab-sol").classList.toggle("on", t === "sol");
      }
      function switchTab(t) {
        playClick();
        curTab = t;
        setTabs(t);
        hideSolOverlay();
        if (!editor || !curTask) return;
        const files = FILECACHE[`${curCat().id}/${curTask.id}`];
        _editorLoading = true;
        if (t === "ed") {
          editor.setValue(solCode);
          editor.updateOptions({ readOnly: false });
          editor.focus();
        } else if (files) {
          editor.setValue(files.spec || "// spec not loaded");
          editor.updateOptions({ readOnly: true });
        }
        _editorLoading = false;
      }
      function hideSolOverlay() {
        document.getElementById("sol-overlay").classList.remove("show");
      }
      function requestSolutions() {
        playClick();
        if (!curTask) return;
        document.getElementById("modal").classList.remove("hide");
      }
      function closeModal() {
        playClick();
        document.getElementById("modal").classList.add("hide");
      }
      function doShowSolution() {
        playClick();
        closeModal();
        const files = FILECACHE[`${curCat().id}/${curTask.id}`];
        setTabs("sol");
        document.getElementById("sol-code").textContent =
          files?.sol ||
          "// No reference solution available.\n// Run build.sh to generate task files.";
        document.getElementById("sol-note").textContent = files?.sol
          ? `// grid/${curTask._folder || curCat().folder}/${curTask.file}.sol.js`
          : "";
        document.getElementById("sol-overlay").classList.add("show");
      }
      document.getElementById("bk-task").onclick = () => {
        playClick();
        if (editor && curTask && !_editorLoading) {
          solCode = editor.getValue();
          CODE[`${curCat().id}/${curTask.id}`] = solCode;
        }
        // Return to category URL (drop task param)
        const cat = curCat();
        if (cat) setQueryParams({ cat: cat.id });
        closeMobResults();
        hideSolOverlay();
        showView("category");
      };
      document.getElementById("modal").addEventListener("click", (e) => {
        if (e.target === e.currentTarget) closeModal();
      });

