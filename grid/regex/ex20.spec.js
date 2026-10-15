/* Ex20
 * 🎖CERTIFIED 2026-10-16
 * Make the text inside <h1> ... <h6> headings upper case.
 *
 * Example:
 *   "<h1>hello</h1>\n<h2>world</h2>"  →  "<h1>HELLO</h1>\n<h2>WORLD</h2>"
 *
 * Scope:
 *   ✓ a heading is <hN> ... </hN> with the SAME level N (1-6) on both sides
 *   ✓ the text between the tags is made upper case, the tags stay lower case
 *   ✓ everything outside of the headings stays as it is (other tags, text, new lines)
 *   ✓ several headings in a text — on separate lines and on one line (the text between them stays)
 *   ✓ tags with different levels (<h1> ... </h2>) are not a heading: left alone
 *   ✓ h0, h7, <header>, <hr>, <h> are not headings
 *   ✓ spaces, digits, punctuation and non-Latin letters (привет → ПРИВЕТ) inside a heading
 *   ✗ not pinned: attributes (<h1 class="a">), upper case tag names (<H1>), other tags inside
 *     a heading, a heading that goes over several lines, a mismatched tag that is followed
 *     later by a closing tag of the same level
 *
 * Difficulty: ★★★★★☆☆☆☆☆ (5/10)
 */

const f = require("./ex20.js");

