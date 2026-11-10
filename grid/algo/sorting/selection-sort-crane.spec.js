/* Selection sort with a harbour crane
 * Write f(crane): sort the containers (the array behind the crane) in place, ascending, with the selection sort
 * algorithm, using only crane.scan(index), crane.grab(index), crane.put(index) and crane.getLength().
 * The magnet holds at most 2 containers and releases them like a stack: the container grabbed LAST goes first.
 *
 * Example:
 *   [5, 4, 3, 2, 1]  →  [1, 2, 3, 4, 5]
 *   swap of the cells 0 and 3:  grab(0), grab(3), put(0), put(3)
 *
 * Scope:
 *   ✓ rows of any length (also empty and one item), sorted, reversed, shuffled, with equal items, with negative
 *     and fractional numbers, numbers of different length (9 < 10 < 100)
 *   ✓ the result is in the cells behind the crane (the answer of f is not used); the magnet is empty at the end
 *   ✓ an accident stops the crane: a third grab(), grab() from an empty cell, put() with an empty magnet, put()
 *     into a taken cell, an index outside of the row (scan, grab and put alike)
 *   ✓ requests for n items: grabs at most 2 * (n - 1), puts at most 2 * (n - 1), scans from n * (n - 1) / 2 to
 *     n * (n - 1) + 2 * (n - 1); getLength() is free
 *   ✓ the sort() of arrays is forbidden (checked with __source)
 *   ✓ speed: the timing test (6.3) sorts a lot of short rows — the solution is compared with the reference
 *     one by STRICT mode
 *   ✗ not pinned: the order of equal items (they are the same numbers), rows of strings
 *
 * Difficulty: ★★★★☆☆☆☆☆☆ (4/10)
 */

const f = require("./selection-sort-crane.js");

// The containers are private. An accident throws (the crane stops at once). Every call is counted.
class Crane {
  #cells;
  #hand = [];
  scans = 0;
  grabs = 0;
  puts = 0;
  constructor(arr) {
    this.#cells = [...arr];
  }

