/* Errors: process an object into an array
 * 🎖CERTIFIED 2026-10-23
 * Given an object { key: [messages] }, f(errors) returns an array of strings "key message", one per
 * message: in the order of the keys, and inside a key in the order of its messages.
 * Loops (for, while) are forbidden.
 *
 * Example:
 *   { username: ["cannot be empty", "minimal length is 3"], password: ["must contain letters"] }
 *     →  ["username cannot be empty", "username minimal length is 3", "password must contain letters"]
 *
 * Scope:
 *   ✓ one key or many, one message or many; the order of the keys and of the messages is kept
 *   ✓ the string is the key, one space, the message; spaces and non-Latin letters inside are kept
 *   ✓ a key with no messages gives nothing; an empty object gives []
 *   ✓ equal messages are not merged; the same message under two keys gives two strings
 *   ✓ the given object and its arrays are not changed; every call returns a new array
 *   ✓ the answer is an array of strings
 *   ✓ the source has no for / while loops (checked with __source)
 *   ✓ speed: the timing test (6.4) renders short objects again and again — the solution is compared
 *     with the reference one by STRICT mode
 *   ✗ not pinned: keys that look like numbers (their order in JS objects is by value), inherited and
 *     non-enumerable properties, empty messages
 *
 * Difficulty: ★★☆☆☆☆☆☆☆☆ (2/10)
 */

const f = require("./errors.js");

// an object that cannot be changed: a solution that writes into it throws
const frozen = (obj) => {
  Object.values(obj).forEach((list) => Object.freeze(list));
  return Object.freeze(obj);
};

