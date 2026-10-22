/* Ex31
 * 🎖CERTIFIED 2026-10-23
 * Find all the valid HEX color codes of a text: # and exactly 3, 4, 6 or 8 hex digits (0-9 a-f A-F),
 * followed by a character that is not a letter, a digit or "_". f(text) returns an array of the codes.
 *
 * Example:
 *   "Colors: #fff, #000000, #F0A"  →  ["#fff", "#000000", "#F0A"]
 *
 * Scope:
 *   ✓ the lengths: 3, 4, 6 and 8 digits are colors; 0, 1, 2, 5, 7 and 9 and more are not
 *   ✓ every hex digit 0-9 a-f A-F in any position; any other letter (g-z), a symbol or a space inside is not a color
 *   ✓ upper, lower and mixed case; the code is returned as it is written, with the #
 *   ✓ the end of the code: a punctuation mark, a bracket, a quote, a space, a new line, a hyphen or the end of
 *     the text is fine; a letter, a digit or "_" right after the code means it is not a color
 *   ✓ several codes in a text (in order, repeats are kept), codes in a CSS-like text
 *   ✓ a text without codes and an empty text give []; the answer is an array of strings
 *   ✓ speed: the timing test (7.5) searches short texts again and again — the solution is compared
 *     with the reference one by STRICT mode
 *   ✗ not pinned: what stands before the # (id#abc, width:100#fff), a doubled ## before the code, letters of
 *     other alphabets right after the code
 *
 * Difficulty: ★★★★☆☆☆☆☆☆ (4/10)
 */

const f = require("./ex31.js");

