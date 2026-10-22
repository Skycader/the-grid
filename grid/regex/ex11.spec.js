/* Ex11
 * 🎖CERTIFIED 2026-10-23
 * Given a list of bills, one per line, count the bills that are more than or equal to $100.
 * A bill is a line "<id>: $<amount>"; f(text) returns a number.
 *
 * Example (the list from the task, 12 bills):
 *   "1: $1.00 … 200: $550.16 … 10001: $990.20"  →  5
 *
 * Scope:
 *   ✓ a bill is a line "<id>: $<amount>": digits, a colon, a space, $ and the amount
 *   ✓ the amount is a number with an optional decimal part; leading zeros do not change its value ($0100 is $100)
 *   ✓ the border: $100 counts, $99.99 does not; there is no upper limit ($1000000 and an amount of 1 500 digits count)
 *   ✓ a line that is not a bill is never counted: no $, no id, text instead of the amount, another currency
 *   ✓ several bills: on many lines, with blank lines, with \r\n, at the first and at the last line
 *   ✓ the answer is a number, 0 for an empty text and for a text without bills
 *   ✓ speed: the timing test (7.5) counts in short texts again and again — the solution is compared
 *     with the reference one by STRICT mode
 *   ✗ not pinned: thousands separators ($1,000), a negative amount, a missing or a doubled space after the colon,
 *     text after the amount, a bill glued to other text
 *
 * Difficulty: ★★★★☆☆☆☆☆☆ (4/10)
 */

const f = require("./ex11.js");

// what the task counts: the value of the amount
const counted = (v) => v >= 100;
const want = (value) => (counted(value) ? 1 : 0);

// the amounts of the bills; one row = one bill and its answer (1 counted, 0 not)
const amounts = [
  "0", "0.00", "0.5", "1", "1.00", "9", "9.99", "10", "10.00", "50", "50.5", "99", "99.00", "99.9", "99.99",
  "100", "100.00", "100.01", "100.5", "101", "150.25", "999", "999.99", "1000", "1000.00", "1001", "5000", "9998.99", "9999", "9999.00",
  "10000", "10000.00", "10001", "12345.67", "99999", "1000000",
];
const amountRows = amounts.map((a, i) => [`${i + 1}: $${a}`, want(parseFloat(a))]);

// the same values with zeros in front: they do not change the value
const zeros = ["0000", "0099", "0099.99", "00099", "00099.99", "0100", "00100.00", "000000100.00", "0101", "0999", "09999", "010000", "0000100"];
const zeroRows = zeros.map((a, i) => [`${i + 1}: $${a}`, want(parseFloat(a))]);

const list = `
1: $1.00
2: $2.00
3: $3.00
8: $44.00
9: $55.77
10: $25.15
15: $36.19
200: $550.16
500: $680.92
1001: $1000.00
1500: $2000.20
10001: $990.20
`;

