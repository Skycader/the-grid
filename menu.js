// ═══════════════════════════════════════════════════════════════
//  GRID::RUNNER — menu.js
//
//  STRUCTURE RULES:
//  • Each node has { id, name, folder } and optionally { children[] }
//  • Tasks are NOT listed here — they live in config/{folder}.js
//  • Boot loader calls:  config/{folder}.js → window.CFG_{id} = [...]
//  • Task files live in: grid/{folder}/{task.file}.js
//
//  NESTING: arbitrary depth is supported.
//  Example deep path: home → ALGO → Sorting → Selection Sort
// ═══════════════════════════════════════════════════════════════

// eslint-disable-next-line no-unused-vars
const MENU = [
  {
    id: "regex",
    name: "REGEX",
    desc: "Pattern Matching",
    folder: "regex",
    // tasks from: config/regex.js → window.CFG_regex
  },
  {
    id: "algo",
    name: "ALGORITHM",
    desc: "Algorithm solving",
    folder: "algo",
    // tasks from: config/algo.js → window.CFG_algo
  },
];
