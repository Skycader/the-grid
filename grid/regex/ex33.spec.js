/* Ex33
 * 🎖CERTIFIED 2026-10-27
 * Return all the clean words of a text: a word is everything between whitespace, and it is clean when it is
 * made of Latin letters only. f(text) returns an array of the words in the order of the text.
 *
 * Example:
 *   "drop.me x.x rar. .top si'mple i'm fa-i-lure s8s correct"  →  ["correct"]
 *
 * Scope:
 *   ✓ letters a-z and A-Z, both cases: Hello, WORLD, CamelCase are clean
 *   ✓ a dot (inside, at the start, at the end, alone), an apostrophe, a hyphen, an underscore, a digit, a
 *     comma, a bracket, a quote and any other sign anywhere in the word make it not clean
 *   ✓ a word is taken whole or not at all: "drop.me" does not give "drop" and "me", "s8s" does not give "s"
 *   ✓ spaces, many spaces, tabs, \n and \r\n separate the words; whitespace at the start and at the end
 *   ✓ order of the text and every occurrence (repeated words are repeated in the answer)
 *   ✓ the answer is an array, [] for an empty text and for a text without clean words
 *   ✓ speed: the timing test (8.6) works on short texts again and again — the solution is compared with the
 *     reference one by STRICT mode
 *   ✗ not pinned: non-Latin letters (é, ж), non-breaking space and other unusual whitespace
 *
 * Difficulty: ★★★★★★★☆☆☆ (7/10)
 */

const f = require("./ex33.js");

