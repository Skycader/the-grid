/* Ex23
 * 🎖CERTIFIED 2026-10-23
 * Export a regex that finds the words like lel, lil, lal but not lol itself. It is used as
 * text.replace(r, "l*l").
 * A word is l, ONE character that is not o, l — a whole word.
 *
 * Example:
 *   "lol lal lil lel lol lul"  →  "lol l*l l*l l*l lol l*l"
 *
 * Scope:
 *   ✓ every letter a-z in the middle is found, except o (the ends: a, n, p, z around o)
 *   ✓ a digit or a symbol in the middle is a match too (l1l, l.l, l-l, l_l, l!l): any ONE character but o
 *   ✓ whole words only: lal glued to other letters, digits or "_" (slalom, lalal, lal1, _lal) is left alone
 *   ✓ punctuation, brackets, quotes, new lines and tabs around the word are fine
 *   ✓ every word in a text, not only the first; the regex is global and gives the same answer when used again
 *   ✓ a text without words and an empty text are unchanged
 *   ✓ speed: the timing test (7.4) replaces in short texts again and again — the solution is compared
 *     with the reference one by STRICT mode
 *   ✗ not pinned: upper case (LEL, lOl), a space, a tab or a new line in the middle ("l l")
 *
 * Difficulty: ★★★☆☆☆☆☆☆☆ (3/10)
 */

const r = require("./ex23.js");

// the regex of the player is used as it is, only the `g` flag is added when it is missing: a missing flag is
// caught once, by the test of the flag (6.2), and does not turn every other test red
const rg = new RegExp(r.source, r.flags.includes("g") ? r.flags : r.flags + "g");
const f = (text) => text.replace(rg, "l*l");

// l?l for every letter a-z: one row = one text and its answer (lol stays)
const letters = "abcdefghijklmnopqrstuvwxyz".split("").map((c) => [`l${c}l`, c === "o" ? "lol" : "l*l"]);

