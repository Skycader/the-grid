/* Ex27
 * Three regular expressions about the number of digits in a string, exported as [r1, r2, r3]:
 *   r1 — exactly 3 digits     r2 — fewer than 3 digits     r3 — 3 or more digits
 * Every regex is used as r.test(text) on the whole string.
 *
 * Example:
 *   "has_1_exact_2_ly_3_digits"  →  r1 true, r2 false, r3 true
 *
 * Scope:
 *   ✓ digits are 0-9, they can be anywhere; the rest of the string can be anything
 *     (letters of any language, spaces, punctuation, tabs, new lines, emoji)
 *   ✓ r2 is the exact complement of r3, and r1 is the part of r3 with exactly three digits
 *   ✓ repeated r.test() calls on the same regex give the same answer
 *   ✓ speed: the timing test (7.4) runs r1 and r3 on short strings again and again — the
 *     solution is compared with the reference one by STRICT mode
 *   ✗ not pinned: digits of other scripts (٣, ３)
 *
 * Difficulty: ★★★★☆☆☆☆☆☆ (4/10)
 */

const [r1, r2, r3] = require("./ex27.js");

// lastIndex is reset before every call, so a g / y flag cannot spoil the digit-count tests:
// it is caught once, by the test of repeated calls (6.2)
const f1 = (text) => ((r1.lastIndex = 0), r1.test(text));
const f2 = (text) => ((r2.lastIndex = 0), r2.test(text));
const f3 = (text) => ((r3.lastIndex = 0), r3.test(text));

// n digits mixed with letters / separators: "x1x2x3…"
const withDigits = (n, sep = "x") => {
  let s = "";
  for (let i = 1; i <= n; i++) s += sep + (i % 10);
  return s + sep;
};

