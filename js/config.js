      // ════════════════════════════════════════════════
      //  CONFIG
      // ════════════════════════════════════════════════
      const TEST_ON_SAVE = true; // Ctrl+S triggers format + run

      // Strict mode: user minTime must not exceed ref minTime × (1 + STRICT_TOLERANCE).
      // 0.10 = 10% slower allowed (recommended). 0.0 = exact match required.
      const STRICT_TOLERANCE = 0.1;
      const STRICT_DEFAULT = true; // strict mode on by default

      const FALLBACK_SVG = `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="4" y="4" width="40" height="40" rx="3" stroke="currentColor" stroke-width="1.5"/>
  <circle cx="24" cy="24" r="10" stroke="currentColor" stroke-width="1.5"/>
  <line x1="24" y1="4" x2="24" y2="44" stroke="currentColor" stroke-width="1" opacity=".4"/>
  <line x1="4" y1="24" x2="44" y2="24" stroke="currentColor" stroke-width="1" opacity=".4"/>
</svg>`;

      // ── In-memory state (no localStorage) ──
      const STATUS = {};
      const CODE = {};
      const FILECACHE = {};
      const ICONSTORE = {};
      // RANKSSTORE: folder → md string (loaded) | null (absent) | undefined (not yet fetched)
      const RANKSSTORE = {};

      // ── Strict mode ──
      let _strictOn = STRICT_DEFAULT;
      let _strictLocked = false; // task.strict===true → cannot turn off

      // ── Font size (persisted to localStorage) ──
      const FZ_KEY = "gr_fontsize";
      const FZ_MIN = 9,
        FZ_MAX = 28;
      let _fz = parseInt(localStorage.getItem(FZ_KEY) || "14", 10);
      if (_fz < FZ_MIN || _fz > FZ_MAX) _fz = 14;

      // ── Pagination ──
      const PAGE_SIZE = 9;
      let catPage = 0;
      let _filteredMenu = MENU; // what's visible during search

