/* Selection sort through an API
 * 🎖CERTIFIED 2026-10-23
 * Write f(api): sort the array behind the API in place, ascending, with the selection sort algorithm, using
 * only api.get(index), api.set(index, value) and api.getLength().
 *
 * Example:
 *   [5, 4, 3, 2, 1]  →  [1, 2, 3, 4, 5]
 *
 * Scope:
 *   ✓ arrays of any length (also empty and one item), sorted, reversed, shuffled, with equal items, with
 *     negative and fractional numbers, numbers of different length (9 < 10 < 100)
 *   ✓ the result is in the array behind the API (the answer of f is not used)
 *   ✓ requests for n items: writes at most 2 * (n - 1), reads from n * (n - 1) / 2 to n * (n - 1) + 2 * (n - 1),
 *     never an index outside of the array; getLength() is free
 *   ✓ the sort() of arrays is forbidden (checked with __source)
 *   ✓ speed: the timing test (6.3) sorts a lot of short arrays — the solution is compared with the reference
 *     one by STRICT mode
 *   ✗ not pinned: the order of equal items (they are the same numbers), arrays of strings, a swap of an item with
 *     itself (it is allowed: it is a write)
 *
 * Difficulty: ★★★☆☆☆☆☆☆☆ (3/10)
 */

const f = require("./selection-sort.js");

// the array behind the API is private; every get() and set() is counted, indexes out of range too
class Api {
  #arr;
  reads = 0;
  writes = 0;
  outOfRange = 0;
  constructor(arr) {
    this.#arr = [...arr];
  }

