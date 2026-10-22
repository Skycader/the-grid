/* Ex5
 * 🎖CERTIFIED 2026-10-23
 * Count the people who own a cat or a rat and whose name is exactly 4 letters long.
 * f(text) returns a number. One owner is "<Name>'s cat" or "<Name>'s rat" with a 4-letter name.
 *
 * Example:
 *   "Jane's cat and Mike's rat and Naomi's dog and Alex's cat and John's dog"  →  3
 *
 * Scope:
 *   ✓ the name is exactly 4 letters and a whole word (Jon, Naomi, Maximilian are not); letters only
 *   ✓ the pet is the whole word cat or rat (dog, mouse, cart, rattle, category are not)
 *   ✓ the form is Name's pet: 's, one space (Jane cat and Janes cat are not)
 *   ✓ upper and lower case letters in the name
 *   ✓ every owner in a text is counted: in one line, on several lines, next to punctuation
 *   ✓ the answer is a number, 0 for a text without owners and for an empty text
 *   ✓ speed: the timing test (7.5) counts in short texts again and again — the solution is compared
 *     with the reference one by STRICT mode
 *   ✗ not pinned: plural pets (cats), upper case pets (CAT), several spaces or a new line between
 *     's and the pet, a typographic apostrophe (’), names with non-Latin letters, the same owner twice
 *
 * Difficulty: ★★☆☆☆☆☆☆☆☆ (2/10)
 */

const f = require("./ex5.js");

