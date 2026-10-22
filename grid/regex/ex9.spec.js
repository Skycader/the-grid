/* Ex9
 * 🎖CERTIFIED 2026-10-23
 * Count how many lines start with The: f(text) returns a number.
 *
 * Example:
 *   "The most important part\nIs to be yourself\nThe world needs us"  →  2
 *
 * Scope:
 *   ✓ a line starts with The when The are its very first characters; a space, a tab or any other
 *     character before them means it does not
 *   ✓ one line is counted once, however many times The stands in it
 *   ✓ lines are separated by \n or \r\n; blank lines, the first line, the last line, a text that ends
 *     with a new line
 *   ✓ the answer is a number, 0 for a text without such lines and for an empty text
 *   ✓ speed: the timing test (5.4) counts in short texts again and again — the solution is compared
 *     with the reference one by STRICT mode
 *   ✗ not pinned: lower and upper case (the, THE), a longer word that starts with The (Theory),
 *     old Mac line ends (\r alone), the Unicode line separators ( )
 *
 * Difficulty: ★★★☆☆☆☆☆☆☆ (3/10)
 */

const f = require("./ex9.js");

describe(":: Running test case for EX9 (lines that start with The)", () => {
  // ==========================================
  // 1️⃣ BASIC
  // ==========================================
  describe("1️⃣ Basic", () => {
    it("1️⃣.1️⃣ should match the example from the task", () => {
      const text = `The most imprtant part
Is to be yourself
A true hero doesn't wear a cape
The world needs us
You may know the The article`;
      expect(f(text)).toBe(2);
    });

    it("1️⃣.2️⃣ should count one line", () => {
      expect(f("The end")).toBe(1);
    });

    it("1️⃣.3️⃣ should always return a number", () => {
      expect(typeof f("The end")).toBe("number");
      expect(typeof f("")).toBe("number");
    });
  });

  // ==========================================
  // 2️⃣ THE LINE START
  // ==========================================
  // One row = one line (text without a new line) and the number of lines. Why these rows: The must be the
  // very first thing; a regex without the line anchor counts The anywhere in a line.
  describe("2️⃣ The start of a line", () => {
    const rows = [
      ["The", 1],
      ["The cat", 1],
      ["The The", 1],
      ["The The The", 1],
      ["The, the end", 1],
      [" The", 0],
      ["  The cat", 0],
      ["\tThe", 0],
      ["a The", 0],
      ["A The", 0],
      ["You may know the The article", 0],
      ["Is The", 0],
      ["-The", 0],
      ["(The", 0],
      ['"The"', 0],
      ["Th", 0],
      ["Te", 0],
      ["he", 0],
      ["T he", 0],
      ["Th e", 0],
      ["", 0],
    ];

    it.each(rows)("2️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 3️⃣ SEVERAL LINES
  // ==========================================
  // One row = one text of several lines and the number of lines.
  describe("3️⃣ Several lines", () => {
    const rows = [
      ["The\nThe\nThe", 3],
      ["The\nA\nThe", 2],
      ["A\nThe\nB", 1],
      ["A\nB\nC", 0],
      ["Hi\nThe", 1],
      ["The\nHi", 1],
      ["Hi The\nThe", 1],
      ["The The\nThe The", 2],
      ["The\n\nThe", 2],
      ["The\n\n\n\nThe\n", 2],
      ["\nThe", 1],
      ["The\n", 1],
      ["\nThe\n", 1],
      ["\n\n\n", 0],
      ["The\r\nThe\r\nA", 2],
      ["A\r\nThe\r\n", 1],
      [" The\nThe\n The\nThe", 2],
      ["The\n The\nThe\n\tThe", 2],
    ];

    it.each(rows)("3️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toBe(expected);
    });

    it("3️⃣.2️⃣ should count every line of a long poem that starts with The", () => {
      const poem = ["The road goes ever on and on", "Down from the door where it began", "The road goes ever on and on", "And I must follow if I can", "The end"].join("\n");
      expect(f(poem)).toBe(3);
    });
  });

  // ==========================================
  // 4️⃣ EDGE CASES
  // ==========================================
  describe("4️⃣ Edge cases", () => {
    it("4️⃣.1️⃣ should return 0 for an empty text", () => {
      expect(f("")).toBe(0);
    });

    it("4️⃣.2️⃣ should return 0 for a text without such lines", () => {
      expect(f("Hello world.\nNothing here.")).toBe(0);
      expect(f("  \n\t\n ")).toBe(0);
    });

    it("4️⃣.3️⃣ should give the same answer when it is called again", () => {
      expect(f("The\nThe")).toBe(2);
      expect(f("The\nThe")).toBe(2);
      expect(f("none")).toBe(0);
      expect(f("The\nThe")).toBe(2);
    });
  });

  // ==========================================
  // 5️⃣ PERFORMANCE
  // ==========================================
  describe("5️⃣ Performance", () => {
    let lines;
    let notStart;
    let oneLine;
    let blank;
    let speed;

    beforeAll(() => {
      lines = "The line\n".repeat(5000);
      notStart = "a line with The inside\n".repeat(4000);
      oneLine = "The ".repeat(2500);
      blank = "\n".repeat(5000);
      speed = [
        "The most important part\nIs to be yourself\nThe world needs us",
        "You may know the The article",
        "The\nThe\nThe",
        "  The cat\n\tThe dog\nA The",
        "A\r\nThe\r\n",
        "Hello world",
      ];
    });

    it("5️⃣.1️⃣ should count 5 000 lines correctly and fast", () => {
      const t0 = Date.now();
      const count = f(lines);
      const elapsed = Date.now() - t0;
      expect(count).toBe(5000);
      expect(elapsed).toBeLessThan(1000);
    });

    it("5️⃣.2️⃣ should count 0 in 4 000 lines with The inside fast", () => {
      const t0 = Date.now();
      const count = f(notStart);
      const elapsed = Date.now() - t0;
      expect(count).toBe(0);
      expect(elapsed).toBeLessThan(1000);
    });

    it("5️⃣.3️⃣ should count a long line once and 5 000 blank lines as 0, fast", () => {
      const t0 = Date.now();
      const counts = [f(oneLine), f(blank)];
      const elapsed = Date.now() - t0;
      expect(counts).toEqual([1, 0]);
      expect(elapsed).toBeLessThan(1000);
    });

    // The timing test: most of the spec's run time is spent here, so STRICT mode compares the player's
    // function with the reference one on exactly this work (18 000 counts in short texts).
    it("5️⃣.4️⃣ should stay fast on a lot of short texts", () => {
      let total = 0;
      for (let i = 0; i < 3000; i++) {
        for (let j = 0; j < speed.length; j++) total += f(speed[j]);
      }
      expect(total).toBe(3000 * 6);
    });
  });
});
