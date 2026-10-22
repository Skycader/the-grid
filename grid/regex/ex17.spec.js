/* Ex17
 * 🎖CERTIFIED 2026-10-23
 * Trim &nbsp; (non-break space): every run of two or more &nbsp; in a row becomes one &nbsp;.
 *
 * Example:
 *   "Now that&nbsp;&nbsp;know me well"  →  "Now that&nbsp;know me well"
 *
 * Scope:
 *   ✓ a run of 2, 3, 4 ... any number of &nbsp; becomes one; a single &nbsp; stays
 *   ✓ every run in a text is trimmed, not only the first one; a run at the start, at the end, the whole text
 *   ✓ a run is made only of directly following &nbsp;: a space, a tab, a new line, a letter or another
 *     entity between two of them breaks it
 *   ✓ only the entity exactly as &nbsp; (lower case, with & and ;) is touched: &nbsp, nbsp;, &NBSP;,
 *     &amp;nbsp;, &#160; and the real non-breaking space character stay as they are
 *   ✓ everything else, including the usual spaces, stays as it is
 *   ✓ the answer is a string; a text without &nbsp; and an empty text are unchanged
 *   ✓ speed: the timing test (7.5) trims short texts again and again — the solution is compared
 *     with the reference one by STRICT mode
 *
 * Difficulty: ★★★★☆☆☆☆☆☆ (4/10)
 */

const f = require("./ex17.js");

const nb = "&nbsp;";
// "a" + n x &nbsp; + "b": one row = one text and its answer
const runs = [1, 2, 3, 4, 5, 8, 10, 20].map((n) => [`a${nb.repeat(n)}b`, `a${nb}b`]);