describe(":: Running test case for EX27 (digit count logic)", () => {
  // ==========================================
  // 1️⃣ R1 — EXACTLY 3 DIGITS
  // ==========================================
  describe("1️⃣ r1 - exactly 3 digits", () => {
    it("1️⃣.1️⃣ should match the examples from the task", () => {
      expect(f1("has_1_exact_2_ly_3_digits")).toBe(true);
      expect(f1("1234")).toBe(false);
      expect(f1("has_1_notex2act_2_ly_3_dig_4_its")).toBe(false);
    });

    it("1️⃣.2️⃣ should accept exactly three digits wherever they are", () => {
      expect(f1("123")).toBe(true);
      expect(f1("000")).toBe(true);
      expect(f1("a1b2c3d")).toBe(true);
      expect(f1("1abc2def3")).toBe(true);
      expect(f1("abc123")).toBe(true);
      expect(f1("123abc")).toBe(true);
    });

    it("1️⃣.3️⃣ should accept three digits among any other characters", () => {
      expect(f1("a1!b2@c3#")).toBe(true);
      expect(f1("1 2 3")).toBe(true);
      expect(f1("!!!123!!!")).toBe(true);
    });

    it("1️⃣.4️⃣ should reject fewer than three digits", () => {
      expect(f1("")).toBe(false);
      expect(f1("abc")).toBe(false);
      expect(f1("a1b")).toBe(false);
      expect(f1("a1b2c")).toBe(false);
      expect(f1("12")).toBe(false);
    });

    it("1️⃣.5️⃣ should reject more than three digits", () => {
      expect(f1("1234")).toBe(false);
      expect(f1("a1b2c3d4")).toBe(false);
      expect(f1("1111111")).toBe(false);
    });
  });

  // ==========================================
  // 2️⃣ R2 — FEWER THAN 3 DIGITS
  // ==========================================
  describe("2️⃣ r2 - fewer than 3 digits", () => {
    it("2️⃣.1️⃣ should match the examples from the task", () => {
      expect(f2("1234")).toBe(false);
      expect(f2("12")).toBe(true);
      expect(f2("has1_less_than_2_digits")).toBe(true);
      expect(f2("has1_not_4_less_than_2_di_4gits")).toBe(false);
    });

    it("2️⃣.2️⃣ should accept no digits at all", () => {
      expect(f2("")).toBe(true);
      expect(f2("!!!")).toBe(true);
      expect(f2("no digits here")).toBe(true);
    });

    it("2️⃣.3️⃣ should accept one and two digits", () => {
      expect(f2("0")).toBe(true);
      expect(f2("99")).toBe(true);
      expect(f2("a9b")).toBe(true);
      expect(f2("x1y2z")).toBe(true);
      expect(f2("1 2")).toBe(true);
    });

    it("2️⃣.4️⃣ should reject three digits and more", () => {
      expect(f2("123")).toBe(false);
      expect(f2("000")).toBe(false);
      expect(f2("a1b2c3")).toBe(false);
      expect(f2("1 2 3 4 5")).toBe(false);
    });
  });

  // ==========================================
  // 3️⃣ R3 — 3 OR MORE DIGITS
  // ==========================================
  describe("3️⃣ r3 - 3 or more digits", () => {
    it("3️⃣.1️⃣ should match the examples from the task", () => {
      expect(f3("h_1_as_mo_2_re_than_3_digits_4")).toBe(true);
      expect(f3("has_1_exact_2_ly_3_digits")).toBe(true);
      expect(f3("1452")).toBe(true);
      expect(f3("12")).toBe(false);
    });

    it("3️⃣.2️⃣ should accept three digits and more", () => {
      expect(f3("000")).toBe(true);
      expect(f3("9999")).toBe(true);
      expect(f3("a5b6c7")).toBe(true);
      expect(f3("1a2b3c4d")).toBe(true);
      expect(f3("!!!123!!!")).toBe(true);
      expect(f3("1 2 3")).toBe(true);
      expect(f3("1".repeat(100))).toBe(true);
    });

    it("3️⃣.3️⃣ should reject fewer than three digits", () => {
      expect(f3("")).toBe(false);
      expect(f3("ab")).toBe(false);
      expect(f3("7")).toBe(false);
      expect(f3("55")).toBe(false);
      expect(f3("a5b6c")).toBe(false);
    });
  });

  // ==========================================
  // 4️⃣ THE REST OF THE STRING
  // ==========================================
  describe("4️⃣ Everything around the digits", () => {
    it("4️⃣.1️⃣ should count digits across new lines and tabs", () => {
      expect(f1("1\n2\n3")).toBe(true);
      expect(f1("1\t2\r\n3")).toBe(true);
      expect(f3("a1\nb2\nc3\nd")).toBe(true);
      expect(f2("1\n2")).toBe(true);
      expect(f2("\n\n\n")).toBe(true);
    });

    it("4️⃣.2️⃣ should not care about letters of any language", () => {
      expect(f1("д1ю2я3")).toBe(true);
      expect(f1("日1本2語3")).toBe(true);
      expect(f2("привет мир 7")).toBe(true);
    });

    it("4️⃣.3️⃣ should not care about emoji and symbols", () => {
      expect(f1("\u{1F600}1\u{1F600}2\u{1F600}3\u{1F600}")).toBe(true);
      expect(f3("☃ £1 €2 ¥3")).toBe(true);
    });
  });

  // ==========================================
  // 5️⃣ THE THREE REGEXES TOGETHER
  // ==========================================
  describe("5️⃣ Consistency", () => {
    // generated cases: every table row is its own test row (it.each), the string is in its title
    const digitCounts = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => {
      const text = withDigits(n);
      return [text, n === 3, n < 3, n >= 3];
    });
    it.each(digitCounts)("5️⃣.1️⃣ %j → r1 %s, r2 %s, r3 %s", (text, e1, e2, e3) => {
      expect(f1(text)).toBe(e1);
      expect(f2(text)).toBe(e2);
      expect(f3(text)).toBe(e3);
    });

    const digitPlaces = [];
    for (let n = 0; n <= 6; n++) {
      const digits = "7".repeat(n);
      for (const text of [digits + "abc", "abc" + digits, "ab" + digits + "cd"])
        digitPlaces.push([text, n === 3, n < 3, n >= 3]);
    }
    it.each(digitPlaces)("5️⃣.2️⃣ %j → r1 %s, r2 %s, r3 %s", (text, e1, e2, e3) => {
      expect(f1(text)).toBe(e1);
      expect(f2(text)).toBe(e2);
      expect(f3(text)).toBe(e3);
    });
  });

  // ==========================================
  // 6️⃣ THE REGEX OBJECTS
  // ==========================================
  describe("6️⃣ Regex objects", () => {
    it("6️⃣.1️⃣ should export three regular expressions", () => {
      expect(r1 instanceof RegExp).toBe(true);
      expect(r2 instanceof RegExp).toBe(true);
      expect(r3 instanceof RegExp).toBe(true);
    });

    it("6️⃣.2️⃣ should answer the same on repeated calls", () => {
      // plain r.test(), no lastIndex reset: a g / y regex says true once and false after.
      // Every regex gets a string it must accept.
      for (let i = 0; i < 4; i++) {
        expect(r1.test("a1b2c3")).toBe(true);
        expect(r2.test("a1")).toBe(true);
        expect(r3.test("a1b2c3")).toBe(true);
      }
    });
  });

  // ==========================================
  // 7️⃣ PERFORMANCE
  // ==========================================
  describe("7️⃣ Performance", () => {
    let evil;
    let speed;

    beforeAll(() => {
      // inputs shaped to hurt nested quantifiers: long runs of one kind, then a mismatch
      evil = {
        letters: "a".repeat(5000) + "!",
        twoDigits: "1a2" + "b".repeat(5000),
        threeDigits: "123" + "x".repeat(5000),
        manyDigits: "1".repeat(5000),
        spaces: "1 2 " + " ".repeat(5000) + " 3",
        mixed: "ab1".repeat(1600) + "!",
      };
      // short strings for the timing test: r1 is true for 2 of them, r3 for 4 of them
      speed = ["a1b2c3d", "1234", "x", "abc123", "12", "h_1_as_mo_2_re_than_3_digits_4"];
    });

    it("7️⃣.1️⃣ should not hang on long strings without digits", () => {
      const t0 = Date.now();
      expect([f1(evil.letters), f2(evil.letters), f3(evil.letters)]).toEqual([false, true, false]);
      expect(Date.now() - t0).toBeLessThan(1000);
    });

    it("7️⃣.2️⃣ should not hang on a long tail after two or three digits", () => {
      const t0 = Date.now();
      expect([f1(evil.twoDigits), f2(evil.twoDigits), f3(evil.twoDigits)]).toEqual([false, true, false]);
      expect([f1(evil.threeDigits), f2(evil.threeDigits), f3(evil.threeDigits)]).toEqual([true, false, true]);
      expect(Date.now() - t0).toBeLessThan(1000);
    });

    it("7️⃣.3️⃣ should not hang on thousands of digits or spaces", () => {
      const t0 = Date.now();
      expect([f1(evil.manyDigits), f2(evil.manyDigits), f3(evil.manyDigits)]).toEqual([false, false, true]);
      expect([f1(evil.spaces), f2(evil.spaces), f3(evil.spaces)]).toEqual([true, false, true]);
      expect([f1(evil.mixed), f2(evil.mixed), f3(evil.mixed)]).toEqual([false, false, true]);
      expect(Date.now() - t0).toBeLessThan(1000);
    });

    // The timing test: most of the spec's run time is spent here, so STRICT mode compares
    // the player's regexes with the reference ones on exactly this work (plain r.test(),
    // 360 000 calls of r1 and r3 on short strings).
    it("7️⃣.4️⃣ should stay fast on a lot of short strings", () => {
      let hits = 0;
      for (let i = 0; i < 30000; i++) {
        for (let j = 0; j < speed.length; j++) hits += r1.test(speed[j]) + r3.test(speed[j]);
      }
      expect(hits).toBe(180000);
    });
  });
});
