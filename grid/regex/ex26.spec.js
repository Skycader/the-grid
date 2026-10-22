/* Ex26
 * 🎖CERTIFIED 2026-10-22
 * Find the quantities of products in a text and omit the prices.
 * A price is a number right after "$" ($30, $10.99); a quantity is any other whole number.
 * The regex is global and is used as text.match(r).
 *
 * Example:
 *   "I paid $30 for 30 apples and 80 oranges"  →  ["30", "80"]
 *
 * Scope:
 *   ✓ a price is omitted as a whole: its cents ($10.99) and the tail of its digits ($1234) never leak
 *   ✓ every other whole number is returned as a string, in the order of the text (also 0 and 007)
 *   ✓ the same value as a price and as a quantity ($30 for 30): the position decides
 *   ✓ quantities next to punctuation, brackets and the end of a sentence; on several lines and after tabs
 *   ✓ a "$" that is not glued to a number does not make the next number a price
 *   ✓ nothing found, an empty text — null
 *   ✓ the regex is global and gives the same answer when it is used again
 *   ✓ speed: the timing test (7.5) matches short texts again and again — the solution is compared
 *     with the reference one by STRICT mode
 *   ✗ not pinned: decimal numbers without "$" (2.5), thousands separators ($1,000), other currencies
 *     (€30), a "$" after the number (30$), numbers glued to letters (5kg, a5), a space between "$" and
 *     the number ($ 5)
 *
 * Difficulty: ★★★★★★★☆☆☆ (7/10)
 */

const r = require("./ex26.js");

// the regex of the player is used as it is, only the `g` flag is added when it is missing: a missing flag is
// caught once, by the test of the flag (6.2), and does not turn every other test red
const rg = new RegExp(r.source, r.flags.includes("g") ? r.flags : r.flags + "g");
const f = (text) => text.match(rg);

