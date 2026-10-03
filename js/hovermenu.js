      // ═══════════ HOVER MENU ═══════════
      // Dropdown that opens when the cursor enters (or focus lands in) `wrap`
      // and closes after a grace period once it leaves — so the cursor has time
      // to travel from the button into the panel. Toggles the `.open` class.
      function attachHoverMenu(wrap, delay = 500) {
        let timer = null;
        const open = () => {
          clearTimeout(timer);
          wrap.classList.add("open");
        };
        const scheduleClose = () => {
          clearTimeout(timer);
          timer = setTimeout(() => wrap.classList.remove("open"), delay);
        };
        const close = () => {
          clearTimeout(timer);
          wrap.classList.remove("open");
        };
        wrap.addEventListener("mouseenter", open);
        wrap.addEventListener("mouseleave", scheduleClose);
        wrap.addEventListener("focusin", open);
        wrap.addEventListener("focusout", scheduleClose);
        return { open, close };
      }
