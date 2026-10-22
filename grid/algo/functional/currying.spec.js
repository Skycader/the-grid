/* Currying: add(4)(4)()
 * 🎖CERTIFIED 2026-10-23
 * Write f (the first call of a chain): f(a)(b)(c)... accepts one number per call and returns a
 * function for the next number; a call without arguments returns the sum of all the numbers.
 *
 * Example:
 *   f(9)(10)()  →  19
 *   f()         →  0
 *
 * Scope:
 *   ✓ chains of any length (0 numbers, 1, 2, 5, thousands): the sum of all the numbers
 *   ✓ negative, zero and fractional numbers; 0 is a number, it does not end the chain
 *   ✓ the call without arguments returns a number; every call with a number returns a function
 *   ✓ every chain has its own sum: chains from separate f(...) calls never mix, also when they are
 *     built in turns; the same chain built twice gives the same sum
 *   ✓ speed: the timing test (6.3) builds a lot of short chains — the solution is compared with the
 *     reference one by STRICT mode
 *   ✗ not pinned: calling an intermediate function several times (const a = f(1); a(2)(); a(3)()),
 *     passing undefined, null, strings or NaN in the middle of a chain
 *
 * Difficulty: ★★★★☆☆☆☆☆☆ (4/10)
 */

const f = require("./currying.js");

// f(a)(b)(c)...(): one row = the numbers of a chain and its sum
const chain = (numbers) => numbers.reduce((fn, n) => fn(n), f)();