describe(":: Running test case for EX11 (bills of $100 or more)", () => {
  // ==========================================
  // 1️⃣ BASIC
  // ==========================================
  describe("1️⃣ Basic", () => {
    it("1️⃣.1️⃣ should match the example from the task", () => {
      expect(f(list)).toBe(5);
    });

    it("1️⃣.2️⃣ should count a bill that fits", () => {
      expect(f("1: $150.00")).toBe(1);
    });

    it("1️⃣.3️⃣ should NOT count a bill that does not fit", () => {
      expect(f("1: $50.00")).toBe(0);
    });

    it("1️⃣.4️⃣ should always return a number", () => {
      expect(typeof f("1: $150.00")).toBe("number");
      expect(typeof f("")).toBe("number");
    });
  });

  // ==========================================
  // 2️⃣ THE AMOUNT
  // ==========================================
  // One row = one bill and its answer. Why these rows: $100 is the first amount that counts, $99.99 the last one that does not; 10 and 99 are the short amounts.
  describe("2️⃣ The amount", () => {
    it.each(amountRows)("2️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 3️⃣ ZEROS IN FRONT
  // ==========================================
  // One row = one bill and its answer. Why these rows: $0100 is $100 and $0099.99 is $99.99; a regex that
  // counts the digits of the text instead of the value gets them wrong.
  describe("3️⃣ Zeros in front", () => {
    it.each(zeroRows)("3️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 4️⃣ LINES THAT ARE NOT BILLS
  // ==========================================
  // One row = one line that is never counted, however big or small it looks.
  describe("4️⃣ Lines that are not bills", () => {
    const rows = [
      ["invalid line", 0],
      ["$150.00", 0],
      ["$50.00", 0],
      ["150.00", 0],
      ["150", 0],
      ["$", 0],
      ["1:", 0],
      ["1: $", 0],
      ["1: $abc", 0],
      ["1: $abc150", 0],
      ["1: abc", 0],
      ["1: 150.00", 0],
      ["1: 50.00", 0],
      ["abc: $150", 0],
      ["abc: $50", 0],
      [": $150", 0],
      [": $50", 0],
      ["1 $150", 0],
      ["1; $150", 0],
      ["1, $50", 0],
      ["1: €150", 0],
      ["1: £50", 0],
      ["1: 150$", 0],
      ["1: 50$", 0],
      ["1: #150", 0],
      ["1: %50", 0],
    ];

    it.each(rows)("4️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 5️⃣ SEVERAL BILLS
  // ==========================================
  describe("5️⃣ Several bills", () => {
    it("5️⃣.1️⃣ should count all the bills that fit, not just the first one", () => {
      expect(f(["1: $150.00", "2: $150.00", "3: $150.00"].join("\n"))).toBe(3);
    });

    it("5️⃣.2️⃣ should count only the bills that fit among the others", () => {
      expect(f(["1: $150.00", "2: $50.00", "3: $150.00", "4: $50.00", "5: $150.00"].join("\n"))).toBe(3);
    });

    it("5️⃣.3️⃣ should skip the lines that are not bills", () => {
      const text = ["1: $150.00", "invalid line", "2: $abc", "3: 150.00", "4: $150.00"].join("\n");
      expect(f(text)).toBe(2);
    });

    it("5️⃣.4️⃣ should count a bill at the first line and at the last line", () => {
      expect(f("1: $150.00\n2: $50.00\n3: $50.00\n4: $150.00")).toBe(2);
    });

    it("5️⃣.5️⃣ should work with blank lines and new lines around", () => {
      expect(f("\n\n1: $150.00\n\n\n2: $150.00\n\n")).toBe(2);
    });

    it("5️⃣.6️⃣ should work with \\r\\n line ends", () => {
      expect(f("1: $150.00\r\n2: $50.00\r\n3: $150.00\r\n")).toBe(2);
    });

    it("5️⃣.7️⃣ should take bills with long ids", () => {
      expect(f("90550: $150.00\n123456789012: $150.00\n0: $150.00")).toBe(3);
    });

    it("5️⃣.8️⃣ should count the same amount in different bills separately", () => {
      expect(f("1: $150.00\n2: $150.00\n1: $150.00")).toBe(3);
    });

    it("5️⃣.9️⃣ should count a mix of amounts of every size", () => {
      const text = amounts.map((a, i) => `${i + 1}: $${a}`).join("\n");
      expect(f(text)).toBe(amounts.filter((a) => counted(parseFloat(a))).length);
    });
  });

  // ==========================================
  // 6️⃣ EDGE CASES
  // ==========================================
  describe("6️⃣ Edge cases", () => {
    it("6️⃣.1️⃣ should return 0 for an empty text", () => {
      expect(f("")).toBe(0);
    });

    it("6️⃣.2️⃣ should return 0 for a text without bills", () => {
      expect(f("no bills here")).toBe(0);
      expect(f("  \n\t\n ")).toBe(0);
    });

    it("6️⃣.3️⃣ should give the same answer when it is called again", () => {
      expect(f(list)).toBe(5);
      expect(f(list)).toBe(5);
    });
  });

  // ==========================================
  // 7️⃣ PERFORMANCE
  // ==========================================
  describe("7️⃣ Performance", () => {
    let good;
    let bad;
    let huge;
    let zerosBefore;
    let longId;
    let speed;

    beforeAll(() => {
      good = "1: $150.00\n".repeat(5000);
      bad = "1: $50.00\n".repeat(5000);
      huge = "1: $" + "9".repeat(1500);
      zerosBefore = "1: $" + "0".repeat(1500) + "1";
      longId = "9".repeat(5000) + ": $150.00";
      speed = [
        list,
        "1: $1.00\n2: $100.00\n3: $550.16",
        "3: $99.99\n4: $100\n5: $100.01",
        "5: $0100\n6: $00099.99",
        "invalid line\n2: $abc\n3: 100.00\n4: $150.00",
        "",
      ];
    });

    it("7️⃣.1️⃣ should count 5 000 bills correctly and fast", () => {
      const t0 = Date.now();
      const counts = [f(good), f(bad)];
      const elapsed = Date.now() - t0;
      expect(counts).toEqual([5000, 0]);
      expect(elapsed).toBeLessThan(1000);
    });

    it("7️⃣.2️⃣ should handle an amount of 1 500 digits fast", () => {
      const t0 = Date.now();
      const count = f(huge);
      const elapsed = Date.now() - t0;
      expect(count).toBe(want(Infinity));
      expect(elapsed).toBeLessThan(1000);
    });

    it("7️⃣.3️⃣ should handle 1 500 zeros in front of an amount fast", () => {
      const t0 = Date.now();
      const count = f(zerosBefore);
      const elapsed = Date.now() - t0;
      expect(count).toBe(want(1));
      expect(elapsed).toBeLessThan(1000);
    });

    it("7️⃣.4️⃣ should handle an id of 5 000 digits fast", () => {
      const t0 = Date.now();
      const count = f(longId);
      const elapsed = Date.now() - t0;
      expect(count).toBe(1);
      expect(elapsed).toBeLessThan(1000);
    });

    // The timing test: most of the spec's run time is spent here, so STRICT mode compares the player's
    // function with the reference one on exactly this work (12 000 counts in short texts).
    it("7️⃣.5️⃣ should stay fast on a lot of short texts", () => {
      let total = 0;
      for (let i = 0; i < 2000; i++) {
        for (let j = 0; j < speed.length; j++) total += f(speed[j]);
      }
      expect(total).toBe(2000 * 11);
    });
  });
});
