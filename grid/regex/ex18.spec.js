/* Ex18
 * 🎖CERTIFIED 2026-10-23
 * Count the SPECIAL IP addresses of a text, one address on a line: a whole line made of 4 or more
 * numbers separated by single dots, every number of 1 to 3 digits. f(text) returns a number.
 *
 * Example:
 *   "192.168.92.102\n1.1.1.1\n2.2.2"  →  2
 *
 * Scope:
 *   ✓ 4 numbers and more (5, 9, 30 ...): all count; 3 numbers and fewer do not
 *   ✓ every number has 1 to 3 digits (0, 00, 007, 255, 999); a number of 4 digits and more does not count
 *   ✓ the range of a number is not checked: 312.999.0.1 is special
 *   ✓ the line is only the address: a dot at the start or at the end, two dots in a row, a letter, a text
 *     before or after it, another separator (comma, colon, hyphen) — not special
 *   ✓ many lines: every special line counts once, repeated lines count each; blank lines, \r\n, the first
 *     and the last line
 *   ✓ the answer is a number, 0 for an empty text and for a text without special addresses
 *   ✓ speed: the timing test (7.5) counts in short texts again and again — the solution is compared
 *     with the reference one by STRICT mode
 *   ✗ not pinned: spaces or tabs before or after the address when there is nothing else on the line ("  1.1.1.1 ")
 *
 * Difficulty: ★★★★☆☆☆☆☆☆ (4/10)
 */

const f = require("./ex18.js");