  get(index) {
    this.reads++;
    if (!Number.isInteger(index) || index < 0 || index >= this.#arr.length) this.outOfRange++;
    return this.#arr[index];
  }

  set(index, value) {
    this.writes++;
    if (!Number.isInteger(index) || index < 0 || index >= this.#arr.length) {
      this.outOfRange++;
      return;
    }
    this.#arr[index] = value;
  }

  getLength() {
    return this.#arr.length;
  }

  get snapshot() {
    return [...this.#arr];
  }
}

// run the sort on an array: the array after the sort and the requests
const run = (arr) => {
  const api = new Api(arr);
  f(api);
  return { result: api.snapshot, reads: api.reads, writes: api.writes, outside: api.outOfRange };
};
const sorted = (arr) => run(arr).result;

// the same numbers on every run: 1 .. n, mixed
const shuffled = (n) => {
  const arr = Array.from({ length: n }, (_, i) => i + 1);
  let seed = 12345;
  for (let i = n - 1; i > 0; i--) {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    const j = seed % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};
const ascending = (n) => Array.from({ length: n }, (_, i) => i + 1);
const descending = (n) => ascending(n).reverse();

// the limits of the requests for n items
const maxWrites = (n) => Math.max(0, 2 * (n - 1));
const minReads = (n) => (n * (n - 1)) / 2;
const maxReads = (n) => n * (n - 1) + 2 * (n - 1);

describe(":: Running test case for SELECTION SORT (through an API)", () => {
  // ==========================================
  // 1️⃣ BASIC
  // ==========================================
  describe("1️⃣ Basic", () => {
    it("1️⃣.1️⃣ should sort a reversed array [5, 4, 3, 2, 1]", () => {
      const r = run([5, 4, 3, 2, 1]);
      expect(r.result).toEqual([1, 2, 3, 4, 5]);
      expect(r.writes).toBeLessThanOrEqual(8);
      expect(r.reads).toBeGreaterThanOrEqual(10);
      expect(r.reads).toBeLessThanOrEqual(28);
    });

    it("1️⃣.2️⃣ should work with an array that is already sorted", () => {
      expect(sorted([1, 2, 3])).toEqual([1, 2, 3]);
    });

    it("1️⃣.3️⃣ should work with an empty array", () => {
      expect(sorted([])).toEqual([]);
    });

    it("1️⃣.4️⃣ should have no sort() in the source", () => {
      expect(__source).not.toMatch(/\.sort\s*\(/);
    });
  });

  // ==========================================
  // 2️⃣ ARRAYS OF EVERY KIND
  // ==========================================
  // One row = the array and what is in it after the sort. Why these rows: every short length, sorted and
  // reversed, equal items, negative and fractional numbers, numbers of different length (not a text order).
  describe("2️⃣ Arrays of every kind", () => {
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
      [[1.5, 1.25, 1.75], [1.25, 1.5, 1.75]],
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

    it("2️⃣.3️⃣ should sort a shuffled array of 50 numbers", () => {
      expect(sorted(shuffled(50))).toEqual(ascending(50));
    });

    it("2️⃣.4️⃣ should sort a reversed array of 100 numbers", () => {
      expect(sorted(descending(100))).toEqual(ascending(100));
    });

    it("2️⃣.5️⃣ should keep every item: the sorted array has the same numbers", () => {
      const arr = [4, 4, 1, 9, -2, 0.5, 9, 3];
      expect(sorted(arr)).toEqual([-2, 0.5, 1, 3, 4, 4, 9, 9]);
    });
  });

  // ==========================================
  // 3️⃣ THE WRITES
  // ==========================================
  // One row = the length n. Why these rows: the selection sort swaps at most once per pass, so there are at
  // most 2 * (n - 1) writes, whatever the array; a bubble sort or an insertion sort writes much more.
  describe("3️⃣ The writes", () => {
    const sizes = [[0], [1], [2], [3], [5], [10], [30], [100]];

    it.each(sizes)("3️⃣.1️⃣ n = %j: at most 2 * (n - 1) writes for a reversed array", (n) => {
      expect(run(descending(n)).writes).toBeLessThanOrEqual(maxWrites(n));
    });

    it.each(sizes)("3️⃣.2️⃣ n = %j: at most 2 * (n - 1) writes for a shuffled array", (n) => {
      expect(run(shuffled(n)).writes).toBeLessThanOrEqual(maxWrites(n));
    });

    it.each(sizes)("3️⃣.3️⃣ n = %j: at most 2 * (n - 1) writes for a sorted array", (n) => {
      expect(run(ascending(n)).writes).toBeLessThanOrEqual(maxWrites(n));
    });
  });

  // ==========================================
  // 4️⃣ THE READS
  // ==========================================
  // One row = the length n. Why these rows: every pass looks at the rest of the array, so there are at least
  // n * (n - 1) / 2 reads (a solution that reads the array once, sorts it by itself and writes it back is not
  // the algorithm of the task) and not more than n * (n - 1) + 2 * (n - 1).
  describe("4️⃣ The reads", () => {
    const sizes = [[2], [3], [5], [10], [30], [100]];

    it.each(sizes)("4️⃣.1️⃣ n = %j: at least n * (n - 1) / 2 reads for a shuffled array", (n) => {
      expect(run(shuffled(n)).reads).toBeGreaterThanOrEqual(minReads(n));
    });

    it.each(sizes)("4️⃣.2️⃣ n = %j: at most n * (n - 1) + 2 * (n - 1) reads for a shuffled array", (n) => {
      expect(run(shuffled(n)).reads).toBeLessThanOrEqual(maxReads(n));
    });

    it.each(sizes)("4️⃣.3️⃣ n = %j: the same limits of the reads for a sorted array", (n) => {
      const r = run(ascending(n));
      expect(r.reads).toBeGreaterThanOrEqual(minReads(n));
      expect(r.reads).toBeLessThanOrEqual(maxReads(n));
    });

    it.each(sizes)("4️⃣.4️⃣ n = %j: the same limits of the reads for a reversed array", (n) => {
      const r = run(descending(n));
      expect(r.reads).toBeGreaterThanOrEqual(minReads(n));
      expect(r.reads).toBeLessThanOrEqual(maxReads(n));
    });

    it("4️⃣.5️⃣ should NOT read anything for an empty array and an array of one item", () => {
      expect(run([]).reads).toBe(0);
      expect(run([5]).reads).toBe(0);
      expect(run([]).writes).toBe(0);
      expect(run([5]).writes).toBe(0);
    });
  });

  // ==========================================
  // 5️⃣ THE INDEXES
  // ==========================================
  describe("5️⃣ The indexes", () => {
    const sizes = [[0], [1], [2], [3], [7], [30]];

    it.each(sizes)("5️⃣.1️⃣ n = %j: no index outside of the array for a shuffled array", (n) => {
      expect(run(shuffled(n)).outside).toBe(0);
    });

    it.each(sizes)("5️⃣.2️⃣ n = %j: no index outside of the array for a reversed array", (n) => {
      expect(run(descending(n)).outside).toBe(0);
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

    it("6️⃣.1️⃣ should sort a reversed array of 150 numbers correctly and fast", () => {
      const t0 = Date.now();
      const r = run(big);
      const elapsed = Date.now() - t0;
      expect(r.result).toEqual(ascending(150));
      expect(elapsed).toBeLessThan(1000);
    });

    it("6️⃣.2️⃣ should give the same answer for the same array every time", () => {
      expect(sorted([3, 1, 2])).toEqual([1, 2, 3]);
      expect(sorted([3, 1, 2])).toEqual([1, 2, 3]);
      expect(sorted([2, 1])).toEqual([1, 2]);
    });

    // The timing test: most of the spec's run time is spent here, so STRICT mode compares the player's
    // function with the reference one on exactly this work (about 14 000 short sorts).
    it("6️⃣.3️⃣ should stay fast on a lot of short arrays", () => {
      let total = 0;
      for (let i = 0; i < 2000; i++) {
        for (let j = 0; j < speed.length; j++) total += sorted(speed[j]).length;
      }
      expect(total).toBe(2000 * 24);
    });
  });
});
