      // ═══════════ DRAGGABLE MODALS ═══════════
      // Every modal (.modal-bg > .modal) can be dragged by its header, anywhere. The modal is
      // centered by the flex backdrop; the drag is a translate on top of that. The offset is
      // reset every time a modal is opened or closed, so it can never get lost.
      (function () {
        const offsets = new WeakMap(); // modal → { x, y }

        const place = (modal, x, y) => {
          offsets.set(modal, { x, y });
          modal.style.transform = x || y ? `translate(${x}px, ${y}px)` : "";
        };

        let drag = null;
        document.addEventListener("pointerdown", (e) => {
          if (e.button !== 0 || e.target.closest("button, a, input, textarea, select")) return;
          const head = e.target.closest(".m-head");
          const modal = head && head.closest(".modal-bg > .modal");
          if (!modal) return;
          const cur = offsets.get(modal) || { x: 0, y: 0 };
          drag = { modal, id: e.pointerId, sx: e.clientX - cur.x, sy: e.clientY - cur.y };
          head.setPointerCapture(e.pointerId);
          modal.classList.add("dragging");
          e.preventDefault();
        });
        document.addEventListener("pointermove", (e) => {
          if (!drag || e.pointerId !== drag.id) return;
          place(drag.modal, Math.round(e.clientX - drag.sx), Math.round(e.clientY - drag.sy));
        });
        const end = (e) => {
          if (!drag || e.pointerId !== drag.id) return;
          drag.modal.classList.remove("dragging");
          drag = null;
        };
        document.addEventListener("pointerup", end);
        document.addEventListener("pointercancel", end);

        // a fresh open (or a close) puts the modal back to the center
        document.querySelectorAll(".modal-bg").forEach((bg) => {
          const modal = bg.querySelector(":scope > .modal");
          if (!modal) return;
          new MutationObserver(() => place(modal, 0, 0)).observe(bg, {
            attributes: true,
            attributeFilter: ["class"],
          });
        });
      })();