describe(":: Running test case for EX5 (4-letter owners of cats and rats)", () => {
  // ==========================================
  // 1️⃣ BASIC
  // ==========================================
  describe("1️⃣ Basic", () => {
    it("1️⃣.1️⃣ should match the example from the task", () => {
      expect(f("Jane's cat and Mike's rat and Naomi's dog and Alex's cat and John's dog")).toBe(3);
    });

    it("1️⃣.2️⃣ should count one owner of a cat", () => {
      expect(f("Jane's cat")).toBe(1);
    });

    it("1️⃣.3️⃣ should count one owner of a rat", () => {
      expect(f("Mike's rat")).toBe(1);
    });

    it("1️⃣.4️⃣ should always return a number", () => {
      expect(typeof f("Jane's cat")).toBe("number");
      expect(typeof f("")).toBe("number");
    });
  });

  // ==========================================
  // 2️⃣ THE LENGTH OF THE NAME
  // ==========================================
  // One row = one text and the number of owners. Why these rows: exactly 4 letters, as a whole word.
  // A regex without the word boundary finds "aomi's cat" inside "Naomi's cat".
  describe("2️⃣ The length of the name", () => {
    const rows = [
      ["Jane's cat", 1],
      ["Mike's rat", 1],
      ["Alex's cat", 1],
      ["Anna's rat", 1],
      ["Jo's cat", 0],
      ["Jon's cat", 0],
      ["Naomi's cat", 0],
      ["Alexa's rat", 0],
      ["Maximilian's cat", 0],
      ["A's cat", 0],
      ["'s cat", 0],
    ];

    it.each(rows)("2️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 3️⃣ THE LETTERS OF THE NAME
  // ==========================================
  // One row = one text and the number of owners. Why these rows: the name is made of letters, any case.
  describe("3️⃣ The letters of the name", () => {
    const rows = [
      ["JANE's cat", 1],
      ["jane's cat", 1],
      ["jAnE's cat", 1],
      ["Jan1's cat", 0],
      ["J4ne's cat", 0],
      ["1234's rat", 0],
      ["Ja_e's rat", 0],
      ["Ja e's rat", 0],
      ["Ja-e's rat", 0],
      ["Ja.e's rat", 0],
    ];

    it.each(rows)("3️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 4️⃣ THE PET
  // ==========================================
  // One row = one text and the number of owners. Why these rows: only a whole word cat or rat; a regex without
  // the closing boundary counts "rattle" and "category".
  describe("4️⃣ The pet", () => {
    const rows = [
      ["Jane's dog", 0],
      ["Mike's mouse", 0],
      ["Lena's bat", 0],
      ["Anna's hat", 0],
      ["John's cart", 0],
      ["Alex's rattle", 0],
      ["Alex's category", 0],
      ["Jane's cattle", 0],
      ["Jane's ca t", 0],
      ["Jane's cut", 0],
      ["Jane's mat", 0],
      ["Jane's rot", 0],
      ["Jane's", 0],
    ];

    it.each(rows)("4️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 5️⃣ THE FORM "NAME'S PET"
  // ==========================================
  // One row = one text and the number of owners.
  describe("5️⃣ The form", () => {
    const rows = [
      ["Jane cat", 0],
      ["Janes cat", 0],
      ["Janes' cat", 0],
      ["Jane`s cat", 0],
      ["Jane'scat", 0],
      ["Jane's-cat", 0],
      ["Jane's,cat", 0],
      ["cat Jane's", 0],
      ["Jane's. cat", 0],
    ];

    it.each(rows)("5️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 6️⃣ SEVERAL OWNERS IN A TEXT
  // ==========================================
  describe("6️⃣ Several owners", () => {
    it("6️⃣.1️⃣ should count owners of different pets in one line", () => {
      expect(f("Jane's cat and Mike's rat")).toBe(2);
    });

    it("6️⃣.2️⃣ should count only the right owners among the wrong ones", () => {
      expect(f("Jon's cat, Jane's cat, Naomi's rat, Mike's rat, John's dog, Alex's mouse")).toBe(2);
    });

    it("6️⃣.3️⃣ should count owners on several lines", () => {
      expect(f("Jane's cat\nMike's rat\r\nAlex's cat\tAnna's rat")).toBe(4);
    });

    it("6️⃣.4️⃣ should count owners next to punctuation", () => {
      expect(f("(Jane's cat), [Mike's rat]; 'Alex's cat'! Anna's rat.")).toBe(4);
    });

    it("6️⃣.5️⃣ should count owners that follow each other", () => {
      expect(f("Jane's cat Mike's rat Alex's cat Anna's rat Lena's cat")).toBe(5);
    });

    it("6️⃣.6️⃣ should count an owner at the very start and at the very end", () => {
      expect(f("Jane's cat sleeps. Then Mike's rat")).toBe(2);
    });
  });

  // ==========================================
  // 7️⃣ EDGE CASES AND PERFORMANCE
  // ==========================================
  describe("7️⃣ Edge cases and performance", () => {
    let owners;
    let longNames;
    let noPets;
    let speed;

    beforeAll(() => {
      owners = "Jane's cat ".repeat(5000);
      longNames = "Naomi's cat ".repeat(5000);
      noPets = "a".repeat(5000) + "'s cat";
      speed = [
        "Jane's cat and Mike's rat and Naomi's dog and Alex's cat and John's dog",
        "Naomi's cat, Jon's rat, Maximilian's cat",
        "Jane's dog, Mike's mouse, John's cart, Alex's rattle",
        "Jane cat, Janes cat, Jane's, cat",
        "Hello world",
      ];
    });

    it("7️⃣.1️⃣ should return 0 for an empty text, not fail", () => {
      expect(f("")).toBe(0);
    });

    it("7️⃣.2️⃣ should return 0 for a text without owners, not fail", () => {
      expect(f("no pets here")).toBe(0);
      expect(f("  \n\t ")).toBe(0);
    });

    it("7️⃣.3️⃣ should count 5 000 owners correctly and fast", () => {
      const t0 = Date.now();
      const count = f(owners);
      const elapsed = Date.now() - t0;
      expect(count).toBe(5000);
      expect(elapsed).toBeLessThan(1000);
    });

    it("7️⃣.4️⃣ should reject 5 000 names of 5 letters and a very long name fast", () => {
      const t0 = Date.now();
      const counts = [f(longNames), f(noPets)];
      const elapsed = Date.now() - t0;
      expect(counts).toEqual([0, 0]);
      expect(elapsed).toBeLessThan(1000);
    });

    // The timing test: most of the spec's run time is spent here, so STRICT mode compares the player's
    // function with the reference one on exactly this work (15 000 counts in short texts).
    it("7️⃣.5️⃣ should stay fast on a lot of short texts", () => {
      let total = 0;
      for (let i = 0; i < 3000; i++) {
        for (let j = 0; j < speed.length; j++) total += f(speed[j]);
      }
      expect(total).toBe(3000 * 3);
    });
  });
});