describe(":: Running test case for ERRORS (object of messages to array)", () => {
  // ==========================================
  // 1️⃣ BASIC
  // ==========================================
  describe("1️⃣ Basic", () => {
    it("1️⃣.1️⃣ should match the example from the task", () => {
      const errors = {
        username: ["cannot be empty", "minimal length is 3"],
        password: ["must contain letters"],
      };
      expect(f(errors)).toEqual(["username cannot be empty", "username minimal length is 3", "password must contain letters"]);
    });

    it("1️⃣.2️⃣ should work fine", () => {
      const errors = {
        username: ["should be valid", "should contain letters"],
        password: ["should be hard"],
      };
      expect(f(errors)).toEqual(["username should be valid", "username should contain letters", "password should be hard"]);
    });

    it("1️⃣.3️⃣ should return an array of strings", () => {
      const result = f({ email: ["is not valid"] });
      expect(Array.isArray(result)).toBe(true);
      expect(typeof result[0]).toBe("string");
    });

    it("1️⃣.4️⃣ should have no for / while loops in the source", () => {
      expect(__source).not.toMatch(/\b(for|while)\s*\(/);
    });
  });

  // ==========================================
  // 2️⃣ OBJECTS OF EVERY SHAPE
  // ==========================================
  // One row = one object and the array it gives. Why these rows: one key and many, one message and many,
  // keys without messages, the order, equal messages.
  describe("2️⃣ Objects of every shape", () => {
    const rows = [
      [{ email: ["is not valid"] }, ["email is not valid"]],
      [{ email: ["is not valid", "is taken"] }, ["email is not valid", "email is taken"]],
      [{ a: ["x"], b: ["y"] }, ["a x", "b y"]],
      [{ b: ["y"], a: ["x"] }, ["b y", "a x"]],
      [{ a: ["x", "y", "z"], b: ["u"] }, ["a x", "a y", "a z", "b u"]],
      [{ a: ["x"], b: ["y", "z"], c: ["u", "v", "w"] }, ["a x", "b y", "b z", "c u", "c v", "c w"]],
      [{ name: [], age: ["must be a number"] }, ["age must be a number"]],
      [{ name: ["is empty"], age: [] }, ["name is empty"]],
      [{ name: [], age: [] }, []],
      [{ a: [] }, []],
      [{}, []],
      [{ a: ["x", "x", "x"] }, ["a x", "a x", "a x"]],
      [{ a: ["same"], b: ["same"] }, ["a same", "b same"]],
      [{ "first name": ["is empty"] }, ["first name is empty"]],
      [{ user_name: ["too short"], "pass-word": ["too weak"] }, ["user_name too short", "pass-word too weak"]],
      [{ имя: ["не может быть пустым"] }, ["имя не может быть пустым"]],
      [{ a: ["with spaces  inside"] }, ["a with spaces  inside"]],
      [{ a: ["must contain: letters, digits & symbols!"] }, ["a must contain: letters, digits & symbols!"]],
    ];

    it.each(rows)("2️⃣.1️⃣ %j → %j", (errors, expected) => {
      expect(f(errors)).toEqual(expected);
    });
  });

  // ==========================================
  // 3️⃣ THE ORDER
  // ==========================================
  describe("3️⃣ The order", () => {
    it("3️⃣.1️⃣ should keep the order of the keys, not the alphabetical one", () => {
      expect(f({ zeta: ["1"], alpha: ["2"], mid: ["3"] })).toEqual(["zeta 1", "alpha 2", "mid 3"]);
    });

    it("3️⃣.2️⃣ should keep the order of the messages, not the alphabetical one", () => {
      expect(f({ k: ["zebra", "apple", "mango"] })).toEqual(["k zebra", "k apple", "k mango"]);
    });

    it("3️⃣.3️⃣ should list all the messages of a key before the next key", () => {
      expect(f({ a: ["1", "2"], b: ["3", "4"] })).toEqual(["a 1", "a 2", "b 3", "b 4"]);
    });
  });

  // ==========================================
  // 4️⃣ THE GIVEN OBJECT
  // ==========================================
  describe("4️⃣ The given object", () => {
    it("4️⃣.1️⃣ should NOT change the object and its arrays", () => {
      const errors = { a: ["x", "y"], b: ["z"] };
      f(errors);
      expect(errors).toEqual({ a: ["x", "y"], b: ["z"] });
    });

    it("4️⃣.2️⃣ should work with an object that cannot be changed", () => {
      const errors = frozen({ a: ["x", "y"], b: ["z"] });
      expect(f(errors)).toEqual(["a x", "a y", "b z"]);
    });

    it("4️⃣.3️⃣ should return a new array every time", () => {
      const errors = { a: ["x"] };
      const first = f(errors);
      const second = f(errors);
      expect(first).toEqual(second);
      expect(first === second).toBe(false);
    });

    it("4️⃣.4️⃣ should NOT remember the previous call", () => {
      expect(f({ a: ["x"] })).toEqual(["a x"]);
      expect(f({ b: ["y"] })).toEqual(["b y"]);
      expect(f({})).toEqual([]);
    });
  });

  // ==========================================
  // 5️⃣ EDGE CASES
  // ==========================================
  describe("5️⃣ Edge cases", () => {
    it("5️⃣.1️⃣ should return an empty array for an empty object", () => {
      expect(f({})).toEqual([]);
    });

    it("5️⃣.2️⃣ should return an empty array when no key has messages", () => {
      expect(f({ a: [], b: [], c: [] })).toEqual([]);
    });

    it("5️⃣.3️⃣ should take a message with a new line or a tab as it is", () => {
      expect(f({ a: ["line1\nline2", "tab\there"] })).toEqual(["a line1\nline2", "a tab\there"]);
    });
  });

  // ==========================================
  // 6️⃣ PERFORMANCE
  // ==========================================
  describe("6️⃣ Performance", () => {
    let wide;
    let deep;
    let speed;

    beforeAll(() => {
      wide = {};
      for (let i = 0; i < 1000; i++) wide[`key${i}`] = ["m1", "m2", "m3", "m4", "m5"];
      deep = { key: Array.from({ length: 5000 }, (_, i) => `message ${i}`) };
      speed = [
        { username: ["cannot be empty", "minimal length is 3"], password: ["must contain letters"] },
        { email: ["is not valid"] },
        { name: [], age: ["must be a number"] },
        {},
        { a: ["x", "y", "z"], b: ["u"] },
      ];
    });

    it("6️⃣.1️⃣ should render 1 000 keys with 5 messages fast", () => {
      const t0 = Date.now();
      const result = f(wide);
      const elapsed = Date.now() - t0;
      expect(result.length).toBe(5000);
      expect(result[0]).toBe("key0 m1");
      expect(result[4999]).toBe("key999 m5");
      expect(elapsed).toBeLessThan(1000);
    });

    it("6️⃣.2️⃣ should render a key with 5 000 messages fast", () => {
      const t0 = Date.now();
      const result = f(deep);
      const elapsed = Date.now() - t0;
      expect(result.length).toBe(5000);
      expect(result[0]).toBe("key message 0");
      expect(result[4999]).toBe("key message 4999");
      expect(elapsed).toBeLessThan(1000);
    });

    it("6️⃣.3️⃣ should keep the order in a long result", () => {
      const result = f(wide);
      const wrong = result.filter((line, i) => line !== `key${Math.floor(i / 5)} m${(i % 5) + 1}`);
      expect(wrong.slice(0, 2)).toEqual([]);
    });

    // The timing test: most of the spec's run time is spent here, so STRICT mode compares the player's
    // function with the reference one on exactly this work (5 000 renders of short objects).
    it("6️⃣.4️⃣ should stay fast on a lot of short objects", () => {
      let total = 0;
      for (let i = 0; i < 1000; i++) {
        for (let j = 0; j < speed.length; j++) total += f(speed[j]).length;
      }
      expect(total).toBe(1000 * 9);
    });
  });
});
