/* Binary Search
 * Given an API over a sorted (ascending) array of distinct numbers:
 *   api.get(index)  → the number at that index
 *   api.getLength() → the length of the array
 * Write f(api, target): the index of target in the array, or -1 when it is not there,
 * using as few api.get() requests as possible.
 *
 * Example:
 *   array [1, 2, 3, 10, 11, 20], target 2  →  1
 *
 * Scope:
 *   ✓ the target at any position, in arrays of any length (including empty and one element)
 *   ✓ a target that is not in the array: below, above, between, empty array → -1
 *   ✓ negative and fractional numbers
 *   ✓ requests: at most floor(log2(n)) + 1 per search, found or not, and never an index
 *     outside of the array
 *   ✓ speed: the timing test (7.1) runs a lot of searches — the solution is compared with the
 *     reference one by STRICT mode
 *   ✗ not pinned: duplicates (which of equal elements is returned), unsorted arrays
 *
 * Difficulty: ★★★☆☆☆☆☆☆☆ (3/10)
 */

const f = require("./binary-search.js");

// the array behind the API is private; every get() is counted, indexes out of range too
class Api {
  #arr;
  iterations = 0;
  outOfRange = 0;
  constructor(arr) {
    this.#arr = arr;
  }

  get(index) {
    this.iterations++;
    if (!Number.isInteger(index) || index < 0 || index >= this.#arr.length) this.outOfRange++;
    return this.#arr[index];
  }

  getLength() {
    return this.#arr.length;
  }
}

// the search result for one target
const find = (arr, target) => f(new Api(arr), target);

// one search: the number of get() requests and of requests outside of the array
const requests = (arr, target) => {
  const api = new Api(arr);
  f(api, target);
  return api.iterations;
};
const outside = (arr, target) => {
  const api = new Api(arr);
  f(api, target);
  return api.outOfRange;
};

// strictly increasing array of n numbers, the same on every run: 3, 7, 12, 15, …
const sortedArray = (n) => {
  const arr = [];
  let v = 3;
  for (let i = 0; i < n; i++) {
    arr.push(v);
    v += 1 + ((i * 7) % 4);
  }
  return arr;
};

// the most requests any search of this array needs: every element and every gap between them
const worstRequests = (n) => {
  const arr = sortedArray(n);
  let worst = 0;
  for (let i = 0; i < n; i++) {
    worst = Math.max(worst, requests(arr, arr[i]), requests(arr, arr[i] + 0.5));
  }
  return Math.max(worst, requests(arr, arr[0] - 1));
};

// the search never reads an index outside of the array: the sum over every target
const worstOutside = (n) => {
  const arr = sortedArray(n);
  let sum = outside(arr, arr[0] - 1) + outside(arr, arr[n - 1] + 1);
  for (let i = 0; i < n; i++) sum += outside(arr, arr[i]) + outside(arr, arr[i] + 0.5);
  return sum;
};

describe(":: Running test case for Binary Search", () => {
  // ==========================================
  // 1️⃣ BASIC
  // ==========================================
  describe("1️⃣ Basic", () => {
    it("1️⃣.1️⃣ should match the example from the task", () => {
      expect(find([1, 2, 3, 10, 11, 20], 2)).toBe(1);
    });

    const small = [1, 2, 3, 10, 11, 20];
    it.each(small.map((value, index) => [value, index]))("1️⃣.2️⃣ [1, 2, 3, 10, 11, 20]: %d → %d", (value, index) => {
      expect(find(small, value)).toBe(index);
    });

    it("1️⃣.3️⃣ should return a number", () => {
      expect(typeof find([1, 2, 3], 3)).toBe("number");
      expect(Number.isInteger(find([1, 2, 3], 3))).toBe(true);
    });
  });

  // ==========================================
  // 2️⃣ BOUNDARIES
  // ==========================================
  describe("2️⃣ Boundaries", () => {
    it("2️⃣.1️⃣ should find the first and the last element", () => {
      expect(find([5, 8, 13, 21, 34], 5)).toBe(0);
      expect(find([5, 8, 13, 21, 34], 34)).toBe(4);
    });

    it("2️⃣.2️⃣ should work on an array of one element", () => {
      expect(find([42], 42)).toBe(0);
      expect(find([42], 41)).toBe(-1);
      expect(find([42], 43)).toBe(-1);
    });

    it("2️⃣.3️⃣ should work on an array of two elements", () => {
      expect(find([4, 9], 4)).toBe(0);
      expect(find([4, 9], 9)).toBe(1);
      expect(find([4, 9], 6)).toBe(-1);
    });

    it("2️⃣.4️⃣ should work on arrays of three and four elements", () => {
      expect(find([1, 5, 9], 5)).toBe(1);
      expect(find([1, 5, 9], 9)).toBe(2);
      expect(find([1, 5, 9, 12], 9)).toBe(2);
      expect(find([1, 5, 9, 12], 12)).toBe(3);
    });
  });

  // ==========================================
  // 3️⃣ NOT FOUND
  // ==========================================
  describe("3️⃣ Target is not in the array", () => {
    it("3️⃣.1️⃣ should return -1 for a target below the smallest element", () => {
      expect(find([10, 20, 30], 5)).toBe(-1);
      expect(find([10, 20, 30], -100)).toBe(-1);
    });

    it("3️⃣.2️⃣ should return -1 for a target above the biggest element", () => {
      expect(find([10, 20, 30], 31)).toBe(-1);
      expect(find([10, 20, 30], 1000000)).toBe(-1);
    });

    it("3️⃣.3️⃣ should return -1 for a target between two elements", () => {
      expect(find([10, 20, 30], 15)).toBe(-1);
      expect(find([10, 20, 30], 25)).toBe(-1);
      expect(find([1, 2, 3, 10, 11, 20], 4)).toBe(-1);
    });

    it("3️⃣.4️⃣ should return -1 for an empty array without any request", () => {
      const api = new Api([]);
      expect(f(api, 7)).toBe(-1);
      expect(api.iterations).toBe(0);
    });
  });

  // ==========================================
  // 4️⃣ NUMBERS
  // ==========================================
  describe("4️⃣ Kinds of numbers", () => {
    it("4️⃣.1️⃣ should work with negative numbers and zero", () => {
      expect(find([-9, -4, 0, 3, 8], -9)).toBe(0);
      expect(find([-9, -4, 0, 3, 8], -4)).toBe(1);
      expect(find([-9, -4, 0, 3, 8], 0)).toBe(2);
      expect(find([-9, -4, 0, 3, 8], -5)).toBe(-1);
    });

    it("4️⃣.2️⃣ should work with fractional numbers", () => {
      expect(find([0.1, 0.25, 0.5, 1.75], 0.25)).toBe(1);
      expect(find([0.1, 0.25, 0.5, 1.75], 1.75)).toBe(3);
      expect(find([0.1, 0.25, 0.5, 1.75], 0.3)).toBe(-1);
    });

    it("4️⃣.3️⃣ should work with big numbers", () => {
      expect(find([1e9, 2e9, 3e9, 9e15], 9e15)).toBe(3);
      expect(find([1e9, 2e9, 3e9, 9e15], 2e9)).toBe(1);
    });
  });

  // ==========================================
  // 5️⃣ REQUESTS
  // ==========================================
  // The same array is searched for every element and for every gap between the elements; the
  // worst search is compared with floor(log2(n)) + 1 — the number of halvings of n elements.
  describe("5️⃣ Requests", () => {
    it("5️⃣.1️⃣ should ask for at most 3 elements of the array from the task", () => {
      expect(worstRequests(6)).toBeLessThanOrEqual(3);
    });

    const sizes = [1, 2, 3, 4, 7, 8, 100, 1000, 1024].map((n) => [n, Math.floor(Math.log2(n)) + 1]);
    it.each(sizes)("5️⃣.2️⃣ %d elements → at most %d requests", (n, bound) => {
      expect(worstRequests(n)).toBeLessThanOrEqual(bound);
    });

    it.each(sizes.slice(0, 8))("5️⃣.3️⃣ %d elements → requests outside of the array", (n) => {
      expect(worstOutside(n)).toBe(0);
    });
  });

  // ==========================================
  // 6️⃣ GENERATED ARRAYS
  // ==========================================
  // One row = a value of a 1000-element array and its index: 52 → 7.
  describe("6️⃣ Generated array", () => {
    const arr = sortedArray(1000);
    const indexes = [0, 1, 2, 3, 100, 255, 256, 499, 500, 501, 744, 997, 998, 999];

    it.each(indexes.map((i) => [arr[i], i]))("6️⃣.1️⃣ %d → %d", (value, index) => {
      expect(find(arr, value)).toBe(index);
    });

    const gaps = [0, 1, 400, 500, 998].map((i) => arr[i] + 0.5);
    it.each(gaps.map((value) => [value, -1]))("6️⃣.2️⃣ %d → %d", (value, answer) => {
      expect(find(arr, value)).toBe(answer);
    });
  });

  // ==========================================
  // 7️⃣ PERFORMANCE
  // ==========================================
  describe("7️⃣ Performance", () => {
    let arr;
    beforeAll(() => {
      arr = sortedArray(10000);
    });

    // The timing test: most of the spec's run time is spent here, so STRICT mode compares the
    // player's search with the reference one on exactly this work (20 000 searches through
    // the counting API, found targets only).
    it("7️⃣.1️⃣ should stay fast on a lot of searches", () => {
      const api = new Api(arr);
      let sum = 0;
      let expected = 0;
      for (let i = 0; i < 20000; i++) {
        const index = (i * 7) % 10000;
        sum += f(api, arr[index]);
        expected += index;
      }
      expect(sum).toBe(expected);
    });
  });
});
