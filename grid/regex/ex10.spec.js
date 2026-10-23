/* Ex10
 * 🎖CERTIFIED 2026-10-23
 * Change lel, lil, lal and so on to l*l, but leave lol itself as it is.
 * A match is a whole word: l, ONE character that is not o, then l. Only the middle o keeps the word.
 *
 * Example:
 *   "lol lal lil lel lol lul"  →  "lol l*l l*l l*l lol l*l"
 *
 * Scope:
 *   ✓ every letter a-z in the middle becomes l*l, except o (the ends: a, n, p, z around o)
 *   ✓ a digit or a symbol in the middle is a match too (l1l, l.l, l-l, l_l, l!l)
 *   ✓ exactly one character between the two l (ll, lool and l are not matches)
 *   ✓ whole words only: lalel, lalal, lolal, slalom, lal1, _lal are left alone; a space, a punctuation mark,
 *     a new line, the start and the end of the text separate the words
 *   ✓ every match in a text, not only the first; punctuation, new lines and tabs around stay
 *   ✓ the answer is a string; a text without matches and an empty text stay as they are
 *   ✓ speed: the timing test (7.4) replaces in short texts again and again — the solution is compared
 *     with the reference one by STRICT mode
 *   ✗ not pinned: upper case (LEL, lOl), a space, a tab or a new line in the middle ("l l"), letters of
 *     other alphabets next to the word
 *
 * Difficulty: ★★★★☆☆☆☆☆☆ (4/10)
 */

const f = require("./ex10.js");

// l?l for every letter a-z: one row = one text and its answer (lol stays)
const letters = "abcdefghijklmnopqrstuvwxyz".split("").map((c) => [`l${c}l`, c === "o" ? "lol" : "l*l"]);

describe(":: Running test case for EX10 (l*l but not lol)", () => {
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

    it("1️⃣.4️⃣ should always return a string", () => {
      expect(typeof f("lel")).toBe("string");
      expect(typeof f("")).toBe("string");
    });
  });

  // ==========================================
  // 2️⃣ THE MIDDLE LETTER
  // ==========================================
  // One row = one word and its answer. Why these rows: all 26 letters; n and p are next to o, so a range
  // written as [a-m] / [q-z] (or with a wrong end) misses one of them.
  describe("2️⃣ The middle letter", () => {
    it.each(letters)("2️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 3️⃣ THE MIDDLE IS NOT A LETTER
  // ==========================================
  // One row = one text and its answer. Why these rows: the middle is any ONE character except o, so a digit
  // or a symbol there is a match too (a regex of letters only would leave them).
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
  // 4️⃣ WHOLE WORDS ONLY, ONE CHARACTER BETWEEN
  // ==========================================
  // One row = one text that must stay as it is. Why these rows: lalel is not lil; a match has exactly one
  // character between the two l and is not a part of a longer word (a regex without \b would change
  // lalal, slalom and lal1; a regex with `*` or `+` instead of one character would change lool).
  describe("4️⃣ Whole words only, one character between", () => {
    const rows = [
      ["lalel", "lalel"],
      ["lalal", "lalal"],
      ["lelel", "lelel"],
      ["lolal", "lolal"],
      ["lalol", "lalol"],
      ["lalolal", "lalolal"],
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
      ["ll", "ll"],
      ["lool", "lool"],
      ["laal", "laal"],
      ["leel", "leel"],
      ["l", "l"],
      ["la", "la"],
      ["al", "al"],
    ];

    it.each(rows)("4️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 5️⃣ SEVERAL MATCHES AND THE SURROUNDINGS
  // ==========================================
  describe("5️⃣ Several matches and the surroundings", () => {
    it("5️⃣.1️⃣ should change ALL the matches, not just the first one", () => {
      expect(f("lal lel lil lal lel lil")).toBe("l*l l*l l*l l*l l*l l*l");
    });

    it("5️⃣.2️⃣ should change a match next to another one with no space between", () => {
      expect(f("lal-lel,lil")).toBe("l*l-l*l,l*l");
    });

    it("5️⃣.3️⃣ should keep the punctuation around the matches", () => {
      expect(f("lal, lel! (lil) [lul] 'lyl' \"lzl\".")).toBe("l*l, l*l! (l*l) [l*l] 'l*l' \"l*l\".");
    });

    it("5️⃣.4️⃣ should keep every lol in a text full of matches", () => {
      expect(f("lal lol lel lol lil lol")).toBe("l*l lol l*l lol l*l lol");
    });

    it("5️⃣.5️⃣ should work on several lines and with tabs", () => {
      expect(f("lal\nlol\tlel\r\nlil")).toBe("l*l\nlol\tl*l\r\nl*l");
    });

    it("5️⃣.6️⃣ should change a match at the very start and at the very end", () => {
      expect(f("lal in the middle lel")).toBe("l*l in the middle l*l");
    });

    it("5️⃣.7️⃣ should keep the words that only look similar", () => {
      expect(f("hello world, lollipop and lolita")).toBe("hello world, lollipop and lolita");
    });
  });

  // ==========================================
  // 6️⃣ EDGE CASES
  // ==========================================
  describe("6️⃣ Edge cases", () => {
    it("6️⃣.1️⃣ should return an empty string for an empty input", () => {
      expect(f("")).toBe("");
    });

    it("6️⃣.2️⃣ should return the text unchanged when there is no match", () => {
      const text = "Hello world. Nothing to change here.";
      expect(f(text)).toBe(text);
    });

    it("6️⃣.3️⃣ should give the same answer when it is called again", () => {
      expect(f("lel lol")).toBe("l*l lol");
      expect(f("lel lol")).toBe("l*l lol");
    });
  });

  // ==========================================
  // 7️⃣ PERFORMANCE
  // ==========================================
  describe("7️⃣ Performance", () => {
    let matches;
    let lols;
    let ls;
    let speed;

    beforeAll(() => {
      matches = "lal ".repeat(5000);
      lols = "lol ".repeat(5000);
      ls = "lo".repeat(2500);
      speed = ["lol lal lil lel lol lul", "lyl lzl lbl", "lol lool ll l1l l.l l l", "lolal", "lal, lel! (lil)", "Hello world"];
    });

    it("7️⃣.1️⃣ should change 5 000 matches correctly and fast", () => {
      const t0 = Date.now();
      const result = f(matches);
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

    it("7️⃣.3️⃣ should leave a text of 2 500 lo (a chain of lol) as it is, fast", () => {
      const t0 = Date.now();
      const result = f(ls);
      const elapsed = Date.now() - t0;
      expect(result === ls).toBe(true);
      expect(elapsed).toBeLessThan(1000);
    });

    // The timing test: most of the spec's run time is spent here, so STRICT mode compares the player's
    // function with the reference one on exactly this work (18 000 replacements in short texts).
    it("7️⃣.4️⃣ should stay fast on a lot of short texts", () => {
      let total = 0;
      for (let i = 0; i < 3000; i++) {
        for (let j = 0; j < speed.length; j++) total += f(speed[j]).length;
      }
      expect(total).toBe(3000 * 88);
    });
  });
});
