      // ═══════════ SETTINGS ═══════════
      // The gear button on the home screen opens the settings window. A setting is a segmented control (one
      // button of the group is on); the choices are kept in localStorage (gr_settings) and read through SETTINGS.
      //   needFill  "in"  (default): the pool of the need button shows the calm: 80 % need = 20 % water
      //             "out"          : the pool shows the need itself: 80 % need = 80 % water
      const ST_KEY = "gr_settings";
      const SETTINGS = { needFill: "in" };
      const ST_CHOICES = { needFill: ["in", "out"] };
      const ST_HINTS = {
        needFill: {
          in: "Fill in: the more the tasks need a repeat, the emptier the pool (80% need = 20% water). Nothing to repeat: a full pool.",
          out: "Fill out: the pool fills with the need (80% need = 80% water). Nothing to repeat: an empty pool.",
        },
      };
      try {
        const saved = JSON.parse(localStorage.getItem(ST_KEY) || "{}");
        for (const k in ST_CHOICES) if (ST_CHOICES[k].includes(saved[k])) SETTINGS[k] = saved[k];
      } catch (e) {}

      const stModal = document.getElementById("st-modal");
      const stFill = document.getElementById("st-fill");

      function stRender() {
        stFill.querySelectorAll(".seg-btn").forEach((b) => {
          const on = b.dataset.v === SETTINGS.needFill;
          b.classList.toggle("on", on);
          b.setAttribute("aria-checked", on);
          b.tabIndex = on ? 0 : -1; // one stop in the group, the arrows move inside it
        });
        // the hints of all the choices sit in one cell of a grid, so the window is as tall as the longest of
        // them and does not jump when the choice changes
        const hint = document.getElementById("st-fill-hint");
        if (!hint.children.length)
          hint.innerHTML = ST_CHOICES.needFill.map((v) => `<span data-v="${v}">${ST_HINTS.needFill[v]}</span>`).join("");
        hint.querySelectorAll("span").forEach((s) => s.classList.toggle("on", s.dataset.v === SETTINGS.needFill));
      }
      function stSet(name, value) {
        if (SETTINGS[name] === value) return;
        SETTINGS[name] = value;
        try {
          localStorage.setItem(ST_KEY, JSON.stringify(SETTINGS));
        } catch (e) {}
        stRender();
        if (name === "needFill" && typeof hvNeedRender === "function") hvNeedRender();
      }
      function stOpen() {
        stRender();
        stModal.classList.remove("hide");
        playClick();
      }
      function stClose() {
        stModal.classList.add("hide");
        playClick();
      }

      document.getElementById("st-btn").addEventListener("click", stOpen);
      stModal.addEventListener("click", (e) => {
        if (e.target === e.currentTarget) return stClose();
        const b = e.target.closest(".seg-btn");
        if (b && b.dataset.v !== SETTINGS.needFill) {
          playClick();
          stSet("needFill", b.dataset.v);
        }
      });
      // the arrows of a segmented control choose the neighbour
      stFill.addEventListener("keydown", (e) => {
        const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
        if (!step) return;
        e.preventDefault();
        const list = ST_CHOICES.needFill,
          next = list[(list.indexOf(SETTINGS.needFill) + step + list.length) % list.length];
        playClick();
        stSet("needFill", next);
        stFill.querySelector(`.seg-btn[data-v="${next}"]`).focus();
      });
      stRender();