describe(":: Running test case for CURRYING (add(9)(10)())", () => {
  // ==========================================
  // 1️⃣ BASIC
  // ==========================================
  describe("1️⃣ Basic", () => {
    it("1️⃣.1️⃣ should match the example from the task: f(9)(10)() is 19", () => {
      expect(f(9)(10)()).toBe(19);
    });

    it("1️⃣.2️⃣ should return 0 for a call without arguments: f()", () => {
      expect(f()).toBe(0);
    });

    it("1️⃣.3️⃣ should return the number for a chain of one: f(9)()", () => {
      expect(f(9)()).toBe(9);
    });

    it("1️⃣.4️⃣ should sum two numbers in any order", () => {
      expect(f(10)(9)()).toBe(19);
      expect(f(9)(10)()).toBe(19);
      expect(f(4)(4)()).toBe(8);
    });
  });

  // ==========================================
  // 2️⃣ THE SUM OF A CHAIN
  // ==========================================
  // One row = the numbers of a chain and the sum it returns. Why these rows: chains of every length,
  // negative, zero and fractional numbers; a sum of 0 is still the number 0.
  describe("2️⃣ The sum of a chain", () => {
    const rows = [
      [[], 0],
      [[0], 0],
      [[1], 1],
      [[9], 9],
      [[-1], -1],
      [[9, 10], 19],
      [[4, 4], 8],
      [[3, -3], 0],
      [[-1, -2, -3], -6],
      [[1, 2, 3, 4, 5], 15],
      [[-5, 10, -3, 7], 9],
      [[10, -5, 3, -8, 20], 20],
      [[100, 200, 300, 400, 500], 1500],
      [[0.5, 0.25], 0.75],
      [[1.5, 2.5], 4],
      [[-0.5, 0.5, 1.25], 1.25],
      [[1000000, 1000000], 2000000],
      [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 10],
    ];

    it.each(rows)("2️⃣.1️⃣ %j → %j", (numbers, expected) => {
      expect(chain(numbers)).toBe(expected);
    });
  });

  // ==========================================
  // 3️⃣ ZERO IS A NUMBER
  // ==========================================
  // One row = the numbers of a chain and the sum it returns. Why these rows: a solution that checks the
  // argument as `if (!n)` takes 0 for the end of the chain.
  describe("3️⃣ Zero is a number", () => {
    const rows = [
      [[0, 0, 0, 10], 10],
      [[5, 0, 0], 5],
      [[0, 5], 5],
      [[0, 0], 0],
      [[0, 0, 0, 0, 0], 0],
      [[1, 0, 2, 0, 3], 6],
      [[0, -1], -1],
    ];

    it.each(rows)("3️⃣.1️⃣ %j → %j", (numbers, expected) => {
      expect(chain(numbers)).toBe(expected);
    });

    it("3️⃣.2️⃣ should return a function after f(0), not a number", () => {
      expect(typeof f(0)).toBe("function");
      expect(typeof f(0)(0)).toBe("function");
    });
  });

  // ==========================================
  // 4️⃣ WHAT EVERY CALL RETURNS
  // ==========================================
  describe("4️⃣ What every call returns", () => {
    it("4️⃣.1️⃣ should return a function for a call with a number", () => {
      expect(typeof f(1)).toBe("function");
      expect(typeof f(1)(2)).toBe("function");
      expect(typeof f(1)(2)(3)).toBe("function");
    });

    it("4️⃣.2️⃣ should return a number for the call without arguments", () => {
      expect(typeof f()).toBe("number");
      expect(typeof f(1)()).toBe("number");
      expect(typeof f(1)(2)()).toBe("number");
    });

    it("4️⃣.3️⃣ should return a function that can be called again and again", () => {
      let fn = f(1);
      for (let i = 0; i < 10; i++) fn = fn(1);
      expect(typeof fn).toBe("function");
      expect(fn()).toBe(11);
    });
  });

  // ==========================================
  // 5️⃣ EVERY CHAIN HAS ITS OWN SUM
  // ==========================================
  describe("5️⃣ Every chain has its own sum", () => {
    it("5️⃣.1️⃣ should NOT keep the sum of the previous chain", () => {
      expect(f(1)(2)()).toBe(3);
      expect(f(10)()).toBe(10);
      expect(f()).toBe(0);
      expect(f(5)()).toBe(5);
    });

    it("5️⃣.2️⃣ should give the same sum when the same chain is built again", () => {
      expect(f(2)(3)()).toBe(5);
      expect(f(2)(3)()).toBe(5);
      expect(f(2)(3)()).toBe(5);
    });

    it("5️⃣.3️⃣ should keep two chains built in turns apart", () => {
      const a = f(1);
      const b = f(100);
      const a2 = a(2);
      const b2 = b(200);
      expect(a2()).toBe(3);
      expect(b2()).toBe(300);
    });

    it("5️⃣.4️⃣ should keep many chains built in turns apart", () => {
      const chains = [f(1), f(2), f(3), f(4), f(5)];
      const moved = chains.map((c, i) => c(i * 10));
      expect(moved.map((c) => c())).toEqual([1, 12, 23, 34, 45]);
    });

    it("5️⃣.5️⃣ should NOT change the answer of a finished chain by new chains", () => {
      const done = f(1)(2)();
      f(100)(200)();
      expect(done).toBe(3);
    });
  });

  // ==========================================
  // 6️⃣ LONG CHAINS AND SPEED
  // ==========================================
  describe("6️⃣ Long chains and speed", () => {
    let speed;

    beforeAll(() => {
      speed = [[9, 10], [], [4, 4], [1, 2, 3, 4, 5], [-5, 10, -3, 7], [0, 0, 0, 10]];
    });

    it("6️⃣.1️⃣ should sum a chain of 5 000 numbers correctly and fast", () => {
      const t0 = Date.now();
      let fn = f;
      for (let i = 1; i <= 5000; i++) fn = fn(i);
      const sum = fn();
      const elapsed = Date.now() - t0;
      expect(sum).toBe((5000 * 5001) / 2);
      expect(elapsed).toBeLessThan(1000);
    });

    it("6️⃣.2️⃣ should sum 5 000 chains of two numbers correctly and fast", () => {
      const t0 = Date.now();
      let total = 0;
      for (let i = 0; i < 5000; i++) total += f(i)(1)();
      const elapsed = Date.now() - t0;
      expect(total).toBe((4999 * 5000) / 2 + 5000);
      expect(elapsed).toBeLessThan(1000);
    });

    // The timing test: most of the spec's run time is spent here, so STRICT mode compares the player's
    // function with the reference one on exactly this work (about 18 000 short chains).
    it("6️⃣.3️⃣ should stay fast on a lot of short chains", () => {
      let total = 0;
      for (let i = 0; i < 3000; i++) {
        for (let j = 0; j < speed.length; j++) total += chain(speed[j]);
      }
      expect(total).toBe(3000 * 61);
    });
  });
});
