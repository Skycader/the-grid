/* Ex25
 * Three regular expressions for lookahead / lookbehind, exported as [r1, r2, r3]:
 *   r1 — prices after `$`            "RHX: $431.41"                 →  ["431.41"]
 *   r2 — the text inside <title>     "<title>Main title</title>"    →  ["Main title"]
 *   r3 — the protocol of a URL       "https://instagram.com"        →  ["https"]
 * Every regex is global and is used as text.match(r).
 *
 * Scope:
 *   ✓ r1: a number with a decimal part glued to `$`; the `$` and a sentence-ending dot are not part of it
 *   ✓ r1: numbers without `$` (23.50, €5.00) are not prices
 *   ✓ r2: only the text between the tags; an empty tag gives ""; no title tag gives null
 *   ✓ r3: the word right before "://" — a port (":8080"), "Note:" or "web:https" is not a protocol
 *   ✓ several matches in one text, several protocols in one URL
 *   ✗ not pinned: prices without decimals ($5), thousands separators ($1,234.56), upper-case
 *     <TITLE>, a title that spans several lines, two titles in one line, protocols with + or -
 *
 * Difficulty: ★★★★★★★☆☆☆ (7/10)
 */

const [r1, r2, r3] = require("./ex25.js");

describe(":: Running test case for EX25 (lookahead and lookbehind)", () => {
  // ==========================================
  // 1️⃣ TASK 1 — PRICES
  // ==========================================
  describe("1️⃣ Task 1 - Price extraction", () => {
    it("1️⃣.1️⃣ should match the example from the task", () => {
      const text = "RHX: $431.41\nMTG: $651.22\nRTT: $300.00";
      expect(text.match(r1)).toEqual(["431.41", "651.22", "300.00"]);
    });

    it("1️⃣.2️⃣ should extract clear numbers from formatted text", () => {
      const text = "\nAGX: $23.50\nTTX: $54.30\nARG: $90.00\n";
      expect(text.match(r1)).toEqual(["23.50", "54.30", "90.00"]);
    });

    it("1️⃣.3️⃣ should handle single digits, large numbers, and no spaces", () => {
      const text = "ABC:$1.00,XYZ:$12345.67";
      expect(text.match(r1)).toEqual(["1.00", "12345.67"]);
    });

    it("1️⃣.4️⃣ should find every price in one line", () => {
      expect(("$1.00 $2.00 $3.00").match(r1)).toEqual(["1.00", "2.00", "3.00"]);
    });

    it("1️⃣.5️⃣ should NOT include the dollar sign in the match", () => {
      const found = "pay $10.50 now".match(r1);
      expect(found).toEqual(["10.50"]);
      expect(found[0]).not.toContain("$");
    });

    it("1️⃣.6️⃣ should NOT include a dot that ends the sentence", () => {
      expect("Total $5.00.".match(r1)).toEqual(["5.00"]);
      expect("(cost: $5.00), thanks".match(r1)).toEqual(["5.00"]);
    });

    it("1️⃣.7️⃣ should ignore numbers without the dollar sign", () => {
      expect("23.50 and 5.00 dollars".match(r1)).toBeNull();
      expect("v1.2 build 3.14".match(r1)).toBeNull();
    });

    it("1️⃣.8️⃣ should ignore other currencies", () => {
      expect("€5.00 £7.50 ¥9.99".match(r1)).toBeNull();
    });

    it("1️⃣.9️⃣ should take only the priced numbers from a mixed text", () => {
      expect("Paid 12.00 for it, owe $3.50 more".match(r1)).toEqual(["3.50"]);
    });

    it("1️⃣.1️⃣0️⃣ should NOT treat a number separated from the dollar sign as a price", () => {
      expect("$ 5.00".match(r1)).toBeNull();
    });

    it("1️⃣.1️⃣1️⃣ should return null if no prices are present", () => {
      expect("No prices here, just text.".match(r1)).toBeNull();
      expect("".match(r1)).toBeNull();
    });
  });

  // ==========================================
  // 2️⃣ TASK 2 — HTML TITLE
  // ==========================================
  describe("2️⃣ Task 2 - HTML title extraction", () => {
    it("2️⃣.1️⃣ should extract a standard website title", () => {
      expect("<title>Website title</title>".match(r2)).toEqual(["Website title"]);
    });

    it("2️⃣.2️⃣ should handle titles with special characters and spaces", () => {
      const text = "<title> Home - My Blog! @2026 </title>";
      expect(text.match(r2)).toEqual([" Home - My Blog! @2026 "]);
    });

    it("2️⃣.3️⃣ should return an empty string inside the array for an empty tag", () => {
      expect("<title></title>".match(r2)).toEqual([""]);
    });

    it("2️⃣.4️⃣ should keep whitespace-only content as it is", () => {
      expect("<title> </title>".match(r2)).toEqual([" "]);
    });

    it("2️⃣.5️⃣ should find the title inside a whole document", () => {
      const text =
        "<html><head><title>Hi there</title></head><body><h1>Hello</h1></body></html>";
      expect(text.match(r2)).toEqual(["Hi there"]);
    });

    it("2️⃣.6️⃣ should NOT include the tags in the match", () => {
      const found = "<title>Main title</title>".match(r2);
      expect(found[0]).not.toContain("<");
      expect(found[0]).not.toContain(">");
    });

    it("2️⃣.7️⃣ should keep angle brackets that are part of the title text", () => {
      expect("<title>a < b and c > d</title>".match(r2)).toEqual([
        "a < b and c > d",
      ]);
    });

    it("2️⃣.8️⃣ should return null when there is no closing tag", () => {
      expect("<title>unfinished".match(r2)).toBeNull();
      expect("<title>unfinished</title".match(r2)).toBeNull();
    });

    it("2️⃣.9️⃣ should return null when there is no opening tag", () => {
      expect("unfinished</title>".match(r2)).toBeNull();
    });

    it("2️⃣.1️⃣0️⃣ should ignore other tags and the plain word title", () => {
      expect("<h1>Hello</h1>".match(r2)).toBeNull();
      expect("<head>title</head>".match(r2)).toBeNull();
      expect("title".match(r2)).toBeNull();
      expect("".match(r2)).toBeNull();
    });
  });

  // ==========================================
  // 3️⃣ TASK 3 — URL PROTOCOLS
  // ==========================================
  describe("3️⃣ Task 3 - Protocol extraction", () => {
    it("3️⃣.1️⃣ should match the examples from the task", () => {
      expect("https://instagram.com".match(r3)).toEqual(["https"]);
      expect("http://google.com".match(r3)).toEqual(["http"]);
      expect("ftp://files.net".match(r3)).toEqual(["ftp"]);
    });

    it("3️⃣.2️⃣ should extract standard protocols from a list", () => {
      const text =
        "\n  https://wikipedia.org\n  http://website.ru\n  ftp://aloga.top\n";
      expect(text.match(r3)).toEqual(["https", "http", "ftp"]);
    });

    it("3️⃣.3️⃣ should extract protocols embedded inside inline text", () => {
      const text = "Go to https://google.com or secure ftp://file.server";
      expect(text.match(r3)).toEqual(["https", "ftp"]);
    });

    it("3️⃣.4️⃣ should NOT include the colon or the slashes in the match", () => {
      const found = "https://a.com".match(r3);
      expect(found[0]).not.toContain(":");
      expect(found[0]).not.toContain("/");
    });

    it("3️⃣.5️⃣ should ignore fake protocols without slashes", () => {
      expect("http:not-a-link.com web:https".match(r3)).toBeNull();
    });

    it("3️⃣.6️⃣ should ignore a colon that is not followed by two slashes", () => {
      expect("http:/a.com".match(r3)).toBeNull();
      expect("http//a.com".match(r3)).toBeNull();
    });

    it("3️⃣.7️⃣ should ignore other colons in the text", () => {
      const text = "Note: the time is 10:30, see https://a.com";
      expect(text.match(r3)).toEqual(["https"]);
    });

    it("3️⃣.8️⃣ should NOT take the host before a port for a protocol", () => {
      expect("http://localhost:8080/x".match(r3)).toEqual(["http"]);
    });

    it("3️⃣.9️⃣ should find every protocol, also inside one URL", () => {
      expect("https://a.com/go?to=http://b.com".match(r3)).toEqual([
        "https",
        "http",
      ]);
    });

    it("3️⃣.1️⃣0️⃣ should return null when there is no URL", () => {
      expect("no links here".match(r3)).toBeNull();
      expect("".match(r3)).toBeNull();
    });
  });

  // ==========================================
  // 4️⃣ EXPORTS
  // ==========================================
  describe("4️⃣ Exports", () => {
    it("4️⃣.1️⃣ should export exactly three regular expressions", () => {
      expect(r1 instanceof RegExp).toBe(true);
      expect(r2 instanceof RegExp).toBe(true);
      expect(r3 instanceof RegExp).toBe(true);
    });

    it("4️⃣.2️⃣ should make every regex global", () => {
      // without `g` match() would return only the first result (and the capture groups)
      expect(r1.global).toBe(true);
      expect(r2.global).toBe(true);
      expect(r3.global).toBe(true);
    });

    it("4️⃣.3️⃣ should give the same answer when used again on the same text", () => {
      const text = "$1.00 $2.00";
      expect(text.match(r1)).toEqual(["1.00", "2.00"]);
      expect(text.match(r1)).toEqual(["1.00", "2.00"]);
    });
  });

  // ==========================================
  // 5️⃣ PERFORMANCE
  // ==========================================
  describe("5️⃣ Performance", () => {
    let prices;
    let noPrices;
    let longTitle;
    let manyTitles;
    let urls;

    beforeAll(() => {
      prices = "$1.00 ".repeat(5000);
      noPrices = "1.00 ".repeat(5000);
      longTitle = "<title>" + "x".repeat(5000) + "</title>";
      manyTitles = "<title>x".repeat(300);
      urls = "http://a.com ".repeat(5000);
    });

    it("5️⃣.1️⃣ should find 5 000 prices correctly and fast", () => {
      const t0 = Date.now();
      const found = prices.match(r1);
      const elapsed = Date.now() - t0;
      expect(found.length).toBe(5000);
      expect(elapsed).toBeLessThan(1000);
    });

    it("5️⃣.2️⃣ should reject a long text without a single price fast", () => {
      const t0 = Date.now();
      const found = noPrices.match(r1);
      const elapsed = Date.now() - t0;
      expect(found).toBeNull();
      expect(elapsed).toBeLessThan(1000);
    });

    it("5️⃣.3️⃣ should extract a very long title fast", () => {
      const t0 = Date.now();
      const found = longTitle.match(r2);
      const elapsed = Date.now() - t0;
      expect(found[0].length).toBe(5000);
      expect(elapsed).toBeLessThan(1000);
    });

    it("5️⃣.4️⃣ should not hang on many unclosed title tags", () => {
      const t0 = Date.now();
      const found = manyTitles.match(r2);
      const elapsed = Date.now() - t0;
      expect(found).toBeNull();
      expect(elapsed).toBeLessThan(1000);
    });

    it("5️⃣.5️⃣ should find 5 000 protocols correctly and fast", () => {
      const t0 = Date.now();
      const found = urls.match(r3);
      const elapsed = Date.now() - t0;
      expect(found.length).toBe(5000);
      expect(elapsed).toBeLessThan(1000);
    });
  });
});
