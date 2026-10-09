# Spec standard

What a `*.spec.js` file in this repo must look like. The reference implementation of
this standard is [`grid/regex/ex1.spec.js`](../grid/regex/ex1.spec.js); the checklist below is
what it was built from.

A spec is the **contract of a task**, not just a test file: someone who reads only
the spec must understand what the task asks, where its boundaries are, and which
wrong solutions it rejects.

Legend: **M** — mandatory, **R** — recommended, **O** — only when it applies to the task.

---

## 1. File and runner basics

| | Rule |
|---|---|
| Name | `<task-file>.spec.js` next to `<task-file>.js` (stub) and `<task-file>.sol.js` (reference) |
| Import | `const f = require("./<task-file>.js");` — `const`, never an implicit global |
| Language | English everywhere: header, `describe`/`it` titles, comments |
| Runner | the in-browser mini-Jest (see `index.html`, `makeRunner`). Available: `describe`, `it`/`test`, `expect`, `beforeEach`, `afterEach`, `beforeAll`, `afterAll`, `require`, `__source` |
| Matchers | `toBe`, `toEqual`, `toStrictEqual`, `toMatch`, `toBeTruthy/Falsy`, `toBeNull`, `toBeUndefined`, `toBeDefined`, `toContain`, `toHaveLength`, `toBeGreaterThan(OrEqual)`, `toBeLessThan(OrEqual)`, `toThrow`, and `.not.` of all of them |
| Assertions | soft: every `expect` in a test is evaluated and reported, the first failure does not hide the rest |
| Reference | `<task-file>.sol.js` **must pass the whole spec**. A spec that its own reference fails is a bug in the spec |

## 2. Checklist

### A. Header

| # | Item | |
|---|---|---|
| A1 | Block comment `/* ExN … */` with the task statement | M |
| A2 | At least one `input → output` example | M |
| A3 | `Scope`: `✓` what is covered, `✗` what is deliberately out of scope | R |
| A4 | `Difficulty: ★…☆ (N/10)` | O — *open decision, see §6* |

### B. Structure

| # | Item | |
|---|---|---|
| B1 | One root `describe(":: Running test case for EXN (<short task name>)", …)` | M |
| B2 | Tests grouped by *kind of check* in nested `describe`s: Basic → Case → Many → … → Edge cases → Performance | R |
| B3 | Section banners (`// ====` + group title) above every nested `describe` | R |
| B4 | Numbering with keycap emoji: group `1️⃣`, test `1️⃣.1️⃣`, `1️⃣.2️⃣`, … | M |
| B5 | Titles read as a sentence: `should <observable behaviour>` | M |
| B6 | One property per test; related `expect`s of the *same* property may share a test | M |

Numbering rule (B4): a number is written digit by digit — `16` → `1️⃣6️⃣`, `10` → `1️⃣0️⃣`
(no `🔟`, so every number follows the same rule). Flat specs (no nested `describe`)
use `1️⃣`, `2️⃣`, … directly in the title.

### C. What the tests check

| # | Kind of check | |
|---|---|---|
| C1 | The example from the task, verbatim | M |
| C2 | Basic / happy path | M |
| C3 | Boundary values (exactly at the threshold, first/last position, min/max length) | M |
| C4 | Empty input and "nothing matches" | M |
| C5 | Negative cases: things that must **not** match / change | M |
| C6 | Several matches in one input (the `g` flag, repeated calls) | R |
| C7 | Case sensitivity | O |
| C8 | Multi-line input (`\n`, `\r\n`, `\t`) | O |
| C9 | Unicode / non-ASCII | O |
| C10 | Look-alike traps: input that *resembles* the target but must be rejected (`scat`, `ca t`, Cyrillic `с` instead of `c`) | R |
| C11 | Return type / shape (`typeof`, `Array.isArray`) | O |

### D. Quality of the solution

| # | Kind of check | |
|---|---|---|
| D1 | Performance / ReDoS: a larger input (up to `"x".repeat(5000)`) with a generous time limit (≥ 1 s). **Keep it small — see §5, item 7** | O |
| D2 | Source constraints through `__source` (e.g. loops forbidden: `expect(__source).not.toMatch(/\b(for\|while)\s*\(/)`) | O |
| D3 | Operation counting through an `Api` wrapper (reads / writes / iterations) for algorithm tasks | O |
| D4 | Randomised data — only with a deterministic expectation (value picked from the generated data), never a hard-coded guess | O |

### E. Technique

