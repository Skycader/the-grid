/* Ex6
 * 🎖CERTIFIED 2026-10-23
 * Remove the digits 0-5 and the capital Latin letters A-Z from a string; everything else stays.
 *
 * Example:
 *   "THEstring1234567890"  →  "string6789"
 *
 * Scope:
 *   ✓ every digit 0-5 is removed, every digit 6-9 stays (the ends: 0, 5 and 6, 9)
 *   ✓ every capital A-Z is removed, every lower case letter stays (the ends: A, Z and a, z)
 *   ✓ the neighbours of the ranges in the ASCII table stay: / : @ [ ` {
 *   ✓ spaces, punctuation, new lines and tabs stay; the order of the rest does not change
 *   ✓ the answer is a string; a text where everything is removed gives "", an empty text gives ""
 *   ✓ speed: the timing test (7.4) removes in short texts again and again — the solution is compared
 *     with the reference one by STRICT mode
 *   ✗ not pinned: capital letters of other alphabets (Ж, É), digits of other scripts (٣)
 *
 * Difficulty: ★★★★☆☆☆☆☆☆ (4/10)
 */

const f = require("./ex6.js");

describe(":: Running test case for EX6 (remove digits 0-5 and capitals)", () => {
  // ==========================================
  // 1️⃣ BASIC
  // ==========================================
  describe("1️⃣ Basic", () => {
    it("1️⃣.1️⃣ should match the example from the task", () => {
      expect(f("THEstring1234567890")).toBe("string6789");
    });

    it("1️⃣.2️⃣ should remove capitals and digits from a sentence", () => {
      expect(f("Hello, World 2026!")).toBe("ello, orld 6!");
    });

    it("1️⃣.3️⃣ should always return a string", () => {
      expect(typeof f("A1")).toBe("string");
      expect(typeof f("")).toBe("string");
    });
  });

  // ==========================================
  // 2️⃣ DIGITS
  // ==========================================
  // One row = one digit and its answer. Why these rows: 0 and 5 are the ends of the range that goes,
  // 6 and 9 are the first and the last that stay.
  describe("2️⃣ Digits", () => {
    const rows = [
      ["0", ""],
      ["1", ""],
      ["2", ""],
      ["3", ""],
      ["4", ""],
      ["5", ""],
      ["6", "6"],
      ["7", "7"],
      ["8", "8"],
      ["9", "9"],
    ];

    it.each(rows)("2️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 3️⃣ LETTERS
  // ==========================================
  // One row = one letter and its answer. Why these rows: A and Z are the ends of the range that goes;
  // a and z are the lower case ones, which must stay (a regex with the `i` flag would remove them).
  describe("3️⃣ Letters", () => {
    const rows = [
      ["A", ""],
      ["B", ""],
      ["M", ""],
      ["N", ""],
      ["Y", ""],
      ["Z", ""],
      ["a", "a"],
      ["b", "b"],
      ["m", "m"],
      ["y", "y"],
      ["z", "z"],
    ];

    it.each(rows)("3️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 4️⃣ THE NEIGHBOURS IN THE ASCII TABLE
  // ==========================================
  // One row = one character that stays. Why these rows: a range written with wrong ends ([@-Z], [/-5], [A-\])
  // removes the neighbours of the digits and the capitals.
  describe("4️⃣ The neighbours in the ASCII table", () => {
    const rows = [
      ["/", "/"],
      [":", ":"],
      ["@", "@"],
      ["[", "["],
      ["\\", "\\"],
      ["`", "`"],
      ["{", "{"],
      ["-", "-"],
      ["_", "_"],
      [" ", " "],
    ];

    it.each(rows)("4️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 5️⃣ WHOLE TEXTS
  // ==========================================
  describe("5️⃣ Whole texts", () => {
    it("5️⃣.1️⃣ should remove ALL the characters of the ranges, not just the first one", () => {
      expect(f("A1B2C3D4E5F")).toBe("");
      expect(f("a1b2c3d4e5f6")).toBe("abcdef6");
    });

    it("5️⃣.2️⃣ should return an empty string when everything is removed", () => {
      expect(f("ABC012345XYZ")).toBe("");
    });

    it("5️⃣.3️⃣ should return the text unchanged when there is nothing to remove", () => {
      const text = "abc 678 xyz, 9! @[/:";
      expect(f(text)).toBe(text);
    });

    it("5️⃣.4️⃣ should keep the order of what stays", () => {
      expect(f("zA9yB8xC7wD6")).toBe("z9y8x7w6");
    });

    it("5️⃣.5️⃣ should keep spaces, new lines and tabs", () => {
      expect(f("Line One\n\tLine Two\r\n3 Lines")).toBe("ine ne\n\tine wo\r\n ines");
    });

    it("5️⃣.6️⃣ should work with words made of capitals and digits glued to lower case", () => {
      expect(f("iPhone15 and MacBook2")).toBe("ihone and acook");
    });

    it("5️⃣.7️⃣ should keep the letters and digits of the ranges that do not go (6-9, a-z)", () => {
      expect(f("0123456789 abcdefghijklmnopqrstuvwxyz")).toBe("6789 abcdefghijklmnopqrstuvwxyz");
    });
  });

  // ==========================================
  // 6️⃣ EDGE CASES
  // ==========================================
  describe("6️⃣ Edge cases", () => {
    it("6️⃣.1️⃣ should return an empty string for an empty input", () => {
      expect(f("")).toBe("");
    });

    it("6️⃣.2️⃣ should give the same answer when it is called again", () => {
      expect(f("A1b6")).toBe("b6");
      expect(f("A1b6")).toBe("b6");
    });
  });

  // ==========================================
  // 7️⃣ PERFORMANCE
  // ==========================================
  describe("7️⃣ Performance", () => {
    let mixed;
    let kept;
    let removed;
    let speed;

    beforeAll(() => {
      mixed = "Ab1c6D ".repeat(5000);
      kept = "abc6789 ".repeat(5000);
      removed = "ABC012345".repeat(5000);
      speed = ["THEstring1234567890", "Hello, World 2026!", "abc 678 xyz", "ABC012345", "@[/:", "iPhone15 and MacBook2"];
    });

    it("7️⃣.1️⃣ should clean 5 000 mixed words correctly and fast", () => {
      const t0 = Date.now();
      const result = f(mixed);
      const elapsed = Date.now() - t0;
      expect(result === "bc6 ".repeat(5000)).toBe(true);
      expect(elapsed).toBeLessThan(1000);
    });

    it("7️⃣.2️⃣ should leave a long text without anything to remove as it is, fast", () => {
      const t0 = Date.now();
      const result = f(kept);
      const elapsed = Date.now() - t0;
      expect(result === kept).toBe(true);
      expect(elapsed).toBeLessThan(1000);
    });

    it("7️⃣.3️⃣ should remove everything from a long text fast", () => {
      const t0 = Date.now();
      const result = f(removed);
      const elapsed = Date.now() - t0;
      expect(result).toBe("");
      expect(elapsed).toBeLessThan(1000);
    });

    // The timing test: most of the spec's run time is spent here, so STRICT mode compares the player's
    // function with the reference one on exactly this work (18 000 replacements in short texts).
    it("7️⃣.4️⃣ should stay fast on a lot of short texts", () => {
      let total = 0;
      for (let i = 0; i < 3000; i++) {
        for (let j = 0; j < speed.length; j++) total += f(speed[j]).length;
      }
      expect(total).toBe(3000 * 53);
    });
  });
});