describe(":: Running test case for EX20 (capitalize headers)", () => {
  // ==========================================
  // 1️⃣ BASIC
  // ==========================================
  describe("1️⃣ Basic", () => {
    it("1️⃣.1️⃣ should match the example from the task", () => {
      const text = `
<h1>hello</h1>
<h2>world</h2>
`;
      expect(f(text)).toBe(`
<h1>HELLO</h1>
<h2>WORLD</h2>
`);
    });

    it("1️⃣.2️⃣ should make the text of one heading capital", () => {
      expect(f("<h1>hello world!</h1>")).toBe("<h1>HELLO WORLD!</h1>");
    });

    it("1️⃣.3️⃣ should return a string", () => {
      expect(typeof f("<h1>a</h1>")).toBe("string");
      expect(typeof f("a")).toBe("string");
    });
  });

  // ==========================================
  // 2️⃣ LEVELS
  // ==========================================
  // One row = one heading: <hN>text</hN> → <hN>TEXT</hN>
  describe("2️⃣ Levels h1 - h6", () => {
    const levels = [1, 2, 3, 4, 5, 6].map((n) => [`<h${n}>some title</h${n}>`, `<h${n}>SOME TITLE</h${n}>`]);

    it.each(levels)("2️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toBe(expected);
    });

    it("2️⃣.2️⃣ should keep the tags lower case", () => {
      expect(f("<h3>title</h3>")).toBe("<h3>TITLE</h3>");
      expect(f("<h3>title</h3>")).not.toMatch(/<H3>|<\/H3>/);
    });
  });

  // ==========================================
  // 3️⃣ ONLY HEADINGS
  // ==========================================
  describe("3️⃣ Only headings change", () => {
    it("3️⃣.1️⃣ should NOT touch the text outside of the headings", () => {
      expect(f("before <h1>title</h1> after")).toBe("before <h1>TITLE</h1> after");
      expect(f("plain text, no tags")).toBe("plain text, no tags");
    });

    it("3️⃣.2️⃣ should NOT touch other tags", () => {
      expect(f("<p>keep me</p><h4>change me</h4>")).toBe("<p>keep me</p><h4>CHANGE ME</h4>");
      expect(f("<div><b>bold</b> text</div>")).toBe("<div><b>bold</b> text</div>");
    });

    it("3️⃣.3️⃣ should NOT treat h0 and h7 as headings", () => {
      expect(f("<h0>text</h0>")).toBe("<h0>text</h0>");
      expect(f("<h7>text</h7>")).toBe("<h7>text</h7>");
    });

    it("3️⃣.4️⃣ should NOT treat tags that only start with h as headings", () => {
      expect(f("<header>text</header>")).toBe("<header>text</header>");
      expect(f("<hr>text<hr>")).toBe("<hr>text<hr>");
      expect(f("<h>text</h>")).toBe("<h>text</h>");
      expect(f("<html>text</html>")).toBe("<html>text</html>");
    });

    it("3️⃣.5️⃣ should keep a heading that is already capital", () => {
      expect(f("<h2>ALREADY CAPITAL</h2>")).toBe("<h2>ALREADY CAPITAL</h2>");
    });
  });

  // ==========================================
  // 4️⃣ SEVERAL HEADINGS
  // ==========================================
  describe("4️⃣ Several headings", () => {
    it("4️⃣.1️⃣ should change headings on separate lines", () => {
      expect(f("<h1>one</h1>\n<h2>two</h2>\n<h3>three</h3>")).toBe("<h1>ONE</h1>\n<h2>TWO</h2>\n<h3>THREE</h3>");
    });

    it("4️⃣.2️⃣ should change Windows line breaks too", () => {
      expect(f("<h1>one</h1>\r\n<h2>two</h2>")).toBe("<h1>ONE</h1>\r\n<h2>TWO</h2>");
    });

    // a greedy .* would swallow everything between the first <h1> and the last </h2>
    it("4️⃣.3️⃣ should keep the text between two headings on one line", () => {
      expect(f("<h1>one</h1> and <h2>two</h2>")).toBe("<h1>ONE</h1> and <h2>TWO</h2>");
      expect(f("<h1>one</h1><p>middle</p><h2>two</h2>")).toBe("<h1>ONE</h1><p>middle</p><h2>TWO</h2>");
    });

    it("4️⃣.4️⃣ should change every heading of the same level, not only the first one", () => {
      expect(f("<h1>a</h1> <h1>b</h1> <h1>c</h1>")).toBe("<h1>A</h1> <h1>B</h1> <h1>C</h1>");
    });

    it("4️⃣.5️⃣ should change all six levels in one text", () => {
      const text = "<h1>a</h1><h2>b</h2><h3>c</h3><h4>d</h4><h5>e</h5><h6>f</h6>";
      expect(f(text)).toBe("<h1>A</h1><h2>B</h2><h3>C</h3><h4>D</h4><h5>E</h5><h6>F</h6>");
    });
  });

  // ==========================================
  // 5️⃣ MISMATCHED TAGS
  // ==========================================
  // One row = tags of different levels: it is not a heading, the text is left alone.
  describe("5️⃣ Mismatched tags", () => {
    const pairs = new Set();
    for (let n = 1; n <= 6; n++) {
      pairs.add(`${n}${(n % 6) + 1}`); // the next level
      pairs.add(`${n}${7 - n}`); // the opposite level
    }
    const rows = [...pairs].map((p) => [`<h${p[0]}>invalid html</h${p[1]}>`]);

    it.each(rows)("5️⃣.1️⃣ %j → untouched", (text) => {
      expect(f(text)).toBe(text);
    });

    it("5️⃣.2️⃣ should change the valid heading and keep the invalid one next to it", () => {
      const text = `
<h1>valid html</h1>
<h3>invalid html</h6>
`;
      expect(f(text)).toBe(`
<h1>VALID HTML</h1>
<h3>invalid html</h6>
`);
    });

    it("5️⃣.3️⃣ should keep an unclosed heading", () => {
      expect(f("<h1>never closed")).toBe("<h1>never closed");
      expect(f("<h2>one</h2> <h3>never closed")).toBe("<h2>ONE</h2> <h3>never closed");
    });

    it("5️⃣.4️⃣ should keep a closing tag without an opening one", () => {
      expect(f("text</h1>")).toBe("text</h1>");
    });
  });

  // ==========================================
  // 6️⃣ TEXT INSIDE
  // ==========================================
  describe("6️⃣ Text inside a heading", () => {
    it("6️⃣.1️⃣ should keep the spaces", () => {
      expect(f("<h2>  padded   text  </h2>")).toBe("<h2>  PADDED   TEXT  </h2>");
    });

    it("6️⃣.2️⃣ should keep digits and punctuation", () => {
      expect(f("<h1>chapter 1: the (very) first, ok? yes!</h1>")).toBe("<h1>CHAPTER 1: THE (VERY) FIRST, OK? YES!</h1>");
      expect(f("<h3>2024-10-16 & co. #1</h3>")).toBe("<h3>2024-10-16 & CO. #1</h3>");
    });

    it("6️⃣.3️⃣ should make mixed case capital", () => {
      expect(f("<h2>MiXeD cAsE</h2>")).toBe("<h2>MIXED CASE</h2>");
    });

    it("6️⃣.4️⃣ should work with non-Latin letters", () => {
      expect(f("<h1>привет мир</h1>")).toBe("<h1>ПРИВЕТ МИР</h1>");
      expect(f("<h2>élan vital</h2>")).toBe("<h2>ÉLAN VITAL</h2>");
    });

    it("6️⃣.5️⃣ should keep an empty heading", () => {
      expect(f("<h1></h1>")).toBe("<h1></h1>");
      expect(f("<h2></h2><h3>x</h3>")).toBe("<h2></h2><h3>X</h3>");
    });

    it("6️⃣.6️⃣ should keep the letters h and a number inside the text as they are", () => {
      expect(f("<h1>h1 and h2</h1>")).toBe("<h1>H1 AND H2</h1>");
    });
  });

  // ==========================================
  // 7️⃣ EDGE CASES
  // ==========================================
  describe("7️⃣ Edge cases", () => {
    it("7️⃣.1️⃣ should return an empty string for an empty input", () => {
      expect(f("")).toBe("");
    });

    it("7️⃣.2️⃣ should return whitespace as it is", () => {
      expect(f("  \n\t\r\n ")).toBe("  \n\t\r\n ");
    });

    it("7️⃣.3️⃣ should return a text without headings as it is", () => {
      expect(f("<p>one</p>\n<p>two</p>")).toBe("<p>one</p>\n<p>two</p>");
    });
  });

  // ==========================================
  // 8️⃣ PERFORMANCE
  // ==========================================
  describe("8️⃣ Performance", () => {
    let headings;
    let plain;
    let page;

    beforeAll(() => {
      headings = "<h2>some title</h2>\n".repeat(5000);
      plain = "lorem <b>ipsum</b> dolor <h".repeat(2000);
      page = [
        "<h1>site title</h1>",
        "<p>a paragraph with some <b>text</b> inside</p>",
        "<h2>first part</h2>",
        "<p>another paragraph, a bit longer than the first one</p>",
        "<h3>a small heading</h3> <h3>and one more</h3>",
        "<h3>broken one</h4>",
        "<h6>the last title</h6>",
        "<footer>footer</footer>",
      ].join("\n");
    });

    it("8️⃣.1️⃣ should change 5 000 headings correctly and fast", () => {
      const t0 = Date.now();
      const result = f(headings);
      const elapsed = Date.now() - t0;
      // not toBe(the whole text): a row cuts long values, and a difference far from the start
      // would look like "equal". The first wrong lines are shown instead.
      const wrong = result.split("\n").filter((line) => line !== "" && line !== "<h2>SOME TITLE</h2>");
      expect(wrong.slice(0, 2)).toEqual([]);
      expect(result.length).toBe(headings.length);
      expect(elapsed).toBeLessThan(1000);
    });

    it("8️⃣.2️⃣ should handle a long text without a single heading fast", () => {
      const t0 = Date.now();
      const result = f(plain);
      const elapsed = Date.now() - t0;
      expect(result).toBe(plain);
      expect(elapsed).toBeLessThan(1000);
    });

    // The timing test: most of the spec's run time is spent here, so STRICT mode compares
    // the player's regex with the reference one on exactly this work (a small page, 3 000 times).
    // Upper case does not change the length of this ASCII page, so the answer is its length.
    it("8️⃣.3️⃣ should stay fast on a lot of small pages", () => {
      let total = 0;
      for (let i = 0; i < 3000; i++) total += f(page).length;
      expect(total).toBe(page.length * 3000);
    });
  });
});