describe(":: Running test case for EX23 (words like lel but not lol)", () => {
  // ==========================================
  // 1️⃣ BASIC
  // ==========================================
  describe("1️⃣ Basic", () => {
    it("1️⃣.1️⃣ should match the example from the task", () => {
      expect(f("lol lal lil lel lol lul")).toBe("lol l*l l*l l*l lol l*l");
    });

    it("1️⃣.2️⃣ should leave lol as it is", () => {
      expect(f("lol")).toBe("lol");
    });

    it("1️⃣.3️⃣ should change lel to l*l", () => {
      expect(f("lel")).toBe("l*l");
    });

    it("1️⃣.4️⃣ should work with String.replace and return a string", () => {
      expect(typeof "lel".replace(rg, "l*l")).toBe("string");
    });
  });

  // ==========================================
  // 2️⃣ THE MIDDLE LETTER
  // ==========================================
  // One row = one word and its answer. Why these rows: all 26 letters; n and p are next to o, so a range
  // with a wrong end ([a-m], [q-z]) misses one of them.
  describe("2️⃣ The middle letter", () => {
    it.each(letters)("2️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 3️⃣ THE MIDDLE IS NOT A LETTER
  // ==========================================
  // One row = one text and its answer. Why these rows: the middle is any ONE character except o, so a digit
  // or a symbol there is a word too (a regex of letters only would leave them).
  describe("3️⃣ The middle is not a letter", () => {
    const rows = [
      ["l1l", "l*l"],
      ["l0l", "l*l"],
      ["l9l", "l*l"],
      ["l.l", "l*l"],
      ["l,l", "l*l"],
      ["l-l", "l*l"],
      ["l_l", "l*l"],
      ["l*l", "l*l"],
      ["l!l", "l*l"],
      ["l#l", "l*l"],
      ["l$l", "l*l"],
      ["l/l", "l*l"],
      ["l1l l2l", "l*l l*l"],
    ];

    it.each(rows)("3️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 4️⃣ WHOLE WORDS ONLY
  // ==========================================
  // One row = one text that must stay as it is. Why these rows: lal inside of a longer word is not a word
  // (a regex without \b would change slalom and lalal).
  describe("4️⃣ Whole words only", () => {
    const rows = [
      ["lalal", "lalal"],
      ["lelel", "lelel"],
      ["lolal", "lolal"],
      ["lalol", "lalol"],
      ["slalom", "slalom"],
      ["lally", "lally"],
      ["ball", "ball"],
      ["hello", "hello"],
      ["salad", "salad"],
      ["alal", "alal"],
      ["lal1", "lal1"],
      ["1lal", "1lal"],
      ["_lal", "_lal"],
      ["lal_", "lal_"],
      ["xlalx", "xlalx"],
      ["lalx", "lalx"],
      ["xlal", "xlal"],
    ];

    it.each(rows)("4️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 5️⃣ SEVERAL WORDS AND THE SURROUNDINGS
  // ==========================================
  describe("5️⃣ Several words and the surroundings", () => {
    it("5️⃣.1️⃣ should change ALL the words, not just the first one", () => {
      expect(f("lal lel lil lal lel lil")).toBe("l*l l*l l*l l*l l*l l*l");
    });

    it("5️⃣.2️⃣ should keep every lol between the changed words", () => {
      expect(f("lal lol lel lol lil lol")).toBe("l*l lol l*l lol l*l lol");
    });

    it("5️⃣.3️⃣ should change words next to punctuation", () => {
      expect(f("lal, lel! (lil) [lul] 'lyl' \"lzl\".")).toBe("l*l, l*l! (l*l) [l*l] 'l*l' \"l*l\".");
    });

    it("5️⃣.4️⃣ should change words separated by a hyphen or a slash", () => {
      expect(f("lal-lel lil/lul")).toBe("l*l-l*l l*l/l*l");
    });

    it("5️⃣.5️⃣ should work on several lines and with tabs", () => {
      expect(f("lal\nlol\tlel\r\nlil")).toBe("l*l\nlol\tl*l\r\nl*l");
    });

    it("5️⃣.6️⃣ should change a word at the very start and at the very end", () => {
      expect(f("lal in the middle lel")).toBe("l*l in the middle l*l");
    });

    it("5️⃣.7️⃣ should keep ordinary words", () => {
      expect(f("hello world, this is a lovely little lolly")).toBe("hello world, this is a lovely little lolly");
    });
  });

  // ==========================================
  // 6️⃣ THE REGEX
  // ==========================================
  describe("6️⃣ The regex", () => {
    it("6️⃣.1️⃣ should be a regular expression", () => {
      expect(r instanceof RegExp).toBe(true);
    });

    // without `g` replace() would change only the first word
    it("6️⃣.2️⃣ should have the global flag", () => {
      expect(r.global).toBe(true);
    });

    it("6️⃣.3️⃣ should give the same answer when it is used again", () => {
      expect("lal lel".replace(r, "l*l")).toBe("l*l l*l");
      expect("lal lel".replace(r, "l*l")).toBe("l*l l*l");
    });

    it("6️⃣.4️⃣ should return an empty string for an empty input and keep a text without words", () => {
      expect(f("")).toBe("");
      expect(f("Hello world. Nothing to change here.")).toBe("Hello world. Nothing to change here.");
    });
  });

  // ==========================================
  // 7️⃣ PERFORMANCE
  // ==========================================
  describe("7️⃣ Performance", () => {
    let words;
    let lols;
    let glued;
    let speed;

    beforeAll(() => {
      words = "lal ".repeat(5000);
      lols = "lol ".repeat(5000);
      glued = "la".repeat(2500);
      speed = ["lol lal lil lel lol lul", "lyl, (lzl) lbl.", "lol lolol lalal slalom", "l1l l.l l l ll lool", "lal-lel lil/lul", "Hello world"];
    });

    it("7️⃣.1️⃣ should change 5 000 words correctly and fast", () => {
      const t0 = Date.now();
      const result = f(words);
      const elapsed = Date.now() - t0;
      expect(result === "l*l ".repeat(5000)).toBe(true);
      expect(elapsed).toBeLessThan(1000);
    });

    it("7️⃣.2️⃣ should leave 5 000 lol as they are, fast", () => {
      const t0 = Date.now();
      const result = f(lols);
      const elapsed = Date.now() - t0;
      expect(result === lols).toBe(true);
      expect(elapsed).toBeLessThan(1000);
    });

    it("7️⃣.3️⃣ should leave one very long word as it is, fast", () => {
      const t0 = Date.now();
      const result = f(glued);
      const elapsed = Date.now() - t0;
      expect(result === glued).toBe(true);
      expect(elapsed).toBeLessThan(1000);
    });

    // The timing test: most of the spec's run time is spent here, so STRICT mode compares the player's
    // regex with the reference one on exactly this work (18 000 replacements in short texts).
    it("7️⃣.4️⃣ should stay fast on a lot of short texts", () => {
      let total = 0;
      for (let i = 0; i < 3000; i++) {
        for (let j = 0; j < speed.length; j++) total += f(speed[j]).length;
      }
      expect(total).toBe(3000 * 105);
    });
  });
});
