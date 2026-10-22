/* Ex7
 * 🎖CERTIFIED 2026-10-23
 * Replace every word the and The with a.
 * Only the whole word in exactly two spellings (the, The) is replaced, the result is the lower case a.
 *
 * Example:
 *   "The cat and the dog and a rat"  →  "a cat and a dog and a rat"
 *
 * Scope:
 *   ✓ the and The, every occurrence in a text, at the start, in the middle, at the end
 *   ✓ the word is whole: other, then, they, theory, bathe, breathe are left alone
 *   ✓ other spellings are left alone: THE, tHe, ThE, thE
 *   ✓ punctuation, brackets, quotes, new lines and tabs around the word stay as they are
 *   ✓ the answer is a string; a text without the word and an empty text stay as they are
 *   ✓ speed: the timing test (7.3) replaces in short texts again and again — the solution is compared
 *     with the reference one by STRICT mode
 *   ✗ not pinned: the word glued to a digit or an underscore (the1, the_), a hyphen or an apostrophe
 *     inside (the-cat, the's), letters of other alphabets next to the word
 *
 * Difficulty: ★★★★☆☆☆☆☆☆ (4/10)
 */

const f = require("./ex7.js");

describe(":: Running test case for EX7 (replace the with a)", () => {
  // ==========================================
  // 1️⃣ BASIC
  // ==========================================
  describe("1️⃣ Basic", () => {
    it("1️⃣.1️⃣ should match the example from the task", () => {
      expect(f("The cat and the dog and a rat")).toBe("a cat and a dog and a rat");
    });

    it("1️⃣.2️⃣ should replace the word when it is the whole text", () => {
      expect(f("the")).toBe("a");
      expect(f("The")).toBe("a");
    });

    it("1️⃣.3️⃣ should always return a string", () => {
      expect(typeof f("the")).toBe("string");
      expect(typeof f("")).toBe("string");
    });
  });

  // ==========================================
  // 2️⃣ THE SPELLINGS
  // ==========================================
  // One row = one text and its answer. Why these rows: only the and The are the word; every other
  // case stays (a regex with the `i` flag would replace all of them).
  describe("2️⃣ The spellings", () => {
    const rows = [
      ["the", "a"],
      ["The", "a"],
      ["THE", "THE"],
      ["tHe", "tHe"],
      ["thE", "thE"],
      ["ThE", "ThE"],
      ["THe", "THe"],
      ["tHE", "tHE"],
    ];

    it.each(rows)("2️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 3️⃣ THE WHOLE WORD
  // ==========================================
  // One row = one text that must stay as it is. Why these rows: "the" is inside of these words, but they
  // are other words; a regex without the word boundaries turns "other" into "aor".
  describe("3️⃣ Words that contain the", () => {
    const rows = [
      ["other", "other"],
      ["then", "then"],
      ["they", "they"],
      ["there", "there"],
      ["these", "these"],
      ["theme", "theme"],
      ["theory", "theory"],
      ["bathe", "bathe"],
      ["lathe", "lathe"],
      ["breathe", "breathe"],
      ["Thesis", "Thesis"],
      ["Theodore", "Theodore"],
      ["anathema", "anathema"],
      ["Other", "Other"],
      ["mother", "mother"],
    ];

    it.each(rows)("3️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 4️⃣ SURROUNDINGS
  // ==========================================
  // One row = one text and its answer.
  describe("4️⃣ Surroundings", () => {
    const rows = [
      ["the cat", "a cat"],
      ["on the", "on a"],
      ["on the table", "on a table"],
      ["the, The; the: The", "a, a; a: a"],
      ["(the)", "(a)"],
      ["[The]", "[a]"],
      ['"the"', '"a"'],
      ["'The'", "'a'"],
      ["the.", "a."],
      ["the!", "a!"],
      ["the?", "a?"],
      ["the\nThe", "a\na"],
      ["the\tThe", "a\ta"],
      ["the\r\nThe", "a\r\na"],
      [" the ", " a "],
    ];

    it.each(rows)("4️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 5️⃣ SEVERAL WORDS
  // ==========================================
  describe("5️⃣ Several words", () => {
    it("5️⃣.1️⃣ should replace ALL the words, not just the first one", () => {
      expect(f("the the the")).toBe("a a a");
      expect(f("The The The")).toBe("a a a");
    });

    it("5️⃣.2️⃣ should replace both spellings in one text", () => {
      expect(f("The cat and the dog and The bird")).toBe("a cat and a dog and a bird");
    });

    it("5️⃣.3️⃣ should replace the word and keep the words that contain it", () => {
      expect(f("the other one, then they bathe")).toBe("a other one, then they bathe");
    });

    it("5️⃣.4️⃣ should keep the other spellings next to the right ones", () => {
      expect(f("THE the tHe The ThE")).toBe("THE a tHe a ThE");
    });

    it("5️⃣.5️⃣ should replace the word at the very start and at the very end", () => {
      expect(f("The end of the")).toBe("a end of a");
    });

    it("5️⃣.6️⃣ should replace a sentence full of articles", () => {
      expect(f("The quick brown fox jumps over the lazy dog. The end.")).toBe("a quick brown fox jumps over a lazy dog. a end.");
    });

    it("5️⃣.7️⃣ should replace the word that comes right after another replaced one", () => {
      expect(f("the the")).toBe("a a");
      expect(f("The, the")).toBe("a, a");
    });

    it("5️⃣.8️⃣ should NOT merge the words that were next to the replaced one", () => {
      expect(f("in the end")).toBe("in a end");
      expect(f("Is the other the one?")).toBe("Is a other a one?");
    });
  });

  // ==========================================
  // 6️⃣ EDGE CASES
  // ==========================================
  describe("6️⃣ Edge cases", () => {
    it("6️⃣.1️⃣ should return an empty string for an empty input", () => {
      expect(f("")).toBe("");
    });

    it("6️⃣.2️⃣ should return the text unchanged when there is no word", () => {
      const text = "Hello world. Nothing to replace here.";
      expect(f(text)).toBe(text);
    });

    it("6️⃣.3️⃣ should give the same answer when it is called again", () => {
      expect(f("The cat")).toBe("a cat");
      expect(f("The cat")).toBe("a cat");
    });
  });

  // ==========================================
  // 7️⃣ PERFORMANCE
  // ==========================================
  describe("7️⃣ Performance", () => {
    let words;
    let inside;
    let speed;

    beforeAll(() => {
      words = "the The ".repeat(2500);
      inside = "other ".repeat(5000);
      speed = [
        "The cat and the dog and a rat",
        "the, (the) the. The!",
        "the other one, then they bathe",
        "THE tHe THe thE",
        "The quick brown fox jumps over the lazy dog.",
      ];
    });

    it("7️⃣.1️⃣ should replace 5 000 words correctly and fast", () => {
      const t0 = Date.now();
      const result = f(words);
      const elapsed = Date.now() - t0;
      expect(result === "a a ".repeat(2500)).toBe(true);
      expect(elapsed).toBeLessThan(1000);
    });

    it("7️⃣.2️⃣ should leave 5 000 words that contain the as they are, fast", () => {
      const t0 = Date.now();
      const result = f(inside);
      const elapsed = Date.now() - t0;
      expect(result === inside).toBe(true);
      expect(elapsed).toBeLessThan(1000);
    });

    // The timing test: most of the spec's run time is spent here, so STRICT mode compares the player's
    // function with the reference one on exactly this work (15 000 replacements in short texts).
    it("7️⃣.3️⃣ should stay fast on a lot of short texts", () => {
      let total = 0;
      for (let i = 0; i < 3000; i++) {
        for (let j = 0; j < speed.length; j++) total += f(speed[j]).length;
      }
      expect(total).toBe(3000 * 120);
    });
  });
});