describe(":: Running test case for EX26 (product quantities without prices)", () => {
  // ==========================================
  // 1️⃣ BASIC
  // ==========================================
  describe("1️⃣ Basic", () => {
    it("1️⃣.1️⃣ should match the example from the task", () => {
      expect(f("I paid $30 for 30 apples and 80 oranges")).toEqual(["30", "80"]);
    });

    it("1️⃣.2️⃣ should omit a price with cents as a whole", () => {
      expect(f("The price is $10.99 for 5 liters and 2 packs")).toEqual(["5", "2"]);
    });

    it("1️⃣.3️⃣ should return an array of strings", () => {
      const found = f("buy 5 and 7");
      expect(Array.isArray(found)).toBe(true);
      expect(typeof found[0]).toBe("string");
    });
  });

  // ==========================================
  // 2️⃣ PRICES ARE OMITTED
  // ==========================================
  // One row = one text with a price only. Why these rows: a regex that only looks at the char before the
  // number lets the tail of a price through ($1234 → 234, $10.99 → 99).
  describe("2️⃣ Prices are omitted", () => {
    const prices = [
      ["$30", null],
      ["$5000", null],
      ["$0", null],
      ["$1234", null],
      ["$10.99", null],
      ["$0.99", null],
      ["$30.5", null],
      ["$100.25.", null],
      ["Total: $5.", null],
      ["($30)", null],
      ["US$30", null],
      ["Costs are $10, $20 and $30.50", null],
    ];

    it.each(prices)("2️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toEqual(expected);
    });
  });

  // ==========================================
  // 3️⃣ QUANTITIES ARE FOUND
  // ==========================================
  // One row = one text and the quantities in it. Why these rows: the answer is whole numbers as they are
  // written (0, 007), also when punctuation, brackets or the end of a sentence stick to them.
  describe("3️⃣ Quantities are found", () => {
    const quantities = [
      ["30 apples", ["30"]],
      ["1000 users", ["1000"]],
      ["0 items", ["0"]],
      ["007 agents", ["007"]],
      ["50", ["50"]],
      ["Quantity is 50, price is $10", ["50"]],
      ["I bought 5.", ["5"]],
      ["(5)", ["5"]],
      ["[7] and {8}", ["7", "8"]],
      ["#42", ["42"]],
      ["5,6", ["5", "6"]],
      ["5 5 5", ["5", "5", "5"]],
      ["1 2 3 4 5 6 7 8 9 10", ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]],
    ];

    it.each(quantities)("3️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toEqual(expected);
    });
  });

  // ==========================================
  // 4️⃣ PRICES AND QUANTITIES TOGETHER
  // ==========================================
  describe("4️⃣ Prices and quantities together", () => {
    it("4️⃣.1️⃣ should take 1000 and 200 and omit $5000", () => {
      expect(f("1000 users spent $5000 to buy 200 units")).toEqual(["1000", "200"]);
    });

    it("4️⃣.2️⃣ should take numbers from brackets and omit the price after them", () => {
      expect(f("Buy 5 items (ref: 123) for $99 each")).toEqual(["5", "123"]);
    });

    // why: the same value as a price and as a quantity — only the "$" in front of it tells them apart
    it("4️⃣.3️⃣ should omit $30 and take 30 when the values are equal", () => {
      expect(f("$30 for 30 apples")).toEqual(["30"]);
      expect(f("30 apples for $30")).toEqual(["30"]);
      expect(f("$5 5 $5 5")).toEqual(["5", "5"]);
    });

    it("4️⃣.4️⃣ should take the quantity that follows the cents of a price", () => {
      expect(f("$5.00 and 5")).toEqual(["5"]);
      expect(f("$100.25 for 7 pieces")).toEqual(["7"]);
    });

    it("4️⃣.5️⃣ should work on several lines and after tabs", () => {
      expect(f("apples: 3\nprice: $4\noranges: 8\r\ntotal: $28")).toEqual(["3", "8"]);
      expect(f("3\t$4\t8")).toEqual(["3", "8"]);
    });

    // why: "$" alone is not a price tag: it must be glued to the number
    it("4️⃣.6️⃣ should NOT treat a number as a price when the $ is not glued to it", () => {
      expect(f("paid in $ for 5 apples")).toEqual(["5"]);
    });
  });

  // ==========================================
  // 5️⃣ EDGE CASES
  // ==========================================
  describe("5️⃣ Edge cases", () => {
    it("5️⃣.1️⃣ should return null for an empty text", () => {
      expect(f("")).toBeNull();
    });

    it("5️⃣.2️⃣ should return null when there are no numbers", () => {
      expect(f("no numbers here")).toBeNull();
      expect(f("  \n\t ")).toBeNull();
      expect(f("$$$ ... $")).toBeNull();
    });

    it("5️⃣.3️⃣ should return null when there are only prices", () => {
      expect(f("$10 $20 $30.50")).toBeNull();
    });
  });

  // ==========================================
  // 6️⃣ THE REGEX
  // ==========================================
  describe("6️⃣ The regex", () => {
    it("6️⃣.1️⃣ should be a regular expression", () => {
      expect(r instanceof RegExp).toBe(true);
    });

    // without `g` match() would return only the first quantity (and its groups)
    it("6️⃣.2️⃣ should have the global flag", () => {
      expect(r.global).toBe(true);
    });

    it("6️⃣.3️⃣ should give the same answer when it is used again", () => {
      const text = "$1 2 $3 4";
      expect(f(text)).toEqual(["2", "4"]);
      expect(f(text)).toEqual(["2", "4"]);
    });
  });

  // ==========================================
  // 7️⃣ PERFORMANCE
  // ==========================================
  describe("7️⃣ Performance", () => {
    let quantities;
    let prices;
    let longPrice;
    let longNumber;
    let speed;

    beforeAll(() => {
      quantities = "buy 12 apples for $30 ".repeat(5000);
      prices = "$1.50 ".repeat(5000);
      longPrice = "$" + "9".repeat(5000);
      longNumber = "7".repeat(5000);
      // short texts for the timing test: a price, a quantity, cents, brackets, nothing
      speed = ["I paid $30 for 30 apples and 80 oranges", "The price is $10.99 for 5 liters", "Buy 5 items (ref: 123) for $99", "$5.00", "no numbers"];
    });

    it("7️⃣.1️⃣ should find 5 000 quantities among 5 000 prices correctly and fast", () => {
      const t0 = Date.now();
      const found = f(quantities);
      const elapsed = Date.now() - t0;
      // not toEqual(the whole array): a row cuts long values. The first wrong items are shown instead.
      expect(found.filter((x) => x !== "12").slice(0, 2)).toEqual([]);
      expect(found.length).toBe(5000);
      expect(elapsed).toBeLessThan(1000);
    });

    it("7️⃣.2️⃣ should reject 5 000 prices fast", () => {
      const t0 = Date.now();
      const found = f(prices);
      const elapsed = Date.now() - t0;
      expect(found).toBeNull();
      expect(elapsed).toBeLessThan(1000);
    });

    // why: a regex that checks only the char before the number finds a tail of this price at every digit
    it("7️⃣.3️⃣ should reject a price of 5 000 digits fast", () => {
      const t0 = Date.now();
      const found = f(longPrice);
      const elapsed = Date.now() - t0;
      expect(found).toBeNull();
      expect(elapsed).toBeLessThan(1000);
    });

    it("7️⃣.4️⃣ should return a quantity of 5 000 digits as one item fast", () => {
      const t0 = Date.now();
      const found = f(longNumber);
      const elapsed = Date.now() - t0;
      expect(found.length).toBe(1);
      expect(found[0].length).toBe(5000);
      expect(elapsed).toBeLessThan(1000);
    });

    // The timing test: most of the spec's run time is spent here, so STRICT mode compares the player's regex
    // with the reference one on exactly this work (plain text.match(r), 20 000 calls on short texts).
    it("7️⃣.5️⃣ should stay fast on a lot of short texts", () => {
      let total = 0;
      for (let i = 0; i < 4000; i++) {
        for (let j = 0; j < speed.length; j++) {
          const found = speed[j].match(rg);
          if (found) total += found.length;
        }
      }
      expect(total).toBe(4000 * 5);
    });
  });
});
