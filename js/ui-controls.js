      // ═══════════ FONT SIZE ═══════════
      function applyFZ() {
        if (editor) editor.updateOptions({ fontSize: _fz });
        const el = document.getElementById("fz-val");
        if (el) el.textContent = _fz;
        localStorage.setItem(FZ_KEY, _fz);
      }
      function changeFZ(delta) {
        _fz = Math.min(FZ_MAX, Math.max(FZ_MIN, _fz + delta));
        applyFZ();
      }

      // ═══════════ STRICT MODE ═══════════
      function toggleStrict() {
        if (_strictLocked) return;
        _strictOn = !_strictOn;
        updateStrictUI();
        playClick();
      }
      function updateStrictUI() {
        const g = document.getElementById("strict-grp");
        const c = document.getElementById("strict-chk");
        if (!g || !c) return;
        g.classList.toggle("strict-on", _strictOn);
        g.classList.toggle("strict-locked", _strictLocked);
        c.textContent = _strictOn ? "✓" : "";
        g.title = _strictLocked
          ? "STRICT MODE locked — required by this task"
          : `STRICT MODE ${_strictOn ? "ON" : "OFF"}: compare timing vs reference (±${(STRICT_TOLERANCE * 100).toFixed(0)}%)`;
      }

      // ═══════════ MOBILE RESULTS SHEET ═══════════
      function isMobile() {
        return window.innerWidth <= 680;
      }
      function openMobResults() {
        if (isMobile())
          document.getElementById("res-panel").classList.add("mob-open");
      }
      function closeMobResults() {
        document.getElementById("res-panel").classList.remove("mob-open");
      }