| # | Item | |
|---|---|---|
| E1 | `beforeEach` to recreate mutable state, `beforeAll` for expensive shared data | O |
| E2 | Helpers live at the bottom under a `// Dependencies` banner | O |
| E3 | A comment above every non-obvious case explaining **why** it exists (what wrong solution it catches) | R |
| E4 | Make `expect(<argument>)` readable: the argument text is printed in the results row, so write `expect(f("x CAT y"))` rather than hiding the input in a variable named `r` | R |

## 3. Annotated template

```js
/* ExN
 * <Task statement in one or two sentences.>
 *
 * Example:
 *   "<input>"  →  "<output>"
 *
 * Scope:
 *   ✓ <covered behaviour>
 *   ✓ <covered behaviour>
 *   ✗ <deliberately NOT covered>
 *
 * Difficulty: ★★☆☆☆☆☆☆☆☆ (2/10)        // see §6
 */

const f = require("./exN.js");

describe(":: Running test case for EXN (<short task name>)", () => {
  // ==========================================
  // 1️⃣ BASIC
  // ==========================================
  describe("1️⃣ Basic", () => {
    it("1️⃣.1️⃣ should match the example from the task", () => {
      expect(f("<input from the task>")).toBe("<output from the task>");
    });
  });

  // ==========================================
  // 2️⃣ <KIND OF CHECK>  (case / many occurrences / boundaries / …)
  // ==========================================
  describe("2️⃣ <Kind of check>", () => {
    // why: a solution that does X would pass 1️⃣.1️⃣ but fail here
    it("2️⃣.1️⃣ should <observable behaviour>", () => {
      expect(f("…")).toBe("…");
    });
  });

  // ==========================================
  // N️⃣ EDGE CASES
  // ==========================================
  describe("N️⃣ Edge cases", () => {
    it("N️⃣.1️⃣ should return an empty result for an empty input", () => {
      expect(f("")).toBe("");
    });

    it("N️⃣.2️⃣ should NOT touch look-alikes of the target", () => {
      const text = "…";
      expect(f(text)).toBe(text);
    });
  });

  // ==========================================
  // N️⃣ PERFORMANCE
  // ==========================================
  describe("N️⃣ Performance", () => {
    let big;
    beforeAll(() => {
      big = "…".repeat(5000);
    });

    it("N️⃣.1️⃣ should handle a very large input correctly and fast", () => {
      const t0 = Date.now();
      const result = f(big);
      expect(result).toBe("…");
      expect(Date.now() - t0).toBeLessThan(1000);
    });
  });
});
```

## 4. How to read the results row

Every assertion is printed as one row:

```
✓ f("x CAT y")  .toBe  "x y"                       ← passed: input, matcher, expected
✗ f("x CAT y")  .toBe  "x y"  → received "x CAT y" ← failed: received is added
✓ f(big).length .toBeLessThan  1000  → received 12 ← passed, but received differs from expected
```

The argument text is cut out of the spec source, so it is only as informative as the
spec makes it (E4).

## 5. Definition of done for a spec

1. The reference `*.sol.js` passes every test.
2. Plausible **wrong** solutions fail. Write 5–8 of them (missing flag, too greedy,
   too strict, off by one, wrong boundary) and confirm each one fails at least one test.
   A wrong solution that passes the spec means a missing test.
3. No test contradicts its own comment or the task statement.
4. Every `✗` in the header `Scope` has either a test that pins the behaviour or a
   sentence explaining why it is left open.
5. Titles, comments and the header are English; numbering follows B4.
6. Opening any row of the results shows enough to see *why* a test failed without
   reading the spec file.
7. **The whole spec runs in under ~10 ms with the reference solution.** In STRICT mode the
   app repeats the entire spec up to 100 times for the reference and 100 times for the
   user's code (1.5 s cap each, so at most ~3 s of waiting), and a single run is killed
   after 3 s (`TIMEOUT (3s)`). A 50 ms spec would use the whole cap on every RUN.
   Catastrophic backtracking is exponential: a ~30-character evil input already hangs a
   bad regex, so a ReDoS test needs a *shaped* input, not a huge one. Inputs of at most
   5 000 elements are enough for everything else (quadratic scans, copy-per-item).

## 6. Open decisions

These are not settled; the reference spec follows the current choice.

- **A4, difficulty in the header.** Difficulty already lives in `config/*.js` (`diff`).
  Keeping a second copy in the spec can drift. Current choice: `ex1.spec.js` repeats it.
- **"Known limitation" tests.** A test that is *expected to fail* (a documented gap of
  the reference solution) is always red and blocks an all-green STRICT run. The runner
  has no `test.fails` / `test.skip` yet; until it does, do not put such tests in a spec.
  Describe the gap in `Scope` (`✗`) instead.
