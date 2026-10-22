/* Ex8
 * 🎖CERTIFIED 2026-10-23
 * Check if a message is valid: it must contain the word xoxo or xoxoxo (xo 2 or 3 times).
 * f(message) returns true or false.
 *
 * Example:
 *   "I love you xoxo"  →  true
 *   "I love you xo"    →  false
 *
 * Scope:
 *   ✓ a word that is exactly xoxo or xoxoxo (lower case) makes the message valid, anywhere in it
 *   ✓ the word is separated by spaces, tabs, new lines or the start / the end of the message
 *   ✓ one xo, four xo and more are not valid; two words with one xo each are not valid
 *   ✓ letters or digits glued to the word (axoxo, xoxox, 1xoxo) make it not a word
 *   ✓ the answer is the boolean true / false; an empty message is false
 *   ✓ speed: the timing test (7.5) checks short messages again and again — the solution is compared
 *     with the reference one by STRICT mode
 *   ✗ not pinned: punctuation next to the word (xoxo!, "xoxo"), upper case (XOXO), a word with a hyphen
 *
 * Difficulty: ★★★★☆☆☆☆☆☆ (4/10)
 */

const solution = require("./ex8.js");

// The answer is turned into a boolean, so a function that returns a match or null instead of true / false
// is caught once, by the test of the answer type (6.3), and does not turn every other test red
const f = (text) => Boolean(solution(text));