describe(":: Running test case for EX17 (trim &nbsp;)", () => {
  // ==========================================
  // 1️⃣ BASIC
  // ==========================================
  describe("1️⃣ Basic", () => {
    it("1️⃣.1️⃣ should match the example from the task", () => {
      const code = `
Hello, this&nbsp;is my text
Now that&nbsp;&nbsp;know me well,
we can&nbsp;continue.
`;
      const done = `
Hello, this&nbsp;is my text
Now that&nbsp;know me well,
we can&nbsp;continue.
`;
      expect(f(code)).toBe(done);
    });

    it("1️⃣.2️⃣ should trim two &nbsp; to one", () => {
      expect(f("Now that&nbsp;&nbsp;know me well")).toBe("Now that&nbsp;know me well");
    });

    it("1️⃣.3️⃣ should keep a single &nbsp;", () => {
      expect(f("this&nbsp;is")).toBe("this&nbsp;is");
    });

    it("1️⃣.4️⃣ should always return a string", () => {
      expect(typeof f("a&nbsp;&nbsp;b")).toBe("string");
      expect(typeof f("")).toBe("string");
    });
  });

  // ==========================================
  // 2️⃣ THE LENGTH OF A RUN
  // ==========================================
  // One row = one text and its answer. Why these rows: 1 stays, 2 and more become one; a regex that
  // replaces only a pair would leave three and four of them as two.
  describe("2️⃣ The length of a run", () => {
    it.each(runs)("2️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 3️⃣ WHAT BREAKS A RUN
  // ==========================================
  // One row = one text that must stay as it is. Why these rows: only directly following &nbsp; make a run.
  describe("3️⃣ What breaks a run", () => {
    const rows = [
      ["a&nbsp; &nbsp;b", "a&nbsp; &nbsp;b"],
      ["a&nbsp;  &nbsp;b", "a&nbsp;  &nbsp;b"],
      ["a&nbsp;\t&nbsp;b", "a&nbsp;\t&nbsp;b"],
      ["a&nbsp;\n&nbsp;b", "a&nbsp;\n&nbsp;b"],
      ["a&nbsp;x&nbsp;b", "a&nbsp;x&nbsp;b"],
      ["a&nbsp;,&nbsp;b", "a&nbsp;,&nbsp;b"],
      ["a&nbsp;&amp;&nbsp;b", "a&nbsp;&amp;&nbsp;b"],
      ["a&nbsp;<br>&nbsp;b", "a&nbsp;<br>&nbsp;b"],
      ["&nbsp; &nbsp; &nbsp;", "&nbsp; &nbsp; &nbsp;"],
    ];

    it.each(rows)("3️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 4️⃣ NOT THE ENTITY
  // ==========================================
  // One row = one text that must stay as it is. Why these rows: only the exact &nbsp; counts; a regex
  // that allows a missing semicolon or any case would trim them.
  describe("4️⃣ Not the entity", () => {
    const rows = [
      ["a&nbspb", "a&nbspb"],
      ["a&nbsp&nbspb", "a&nbsp&nbspb"],
      ["a&nbsp&nbsp;b", "a&nbsp&nbsp;b"],
      ["a&nbsp;&nbspb", "a&nbsp;&nbspb"],
      ["anbsp;nbsp;b", "anbsp;nbsp;b"],
      ["a&NBSP;&NBSP;b", "a&NBSP;&NBSP;b"],
      ["a&Nbsp;&Nbsp;b", "a&Nbsp;&Nbsp;b"],
      ["a&nBsP;&nBsP;b", "a&nBsP;&nBsP;b"],
      ["a&amp;nbsp;&amp;nbsp;b", "a&amp;nbsp;&amp;nbsp;b"],
      ["a& nbsp;& nbsp;b", "a& nbsp;& nbsp;b"],
      ["a&nbsp ;&nbsp ;b", "a&nbsp ;&nbsp ;b"],
      ["a&#160;&#160;b", "a&#160;&#160;b"],
      ["a&#xA0;&#xA0;b", "a&#xA0;&#xA0;b"],
      ["a  b", "a  b"],
      ["a  b", "a  b"],
      ["a&emsp;&emsp;b", "a&emsp;&emsp;b"],
    ];

    it.each(rows)("4️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 5️⃣ SEVERAL RUNS AND THE SURROUNDINGS
  // ==========================================
  describe("5️⃣ Several runs and the surroundings", () => {
    it("5️⃣.1️⃣ should trim ALL the runs, not just the first one", () => {
      expect(f("a&nbsp;&nbsp;b&nbsp;&nbsp;c&nbsp;&nbsp;d")).toBe("a&nbsp;b&nbsp;c&nbsp;d");
    });

    it("5️⃣.2️⃣ should trim runs of different length in one text", () => {
      expect(f("a&nbsp;b&nbsp;&nbsp;c&nbsp;&nbsp;&nbsp;d&nbsp;&nbsp;&nbsp;&nbsp;e")).toBe("a&nbsp;b&nbsp;c&nbsp;d&nbsp;e");
    });

    it("5️⃣.3️⃣ should trim a run at the very start and at the very end", () => {
      expect(f("&nbsp;&nbsp;a&nbsp;&nbsp;")).toBe("&nbsp;a&nbsp;");
    });

    it("5️⃣.4️⃣ should trim a text that is a run only", () => {
      expect(f("&nbsp;&nbsp;")).toBe("&nbsp;");
      expect(f("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")).toBe("&nbsp;");
    });

    it("5️⃣.5️⃣ should keep single &nbsp; next to trimmed runs", () => {
      expect(f("a&nbsp;b&nbsp;&nbsp;c&nbsp;d")).toBe("a&nbsp;b&nbsp;c&nbsp;d");
    });

    it("5️⃣.6️⃣ should keep the usual spaces, tabs and new lines", () => {
      expect(f("a  b\tc\nd&nbsp;&nbsp; e\r\n&nbsp;&nbsp;f")).toBe("a  b\tc\nd&nbsp; e\r\n&nbsp;f");
    });

    it("5️⃣.7️⃣ should keep the tags and the other entities", () => {
      expect(f("<p>a&nbsp;&nbsp;<b>b</b>&amp;&lt;&nbsp;&nbsp;&nbsp;c</p>")).toBe("<p>a&nbsp;<b>b</b>&amp;&lt;&nbsp;c</p>");
    });

    it("5️⃣.8️⃣ should trim a run that stands next to a broken entity", () => {
      expect(f("&nbsp&nbsp;&nbsp;&nbsp;")).toBe("&nbsp&nbsp;");
    });
  });

  // ==========================================
  // 6️⃣ EDGE CASES
  // ==========================================
  describe("6️⃣ Edge cases", () => {
    it("6️⃣.1️⃣ should return an empty string for an empty input", () => {
      expect(f("")).toBe("");
    });

    it("6️⃣.2️⃣ should return the text unchanged when there is no &nbsp;", () => {
      const text = "Hello world. Nothing to trim here.";
      expect(f(text)).toBe(text);
    });

    it("6️⃣.3️⃣ should give the same answer when it is called again", () => {
      expect(f("a&nbsp;&nbsp;b")).toBe("a&nbsp;b");
      expect(f("a&nbsp;&nbsp;b")).toBe("a&nbsp;b");
    });
  });

  // ==========================================
  // 7️⃣ PERFORMANCE
  // ==========================================
  describe("7️⃣ Performance", () => {
    let one;
    let many;
    let broken;
    let alternating;
    let speed;

    beforeAll(() => {
      one = nb.repeat(5000);
      many = "a&nbsp;&nbsp;".repeat(2500);
      broken = "&nbsp".repeat(3000);
      alternating = "&nbsp;&nbsp".repeat(2000);
      speed = ["Now that&nbsp;&nbsp;know me well", "a&nbsp;&nbsp;&nbsp;&nbsp;b", "this&nbsp;is", "a&nbsp; &nbsp;b", "&nbsp&nbsp; &amp;nbsp;&amp;nbsp;", "Hello world"];
    });

    it("7️⃣.1️⃣ should trim a run of 5 000 &nbsp; correctly and fast", () => {
      const t0 = Date.now();
      const result = f(one);
      const elapsed = Date.now() - t0;
      expect(result).toBe(nb);
      expect(elapsed).toBeLessThan(1000);
    });

    it("7️⃣.2️⃣ should trim 2 500 runs correctly and fast", () => {
      const t0 = Date.now();
      const result = f(many);
      const elapsed = Date.now() - t0;
      expect(result === "a&nbsp;".repeat(2500)).toBe(true);
      expect(elapsed).toBeLessThan(1000);
    });

    it("7️⃣.3️⃣ should leave 3 000 broken entities as they are, fast", () => {
      const t0 = Date.now();
      const result = f(broken);
      const elapsed = Date.now() - t0;
      expect(result === broken).toBe(true);
      expect(elapsed).toBeLessThan(1000);
    });

    it("7️⃣.4️⃣ should leave 2 000 single entities between broken ones as they are, fast", () => {
      const t0 = Date.now();
      const result = f(alternating);
      const elapsed = Date.now() - t0;
      expect(result === alternating).toBe(true);
      expect(elapsed).toBeLessThan(1000);
    });

    // The timing test: most of the spec's run time is spent here, so STRICT mode compares the player's
    // function with the reference one on exactly this work (18 000 replacements in short texts).
    it("7️⃣.5️⃣ should stay fast on a lot of short texts", () => {
      let total = 0;
      for (let i = 0; i < 3000; i++) {
        for (let j = 0; j < speed.length; j++) total += f(speed[j]).length;
      }
      expect(total).toBe(3000 * 104);
    });
  });
});
