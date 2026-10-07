/* Ex1
 * Remove every whole word `cat` from the text.
 *
 * Example:
 *   "There are no cat left. Cat is gone"  →  "There are no  left.  is gone"
 *
 * Scope:
 *   ✓ every occurrence of the WORD, not just the first one
 *   ✓ case-insensitive (cat, Cat, CAT, cAt …)
 *   ✓ whole words only: scat, cats, concatenate, bobcat, cat5, _cat stay intact
 *   ✓ punctuation, hyphen, apostrophe, slash, newline and tab are word boundaries
 *   ✓ nothing else is touched: spaces, punctuation and newlines stay as they are
 *   ✗ lookalikes (ca t, c-a-t, Cyrillic «с») are not `cat`
 *
 * Difficulty: ★☆☆☆☆☆☆☆☆☆ (1/10)
 */

const f = require("./ex1.js");

describe(":: Running test case for EX1 (remove all words `cat`)", () => {
  // ==========================================
  // 1️⃣ BASIC
  // ==========================================
  describe("1️⃣ Basic", () => {
    it("1️⃣.1️⃣ should match the example from the task", () => {
      expect(f("There are no cat left. Cat is gone")).toBe(
        "There are no  left.  is gone",
      );
    });

    it("1️⃣.2️⃣ should remove a single cat from the middle of a sentence", () => {
      expect(f("a cat b")).toBe("a  b");
    });

    it("1️⃣.3️⃣ should return an empty string when the text is only `cat`", () => {
      expect(f("cat")).toBe("");
    });

    it("1️⃣.4️⃣ should always return a string", () => {
      expect(typeof f("cat")).toBe("string");
      expect(typeof f("")).toBe("string");
    });
  });

  // ==========================================
  // 2️⃣ CASE
  // ==========================================
  describe("2️⃣ Case insensitivity", () => {
    it("2️⃣.1️⃣ should remove UPPERCASE CAT", () => {
      expect(f("x CAT y")).toBe("x  y");
    });

    it("2️⃣.2️⃣ should remove Capitalized Cat", () => {
      expect(f("Cat sat")).toBe(" sat");
    });

    it("2️⃣.3️⃣ should remove any mix of upper and lower case letters", () => {
      expect(f("cAt cAT CaT")).toBe("  ");
    });
  });

  // ==========================================
  // 3️⃣ MULTIPLICITY
  // ==========================================
  describe("3️⃣ Many occurrences", () => {
    it("3️⃣.1️⃣ should remove ALL occurrences, not just the first one", () => {
      expect(f("cat cat cat cat cat")).toBe("    ");
    });

    it("3️⃣.2️⃣ should remove cats separated by punctuation only", () => {
      expect(f("cat,cat/cat-cat")).toBe(",/-");
    });

    it("3️⃣.3️⃣ should treat glued cats as ONE word and keep it", () => {
      expect(f("catcatcat")).toBe("catcatcat");
    });
  });

  // ==========================================
  // 4️⃣ WHOLE WORDS ONLY
  // ==========================================
  describe("4️⃣ Whole words only", () => {
    it("4️⃣.1️⃣ should NOT touch cat glued to letters on the left", () => {
      expect(f("scat")).toBe("scat");
      expect(f("bobcat")).toBe("bobcat");
      expect(f("Bobcat")).toBe("Bobcat");
    });

    it("4️⃣.2️⃣ should NOT touch cat glued to letters on the right", () => {
      expect(f("cats")).toBe("cats");
      expect(f("catty")).toBe("catty");
      expect(f("catalog")).toBe("catalog");
    });

    it("4️⃣.3️⃣ should NOT touch cat in the middle of a word", () => {
      expect(f("concatenate")).toBe("concatenate");
      expect(f("education")).toBe("education");
    });

    it("4️⃣.4️⃣ should treat digits and underscore as part of a word", () => {
      expect(f("cat5 5cat _cat cat_ cat_cat")).toBe("cat5 5cat _cat cat_ cat_cat");
    });

    it("4️⃣.5️⃣ should remove only the real word among look-alike words", () => {
      expect(f("scat cat cats")).toBe("scat  cats");
    });
  });

  // ==========================================
  // 5️⃣ BOUNDARIES THAT DO COUNT
  // ==========================================
  describe("5️⃣ Word boundaries", () => {
    it("5️⃣.1️⃣ should remove cat next to punctuation and keep the punctuation", () => {
      expect(f("cat, cat. cat! (cat) 'cat'")).toBe(", . ! () ''");
    });

    it("5️⃣.2️⃣ should treat hyphen, apostrophe and slash as boundaries", () => {
      expect(f("cat-food")).toBe("-food");
      expect(f("cat's toy")).toBe("'s toy");
      expect(f("cat/dog")).toBe("/dog");
    });

    it("5️⃣.3️⃣ should remove cat at the very start and the very end", () => {
      expect(f("cat sat on a cat")).toBe(" sat on a ");
    });

    it("5️⃣.4️⃣ should leave newlines and tabs untouched", () => {
      expect(f("cat\ncat\tcat\r\ncat")).toBe("\n\t\r\n");
    });
  });

  // ==========================================
  // 6️⃣ EDGE CASES
  // ==========================================
  describe("6️⃣ Edge cases", () => {
    it("6️⃣.1️⃣ should return an empty string for an empty input", () => {
      expect(f("")).toBe("");
    });

    it("6️⃣.2️⃣ should return the text unchanged when there is no cat", () => {
      const text = "Dogs, birds and fish live here.";
      expect(f(text)).toBe(text);
    });

    it("6️⃣.3️⃣ should NOT touch lookalikes of `cat`", () => {
      const text = "ca t c-a-t ct cta act сat caт";
      expect(f(text)).toBe(text); // с and т are Cyrillic «с», «т»
    });
  });

  // ==========================================
  // 7️⃣ PERFORMANCE
  // ==========================================
  describe("7️⃣ Performance", () => {
    let big;
    let expected;
    let noWords;

    beforeAll(() => {
      big = "cat ".repeat(100000);
      expected = " ".repeat(100000);
      noWords = "scat ".repeat(100000);
    });

    it("7️⃣.1️⃣ should handle 100 000 words correctly and fast", () => {
      const t0 = Date.now();
      const result = f(big);
      const elapsed = Date.now() - t0;
      expect(result).toBe(expected);
      expect(elapsed).toBeLessThan(1000);
    });

    it("7️⃣.2️⃣ should handle 100 000 near-misses (scat) without changing them", () => {
      const t0 = Date.now();
      const result = f(noWords);
      const elapsed = Date.now() - t0;
      expect(result).toBe(noWords);
      expect(elapsed).toBeLessThan(1000);
    });
  });
});
