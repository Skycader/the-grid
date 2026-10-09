/* Ex21
 * Count the words that end with the same letter they start with.
 *
 * Example:
 *   "aqua astra mom text roar\ncar level map"  →  6
 *
 * Scope:
 *   ✓ every occurrence counts: the same word twice is counted twice
 *   ✓ words are separated by spaces, tabs, newlines and punctuation
 *   ✓ a word never reaches into the next one ("ab ba" has no such word)
 *   ✓ the first and the last letter are compared, not "does the letter repeat somewhere"
 *   ✓ a word of one letter counts too (a, b, x), but a two-letter word needs equal letters
 *   ✗ not pinned: capital letters (Anna, I), digits, underscore, non-Latin letters —
 *     the task statement does not decide them
 *
 * Difficulty: ★★★★★★☆☆☆☆ (6/10)
 */

const f = require("./ex21.js");

describe(":: Running test case for EX21 (same first and last letter)", () => {
  // ==========================================
  // 1️⃣ BASIC
  // ==========================================
  describe("1️⃣ Basic", () => {
    it("1️⃣.1️⃣ should match the example from the task", () => {
      const text = `
aqua astra mom text roar
car level map
`;
      expect(f(text)).toBe(6);
    });

    it("1️⃣.2️⃣ should count each word from the task statement", () => {
      expect(f("aqua")).toBe(1);
      expect(f("astra")).toBe(1);
      expect(f("mom")).toBe(1);
      expect(f("text")).toBe(1);
      expect(f("roar")).toBe(1);
    });

    it("1️⃣.3️⃣ should NOT count words with different first and last letters", () => {
      expect(f("car")).toBe(0);
      expect(f("map")).toBe(0);
      expect(f("dynomite")).toBe(0);
      expect(f("bobr")).toBe(0);
    });

    it("1️⃣.4️⃣ should work fine with zero income", () => {
      expect(f("\ndynomite bobr\n")).toBe(0);
    });

    it("1️⃣.5️⃣ should always return a number", () => {
      expect(typeof f("mom")).toBe("number");
      expect(typeof f("")).toBe("number");
    });
  });

  // ==========================================
  // 2️⃣ MANY WORDS
  // ==========================================
  describe("2️⃣ Many words", () => {
    it("2️⃣.1️⃣ should count all matching words in one line", () => {
      expect(f("aqua astra mom text roar")).toBe(5);
    });

    it("2️⃣.2️⃣ should count the same word every time it occurs", () => {
      // a Set of words would give 1 here
      expect(f("mom mom mom")).toBe(3);
    });

    it("2️⃣.3️⃣ should count only the matching words in a mixed text", () => {
      expect(f("mom car dad map text")).toBe(3);
    });

    it("2️⃣.4️⃣ should count words on several lines", () => {
      expect(f("mom\ncar\ndad\n\nmap\nlevel")).toBe(3);
    });
  });

  // ==========================================
  // 3️⃣ WORD BOUNDARIES
  // ==========================================
  describe("3️⃣ Word boundaries", () => {
    it("3️⃣.1️⃣ should NOT build a word out of two neighbouring words", () => {
      // "ab ba": a ... a if the space were part of the word
      expect(f("ab ba")).toBe(0);
      expect(f("car rac")).toBe(0);
      expect(f("map pam")).toBe(0);
    });

    it("3️⃣.2️⃣ should treat punctuation as a separator", () => {
      expect(f("mom, dad. text!")).toBe(3);
      expect(f("(mom) 'dad' \"text\"")).toBe(3);
    });

    it("3️⃣.3️⃣ should treat tabs and newlines as separators", () => {
      expect(f("mom\tdad\nlevel")).toBe(3);
      expect(f("mom\r\ndad")).toBe(2);
    });

    it("3️⃣.4️⃣ should not care how many separators there are", () => {
      expect(f("mom     dad\n\n\n\ttext")).toBe(3);
    });
  });

  // ==========================================
  // 4️⃣ SHAPE OF THE WORD
  // ==========================================
  describe("4️⃣ Shape of the word", () => {
    it("4️⃣.1️⃣ should count a two-letter word made of the same letter", () => {
      expect(f("aa")).toBe(1);
    });

    it("4️⃣.2️⃣ should compare the first and the LAST letter", () => {
      expect(f("abca")).toBe(1);
      expect(f("abcab")).toBe(0);
    });

    it("4️⃣.3️⃣ should NOT count a word where the first letter only repeats inside", () => {
      expect(f("abac")).toBe(0);
      expect(f("banana")).toBe(0);
      expect(f("abab")).toBe(0);
    });

    it("4️⃣.4️⃣ should count palindromes and non-palindromes alike", () => {
      expect(f("level abba")).toBe(2);
      expect(f("baab bcab")).toBe(2);
    });
  });

  // ==========================================
  // 5️⃣ ONE-LETTER WORDS
  // ==========================================
  describe("5️⃣ One-letter words", () => {
    it("5️⃣.1️⃣ should count a one-letter word", () => {
      expect(f("a")).toBe(1);
      expect(f("x")).toBe(1);
    });

    it("5️⃣.2️⃣ should count every one-letter word separately", () => {
      expect(f("a b c")).toBe(3);
      expect(f("a a a")).toBe(3);
    });

    it("5️⃣.3️⃣ should count one-letter words next to longer matching words", () => {
      expect(f("a mom ab x")).toBe(3);
      expect(f("ab a ba")).toBe(1);
    });

    it("5️⃣.4️⃣ should NOT let the one-letter rule leak into two-letter words", () => {
      // a solution that makes the backreference itself optional counts every word
      expect(f("ab")).toBe(0);
      expect(f("ab cd ef")).toBe(0);
      expect(f("aa")).toBe(1);
    });

    it("5️⃣.5️⃣ should treat punctuation and whitespace around a one-letter word as separators", () => {
      expect(f("a, b. c!")).toBe(3);
      expect(f("x\ny\tz")).toBe(3);
      expect(f("(a) 'b'")).toBe(2);
    });

    it("5️⃣.6️⃣ should NOT take a letter out of a longer word", () => {
      expect(f("abc")).toBe(0);
      expect(f("abc abd")).toBe(0);
    });
  });

  // ==========================================
  // 6️⃣ EDGE CASES
  // ==========================================
  describe("6️⃣ Edge cases", () => {
    it("6️⃣.1️⃣ should return 0 for an empty input", () => {
      expect(f("")).toBe(0);
    });

    it("6️⃣.2️⃣ should return 0 for whitespace only", () => {
      expect(f("   \n\t  \r\n")).toBe(0);
    });

    it("6️⃣.3️⃣ should return 0 for punctuation only", () => {
      expect(f("!!! ... ,,, --- ???")).toBe(0);
    });
  });

  // ==========================================
  // 7️⃣ PERFORMANCE
  // ==========================================
  describe("7️⃣ Performance", () => {
    let matching;
    let notMatching;
    let singles;

    beforeAll(() => {
      matching = "mom ".repeat(5000);
      notMatching = "ab ".repeat(5000);
      singles = "a ".repeat(5000);
    });

    it("7️⃣.1️⃣ should count 5 000 words correctly and fast", () => {
      const t0 = Date.now();
      const result = f(matching);
      const elapsed = Date.now() - t0;
      expect(result).toBe(5000);
      expect(elapsed).toBeLessThan(1000);
    });

    it("7️⃣.2️⃣ should handle a long text without a single match fast", () => {
      // a lazy scan that can cross spaces goes to the end of the text from every word
      const t0 = Date.now();
      const result = f(notMatching);
      const elapsed = Date.now() - t0;
      expect(result).toBe(0);
      expect(elapsed).toBeLessThan(1000);
    });

    it("7️⃣.3️⃣ should count 5 000 one-letter words correctly and fast", () => {
      const t0 = Date.now();
      const result = f(singles);
      const elapsed = Date.now() - t0;
      expect(result).toBe(5000);
      expect(elapsed).toBeLessThan(1000);
    });
  });
});
