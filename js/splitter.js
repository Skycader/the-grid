// ═══════════ SPLITTERS ═══════════
// The borders of the task view can be dragged: the editor | the right column (width), and DEMO / the test
// results (height). Double-click on a border resets it. The sizes are kept in localStorage (gr_split).
// The sizes are the CSS variables --res-w (the right column, % of the editor area) and --demo-h (DEMO, % of the column).
(function () {
  const KEY = "gr_split";
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(KEY) || "{}") || {};
  } catch (e) {}
  const area = document.querySelector(".editor-area");
  const col = document.getElementById("res-panel");
  const sv = document.getElementById("split-v");
  const sh = document.getElementById("split-h");
  if (!area || !col || !sv || !sh) return;

  const apply = () => {
    if (saved.w) col.style.setProperty("--res-w", saved.w + "%");
    else col.style.removeProperty("--res-w");
    if (saved.h) col.style.setProperty("--demo-h", saved.h + "%");
    else col.style.removeProperty("--demo-h");
  };
  const store = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify(saved));
    } catch (e) {}
  };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function drag(handle, onMove, onReset) {
    handle.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      try {
        handle.setPointerCapture(e.pointerId);
      } catch (err) {}
      handle.classList.add("drag");
      document.body.classList.add("split-drag");
      const move = (ev) => onMove(ev);
      const up = () => {
        handle.classList.remove("drag");
        document.body.classList.remove("split-drag");
        handle.removeEventListener("pointermove", move);
        handle.removeEventListener("pointerup", up);
        handle.removeEventListener("pointercancel", up);
        store();
      };
      handle.addEventListener("pointermove", move);
      handle.addEventListener("pointerup", up);
      handle.addEventListener("pointercancel", up);
    });
    handle.addEventListener("dblclick", () => {
      onReset();
      apply();
      store();
    });
  }

  drag(
    sv,
    (e) => {
      const r = area.getBoundingClientRect();
      saved.w = +clamp(((r.right - e.clientX) / r.width) * 100, 15, 80).toFixed(2);
      apply();
    },
    () => delete saved.w,
  );
  drag(
    sh,
    (e) => {
      const r = col.getBoundingClientRect();
      // the header of the results and a bit of the list always stay visible
      const hPx = clamp(e.clientY - r.top, 60, Math.max(60, r.height - 90));
      saved.h = +((hPx / r.height) * 100).toFixed(2);
      apply();
    },
    () => delete saved.h,
  );
  apply();
})();
