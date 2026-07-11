      // ═══════════ KEYBOARD ═══════════
      document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "s") {
          e.preventDefault();
          if (TEST_ON_SAVE && view === "task") formatAndRun();
          return;
        }

        if (e.key === "Escape") {
          if (!document.getElementById("modal").classList.contains("hide")) {
            closeModal();
            return;
          }
          if (view === "task") {
            playClick();
            document.getElementById("bk-task").click();
            return;
          }
          if (view === "category") {
            playClick();
            showView("home");
            return;
          }
          return;
        }

        // F → focus search (home view only, when not already in input)
        if (
          (e.key === "f" || e.key === "F") &&
          view === "home" &&
          e.target !== document.getElementById("srch") &&
          !e.ctrlKey &&
          !e.metaKey
        ) {
          e.preventDefault();
          document.getElementById("srch").focus();
          return;
        }

        // Don't intercept when typing in search or editor
        if (e.target === document.getElementById("srch")) return;
        if (
          view === "task" &&
          document.activeElement &&
          document.getElementById("monaco").contains(document.activeElement)
        )
          return;

        const isUp = e.key === "ArrowUp" || e.key === "w" || e.key === "W";
        const isDown = e.key === "ArrowDown" || e.key === "s" || e.key === "S";
        const isLeft = e.key === "ArrowLeft" || e.key === "a" || e.key === "A";
        const isRight =
          e.key === "ArrowRight" || e.key === "d" || e.key === "D";
        const isEnter = e.key === "Enter";

        if (view === "home") {
          const cards = document
            .getElementById("cat-grid")
            .querySelectorAll(".cat-card");
          if (!cards.length) return;
          const cols = 3,
            max = cards.length - 1;
          if (isRight) {
            e.preventDefault();
            focusCatIdx = Math.min(focusCatIdx + 1, max);
          } else if (isLeft) {
            e.preventDefault();
            focusCatIdx = Math.max(focusCatIdx - 1, 0);
          } else if (isDown) {
            e.preventDefault();
            focusCatIdx = Math.min(focusCatIdx + cols, max);
          } else if (isUp) {
            e.preventDefault();
            focusCatIdx = Math.max(focusCatIdx - cols, 0);
          } else if (isEnter && focusCatIdx >= 0) {
            e.preventDefault();
            cards[focusCatIdx].click();
            return;
          } else return;
          if (focusCatIdx < 0) focusCatIdx = 0;
          cards.forEach((c, i) =>
            c.classList.toggle("focused", i === focusCatIdx),
          );
          cards[focusCatIdx].scrollIntoView({ block: "nearest" });
          return;
        }
        if (view === "category") {
          const rows = document
            .getElementById("task-list")
            .querySelectorAll(".task-row");
          if (!rows.length) return;
          if (isDown || isRight) {
            e.preventDefault();
            focusTaskIdx = Math.min(focusTaskIdx + 1, rows.length - 1);
          } else if (isUp || isLeft) {
            e.preventDefault();
            focusTaskIdx = Math.max(focusTaskIdx - 1, 0);
          } else if (isEnter && focusTaskIdx >= 0) {
            e.preventDefault();
            rows[focusTaskIdx].click();
            return;
          } else return;
          if (focusTaskIdx < 0) focusTaskIdx = 0;
          rows.forEach((r, i) =>
            r.classList.toggle("focused", i === focusTaskIdx),
          );
          rows[focusTaskIdx].scrollIntoView({ block: "nearest" });
          return;
        }
      });