describe(":: Running test case for EX31 (#RGB HEX colors)", () => {
  // ==========================================
  // 1️⃣ BASIC
  // ==========================================
  describe("1️⃣ Basic", () => {
    it("1️⃣.1️⃣ should find standard 3 and 6 digit HEX codes", () => {
      expect(f("Colors: #fff, #000000, #F0A, #abcdef, #123456")).toEqual(["#fff", "#000000", "#F0A", "#abcdef", "#123456"]);
    });

    it("1️⃣.2️⃣ should find HEX codes with alpha channel (4 and 8 digits)", () => {
      expect(f("Transparent colors: #ff00ffaa, #f00f")).toEqual(["#ff00ffaa", "#f00f"]);
    });

    it("1️⃣.3️⃣ should not match invalid HEX strings", () => {
      expect(f("Invalid: #ff, #12345, #1234567, #gggggg, #z12, #123456789")).toEqual([]);
    });

    it("1️⃣.4️⃣ should pick multiple codes from a sentence with punctuation", () => {
      expect(f("Check #abc; then #112233. Also #AABBCCDD!")).toEqual(["#abc", "#112233", "#AABBCCDD"]);
    });

    it("1️⃣.5️⃣ should be case-insensitive", () => {
      expect(f("Mixed: #aBc, #Def0, #1a2B3c")).toEqual(["#aBc", "#Def0", "#1a2B3c"]);
    });

    it("1️⃣.6️⃣ should return an array of strings", () => {
      const found = f("#fff");
      expect(Array.isArray(found)).toBe(true);
      expect(typeof found[0]).toBe("string");
    });
  });

  // ==========================================
  // 2️⃣ THE LENGTH
  // ==========================================
  // One row = one code and what is found. Why these rows: 3, 4, 6 and 8 are colors, every other length
  // is not; 5 and 7 are the traps of a {3,8} range.
  describe("2️⃣ The length", () => {
    const rows = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 16].map((n) => {
      const text = "#" + "a".repeat(n);
      return [text, [3, 4, 6, 8].includes(n) ? [text] : []];
    });

    it.each(rows)("2️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toEqual(expected);
    });
  });

  // ==========================================
  // 3️⃣ THE CHARACTERS
  // ==========================================
  // One row = one code and what is found. Why these rows: all 22 hex digits are fine; one wrong character
  // in any position (g, G, z, a symbol, a space) breaks the code.
  describe("3️⃣ The characters", () => {
    const rows = [
      ["#012", ["#012"]],
      ["#345", ["#345"]],
      ["#678", ["#678"]],
      ["#9ab", ["#9ab"]],
      ["#cde", ["#cde"]],
      ["#f00", ["#f00"]],
      ["#ABC", ["#ABC"]],
      ["#DEF", ["#DEF"]],
      ["#0f9a", ["#0f9a"]],
      ["#012345", ["#012345"]],
      ["#6789ab", ["#6789ab"]],
      ["#cdefAB", ["#cdefAB"]],
      ["#CDEF0123", ["#CDEF0123"]],
      ["#gbc", []],
      ["#agc", []],
      ["#abg", []],
      ["#ggg", []],
      ["#GGG", []],
      ["#12G", []],
      ["#xyz", []],
      ["#z12", []],
      ["#12g456", []],
      ["#12345g", []],
      ["#gggggg", []],
      ["#ABCDEG", []],
      ["#12 345", []],
      ["#12-345", []],
      ["#12_345", []],
      ["#a.b", []],
    ];

    it.each(rows)("3️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toEqual(expected);
    });

    it("3️⃣.2️⃣ should find a code without the # as nothing", () => {
      expect(f("fff 000000 abc")).toEqual([]);
    });

    it("3️⃣.3️⃣ should not take other signs for the #", () => {
      expect(f("$fff @000000 %abc &123")).toEqual([]);
    });
  });

  // ==========================================
  // 4️⃣ THE END OF THE CODE
  // ==========================================
  // One row = one text and what is found. Why these rows: a code ends at any character except a letter, a digit
  // and "_"; a regex without the closing boundary finds a color inside of a longer word.
  describe("4️⃣ The end of the code", () => {
    const rows = [
      ["#abc", ["#abc"]],
      ["#abc ", ["#abc"]],
      ["#abc,", ["#abc"]],
      ["#abc.", ["#abc"]],
      ["#abc;", ["#abc"]],
      ["#abc:", ["#abc"]],
      ["#abc!", ["#abc"]],
      ["#abc?", ["#abc"]],
      ["#abc)", ["#abc"]],
      ["#abc]", ["#abc"]],
      ["#abc}", ["#abc"]],
      ["#abc\"", ["#abc"]],
      ["#abc'", ["#abc"]],
      ["#abc-", ["#abc"]],
      ["#abc/", ["#abc"]],
      ["#abc>", ["#abc"]],
      ["#abc#", ["#abc"]],
      ["#abc\n", ["#abc"]],
      ["#abc\t", ["#abc"]],
      ["#abc\r\n", ["#abc"]],
      ["#abcg", []],
      ["#abcz", []],
      ["#abcG", []],
      ["#abc_", []],
      ["#abcdefg", []],
      ["#abcdefghij", []],
      ["#abc123456", []],
      ["#abcd5g", []],
    ];

    it.each(rows)("4️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toEqual(expected);
    });
  });

  // ==========================================
  // 5️⃣ SEVERAL CODES AND THE SURROUNDINGS
  // ==========================================
  describe("5️⃣ Several codes and the surroundings", () => {
    it("5️⃣.1️⃣ should find ALL the codes, not just the first one", () => {
      expect(f("#fff #000 #f00 #0f0 #00f")).toEqual(["#fff", "#000", "#f00", "#0f0", "#00f"]);
    });

    it("5️⃣.2️⃣ should keep the order of the text, not the order of the colors", () => {
      expect(f("#fff #000000 #000")).toEqual(["#fff", "#000000", "#000"]);
    });

    it("5️⃣.3️⃣ should keep the repeats", () => {
      expect(f("#fff #fff #FFF")).toEqual(["#fff", "#fff", "#FFF"]);
    });

    it("5️⃣.4️⃣ should find codes of every length in one text", () => {
      expect(f("#abc #abcd #abcdef #abcdef01")).toEqual(["#abc", "#abcd", "#abcdef", "#abcdef01"]);
    });

    it("5️⃣.5️⃣ should find codes in a CSS-like text", () => {
      const css = "a { color: #fff; background: #112233; border: 1px solid #ccc; }\np { color: #00000080 }";
      expect(f(css)).toEqual(["#fff", "#112233", "#ccc", "#00000080"]);
    });

    it("5️⃣.6️⃣ should find codes in brackets, quotes and after signs", () => {
      expect(f("(#abc) [#def] {#123} \"#456\" '#789' =#abc :#def ,#123")).toEqual(["#abc", "#def", "#123", "#456", "#789", "#abc", "#def", "#123"]);
    });

    it("5️⃣.7️⃣ should find codes on several lines", () => {
      expect(f("#abc\n#def\r\n#123456\n\n#12345678")).toEqual(["#abc", "#def", "#123456", "#12345678"]);
    });

    it("5️⃣.8️⃣ should find the valid codes and skip the invalid ones around", () => {
      expect(f("#ff #abc #12345 #def #gggggg #123456")).toEqual(["#abc", "#def", "#123456"]);
    });

    it("5️⃣.9️⃣ should take a number sign with digits for a color when it fits", () => {
      expect(f("issue #123, ticket #12345, bug #7")).toEqual(["#123"]);
    });

    it("5️⃣.1️⃣0️⃣ should find codes separated by a hyphen or a slash", () => {
      expect(f("#abc-#def/#123456")).toEqual(["#abc", "#def", "#123456"]);
    });
  });

  // ==========================================
  // 6️⃣ EDGE CASES
  // ==========================================
  describe("6️⃣ Edge cases", () => {
    it("6️⃣.1️⃣ should return [] for an empty text", () => {
      expect(f("")).toEqual([]);
    });

    it("6️⃣.2️⃣ should return [] for a text without codes", () => {
      expect(f("no colors here, only #hashtags and # signs")).toEqual([]);
      expect(f("  \n\t ")).toEqual([]);
    });

    it("6️⃣.3️⃣ should return an array, not null, when nothing is found", () => {
      expect(Array.isArray(f("nothing"))).toBe(true);
    });

    it("6️⃣.4️⃣ should give the same answer when it is called again", () => {
      expect(f("#abc #def")).toEqual(["#abc", "#def"]);
      expect(f("#abc #def")).toEqual(["#abc", "#def"]);
      expect(f("none")).toEqual([]);
      expect(f("#abc #def")).toEqual(["#abc", "#def"]);
    });
  });

  // ==========================================
  // 7️⃣ PERFORMANCE
  // ==========================================
  describe("7️⃣ Performance", () => {
    let codes;
    let longHex;
    let glued;
    let sevens;
    let speed;

    beforeAll(() => {
      codes = "#fff ".repeat(5000);
      longHex = "#" + "a".repeat(5000);
      glued = "#abc".repeat(1200);
      sevens = "#1234567 ".repeat(2500);
      speed = [
        "Colors: #fff, #000000, #F0A, #abcdef, #123456",
        "Transparent colors: #ff00ffaa, #f00f",
        "Invalid: #ff, #12345, #1234567, #gggggg, #z12",
        "Check #abc; then #112233. Also #AABBCCDD!",
        "no colors here",
      ];
    });

    it("7️⃣.1️⃣ should find 5 000 codes correctly and fast", () => {
      const t0 = Date.now();
      const found = f(codes);
      const elapsed = Date.now() - t0;
      expect(found.filter((c) => c !== "#fff").slice(0, 2)).toEqual([]);
      expect(found.length).toBe(5000);
      expect(elapsed).toBeLessThan(1000);
    });

    it("7️⃣.2️⃣ should reject a code of 5 000 digits fast", () => {
      const t0 = Date.now();
      const found = f(longHex);
      const elapsed = Date.now() - t0;
      expect(found).toEqual([]);
      expect(elapsed).toBeLessThan(1000);
    });

    it("7️⃣.3️⃣ should find 1 200 codes that follow each other without spaces, fast", () => {
      const t0 = Date.now();
      const found = f(glued);
      const elapsed = Date.now() - t0;
      expect(found.length).toBe(1200);
      expect(elapsed).toBeLessThan(1000);
    });

    it("7️⃣.4️⃣ should reject 2 500 codes of 7 digits fast", () => {
      const t0 = Date.now();
      const found = f(sevens);
      const elapsed = Date.now() - t0;
      expect(found).toEqual([]);
      expect(elapsed).toBeLessThan(1000);
    });

    // The timing test: most of the spec's run time is spent here, so STRICT mode compares the player's
    // function with the reference one on exactly this work (15 000 searches in short texts).
    it("7️⃣.5️⃣ should stay fast on a lot of short texts", () => {
      let total = 0;
      for (let i = 0; i < 3000; i++) {
        for (let j = 0; j < speed.length; j++) total += f(speed[j]).length;
      }
      expect(total).toBe(3000 * 10);
    });
  });
});