describe(":: Running test case for EX33 (clean words)", () => {
  // ==========================================
  // 1️⃣ BASIC
  // ==========================================
  describe("1️⃣ Basic", () => {
    it("1️⃣.1️⃣ should match the example from the task", () => {
      expect(f("drop.me x.x rar. .top si'mple i'm fa-i-lure s8s correct")).toEqual(["correct"]);
    });

    it("1️⃣.2️⃣ should return the clean words and skip the dotted one", () => {
      expect(f("drop.me fail over")).toEqual(["fail", "over"]);
    });

    it("1️⃣.3️⃣ should return one word", () => {
      expect(f("correct")).toEqual(["correct"]);
    });

    it("1️⃣.4️⃣ should always return an array", () => {
      expect(Array.isArray(f("correct"))).toBe(true);
      expect(Array.isArray(f("drop.me"))).toBe(true);
      expect(Array.isArray(f(""))).toBe(true);
    });
  });

  // ==========================================
  // 2️⃣ ONE WORD: CLEAN
  // ==========================================
  // One row = one text of a single word and the answer. Why these rows: a letter is a letter in any case
  // and in any length.
  describe("2️⃣ One word: clean", () => {
    const rows = [
      ["correct", ["correct"]],
      ["a", ["a"]],
      ["Z", ["Z"]],
      ["Hello", ["Hello"]],
      ["WORLD", ["WORLD"]],
      ["CamelCase", ["CamelCase"]],
      ["supercalifragilisticexpialidocious", ["supercalifragilisticexpialidocious"]],
    ];

    it.each(rows)("2️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toEqual(expected);
    });
  });

  // ==========================================
  // 3️⃣ ONE WORD: A DOT
  // ==========================================
  // One row = one text of a single word and the answer. Why these rows: the dot anywhere makes the word
  // not clean; `\b` and `\w+` cut such a word into clean pieces.
  describe("3️⃣ One word: a dot", () => {
    const rows = [
      ["drop.me", []],
      ["x.x", []],
      ["rar.", []],
      [".top", []],
      [".", []],
      ["...", []],
      ["a..b", []],
      ["a.b.c.d", []],
      ["example.com", []],
      ["e.g.", []],
      ["www.site.org.", []],
      ["a.", []],
      [".a", []],
    ];

    it.each(rows)("3️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toEqual(expected);
    });
  });

  // ==========================================
  // 4️⃣ ONE WORD: OTHER SIGNS AND DIGITS
  // ==========================================
  // One row = one text of a single word and the answer. Why these rows: only letters are clean, so an
  // apostrophe, a hyphen, a digit, an underscore or a punctuation mark spoils the word as a dot does.
  describe("4️⃣ One word: other signs and digits", () => {
    const rows = [
      ["si'mple", []],
      ["i'm", []],
      ["it's", []],
      ["fa-i-lure", []],
      ["well-known", []],
      ["-a", []],
      ["a-", []],
      ["s8s", []],
      ["x2", []],
      ["2x", []],
      ["42", []],
      ["3.14", []],
      ["snake_case", []],
      ["_a", []],
      ["a_", []],
      ["cat,", []],
      [",cat", []],
      ["a,b", []],
      ["end!", []],
      ["what?", []],
      ["(a)", []],
      ['"quote"', []],
      ["a;", []],
      ["a:b", []],
      ["a/b", []],
      ["a@b", []],
      ["a+b", []],
      ["#tag", []],
    ];

    it.each(rows)("4️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toEqual(expected);
    });
  });

  // ==========================================
  // 5️⃣ MANY WORDS
  // ==========================================
  describe("5️⃣ Many words", () => {
    it("5️⃣.1️⃣ should keep the order of the text", () => {
      expect(f("one two three four")).toEqual(["one", "two", "three", "four"]);
      expect(f("one t.wo three fo4ur five")).toEqual(["one", "three", "five"]);
    });

    it("5️⃣.2️⃣ should return every occurrence of a repeated word", () => {
      expect(f("go go go")).toEqual(["go", "go", "go"]);
      expect(f("go go. go go.")).toEqual(["go", "go"]);
    });

    it("5️⃣.3️⃣ should NOT cut a bad word into clean pieces", () => {
      expect(f("drop.me")).toEqual([]);
      expect(f("s8s")).toEqual([]);
      expect(f("fa-i-lure")).toEqual([]);
      expect(f("a.b c d.e")).toEqual(["c"]);
      expect(f("x,y z")).toEqual(["z"]);
    });

    it("5️⃣.4️⃣ should NOT take a clean part of a word that touches a sign", () => {
      expect(f("cat, dog")).toEqual(["dog"]);
      expect(f("end. start")).toEqual(["start"]);
      expect(f("(a) b")).toEqual(["b"]);
      expect(f("a-b c")).toEqual(["c"]);
    });

    it("5️⃣.5️⃣ should return the clean words from the first and the last place", () => {
      expect(f("first x.x y.y last")).toEqual(["first", "last"]);
      expect(f("x.x middle y.y")).toEqual(["middle"]);
    });

    it("5️⃣.6️⃣ should return the clean words among the digits and the signs", () => {
      expect(f("it's 3.14 ok")).toEqual(["ok"]);
      expect(f("a1 b2 c d3 e")).toEqual(["c", "e"]);
    });

    it("5️⃣.7️⃣ should return [] when every word is bad", () => {
      expect(f("drop.me x.x rar. .top si'mple i'm fa-i-lure s8s")).toEqual([]);
    });
  });

  // ==========================================
  // 6️⃣ WHITESPACE
  // ==========================================
  // One row = one text and the answer. Why these rows: the separator is any whitespace, one or many; a
  // word at the very start or end of the text has no whitespace on one side.
  describe("6️⃣ Whitespace", () => {
    const rows = [
      ["a b", ["a", "b"]],
      ["a  b", ["a", "b"]],
      ["a     b", ["a", "b"]],
      ["a\tb", ["a", "b"]],
      ["a\nb", ["a", "b"]],
      ["a\r\nb", ["a", "b"]],
      ["a\n\n\nb", ["a", "b"]],
      ["a \t\n\r\n b", ["a", "b"]],
      [" a", ["a"]],
      ["a ", ["a"]],
      ["  a  b  ", ["a", "b"]],
      ["\na\n", ["a"]],
      ["\tfail\tx.x\tover\t", ["fail", "over"]],
      ["x.x\nfail\r\nover\ndrop.me", ["fail", "over"]],
    ];

    it.each(rows)("6️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toEqual(expected);
    });
  });

  // ==========================================
  // 7️⃣ EDGE CASES
  // ==========================================
  describe("7️⃣ Edge cases", () => {
    it("7️⃣.1️⃣ should return [] for an empty text", () => {
      expect(f("")).toEqual([]);
    });

    it("7️⃣.2️⃣ should return [] for a text of whitespace only", () => {
      expect(f(" ")).toEqual([]);
      expect(f("   \t\n\r\n  ")).toEqual([]);
    });

    it("7️⃣.3️⃣ should return [] for a text of signs only", () => {
      expect(f(". , ! ? -")).toEqual([]);
      expect(f("123 456")).toEqual([]);
    });

    it("7️⃣.4️⃣ should give the same answer when it is called again", () => {
      const text = "drop.me fail over";
      expect(f(text)).toEqual(["fail", "over"]);
      expect(f(text)).toEqual(["fail", "over"]);
      expect(f("none.")).toEqual([]);
      expect(f(text)).toEqual(["fail", "over"]);
    });

    it("7️⃣.5️⃣ should return a new array each time", () => {
      const first = f("a b");
      const second = f("a b");
      expect(first === second).toBe(false);
      expect(f("x.x") === f("x.x")).toBe(false);
    });
  });

  // ==========================================
  // 8️⃣ PERFORMANCE
  // ==========================================
  describe("8️⃣ Performance", () => {
    let many;
    let longClean;
    let longBadEnd;
    let longBadStart;
    let manyBad;
    let speed;

    beforeAll(() => {
      many = "word ".repeat(5000);
      longClean = "a".repeat(5000);
      longBadEnd = "a".repeat(5000) + ".";
      longBadStart = "." + "a".repeat(5000);
      manyBad = "ab.cd ".repeat(5000);
      speed = [
        "drop.me x.x rar. .top si'mple i'm fa-i-lure s8s correct",
        "drop.me fail over",
        "Hello World",
        "it's 3.14 ok",
        "a\tb\nc\r\nd",
        "end. cat, 42",
      ];
    });

    it("8️⃣.1️⃣ should return 5 000 words correctly and fast", () => {
      const t0 = Date.now();
      const result = f(many);
      const elapsed = Date.now() - t0;
      expect(result.length).toBe(5000);
      expect(elapsed).toBeLessThan(1000);
    });

    it("8️⃣.2️⃣ should return one word of 5 000 letters, fast", () => {
      const t0 = Date.now();
      const result = f(longClean);
      const elapsed = Date.now() - t0;
      expect(result).toEqual([longClean]);
      expect(elapsed).toBeLessThan(1000);
    });

    it("8️⃣.3️⃣ should reject a word of 5 000 letters with a dot at the end, fast", () => {
      const t0 = Date.now();
      const result = f(longBadEnd);
      const elapsed = Date.now() - t0;
      expect(result).toEqual([]);
      expect(elapsed).toBeLessThan(1000);
    });

    it("8️⃣.4️⃣ should reject a word of 5 000 letters with a dot at the start, fast", () => {
      const t0 = Date.now();
      const result = f(longBadStart);
      const elapsed = Date.now() - t0;
      expect(result).toEqual([]);
      expect(elapsed).toBeLessThan(1000);
    });

    it("8️⃣.5️⃣ should reject 5 000 dotted words, fast", () => {
      const t0 = Date.now();
      const result = f(manyBad);
      const elapsed = Date.now() - t0;
      expect(result).toEqual([]);
      expect(elapsed).toBeLessThan(1000);
    });

    // The timing test: most of the spec's run time is spent here, so STRICT mode compares the player's
    // function with the reference one on exactly this work (18 000 calls on short texts).
    it("8️⃣.6️⃣ should stay fast on a lot of short texts", () => {
      let total = 0;
      for (let i = 0; i < 3000; i++) {
        for (let j = 0; j < speed.length; j++) total += f(speed[j]).length;
      }
      expect(total).toBe(3000 * 10);
    });
  });
});
