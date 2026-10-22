/* Ex19
 * 🎖CERTIFIED 2026-10-23
 * Check that a password consists of ASCII symbols only: A-Z a-z 0-9 and all the special symbols
 * including $ — the printable ASCII characters from ! to ~. f(password) returns true or false.
 *
 * Example:
 *   "$Raxon123_"  →  true
 *   "пароль"      →  false
 *
 * Scope:
 *   ✓ every letter, every digit and every one of the 32 special symbols is allowed, in any order
 *   ✓ the symbols that are not punctuation in Unicode are allowed too: $ + < = > ^ ` | ~
 *   ✓ a space, a tab, a new line and the control characters are not allowed
 *   ✓ every character outside of ASCII is not allowed: letters of other alphabets (é, пароль, 密码), long
 *     dash, quotes « », currency signs (€ £), emoji, a non-breaking space, a zero-width space; one such
 *     character anywhere makes the password invalid
 *   ✓ an empty password is invalid
 *   ✓ the answer is the boolean true / false
 *   ✓ speed: the timing test (8.4) checks short passwords again and again — the solution is compared
 *     with the reference one by STRICT mode
 *   ✗ not pinned: the length limits of a password, the strength rules (a capital, a digit)
 *
 * Difficulty: ★★★☆☆☆☆☆☆☆ (3/10)
 */

const solution = require("./ex19.js");

// The answer is turned into a boolean, so a function that returns something else than true / false is
// caught once, by the test of the answer type (7.3), and does not turn every other test red
const f = (password) => Boolean(solution(password));

const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const digits = "0123456789";
const symbols = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";

