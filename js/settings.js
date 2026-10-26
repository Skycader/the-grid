      // ═══════════ SETTINGS ═══════════
      // The gear button on the home screen opens the settings window. A setting is a segmented control (one
      // button of the group is on); the choices are kept in localStorage (gr_settings) and read through SETTINGS.
      //   needFill  "in"  (default): the pool of the need button shows the calm: 80 % need = 20 % water
      //             "out"          : the pool shows the need itself: 80 % need = 80 % water
      const ST_KEY = "gr_settings";
      const SETTINGS = { needFill: "in" };
      const ST_CHOICES = { needFill: ["in", "out"] };
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
      }
      function stSet(name, value) {
        if (SETTINGS[name] === value) return;
        SETTINGS[name] = value;
        try {
          localStorage.setItem(ST_KEY, JSON.stringify(SETTINGS));
        } catch (e) {}
        stRender();
        stDemoRender();
        if (name === "needFill" && typeof hvNeedRender === "function") hvNeedRender();
      }
      // The demo: the pool of the need button (js/harvest.js), with a slider of the need to try the
      // setting on. The slider starts at the real need (60 % when there is nothing solved yet to measure).
      let _stPool = null;
      const stNeed = document.getElementById("st-need");
      function stDemoRender() {
        document.getElementById("st-need-val").textContent = stNeed.value + "%";
        if (_stPool) hvPoolSetWater(_stPool, hvWaterOf(+stNeed.value));
      }
      stNeed.addEventListener("input", stDemoRender);
      function stOpen() {
        if (!_stPool) _stPool = hvPoolMake(document.getElementById("st-pool"));
        const real = hvMeasuredNeed();
        stNeed.value = _hvNeedCount ? Math.round(real) : 60;
        stRender();
        stModal.classList.remove("hide");
        stDemoRender();
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
