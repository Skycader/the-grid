      // ═══════════ NUMBER INPUT ═══════════
      // A custom + / − stepper instead of the native spin buttons of <input type="number"> (they are hidden by
      // the CSS): every number input gets two small buttons on its right edge. A press steps by input.step and
      // is clamped to min / max; holding the button repeats (a pause, then faster). The input fires "input" and
      // "change" as if the player had typed the number, so the code that listens to the input does not change.
      const NUM_PLUS =
        '<svg width="9" height="9" viewBox="0 0 9 9" aria-hidden="true"><path d="M4.5 1V8M1 4.5H8" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>';
      const NUM_MINUS =
        '<svg width="9" height="9" viewBox="0 0 9 9" aria-hidden="true"><path d="M1 4.5H8" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>';

      function numStep(input, dir) {
        const step = parseFloat(input.step) > 0 ? parseFloat(input.step) : 1;
        const min = input.min === "" ? -Infinity : parseFloat(input.min);
        const max = input.max === "" ? Infinity : parseFloat(input.max);
        const cur = parseFloat(input.value);
        // an empty field starts from the lower bound (or 0), like the native control
        let next = Number.isFinite(cur) ? cur + dir * step : Number.isFinite(min) ? min : 0;
        next = Math.min(max, Math.max(min, next));
        // the step is whole for an integer field: no 0.30000000000000004
        next = Math.round(next / step) * step;
        next = +next.toFixed(6);
        if (String(next) === input.value) return;
        input.value = next;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }

      function numEnhance(input) {
        if (input.closest(".num-wrap")) return;
        const wrap = document.createElement("span");
        wrap.className = "num-wrap" + (input.classList.contains("hv-num") ? " num-wide" : "");
        input.parentNode.insertBefore(wrap, input);
        wrap.appendChild(input);
        const btns = document.createElement("span");
        btns.className = "num-btns";
        btns.innerHTML =
          `<button type="button" class="num-btn" tabindex="-1" aria-label="Increase" data-d="1">${NUM_PLUS}</button>` +
          `<button type="button" class="num-btn" tabindex="-1" aria-label="Decrease" data-d="-1">${NUM_MINUS}</button>`;
        wrap.appendChild(btns);

        let hold = 0,
          repeat = 0;
        const stop = () => {
          clearTimeout(hold);
          clearInterval(repeat);
          hold = repeat = 0;
        };
        btns.addEventListener("pointerdown", (e) => {
          const b = e.target.closest(".num-btn");
          if (!b || e.button !== 0 || input.disabled) return;
          e.preventDefault(); // the input keeps the focus
          const dir = +b.dataset.d;
          playClick();
          numStep(input, dir);
          stop();
          hold = setTimeout(() => {
            repeat = setInterval(() => numStep(input, dir), 70);
          }, 420);
        });
        ["pointerup", "pointerleave", "pointercancel"].forEach((t) => btns.addEventListener(t, stop));
      }

      document.querySelectorAll('input[type="number"]').forEach(numEnhance);