describe(":: Running test case for EX19 (ASCII password)", () => {
  // ==========================================
  // 1️⃣ BASIC
  // ==========================================
  describe("1️⃣ Basic", () => {
    it("1️⃣.1️⃣ should allow a password of letters, digits and symbols", () => {
      expect(f("asciipassword")).toBe(true);
      expect(f("12345")).toBe(true);
      expect(f("$Raxon123_")).toBe(true);
    });

    it("1️⃣.2️⃣ should allow a password with a hyphen", () => {
      expect(f("ascii-password")).toBe(true);
    });

    it("1️⃣.3️⃣ should NOT allow a password of another alphabet", () => {
      expect(f("пароль")).toBe(false);
      expect(f("очень!сложный!пароль!")).toBe(false);
      expect(f("мудамуда!")).toBe(false);
    });

    it("1️⃣.4️⃣ should NOT allow a password with spaces", () => {
      expect(f(" $Raxon123_")).toBe(false);
      expect(f(" $Raxon123_ ")).toBe(false);
      expect(f(" $Raxon 123_ ")).toBe(false);
    });
  });

  // ==========================================
  // 2️⃣ LETTERS AND DIGITS
  // ==========================================
  // One row = one password and its answer. Why these rows: the ends of the ranges (a, z, A, Z, 0, 9).
  describe("2️⃣ Letters and digits", () => {
    const rows = [
      ["a", true],
      ["m", true],
      ["z", true],
      ["A", true],
      ["M", true],
      ["Z", true],
      ["0", true],
      ["5", true],
      ["9", true],
      [letters, true],
      [digits, true],
      [letters + digits, true],
      ["Password1", true],
      ["correct-horse-battery-staple", true],
      ["P@ssw0rd!", true],
    ];

    it.each(rows)("2️⃣.1️⃣ %j → %s", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 3️⃣ SPECIAL SYMBOLS
  // ==========================================
  // One row = one symbol as the whole password and its answer. Why these rows: all 32 symbols of the table;
  // ! and ~ are the first and the last printable ones, and $ + < = > ^ ` | ~ are not punctuation in
  // Unicode (a regex built on \p{P} rejects them).
  describe("3️⃣ Special symbols", () => {
    const rows = symbols.split("").map((c) => [c, true]);

    it.each(rows)("3️⃣.1️⃣ %j → %s", (text, expected) => {
      expect(f(text)).toBe(expected);
    });

    it("3️⃣.2️⃣ should allow all the special symbols in one password", () => {
      expect(f(symbols)).toBe(true);
    });

    it("3️⃣.3️⃣ should allow letters, digits and all the special symbols together", () => {
      expect(f(letters + digits + symbols)).toBe(true);
      expect(f(symbols + digits + letters)).toBe(true);
    });
  });

  // ==========================================
  // 4️⃣ SPACES AND CONTROL CHARACTERS
  // ==========================================
  // One row = one password and its answer. Why these rows: only the characters from ! to ~ are allowed.
  describe("4️⃣ Spaces and control characters", () => {
    const rows = [
      [" ", false],
      ["  ", false],
      ["a b", false],
      [" abc", false],
      ["abc ", false],
      ["ab c d", false],
      ["\t", false],
      ["a\tb", false],
      ["\n", false],
      ["abc\n", false],
      ["\nabc", false],
      ["a\nb", false],
      ["a\r\nb", false],
      ["\r", false],
      ["\0", false],
      ["a\0b", false],
      ["\x1f", false],
      ["\x7f", false],
      ["abc\x7f", false],
      ["\f", false],
      ["\v", false],
    ];

    it.each(rows)("4️⃣.1️⃣ %j → %s", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 5️⃣ NOT ASCII
  // ==========================================
  // One row = one password and its answer. Why these rows: one non-ASCII character is enough to reject;
  // the punctuation of other scripts (— « » ¿) is the trap of a regex built on \p{P}.
  describe("5️⃣ Not ASCII", () => {
    const rows = [
      ["é", false],
      ["ü", false],
      ["ñ", false],
      ["ß", false],
      ["ж", false],
      ["Ж", false],
      ["пароль", false],
      ["密码", false],
      ["パスワード", false],
      ["كلمة", false],
      ["pásswörd", false],
      ["pass—word", false],
      ["pass–word", false],
      ["«pass»", false],
      ["¿pass?", false],
      ["¡pass!", false],
      ["“pass”", false],
      ["‘pass’", false],
      ["pass…", false],
      ["€uro", false],
      ["£pound", false],
      ["¥en", false],
      ["©", false],
      ["°", false],
      ["№1", false],
      ["😀", false],
      ["pass😀", false],
      ["a b", false],
      [" ", false],
      ["pass​word", false],
      ["﻿pass", false],
      ["раssword", false], // Cyrillic «р» and «а»
    ];

    it.each(rows)("5️⃣.1️⃣ %j → %s", (text, expected) => {
      expect(f(text)).toBe(expected);
    });

    it("5️⃣.2️⃣ should reject a long ASCII password with a single non-ASCII character at the end", () => {
      expect(f("a".repeat(100) + "é")).toBe(false);
    });

    it("5️⃣.3️⃣ should reject a long ASCII password with a single non-ASCII character at the start", () => {
      expect(f("é" + "a".repeat(100))).toBe(false);
    });
  });

  // ==========================================
  // 6️⃣ EDGE CASES
  // ==========================================
  describe("6️⃣ Edge cases", () => {
    it("6️⃣.1️⃣ should NOT allow an empty password", () => {
      expect(f("")).toBe(false);
    });

    it("6️⃣.2️⃣ should allow a password of one character", () => {
      expect(f("a")).toBe(true);
      expect(f("$")).toBe(true);
    });

    it("6️⃣.3️⃣ should allow a long ASCII password", () => {
      expect(f("a1!".repeat(100))).toBe(true);
    });
  });

  // ==========================================
  // 7️⃣ THE ANSWER
  // ==========================================
  describe("7️⃣ The answer", () => {
    it("7️⃣.1️⃣ should give the same answer when it is called again", () => {
      expect(f("$Raxon123_")).toBe(true);
      expect(f("$Raxon123_")).toBe(true);
      expect(f("пароль")).toBe(false);
      expect(f("$Raxon123_")).toBe(true);
    });

    it("7️⃣.2️⃣ should give the same answer for the same password every time, also after a wrong one", () => {
      expect(f("abc")).toBe(true);
      expect(f("é")).toBe(false);
      expect(f("abc")).toBe(true);
      expect(f("é")).toBe(false);
    });

    it("7️⃣.3️⃣ should answer with the boolean true or false, not with a match", () => {
      expect(solution("$Raxon123_")).toBe(true);
      expect(solution("пароль")).toBe(false);
    });
  });

  // ==========================================
  // 8️⃣ PERFORMANCE
  // ==========================================
  describe("8️⃣ Performance", () => {
    let long;
    let badEnd;
    let badStart;
    let speed;

    beforeAll(() => {
      long = "aZ9$".repeat(1250);
      badEnd = "a".repeat(4999) + "é";
      badStart = "é" + "a".repeat(4999);
      speed = ["asciipassword", "$Raxon123_", "ascii-password", "пароль", " $Raxon123_ ", "P@ss-w0rd!~+=<>|^`", "pass—word", ""];
    });

    it("8️⃣.1️⃣ should allow a password of 5 000 ASCII characters fast", () => {
      const t0 = Date.now();
      const answer = f(long);
      const elapsed = Date.now() - t0;
      expect(answer).toBe(true);
      expect(elapsed).toBeLessThan(1000);
    });

    it("8️⃣.2️⃣ should reject a long password with a bad character at the end or at the start fast", () => {
      const t0 = Date.now();
      const answers = [f(badEnd), f(badStart)];
      const elapsed = Date.now() - t0;
      expect(answers).toEqual([false, false]);
      expect(elapsed).toBeLessThan(1000);
    });

    it("8️⃣.3️⃣ should reject a long password with a space in the middle fast", () => {
      const t0 = Date.now();
      const answer = f("a".repeat(2500) + " " + "a".repeat(2500));
      const elapsed = Date.now() - t0;
      expect(answer).toBe(false);
      expect(elapsed).toBeLessThan(1000);
    });

    // The timing test: most of the spec's run time is spent here, so STRICT mode compares the player's
    // function with the reference one on exactly this work (24 000 checks of short passwords).
    it("8️⃣.4️⃣ should stay fast on a lot of short passwords", () => {
      let valid = 0;
      for (let i = 0; i < 2000; i++) {
        for (let j = 0; j < speed.length; j++) {
          if (f(speed[j])) valid++;
        }
      }
      expect(valid).toBe(2000 * 4);
    });
  });
});