  #accident(message) {
    throw new Error("ACCIDENT: " + message);
  }

  #inRow(index) {
    return Number.isInteger(index) && index >= 0 && index < this.#cells.length;
  }

  scan(index) {
    this.scans++;
    if (!this.#inRow(index)) this.#accident("scan outside of the row");
    return this.#cells[index] === null ? undefined : this.#cells[index];
  }

  grab(index) {
    this.grabs++;
    if (this.#hand.length >= 2) this.#accident("the magnet holds 2 containers already");
    if (!this.#inRow(index)) this.#accident("grab outside of the row");
    if (this.#cells[index] === null) this.#accident("grab from an empty cell");
    this.#hand.push(this.#cells[index]);
    this.#cells[index] = null;
  }

  put(index) {
    this.puts++;
    if (this.#hand.length === 0) this.#accident("put with an empty magnet");
    if (!this.#inRow(index)) this.#accident("put outside of the row");
    if (this.#cells[index] !== null) this.#accident("put into a taken cell");
    this.#cells[index] = this.#hand.pop();
  }

  getLength() {
    return this.#cells.length;
  }

  get snapshot() {
    return this.#cells.map((c) => (c === null ? "empty" : c));
  }

  get held() {
    return this.#hand.length;
  }
}

// run the sort on a row: the cells after the sort and the requests; an accident is kept, not thrown
const run = (arr) => {
  const crane = new Crane(arr);
  let accident = null;
  try {
    f(crane);
  } catch (e) {
    accident = e.message;
  }
  return { result: crane.snapshot, held: crane.held, accident, scans: crane.scans, grabs: crane.grabs, puts: crane.puts };
};
const sorted = (arr) => run(arr).result;

// the same numbers on every run: 1 .. n, mixed
const ascending = (n) => Array.from({ length: n }, (_, i) => i + 1);
const descending = (n) => ascending(n).reverse();
const shuffled = (n) => {
  const arr = ascending(n);
  let seed = 12345;
  for (let i = n - 1; i > 0; i--) {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    const j = seed % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// the limits of the requests for n items
const maxMoves = (n) => Math.max(0, 2 * (n - 1));
const minScans = (n) => (n * (n - 1)) / 2;
const maxScans = (n) => n * (n - 1) + 2 * (n - 1);

describe(":: Running test case for SELECTION SORT WITH A CRANE", () => {
  // ==========================================
  // 1️⃣ BASIC
  // ==========================================
  describe("1️⃣ Basic", () => {
    it("1️⃣.1️⃣ should sort a reversed row [5, 4, 3, 2, 1]", () => {
      const r = run([5, 4, 3, 2, 1]);
      expect(r.result).toEqual([1, 2, 3, 4, 5]);
      expect(r.grabs).toBeLessThanOrEqual(8);
      expect(r.puts).toBeLessThanOrEqual(8);
      expect(r.scans).toBeGreaterThanOrEqual(10);
      expect(r.scans).toBeLessThanOrEqual(28);
    });

    it("1️⃣.2️⃣ should work with a row that is already sorted", () => {
      expect(sorted([1, 2, 3])).toEqual([1, 2, 3]);
    });

    it("1️⃣.3️⃣ should work with an empty row", () => {
      expect(sorted([])).toEqual([]);
    });

    it("1️⃣.4️⃣ should have no sort() in the source", () => {
      expect(__source).not.toMatch(/\.sort\s*\(/);
    });
  });

  // ==========================================
  // 2️⃣ ROWS OF EVERY KIND
  // ==========================================
  // One row of the table = the containers and what is in the cells after the sort. Why these rows: every short
  // length, sorted and reversed, equal items, negative and fractional numbers, numbers of different length.
  describe("2️⃣ Rows of every kind", () => {
    const rows = [
      [[], []],
      [[1], [1]],
      [[2, 1], [1, 2]],
      [[1, 2], [1, 2]],
      [[3, 1, 2], [1, 2, 3]],
      [[2, 3, 1], [1, 2, 3]],
      [[1, 3, 2], [1, 2, 3]],
      [[5, 4, 3, 2, 1], [1, 2, 3, 4, 5]],
      [[1, 2, 3, 4, 5], [1, 2, 3, 4, 5]],
      [[2, 5, 1, 4, 3], [1, 2, 3, 4, 5]],
      [[2, 2, 2], [2, 2, 2]],
      [[2, 2, 1], [1, 2, 2]],
      [[1, 2, 2], [1, 2, 2]],
      [[3, 1, 3, 1, 2], [1, 1, 2, 3, 3]],
      [[0, 0, 0, 0], [0, 0, 0, 0]],
      [[10, 9, 2, 1, 100], [1, 2, 9, 10, 100]],
      [[-1, -5, 0, 3, -2], [-5, -2, -1, 0, 3]],
      [[-3, -2, -1], [-3, -2, -1]],
      [[-1, 0.5, -3], [-3, -1, 0.5]],
      [[0.5, 0.25, 0.75, 0.1], [0.1, 0.25, 0.5, 0.75]],
      [[100, 20, 3, 400, 5], [3, 5, 20, 100, 400]],
      [[1000000, -1000000, 0], [-1000000, 0, 1000000]],
      [[9, 8, 7, 6, 5, 4, 3, 2, 1, 0], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]],
      [[7, 7, 3, 3, 9, 9, 1, 1], [1, 1, 3, 3, 7, 7, 9, 9]],
    ];

    it.each(rows)("2️⃣.1️⃣ %j → %j", (arr, expected) => {
      expect(sorted(arr)).toEqual(expected);
    });

    it("2️⃣.2️⃣ should sort the numbers by value, not as texts", () => {
      expect(sorted([10, 9, 8, 100, 1])).toEqual([1, 8, 9, 10, 100]);
    });

    it("2️⃣.3️⃣ should sort a shuffled row of 50 containers", () => {
      expect(sorted(shuffled(50))).toEqual(ascending(50));
    });

    it("2️⃣.4️⃣ should sort a reversed row of 100 containers", () => {
      expect(sorted(descending(100))).toEqual(ascending(100));
    });
  });

  // ==========================================
  // 3️⃣ THE END OF THE WORK
  // ==========================================
  // One row = the length n. Why: the crane has to stop with no accident, an empty magnet and no hole in the row
  // (a container that was grabbed and never put back leaves a hole and a container in the magnet).
  describe("3️⃣ The end of the work", () => {
    const sizes = [[0], [1], [2], [3], [5], [10], [30]];

    it.each(sizes)("3️⃣.1️⃣ n = %j: no accident (shuffled row)", (n) => {
      expect(run(shuffled(n)).accident).toBeNull();
    });

    it.each(sizes)("3️⃣.2️⃣ n = %j: no accident (reversed row)", (n) => {
      expect(run(descending(n)).accident).toBeNull();
    });

    it.each(sizes)("3️⃣.3️⃣ n = %j: the magnet is empty at the end (shuffled row)", (n) => {
      expect(run(shuffled(n)).held).toBe(0);
    });

    it.each(sizes)("3️⃣.4️⃣ n = %j: no hole in the row at the end (reversed row)", (n) => {
      expect(run(descending(n)).result).not.toContain("empty");
    });
  });

  // ==========================================
  // 4️⃣ THE MOVES (GRAB AND PUT)
  // ==========================================
  // One row = the length n. Why: the selection sort swaps at most once per pass, one swap is 2 grabs and 2 puts,
  // so at most 2 * (n - 1) of each, whatever the row; a bubble sort or an insertion sort moves much more.
  // A swap of a cell with itself is an accident (the second grab() takes from an empty cell).
  describe("4️⃣ The moves", () => {
    const sizes = [[0], [1], [2], [3], [5], [10], [30], [100]];

    it.each(sizes)("4️⃣.1️⃣ n = %j: at most 2 * (n - 1) grabs for a reversed row", (n) => {
      expect(run(descending(n)).grabs).toBeLessThanOrEqual(maxMoves(n));
    });

    it.each(sizes)("4️⃣.2️⃣ n = %j: at most 2 * (n - 1) puts for a shuffled row", (n) => {
      expect(run(shuffled(n)).puts).toBeLessThanOrEqual(maxMoves(n));
    });

    it.each(sizes)("4️⃣.3️⃣ n = %j: not a single grab for a sorted row (nothing to move)", (n) => {
      expect(run(ascending(n)).grabs).toBe(0);
    });

    it.each(sizes)("4️⃣.4️⃣ n = %j: as many puts as grabs (shuffled row)", (n) => {
      const r = run(shuffled(n));
      expect(r.puts).toBe(r.grabs);
    });
  });

  // ==========================================
  // 5️⃣ THE SCANS
  // ==========================================
  // One row = the length n. Why: every pass looks at the rest of the row, so there are at least n * (n - 1) / 2
  // scans (a solution that scans the row once, sorts it by itself and moves the containers is not the
  // algorithm of the task) and not more than n * (n - 1) + 2 * (n - 1).
  describe("5️⃣ The scans", () => {
    const sizes = [[2], [3], [5], [10], [30], [100]];

    it.each(sizes)("5️⃣.1️⃣ n = %j: at least n * (n - 1) / 2 scans for a shuffled row", (n) => {
      expect(run(shuffled(n)).scans).toBeGreaterThanOrEqual(minScans(n));
    });

    it.each(sizes)("5️⃣.2️⃣ n = %j: at most n * (n - 1) + 2 * (n - 1) scans for a shuffled row", (n) => {
      expect(run(shuffled(n)).scans).toBeLessThanOrEqual(maxScans(n));
    });

    it.each(sizes)("5️⃣.3️⃣ n = %j: the same limits of the scans for a sorted row", (n) => {
      const r = run(ascending(n));
      expect(r.scans).toBeGreaterThanOrEqual(minScans(n));
      expect(r.scans).toBeLessThanOrEqual(maxScans(n));
    });

    it.each(sizes)("5️⃣.4️⃣ n = %j: the same limits of the scans for a reversed row", (n) => {
      const r = run(descending(n));
      expect(r.scans).toBeGreaterThanOrEqual(minScans(n));
      expect(r.scans).toBeLessThanOrEqual(maxScans(n));
    });

    it("5️⃣.5️⃣ should NOT touch the crane for an empty row and a row of one container", () => {
      expect(run([]).scans).toBe(0);
      expect(run([5]).scans).toBe(0);
      expect(run([]).grabs).toBe(0);
      expect(run([5]).grabs).toBe(0);
    });
  });

  // ==========================================
  // 6️⃣ SPEED
  // ==========================================
  describe("6️⃣ Speed", () => {
    let big;
    let speed;

    beforeAll(() => {
      big = descending(150);
      speed = [[5, 4, 3, 2, 1], [3, 1, 2], [2, 2, 1], [-1, 0.5, -3], [1, 2, 3, 4], [7, 3, 9, 1, 8, 2], []];
    });

    it("6️⃣.1️⃣ should sort a reversed row of 150 containers correctly and fast", () => {
      const t0 = Date.now();
      const r = run(big);
      const elapsed = Date.now() - t0;
      expect(r.result).toEqual(ascending(150));
      expect(elapsed).toBeLessThan(1000);
    });

    it("6️⃣.2️⃣ should give the same answer for the same row every time", () => {
      expect(sorted([3, 1, 2])).toEqual([1, 2, 3]);
      expect(sorted([3, 1, 2])).toEqual([1, 2, 3]);
      expect(sorted([2, 1])).toEqual([1, 2]);
    });

    // The timing test: most of the spec's run time is spent here, so STRICT mode compares the player's
    // function with the reference one on exactly this work (about 14 000 short sorts).
    it("6️⃣.3️⃣ should stay fast on a lot of short rows", () => {
      let total = 0;
      for (let i = 0; i < 2000; i++) {
        for (let j = 0; j < speed.length; j++) total += sorted(speed[j]).length;
      }
      expect(total).toBe(2000 * 24);
    });
  });
});
