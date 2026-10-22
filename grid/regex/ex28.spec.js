/* Ex28
 * 🎖CERTIFIED 2026-10-23
 * Export a regex that checks if a password is strong enough. It is used as r.test(password).
 * A strong password has: an upper case letter, a lower case letter, at least 3 digits, a special
 * character, no whitespace, and a length from 24 to 256 characters.
 *
 * Example:
 *   "$MySup3erHard0Pass0wor0d"  →  true
 *   "$TooShort3000"             →  false
 *
 * Scope:
 *   ✓ each rule on its own: a password that breaks only one rule is weak (no upper case, no lower case,
 *     fewer than 3 digits, no special character, a space / tab / new line anywhere, too short, too long)
 *   ✓ the borders: 3 digits are enough, 2 are not; the length 24 and 256 are fine, 23 and 257 are not
 *   ✓ the digits need not stand together; the characters can be in any order
 *   ✓ every one of the 32 visible ASCII symbols counts as the special character (also _ $ + < = > ^ ` | ~)
 *   ✓ the regex has no g or y flag, so r.test() gives the same answer every time
 *   ✓ speed: the timing test (8.4) checks short passwords again and again — the solution is compared
 *     with the reference one by STRICT mode
 *   ✗ not pinned: characters outside of ASCII (é, пароль, —, €, emoji) and other control characters
 *
 * Difficulty: ★★★★★★★★★★ (10/10)
 */

const r = require("./ex28.js");

// lastIndex is reset before every call, so a g / y flag cannot spoil the password tests:
// it is caught once, by the test of the flags (7.2)
const f = (password) => ((r.lastIndex = 0), r.test(password));

// a strong password of the given length (at least 6): Aa1!23 and x
const pw = (length) => "Aa1!23" + "x".repeat(length - 6);