describe(":: Running test case for EX18 (special IP addresses)", () => {
  // ==========================================
  // 1️⃣ BASIC
  // ==========================================
  describe("1️⃣ Basic", () => {
    it("1️⃣.1️⃣ should match the example from the task", () => {
      const text = `
192.168.92.102
1.1.1.1
0.0.0.0
23.23.23.4.
55.16.43.21.56
92.132.46.312.63.46.1.23.5
92.132.46.312.63.46.1.23.5.3456634
92.132.46.312.63.46.1.23.5.345
2.2.2
90.10.20.50.10.23
`;
      expect(f(text)).toBe(7);
    });

    it("1️⃣.2️⃣ should return 0 when there are only short addresses", () => {
      expect(f("\n0.0.0\n1.1.1\n")).toBe(0);
    });

    it("1️⃣.3️⃣ should count one address", () => {
      expect(f("192.168.92.102")).toBe(1);
    });

    it("1️⃣.4️⃣ should always return a number", () => {
      expect(typeof f("1.1.1.1")).toBe("number");
      expect(typeof f("")).toBe("number");
    });
  });

  // ==========================================
  // 2️⃣ THE NUMBER OF UNITS
  // ==========================================
  // One row = one line and the number of special addresses. Why these rows: 4 is the first that counts,
  // 3 is the last that does not; there is no upper limit.
  describe("2️⃣ The number of units", () => {
    const rows = [
      ["1", 0],
      ["1.1", 0],
      ["1.1.1", 0],
      ["1.1.1.1", 1],
      ["1.1.1.1.1", 1],
      ["1.1.1.1.1.1", 1],
      ["55.16.43.21.56", 1],
      ["92.132.46.312.63.46.1.23.5", 1],
      ["1.2.3.4.5.6.7.8.9.10.11.12.13.14.15.16.17.18.19.20", 1],
      ["192.168.92.102", 1],
      ["255.255.255.255", 1],
      ["0.0.0.0", 1],
      ["2.2.2", 0],
      ["10.0.0", 0],
    ];

    it.each(rows)("2️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 3️⃣ THE DIGITS OF A UNIT
  // ==========================================
  // One row = one line and the number of special addresses. Why these rows: a unit has 1 to 3 digits;
  // the range 0-255 is not checked.
  describe("3️⃣ The digits of a unit", () => {
    const rows = [
      ["1.2.3.4", 1],
      ["12.34.56.78", 1],
      ["123.456.789.123", 1],
      ["999.999.999.999", 1],
      ["312.999.0.1", 1],
      ["00.00.00.00", 1],
      ["007.007.007.007", 1],
      ["1.1.1.1234", 0],
      ["1234.1.1.1", 0],
      ["1.1234.1.1", 0],
      ["1.1.1.12345", 0],
      ["1.1.1.3456634", 0],
      ["92.132.46.312.63.46.1.23.5.3456634", 0],
      ["1111.2222.3333.4444", 0],
      ["1.1.1.1.1234", 0],
    ];

    it.each(rows)("3️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 4️⃣ THE LINE IS ONLY THE ADDRESS
  // ==========================================
  // One row = one line and the number of special addresses. Why these rows: anything else on the line
  // means it is not an address; a regex without the line anchors finds an address inside of them.
  describe("4️⃣ The line is only the address", () => {
    const rows = [
      ["23.23.23.4.", 0],
      [".1.1.1.1", 0],
      ["1.1.1.1.", 0],
      ["1..1.1.1", 0],
      ["1.1..1.1", 0],
      ["1.1.1..1", 0],
      ["1.1.1.1..", 0],
      ["ip: 1.1.1.1", 0],
      ["1.1.1.1 is the address", 0],
      ["address1.1.1.1", 0],
      ["1.1.1.1abc", 0],
      ["a1.1.1.1", 0],
      ["1.1.1.a", 0],
      ["a.1.1.1", 0],
      ["1.1.a.1.1", 0],
      ["-1.1.1.1", 0],
      ["+1.1.1.1", 0],
      ["1.1.1.-1", 0],
      ["1,1,1,1", 0],
      ["1-1-1-1", 0],
      ["1:1:1:1", 0],
      ["1/1/1/1", 0],
      ["1_1_1_1", 0],
      ["1 1 1 1", 0],
      ["1.1.1.1.1.", 0],
      ["(1.1.1.1)", 0],
      ["1.1.1.1;", 0],
      ["1.1.1.1:8080", 0],
    ];

    it.each(rows)("4️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 5️⃣ MANY LINES
  // ==========================================
  describe("5️⃣ Many lines", () => {
    it("5️⃣.1️⃣ should count all the special lines, not just the first one", () => {
      expect(f("1.1.1.1\n2.2.2.2\n3.3.3.3")).toBe(3);
    });

    it("5️⃣.2️⃣ should count only the special lines among the others", () => {
      expect(f("1.1.1.1\n2.2.2\n3.3.3.3.3\nabc\n4.4.4.4.")).toBe(2);
    });

    it("5️⃣.3️⃣ should count repeated lines each", () => {
      expect(f("1.1.1.1\n1.1.1.1\n1.1.1.1")).toBe(3);
    });

    it("5️⃣.4️⃣ should count the first and the last line", () => {
      expect(f("1.1.1.1\nabc\nabc\n4.4.4.4")).toBe(2);
    });

    it("5️⃣.5️⃣ should work with blank lines around and between", () => {
      expect(f("\n\n1.1.1.1\n\n\n2.2.2.2\n\n")).toBe(2);
    });

    it("5️⃣.6️⃣ should work with \\r\\n line ends", () => {
      expect(f("1.1.1.1\r\n2.2.2.2\r\n3.3.3\r\n4.4.4.4.4\r\n")).toBe(3);
    });

    it("5️⃣.7️⃣ should NOT take an address that is cut by a new line", () => {
      expect(f("1.1\n1.1")).toBe(0);
      expect(f("1.1.1.\n1")).toBe(0);
      expect(f("1\n.1.1.1")).toBe(0);
    });

    it("5️⃣.8️⃣ should NOT take addresses that stand together in one line", () => {
      expect(f("1.1.1.1 2.2.2.2")).toBe(0);
      expect(f("1.1.1.1,2.2.2.2")).toBe(0);
    });

    it("5️⃣.9️⃣ should count a mix of units of every size", () => {
      expect(f("1.1.1.1\n11.11.11.11\n111.111.111.111\n1.11.111.1\n111.1.1.111.1")).toBe(5);
    });
  });

  // ==========================================
  // 6️⃣ EDGE CASES
  // ==========================================
  describe("6️⃣ Edge cases", () => {
    it("6️⃣.1️⃣ should return 0 for an empty text", () => {
      expect(f("")).toBe(0);
    });

    it("6️⃣.2️⃣ should return 0 for a text without addresses", () => {
      expect(f("no addresses here")).toBe(0);
      expect(f("\n\n\n")).toBe(0);
    });

    it("6️⃣.3️⃣ should give the same answer when it is called again", () => {
      expect(f("1.1.1.1\n2.2.2")).toBe(1);
      expect(f("1.1.1.1\n2.2.2")).toBe(1);
      expect(f("none")).toBe(0);
      expect(f("1.1.1.1\n2.2.2")).toBe(1);
    });
  });

  // ==========================================
  // 7️⃣ PERFORMANCE
  // ==========================================
  describe("7️⃣ Performance", () => {
    let lines;
    let longAddress;
    let badEnd;
    let notSpecial;
    let speed;

    beforeAll(() => {
      lines = "192.168.92.102\n".repeat(5000);
      longAddress = "1.".repeat(2500) + "1";
      badEnd = "1.".repeat(2500) + "x";
      notSpecial = "1.1.1\n".repeat(5000);
      speed = [
        "192.168.92.102\n1.1.1.1\n2.2.2",
        "55.16.43.21.56\n23.23.23.4.\n1.1.1.12345",
        "92.132.46.312.63.46.1.23.5",
        "ip: 1.1.1.1\n1,1,1,1",
        "\n\n1.1.1.1\n\n2.2.2.2\n\n",
        "Hello world",
      ];
    });

    it("7️⃣.1️⃣ should count 5 000 lines correctly and fast", () => {
      const t0 = Date.now();
      const count = f(lines);
      const elapsed = Date.now() - t0;
      expect(count).toBe(5000);
      expect(elapsed).toBeLessThan(1000);
    });

    it("7️⃣.2️⃣ should count an address of 2 501 units as one, fast", () => {
      const t0 = Date.now();
      const count = f(longAddress);
      const elapsed = Date.now() - t0;
      expect(count).toBe(1);
      expect(elapsed).toBeLessThan(1000);
    });

    it("7️⃣.3️⃣ should reject a long address with a bad end fast", () => {
      const t0 = Date.now();
      const count = f(badEnd);
      const elapsed = Date.now() - t0;
      expect(count).toBe(0);
      expect(elapsed).toBeLessThan(1000);
    });

    it("7️⃣.4️⃣ should count 0 in 5 000 short addresses fast", () => {
      const t0 = Date.now();
      const count = f(notSpecial);
      const elapsed = Date.now() - t0;
      expect(count).toBe(0);
      expect(elapsed).toBeLessThan(1000);
    });

    // The timing test: most of the spec's run time is spent here, so STRICT mode compares the player's
    // function with the reference one on exactly this work (18 000 counts in short texts).
    it("7️⃣.5️⃣ should stay fast on a lot of short texts", () => {
      let total = 0;
      for (let i = 0; i < 3000; i++) {
        for (let j = 0; j < speed.length; j++) total += f(speed[j]);
      }
      expect(total).toBe(3000 * 6);
    });
  });
});