describe(":: Running test case for EX8 (valid xoxo message)", () => {
  // ==========================================
  // 1️⃣ BASIC
  // ==========================================
  describe("1️⃣ Basic", () => {
    it("1️⃣.1️⃣ should accept xoxo in a message", () => {
      expect(f("I love you xoxo")).toBe(true);
    });

    it("1️⃣.2️⃣ should accept xoxoxo in a message", () => {
      expect(f("I love you xoxoxo")).toBe(true);
    });

    it("1️⃣.3️⃣ should reject one xo", () => {
      expect(f("I love you xo")).toBe(false);
    });

    it("1️⃣.4️⃣ should accept a message that is the word only", () => {
      expect(f("xoxo")).toBe(true);
      expect(f("xoxoxo")).toBe(true);
    });
  });

  // ==========================================
  // 2️⃣ THE NUMBER OF xo
  // ==========================================
  // One row = one message and its answer. Why these rows: 2 and 3 are valid, 1 and 4 are the first
  // ones outside.
  describe("2️⃣ The number of xo", () => {
    const rows = [
      ["xo", false],
      ["xoxo", true],
      ["xoxoxo", true],
      ["xoxoxoxo", false],
      ["xoxoxoxoxo", false],
      ["xoxoxoxoxoxo", false],
      ["x", false],
      ["o", false],
      ["xox", false],
      ["oxo", false],
      ["xoxox", false],
      ["oxoxo", false],
    ];

    it.each(rows)("2️⃣.1️⃣ %j → %s", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 3️⃣ WHERE THE WORD STANDS
  // ==========================================
  // One row = one message and its answer.
  describe("3️⃣ Where the word stands", () => {
    const rows = [
      ["xoxo love", true],
      ["love xoxo", true],
      ["I xoxo you", true],
      ["xoxoxo love", true],
      ["I xoxoxo you", true],
      ["xoxo xoxoxo", true],
      ["xoxo xo", true],
      ["xo xoxo", true],
      ["xoxoxoxo xoxo", true],
      ["  xoxo", true],
      ["xoxo  ", true],
      ["  xoxo  ", true],
      ["I\txoxo\tyou", true],
      ["I\nxoxo\nyou", true],
      ["I\r\nxoxoxo\r\nyou", true],
      ["xoxo\n", true],
      ["\nxoxo", true],
    ];

    it.each(rows)("3️⃣.1️⃣ %j → %s", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 4️⃣ NOT A WHOLE WORD
  // ==========================================
  // One row = one message and its answer. Why these rows: xoxo glued to other letters or digits is another
  // word; a regex without the separators finds xoxo inside of them.
  describe("4️⃣ Not a whole word", () => {
    const rows = [
      ["axoxo", false],
      ["xoxoa", false],
      ["axoxoa", false],
      ["xxoxo", false],
      ["xoxox", false],
      ["oxoxo", false],
      ["xoxoxx", false],
      ["1xoxo", false],
      ["xoxo1", false],
      ["_xoxo", false],
      ["xoxo_", false],
      ["hugsxoxo", false],
      ["xoxohugs", false],
      ["I love you axoxo", false],
      ["xoxoxoa love", false],
      ["xoxoxo1 love", false],
    ];

    it.each(rows)("4️⃣.1️⃣ %j → %s", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 5️⃣ XO IN SEVERAL PLACES
  // ==========================================
  // One row = one message and its answer. Why these rows: the xo have to be in ONE word; xo in
  // several words, or with something between them, are not the word.
  describe("5️⃣ xo in several places", () => {
    const rows = [
      ["xo xo", false],
      ["xo xo xo", false],
      ["xo xo xo xo", false],
      ["xo-xo", false],
      ["xo_xo", false],
      ["xo.xo", false],
      ["x o x o", false],
      ["xo oxo", false],
      ["xxoo", false],
      ["xoxxo", false],
      ["xoooxo", false],
      ["xo\nxo", false],
      ["I love you xo xo and xoxoxoxo", false],
    ];

    it.each(rows)("5️⃣.1️⃣ %j → %s", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 6️⃣ EDGE CASES AND THE ANSWER
  // ==========================================
  describe("6️⃣ Edge cases and the answer", () => {
    it("6️⃣.1️⃣ should reject an empty message", () => {
      expect(f("")).toBe(false);
    });

    it("6️⃣.2️⃣ should reject a message of spaces only and a message without the word", () => {
      expect(f("   ")).toBe(false);
      expect(f("\n\t")).toBe(false);
      expect(f("Hello, how are you?")).toBe(false);
    });

    it("6️⃣.3️⃣ should answer with the boolean true or false, not with a match", () => {
      expect(solution("I love you xoxo")).toBe(true);
      expect(solution("I love you xo")).toBe(false);
    });

    it("6️⃣.4️⃣ should give the same answer when it is called again", () => {
      expect(f("love xoxo")).toBe(true);
      expect(f("love xoxo")).toBe(true);
      expect(f("love xo")).toBe(false);
      expect(f("love xo")).toBe(false);
    });
  });

  // ==========================================
  // 7️⃣ PERFORMANCE
  // ==========================================
  describe("7️⃣ Performance", () => {
    let longValid;
    let longInvalid;
    let manyWords;
    let oneWord;
    let letters;
    let speed;

    beforeAll(() => {
      longValid = "love you ".repeat(2500) + "xoxo";
      longInvalid = "love xo ".repeat(2500) + "xoxoxoxo";
      manyWords = "xoxoxoxo ".repeat(2500);
      oneWord = "xo".repeat(2500);
      letters = "x".repeat(5000);
      speed = ["I love you xoxo", "I love you xoxoxo", "I love you xo", "love xoxoxoxo", "axoxo xoxox", "Hello, how are you?"];
    });

    it("7️⃣.1️⃣ should find the word at the end of a long message correctly and fast", () => {
      const t0 = Date.now();
      const answer = f(longValid);
      const elapsed = Date.now() - t0;
      expect(answer).toBe(true);
      expect(elapsed).toBeLessThan(1000);
    });

    it("7️⃣.2️⃣ should reject a long message without the word fast", () => {
      const t0 = Date.now();
      const answers = [f(longInvalid), f(manyWords)];
      const elapsed = Date.now() - t0;
      expect(answers).toEqual([false, false]);
      expect(elapsed).toBeLessThan(1000);
    });

    it("7️⃣.3️⃣ should reject one word of 2 500 xo fast", () => {
      const t0 = Date.now();
      const answer = f(oneWord);
      const elapsed = Date.now() - t0;
      expect(answer).toBe(false);
      expect(elapsed).toBeLessThan(1000);
    });

    it("7️⃣.4️⃣ should reject 5 000 letters x fast", () => {
      const t0 = Date.now();
      const answer = f(letters);
      const elapsed = Date.now() - t0;
      expect(answer).toBe(false);
      expect(elapsed).toBeLessThan(1000);
    });

    // The timing test: most of the spec's run time is spent here, so STRICT mode compares the player's
    // function with the reference one on exactly this work (18 000 checks of short messages).
    it("7️⃣.5️⃣ should stay fast on a lot of short messages", () => {
      let valid = 0;
      for (let i = 0; i < 3000; i++) {
        for (let j = 0; j < speed.length; j++) {
          if (f(speed[j])) valid++;
        }
      }
      expect(valid).toBe(3000 * 2);
    });
  });
});
