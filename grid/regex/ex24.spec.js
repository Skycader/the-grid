/* Ex24
 * 🎖CERTIFIED 2026-10-23
 * Transform a telephone number of any format into digits only: keep the digits 0-9 in the same order,
 * remove every other character.
 *
 * Example:
 *   "+7 (987) 231 45-23"  →  "79872314523"
 *
 * Scope:
 *   ✓ the usual formats: spaces, brackets, hyphens, dots, a leading plus, slashes, mixed
 *   ✓ every digit 0-9 stays, in the same order, also the repeated ones and a leading 0
 *   ✓ every other character is removed: letters, text around the number, tabs, new lines, any symbols
 *   ✓ a text that is digits only stays as it is; a text without digits and an empty text give ""
 *   ✓ the answer is a string (also "0" stays a string)
 *   ✓ speed: the timing test (6.4) cleans short numbers again and again — the solution is compared
 *     with the reference one by STRICT mode
 *   ✗ not pinned: digits of other scripts (٣, ３), superscript digits (²)
 *
 * Difficulty: ★☆☆☆☆☆☆☆☆☆ (1/10)
 */

const f = require("./ex24.js");

describe(":: Running test case for EX24 (phone number to digits)", () => {
  // ==========================================
  // 1️⃣ BASIC
  // ==========================================
  describe("1️⃣ Basic", () => {
    it("1️⃣.1️⃣ should transform format 1 to digits only", () => {
      expect(f("+7 923 168 59 41")).toBe("79231685941");
    });

    it("1️⃣.2️⃣ should transform format 2 to digits only", () => {
      expect(f("+7 (923) 168 59-41")).toBe("79231685941");
    });

    it("1️⃣.3️⃣ should match the examples from the task", () => {
      expect(f("+7 987 231 45 23")).toBe("79872314523");
      expect(f("+7 (987) 231 45-23")).toBe("79872314523");
    });

    it("1️⃣.4️⃣ should always return a string", () => {
      expect(typeof f("+7 923")).toBe("string");
      expect(typeof f("0")).toBe("string");
      expect(typeof f("")).toBe("string");
    });
  });

  // ==========================================
  // 2️⃣ THE FORMATS
  // ==========================================
  // One row = one number and its answer.
  describe("2️⃣ The formats", () => {
    const rows = [
      ["+7 987 231 45 23", "79872314523"],
      ["+7 (987) 231 45-23", "79872314523"],
      ["+7(987)2314523", "79872314523"],
      ["+7-987-231-45-23", "79872314523"],
      ["8 (800) 555-35-35", "88005553535"],
      ["8-800-555-35-35", "88005553535"],
      ["8(800)5553535", "88005553535"],
      ["+1 (555) 123-4567", "15551234567"],
      ["(555) 123-4567", "5551234567"],
      ["(555)123-4567", "5551234567"],
      ["555.123.4567", "5551234567"],
      ["555 123 4567", "5551234567"],
      ["555-123-4567", "5551234567"],
      ["555/123/4567", "5551234567"],
      ["+44 20 7946 0958", "442079460958"],
      ["+44 (0)20 7946 0958", "4402079460958"],
      ["+49 30 901820", "4930901820"],
      ["00 7 987 231 45 23", "0079872314523"],
      ["79872314523", "79872314523"],
      ["+79872314523", "79872314523"],
    ];

    it.each(rows)("2️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 3️⃣ OTHER CHARACTERS
  // ==========================================
  // One row = one text and its answer. Why these rows: anything that is not a digit goes away — also letters
  // and text around the number; a regex that removes only the usual separators leaves these.
  describe("3️⃣ Other characters", () => {
    const rows = [
      ["tel: +7 987 231 45 23", "79872314523"],
      ["Phone: (987) 231-45-23.", "9872314523"],
      ["+7 987 231 45 23 ext. 12", "7987231452312"],
      ["+7 987 231 45 23 (home)", "79872314523"],
      ["1-800-FLOWERS", "1800"],
      ["call me: 5-5-5", "555"],
      ["+7 987 231 45 23\n", "79872314523"],
      ["\n+7 987 231 45 23", "79872314523"],
      ["+7\t987\t231\t45\t23", "79872314523"],
      ["+7\n987\r\n231\n45\n23", "79872314523"],
      ["  +7 987 231 45 23  ", "79872314523"],
      ["~!@#$%^&*()_+{}|:\"<>?-=[]\\;',./`", ""],
      ["tel_7_987", "7987"],
      ["a1b2c3", "123"],
      ["x7y", "7"],
    ];

    it.each(rows)("3️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 4️⃣ THE DIGITS
  // ==========================================
  // One row = one text and its answer. Why these rows: every digit stays, 0 and 9 are the ends of the range.
  describe("4️⃣ The digits", () => {
    const rows = [
      ["0", "0"],
      ["1", "1"],
      ["2", "2"],
      ["3", "3"],
      ["4", "4"],
      ["5", "5"],
      ["6", "6"],
      ["7", "7"],
      ["8", "8"],
      ["9", "9"],
      ["0123456789", "0123456789"],
      ["9876543210", "9876543210"],
      ["007", "007"],
      ["000", "000"],
      ["+0", "0"],
      ["1 1 1 1", "1111"],
      ["0-0-0", "000"],
    ];

    it.each(rows)("4️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 5️⃣ NOTHING TO KEEP
  // ==========================================
  describe("5️⃣ Nothing to keep", () => {
    it("5️⃣.1️⃣ should return an empty string for an empty input", () => {
      expect(f("")).toBe("");
    });

    it("5️⃣.2️⃣ should return an empty string for a text without digits", () => {
      expect(f("no digits here")).toBe("");
      expect(f("+ - ( ) .")).toBe("");
      expect(f("   ")).toBe("");
      expect(f("\n\t\r\n")).toBe("");
    });

    it("5️⃣.3️⃣ should keep the order of the digits", () => {
      expect(f("9 (8) 7-6.5/4")).toBe("987654");
    });

    it("5️⃣.4️⃣ should give the same answer when it is called again", () => {
      expect(f("+7 (987) 231 45-23")).toBe("79872314523");
      expect(f("+7 (987) 231 45-23")).toBe("79872314523");
    });
  });

  // ==========================================
  // 6️⃣ PERFORMANCE
  // ==========================================
  describe("6️⃣ Performance", () => {
    let digits;
    let spread;
    let noDigits;
    let speed;

    beforeAll(() => {
      digits = "1234567890".repeat(500);
      spread = "+7 (987) 231 45-23 ".repeat(1000);
      noDigits = "abc +()- ".repeat(1000);
      speed = ["+7 987 231 45 23", "+7 (987) 231 45-23", "8 (800) 555-35-35", "tel: +44 20 7946 0958", "79872314523", "no digits here"];
    });

    it("6️⃣.1️⃣ should keep 5 000 digits as they are, fast", () => {
      const t0 = Date.now();
      const result = f(digits);
      const elapsed = Date.now() - t0;
      expect(result === digits).toBe(true);
      expect(elapsed).toBeLessThan(1000);
    });

    it("6️⃣.2️⃣ should clean 1 000 numbers written in a row, fast", () => {
      const t0 = Date.now();
      const result = f(spread);
      const elapsed = Date.now() - t0;
      expect(result === "79872314523".repeat(1000)).toBe(true);
      expect(elapsed).toBeLessThan(1000);
    });

    it("6️⃣.3️⃣ should clean a long text without digits to an empty string, fast", () => {
      const t0 = Date.now();
      const result = f(noDigits);
      const elapsed = Date.now() - t0;
      expect(result).toBe("");
      expect(elapsed).toBeLessThan(1000);
    });

    // The timing test: most of the spec's run time is spent here, so STRICT mode compares the player's
    // function with the reference one on exactly this work (18 000 cleanings of short numbers).
    it("6️⃣.4️⃣ should stay fast on a lot of short numbers", () => {
      let total = 0;
      for (let i = 0; i < 3000; i++) {
        for (let j = 0; j < speed.length; j++) total += f(speed[j]).length;
      }
      expect(total).toBe(3000 * 56);
    });
  });
});