describe(":: Running test case for EX28 (strong password)", () => {
  // ==========================================
  // 1️⃣ BASIC
  // ==========================================
  describe("1️⃣ Basic", () => {
    it("1️⃣.1️⃣ should accept a strong password", () => {
      expect(f("$MySup3erHard0Pass0wor0d")).toBe(true);
    });

    it("1️⃣.2️⃣ should reject a password without digits and special characters", () => {
      expect(f("MySuperHardPassword")).toBe(false);
    });

    it("1️⃣.3️⃣ should reject a password without upper case letters", () => {
      expect(f("$mysuperhardpassword")).toBe(false);
    });

    it("1️⃣.4️⃣ should reject a password that repeats one character", () => {
      expect(f("$$$MMMoney")).toBe(false);
    });

    it("1️⃣.5️⃣ should reject a short password", () => {
      expect(f("$TooShort3000")).toBe(false);
    });

    it("1️⃣.6️⃣ should reject a password with a space", () => {
      expect(f("$SpaceBarsAre Forbidden")).toBe(false);
    });
  });

  // ==========================================
  // 2️⃣ ONE RULE BROKEN AT A TIME
  // ==========================================
  // One row = one password of 24 characters and its answer. Why these rows: each one breaks exactly one rule
  // (or none), so a regex that forgets one lookahead is caught by its own row.
  describe("2️⃣ One rule broken at a time", () => {
    const rows = [
      ["Aa1!23xxxxxxxxxxxxxxxxxx", true], // the base: everything is fine
      ["aa1!23xxxxxxxxxxxxxxxxxx", false], // no upper case letter
      ["AA1!23XXXXXXXXXXXXXXXXXX", false], // no lower case letter
      ["Aa1!2xxxxxxxxxxxxxxxxxxx", false], // 2 digits
      ["Aa1!xxxxxxxxxxxxxxxxxxxx", false], // 1 digit
      ["Aa!xxxxxxxxxxxxxxxxxxxxx", false], // no digits
      ["Aa123xxxxxxxxxxxxxxxxxxx", false], // no special character
      ["A1a!2xxxxxxxxxxxxxxxxxx3", true], // the digits do not stand together
      ["3a!2xxxxxxxxxxxxxxxxxA1x", true], // another order
      ["!!!!!!!!!!!!!!!!!!!!!123", false], // no letters
      ["AAAAAAAAAAAAAAAAAAAAAAAA", false], // only upper case
      ["aaaaaaaaaaaaaaaaaaaaaaaa", false], // only lower case
      ["111111111111111111111111", false], // only digits
      ["!!!!!!!!!!!!!!!!!!!!!!!!", false], // only special characters
      ["Aa1!23Aa1!23Aa1!23Aa1!23", true], // everything repeated
      ["1234567890!@#$%^&*()_+Aa", true], // many digits and symbols
      ["aA!aA!aA!aA!aA!aA!aA!1a2", false], // 2 digits
      ["Zz9?8Z7z6Z5z4Z3z2Z1z0Z9z", true], // a lot of digits and letters
    ];

    it.each(rows)("2️⃣.1️⃣ %j → %s", (password, expected) => {
      expect(f(password)).toBe(expected);
    });
  });

  // ==========================================
  // 3️⃣ WHITESPACE
  // ==========================================
  // One row = one password of 24 or more characters and its answer. Why these rows: one whitespace character
  // anywhere makes the password weak, however strong the rest is.
  describe("3️⃣ Whitespace", () => {
    const rows = [
      ["Aa1!23 xxxxxxxxxxxxxxxxx", false],
      [" Aa1!23xxxxxxxxxxxxxxxxxx", false],
      ["\nAa1!23xxxxxxxxxxxxxxxxxx", false],
      [" Aa1!23xxxxxxxxxxxxxxxxx", false],
      ["Aa1!23xxxxxxxxxxxxxxxxx ", false],
      ["Aa1!23xxxxxxxx xxxxxxxxx", false],
      ["Aa1!23\txxxxxxxxxxxxxxxxx", false],
      ["Aa1!23xxxxxxxxxxxxxxxxx\t", false],
      ["Aa1!23\nxxxxxxxxxxxxxxxxx", false],
      ["Aa1!23xxxxxxxxxxxxxxxxx\n", false],
      ["\nAa1!23xxxxxxxxxxxxxxxxx", false],
      ["Aa1!23xxxxxxxxxxxxxxxxx\r\n", false],
      ["Aa1!23\rxxxxxxxxxxxxxxxxx", false],
      ["Aa1!23xxxxxxxx\fxxxxxxxxx", false],
      ["Aa1!23xxxxxxxx\vxxxxxxxxx", false],
      ["A a 1 ! 2 3 x x x x x x x x x x x x x x x x", false],
      ["Aa1!23xxxxxxxxxxxxxxxxxx", true], // the same without whitespace
    ];

    it.each(rows)("3️⃣.1️⃣ %j → %s", (password, expected) => {
      expect(f(password)).toBe(expected);
    });
  });

  // ==========================================
  // 4️⃣ THE LENGTH
  // ==========================================
  describe("4️⃣ The length", () => {
    it("4️⃣.1️⃣ should accept the lengths from 24 to 256", () => {
      expect(f(pw(24))).toBe(true);
      expect(f(pw(25))).toBe(true);
      expect(f(pw(100))).toBe(true);
      expect(f(pw(255))).toBe(true);
      expect(f(pw(256))).toBe(true);
    });

    it("4️⃣.2️⃣ should reject a password shorter than 24, also the one that has everything else", () => {
      expect(f(pw(6))).toBe(false);
      expect(f(pw(12))).toBe(false);
      expect(f(pw(20))).toBe(false);
      expect(f(pw(23))).toBe(false);
    });

    it("4️⃣.3️⃣ should reject a password longer than 256, also the one that has everything else", () => {
      expect(f(pw(257))).toBe(false);
      expect(f(pw(300))).toBe(false);
      expect(f(pw(1000))).toBe(false);
    });

    // why: a regex without the ^ anchor finds a strong password of 24-256 characters inside of a longer text
    it("4️⃣.6️⃣ should reject a long text that has strong passwords inside of it", () => {
      expect(f("Aa1!23".repeat(43))).toBe(false);
      expect(f("Aa1!23".repeat(100))).toBe(false);
    });

    it("4️⃣.4️⃣ should count a password of exactly 24 characters with every kind of character in it", () => {
      expect(f("A" + "a" + "123" + "!" + "x".repeat(18))).toBe(true);
      expect(f("A" + "a" + "123" + "!" + "x".repeat(17))).toBe(false);
    });

    it("4️⃣.5️⃣ should NOT accept an empty password", () => {
      expect(f("")).toBe(false);
    });
  });

  // ==========================================
  // 5️⃣ THE SPECIAL CHARACTER
  // ==========================================
  // One row = one symbol that is the ONLY special character of a password of 24 characters. Why these rows:
  // all 32 symbols; $ + < = > ^ ` | ~ are not punctuation in Unicode, "_" is a word character in a regex.
  describe("5️⃣ The special character", () => {
    const symbols = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~".split("").map((s) => [s, true]);

    it.each(symbols)("5️⃣.1️⃣ %j → %s", (s, expected) => {
      expect(f("Aa123" + s + "x".repeat(18))).toBe(expected);
    });

    it("5️⃣.2️⃣ should accept the special character at the start and at the end", () => {
      expect(f("!Aa123" + "x".repeat(18))).toBe(true);
      expect(f("Aa123" + "x".repeat(18) + "!")).toBe(true);
    });

    it("5️⃣.3️⃣ should NOT take a letter or a digit for the special character", () => {
      expect(f("Aa123" + "x".repeat(19))).toBe(false);
      expect(f("Aa123" + "9".repeat(19))).toBe(false);
      expect(f("Aa123" + "Z".repeat(19))).toBe(false);
    });
  });

  // ==========================================
  // 6️⃣ THE DIGITS
  // ==========================================
  // One row = one password of 24 characters and its answer. Why these rows: 3 is the least that is enough;
  // the digits can be far from each other.
  describe("6️⃣ The digits", () => {
    const rows = [
      ["Aa!xxxxxxxxxxxxxxxxxxxxx", false], // 0
      ["Aa!1xxxxxxxxxxxxxxxxxxxx", false], // 1
      ["Aa!12xxxxxxxxxxxxxxxxxxx", false], // 2
      ["Aa!123xxxxxxxxxxxxxxxxxx", true], // 3
      ["Aa!1234xxxxxxxxxxxxxxxxx", true], // 4
      ["Aa!1x2x3xxxxxxxxxxxxxxxx", true], // apart
      ["1Aa!xxxxxxxxxxxxxxxxxx23", true], // at the start and at the end
      ["1Aa!xxxxxxxxxxxxxxxxxxx2", false], // 2 apart
      ["Aa!0x0x0xxxxxxxxxxxxxxxx", true], // zeros
      ["Aa!9x9x9xxxxxxxxxxxxxxxx", true], // nines
      ["Aa!xxxxxxxxxxxxxxxxxx١٢٣", false], // digits of another script are not digits
    ];

    it.each(rows)("6️⃣.1️⃣ %j → %s", (password, expected) => {
      expect(f(password)).toBe(expected);
    });
  });

  // ==========================================
  // 7️⃣ THE REGEX
  // ==========================================
  describe("7️⃣ The regex", () => {
    it("7️⃣.1️⃣ should be a regular expression", () => {
      expect(r instanceof RegExp).toBe(true);
    });

    // with `g` or `y` test() remembers the position and gives a different answer the next time
    it("7️⃣.2️⃣ should have no global and no sticky flag", () => {
      expect(r.global).toBe(false);
      expect(r.sticky).toBe(false);
    });

    it("7️⃣.3️⃣ should give the same answer when it is used again", () => {
      const strong = "$MySup3erHard0Pass0wor0d";
      expect(r.test(strong)).toBe(true);
      expect(r.test(strong)).toBe(true);
      expect(r.test(strong)).toBe(true);
    });
  });

  // ==========================================
  // 8️⃣ PERFORMANCE
  // ==========================================
  describe("8️⃣ Performance", () => {
    let letters;
    let digits;
    let nearMiss;
    let longStrong;
    let speed;

    beforeAll(() => {
      letters = "a".repeat(5000);
      digits = "1".repeat(5000);
      nearMiss = "1a".repeat(2500);
      longStrong = pw(256);
      speed = ["$MySup3erHard0Pass0wor0d", "MySuperHardPassword", "$mysuperhardpassword", "$TooShort3000", "$SpaceBarsAre Forbidden", "Aa1!23xxxxxxxxxxxxxxxxxx"];
    });

    it("8️⃣.1️⃣ should reject texts of 5 000 characters fast", () => {
      const t0 = Date.now();
      const answers = [f(letters), f(digits), f(nearMiss)];
      const elapsed = Date.now() - t0;
      expect(answers).toEqual([false, false, false]);
      expect(elapsed).toBeLessThan(1000);
    });

    it("8️⃣.2️⃣ should accept the longest strong password fast", () => {
      const t0 = Date.now();
      const answer = f(longStrong);
      const elapsed = Date.now() - t0;
      expect(answer).toBe(true);
      expect(elapsed).toBeLessThan(1000);
    });

    it("8️⃣.3️⃣ should reject a password of 5 000 characters with only 2 digits fast", () => {
      const t0 = Date.now();
      const answer = f("Aa!12" + "x".repeat(4995));
      const elapsed = Date.now() - t0;
      expect(answer).toBe(false);
      expect(elapsed).toBeLessThan(1000);
    });

    // The timing test: most of the spec's run time is spent here, so STRICT mode compares the player's
    // regex with the reference one on exactly this work (18 000 checks of short passwords).
    it("8️⃣.4️⃣ should stay fast on a lot of short passwords", () => {
      let strong = 0;
      for (let i = 0; i < 3000; i++) {
        for (let j = 0; j < speed.length; j++) {
          if (f(speed[j])) strong++;
        }
      }
      expect(strong).toBe(3000 * 2);
    });
  });
});
