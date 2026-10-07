/* Ex2
 * Remove the titles `Mr.` and `Mrs.` from the text.
 *
 * Example:
 *   "Mr. and Mrs. Lucky"  →  " and  Lucky"
 *
 * Scope:
 *   ✓ both titles, every occurrence, not just the first one
 *   ✓ the dot belongs to the title and is a LITERAL dot (Mr, Mrs, Mrx are not titles)
 *   ✓ exact case only: Mr. and Mrs. — MR., mr., mRs. are left alone
 *   ✓ glued titles and titles glued to a name (Mr.Mrs., Mr.Smith) are still removed
 *   ✓ nothing else is touched: spaces, punctuation and newlines stay as they are
 *   ✗ other titles (Ms., Dr., Miss, Prof.) are not in the task
 *
 * Difficulty: ★★☆☆☆☆☆☆☆☆ (2/10)
 */

const f = require("./ex2.js");

describe(":: Running test case for EX2 (remove Mr. and Mrs.)", () => {
  // ==========================================
  // 1️⃣ BASIC
  // ==========================================
  describe("1️⃣ Basic", () => {
    it("1️⃣.1️⃣ should match the example from the task", () => {
      expect(f("Mr. and Mrs. Lucky")).toBe(" and  Lucky");
    });

    it("1️⃣.2️⃣ should remove Mr.", () => {
      expect(f("Hello Mr. Smith")).toBe("Hello  Smith");
    });

    it("1️⃣.3️⃣ should remove Mrs.", () => {
      expect(f("Hello Mrs. Smith")).toBe("Hello  Smith");
    });

    it("1️⃣.4️⃣ should return an empty string when the text is only a title", () => {
      expect(f("Mr.")).toBe("");
      expect(f("Mrs.")).toBe("");
    });

    it("1️⃣.5️⃣ should always return a string", () => {
      expect(typeof f("Mr.")).toBe("string");
      expect(typeof f("")).toBe("string");
    });
  });

  // ==========================================
  // 2️⃣ MANY OCCURRENCES
  // ==========================================
  describe("2️⃣ Many occurrences", () => {
    it("2️⃣.1️⃣ should remove ALL Mr., not just the first one", () => {
      expect(f("Mr. Smith and Mr. Jones and Mr. Brown")).toBe(
        " Smith and  Jones and  Brown",
      );
    });

    it("2️⃣.2️⃣ should remove ALL Mrs., not just the first one", () => {
      expect(f("Mrs. Lee, Mrs. Kim and Mrs. Poe")).toBe(" Lee,  Kim and  Poe");
    });

    it("2️⃣.3️⃣ should remove a mix of both titles in one text", () => {
      expect(f("Mrs. Lee met Mr. Kim and Mrs. Poe")).toBe(
        " Lee met  Kim and  Poe",
      );
    });

    it("2️⃣.4️⃣ should remove titles glued together", () => {
      expect(f("Mr.Mrs.Mr.Mrs.")).toBe("");
    });

    it("2️⃣.5️⃣ should remove a title glued to a name and keep the name", () => {
      expect(f("Mr.Smith & Mrs.Jones")).toBe("Smith & Jones");
    });
  });

  // ==========================================
  // 3️⃣ LITERAL DOT
  // ==========================================
  describe("3️⃣ The dot is part of the title", () => {
    it("3️⃣.1️⃣ should NOT touch titles without the dot", () => {
      expect(f("Mr Smith, Mrs Smith")).toBe("Mr Smith, Mrs Smith");
    });

    it("3️⃣.2️⃣ should NOT treat any character after Mr/Mrs as the dot", () => {
      // a solution with an unescaped `.` (any char) would eat these
      const text = "Mr, Mr! Mr- Mr: Mrs, Mrs! Mrx Mrsx Mr_s";
      expect(f(text)).toBe(text);
    });

    it("3️⃣.3️⃣ should remove only the title's own dot, not the one after it", () => {
      expect(f("Mr.. Mrs..")).toBe(". .");
    });

    it("3️⃣.4️⃣ should keep the sentence dot after a name", () => {
      expect(f("Dear Mr. Lucky, Mrs. Lucky.")).toBe("Dear  Lucky,  Lucky.");
    });
  });

  // ==========================================
  // 4️⃣ EXACT SPELLING
  // ==========================================
  describe("4️⃣ Exact spelling", () => {
    it("4️⃣.1️⃣ should NOT touch other letter cases", () => {
      const text = "MR. mr. MRS. mrs. mR. mRs. MRs. MrS.";
      expect(f(text)).toBe(text);
    });

    it("4️⃣.2️⃣ should NOT touch other titles", () => {
      const text = "Ms. Dr. Miss Mx. Prof. Sir";
      expect(f(text)).toBe(text);
    });

    it("4️⃣.3️⃣ should NOT touch look-alikes of the titles", () => {
      const text = "Mrss. Mrrs. Mmr. M r. M.r. Mr_. Mr․ Мr.";
      expect(f(text)).toBe(text); // ․ = one dot leader, М = Cyrillic «М»
    });
  });

  // ==========================================
  // 5️⃣ SURROUNDINGS
  // ==========================================
  describe("5️⃣ Surroundings", () => {
    it("5️⃣.1️⃣ should remove titles next to punctuation and keep the punctuation", () => {
      expect(f("(Mr.) 'Mrs.' [Mr.], Mrs.!")).toBe("() '' [], !");
    });

    it("5️⃣.2️⃣ should leave newlines and tabs untouched", () => {
      expect(f("Mr.\nMrs.\tMr.\r\nMrs.")).toBe("\n\t\r\n");
    });

    it("5️⃣.3️⃣ should remove titles at the very start and the very end", () => {
      expect(f("Mr. Lucky and Mrs.")).toBe(" Lucky and ");
    });
  });

  // ==========================================
  // 6️⃣ EDGE CASES
  // ==========================================
  describe("6️⃣ Edge cases", () => {
    it("6️⃣.1️⃣ should return an empty string for an empty input", () => {
      expect(f("")).toBe("");
    });

    it("6️⃣.2️⃣ should return the text unchanged when there are no titles", () => {
      const text = "Hello world. Nothing to remove here.";
      expect(f(text)).toBe(text);
    });
  });

  // ==========================================
  // 7️⃣ PERFORMANCE
  // ==========================================
  describe("7️⃣ Performance", () => {
    let titles;
    let noDots;

    beforeAll(() => {
      titles = "Mr. Mrs. ".repeat(50000);
      noDots = "Mrs".repeat(100000);
    });

    it("7️⃣.1️⃣ should handle 100 000 titles correctly and fast", () => {
      const t0 = Date.now();
      const result = f(titles);
      const elapsed = Date.now() - t0;
      expect(result).toBe("  ".repeat(50000));
      expect(elapsed).toBeLessThan(1000);
    });

    it("7️⃣.2️⃣ should handle a very long text without dots and not change it", () => {
      const t0 = Date.now();
      const result = f(noDots);
      const elapsed = Date.now() - t0;
      expect(result).toBe(noDots);
      expect(elapsed).toBeLessThan(1000);
    });
  });
});
