/* Ex4
 * 🎖CERTIFIED 2026-10-23
 * Find lol, lal, lil and so on with a dot after them and replace the middle letter with *.
 * A match is: l, one letter, l and a literal dot. The dot stays.
 *
 * Example:
 *   "lel. lol lil."  →  "l*l. lol l*l."
 *
 * Scope:
 *   ✓ every vowel in the middle (lal. lel. lil. lol. lul. lyl.)
 *   ✓ the dot is a LITERAL dot and must be there: lol, lol, lol! and lolx are left alone
 *   ✓ exactly one letter between the two l (ll. lool. lo. are not matches)
 *   ✓ every match in a text, not only the first; matches glued together and next to punctuation
 *   ✓ the dot after the match stays, also a second dot (lol.. → l*l..)
 *   ✓ the answer is a string; a text without matches and an empty text stay as they are
 *   ✓ speed: the timing test (7.4) replaces in short texts again and again — the solution is compared
 *     with the reference one by STRICT mode
 *   ✗ not pinned: a consonant, a digit or a space in the middle (lxl., l1l., l l.), upper case L,
 *     a match glued to letters (xlol.)
 *
 * Difficulty: ★☆☆☆☆☆☆☆☆☆ (1/10)
 */

const f = require("./ex4.js");

describe(":: Running test case for EX4 (mask the middle letter)", () => {
  // ==========================================
  // 1️⃣ BASIC
  // ==========================================
  describe("1️⃣ Basic", () => {
    it("1️⃣.1️⃣ should match the example from the task", () => {
      expect(f("lel. lol lil.")).toBe("l*l. lol l*l.");
    });

    it("1️⃣.2️⃣ should mask the middle letter when it is the whole text", () => {
      expect(f("lol.")).toBe("l*l.");
    });

    it("1️⃣.3️⃣ should always return a string", () => {
      expect(typeof f("lol.")).toBe("string");
      expect(typeof f("")).toBe("string");
    });
  });

  // ==========================================
  // 2️⃣ THE MIDDLE LETTER
  // ==========================================
  // One row = one text and its answer.
  describe("2️⃣ The middle letter", () => {
    const rows = [
      ["lal.", "l*l."],
      ["lel.", "l*l."],
      ["lil.", "l*l."],
      ["lol.", "l*l."],
      ["lul.", "l*l."],
      ["lyl.", "l*l."],
    ];

    it.each(rows)("2️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 3️⃣ THE DOT
  // ==========================================
  // One row = one text and its answer. Why these rows: the dot is required and it is a real dot,
  // so a regex with an unescaped `.` (any character) would change lolx and lol!.
  describe("3️⃣ The dot", () => {
    const rows = [
      ["lol", "lol"],
      ["lol lil lel", "lol lil lel"],
      ["lol,", "lol,"],
      ["lol!", "lol!"],
      ["lol?", "lol?"],
      ["lol;", "lol;"],
      ["lolx", "lolx"],
      ["lol1", "lol1"],
      ["lol-", "lol-"],
      ["lol:", "lol:"],
      ["lol_", "lol_"],
      ["lol․", "lol․"], // one dot leader «․», not a dot
      ["lol. ", "l*l. "],
      ["lol..", "l*l.."],
      ["lol...", "l*l..."],
    ];

    it.each(rows)("3️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 4️⃣ EXACTLY ONE LETTER BETWEEN
  // ==========================================
  // One row = one text that must stay as it is.
  describe("4️⃣ Exactly one letter between the l", () => {
    const rows = [
      ["ll.", "ll."],
      ["lool.", "lool."],
      ["loool.", "loool."],
      ["lo.", "lo."],
      ["l.", "l."],
      ["lo.l.", "lo.l."],
      ["l.l", "l.l"],
      ["lal", "lal"],
      ["la l.", "la l."],
    ];

    it.each(rows)("4️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 5️⃣ SEVERAL MATCHES
  // ==========================================
  describe("5️⃣ Several matches", () => {
    it("5️⃣.1️⃣ should change ALL the matches, not just the first one", () => {
      expect(f("lol. lol. lol.")).toBe("l*l. l*l. l*l.");
    });

    it("5️⃣.2️⃣ should change all kinds of matches in one text", () => {
      expect(f("lal. lel. lil. lol. lul.")).toBe("l*l. l*l. l*l. l*l. l*l.");
    });

    it("5️⃣.3️⃣ should change matches that follow each other without a space", () => {
      expect(f("lol.lil.lel.")).toBe("l*l.l*l.l*l.");
    });

    it("5️⃣.4️⃣ should change only the last l?l. of lolol.", () => {
      expect(f("lolol.")).toBe("lol*l.");
    });

    it("5️⃣.5️⃣ should keep the punctuation around a match", () => {
      expect(f("(lol.) [lil.], 'lel.'!")).toBe("(l*l.) [l*l.], 'l*l.'!");
    });

    it("5️⃣.6️⃣ should work on several lines and with tabs", () => {
      expect(f("lol.\nlil. lel.\tlal.\r\nlul.")).toBe("l*l.\nl*l. l*l.\tl*l.\r\nl*l.");
    });

    it("5️⃣.7️⃣ should change the matches and leave the lol without a dot", () => {
      expect(f("lel. lol lil. lal, lul.")).toBe("l*l. lol l*l. lal, l*l.");
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
      const text = "Hello world. Nothing to mask here.";
      expect(f(text)).toBe(text);
    });

    it("6️⃣.3️⃣ should give the same answer when it is called again", () => {
      expect(f("lol.")).toBe("l*l.");
      expect(f("lol.")).toBe("l*l.");
    });
  });

  // ==========================================
  // 7️⃣ PERFORMANCE
  // ==========================================
  describe("7️⃣ Performance", () => {
    let matches;
    let noDots;
    let ls;
    let speed;

    beforeAll(() => {
      matches = "lol. ".repeat(5000);
      noDots = "lol ".repeat(5000);
      ls = "l".repeat(5000);
      speed = ["lel. lol lil.", "lal. lul. lyl.", "lol.lol..", "lolol.", "ll. lool. lo.", "Hello world"];
    });

    it("7️⃣.1️⃣ should change 5 000 matches correctly and fast", () => {
      const t0 = Date.now();
      const result = f(matches);
      const elapsed = Date.now() - t0;
      expect(result === "l*l. ".repeat(5000)).toBe(true);
      expect(elapsed).toBeLessThan(1000);
    });

    it("7️⃣.2️⃣ should leave 5 000 words without a dot as they are, fast", () => {
      const t0 = Date.now();
      const result = f(noDots);
      const elapsed = Date.now() - t0;
      expect(result === noDots).toBe(true);
      expect(elapsed).toBeLessThan(1000);
    });

    it("7️⃣.3️⃣ should handle a text of 5 000 l fast", () => {
      const t0 = Date.now();
      const result = f(ls);
      const elapsed = Date.now() - t0;
      expect(result === ls).toBe(true);
      expect(elapsed).toBeLessThan(1000);
    });

    // The timing test: most of the spec's run time is spent here, so STRICT mode compares the player's
    // function with the reference one on exactly this work (about 18 000 replacements in short texts).
    it("7️⃣.4️⃣ should stay fast on a lot of short texts", () => {
      let total = 0;
      for (let i = 0; i < 3000; i++) {
        for (let j = 0; j < speed.length; j++) total += f(speed[j]).length;
      }
      expect(total).toBe(3000 * 66);
    });
  });
});
