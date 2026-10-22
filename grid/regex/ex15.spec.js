/* Ex15
 * 🎖CERTIFIED 2026-10-22
 * Check if the text is a valid HTML document: f(text) returns true or false.
 * A valid document is ONE <html> ... </html> pair: the text starts with <html>, ends with
 * </html> (spaces and new lines around them are fine) and has no other <html> or </html> inside.
 *
 * Example:
 *   "<html>\n  Hello, world!\n</html>"  →  true
 *   "<html>a</html><html>b</html>"      →  false
 *
 * Scope:
 *   ✓ one pair with anything inside (text, other tags, new lines, tabs, \r\n, non-Latin letters, emoji)
 *   ✓ spaces, tabs and new lines before <html> and after </html> are fine
 *   ✓ an empty document <html></html> is valid
 *   ✓ a second <html>, a second </html>, two documents in a row — invalid
 *   ✓ a missing opening or closing tag, the tags in the wrong order, text outside of the tags — invalid
 *   ✓ look-alikes (<htmx>, <htmlx>, <html5>, a broken </html) are not the tag
 *   ✓ the word "html" and < > signs inside are just text
 *   ✓ the answer is the boolean true / false, an empty text is false
 *   ✓ speed: the timing test (7.6) checks short texts again and again — the solution is compared with
 *     the reference one by STRICT mode
 *   ✗ not pinned: attributes (<html lang="en">), upper case tags (<HTML>), spaces inside a tag
 *     (<html >), a doctype before <html>, the tags inside comments or scripts
 *
 * Difficulty: ★★★★★★★★☆☆ (8/10)
 */

const solution = require("./ex15.js");

// The answer is turned into a boolean, so a function that returns a match or null instead of true / false
// is caught once, by the test of the answer type (6.5), and does not turn every other test red
const f = (text) => Boolean(solution(text));

describe(":: Running test case for EX15 (valid HTML)", () => {
  // ==========================================
  // 1️⃣ BASIC
  // ==========================================
  describe("1️⃣ Basic", () => {
    it("1️⃣.1️⃣ should accept the valid example from the task", () => {
      expect(f("<html>\n  Hello, world!\n</html>")).toBe(true);
    });

    it("1️⃣.2️⃣ should accept a document with tags inside", () => {
      expect(f("<html><p>123</p></html>")).toBe(true);
    });

    it("1️⃣.3️⃣ should reject two documents in a row", () => {
      const text = `<html>
Here goes html 1
</html>
<html>
And also in the same file html 2
</html>`;
      expect(f(text)).toBe(false);
    });

    it("1️⃣.4️⃣ should reject another tag name", () => {
      expect(f("<htmx> Sounds cool? </htmx>")).toBe(false);
    });

    it("1️⃣.5️⃣ should reject an extra closing tag", () => {
      expect(f("<html>Is a lot of fun</html></html>")).toBe(false);
    });
  });

  // ==========================================
  // 2️⃣ VALID DOCUMENTS
  // ==========================================
  // One row = one valid text. Why these rows: whatever is inside the pair is fine, and so are the spaces
  // around it; a regex with `.` instead of [\s\S] drops the multi-line rows, one without \s* drops the padded ones.
  describe("2️⃣ Valid documents", () => {
    const valid = [
      ["<html></html>", true],
      ["<html>x</html>", true],
      ["<html> </html>", true],
      ["<html>\n</html>", true],
      ["<html>Hello, world!</html>", true],
      ["<html><head></head><body><h1>Hi</h1></body></html>", true],
      ["<html>\nline 1\nline 2\n\nline 4\n</html>", true],
      ["<html>\r\nline\r\n</html>", true],
      ["<html>\ttab\t</html>", true],
      ["  <html>x</html>", true],
      ["<html>x</html>  ", true],
      ["\n\n<html>x</html>\n\n", true],
      ["\t <html>x</html> \t", true],
      ["\r\n<html>x</html>\r\n", true],
      ["<html>привет, мир 😀</html>", true],
    ];

    it.each(valid)("2️⃣.1️⃣ %j → %s", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 3️⃣ TEXT INSIDE LOOKS LIKE A TAG, BUT IS NOT
  // ==========================================
  // One row = one valid text. Why these rows: only the exact <html> and </html> are forbidden inside.
  // A check of the word "html" or of any "<h" would reject these.
  describe("3️⃣ Look-alikes inside", () => {
    const inside = [
      ["<html>html</html>", true],
      ["<html>the html tag</html>", true],
      ["<html><htmlx>y</htmlx></html>", true],
      ["<html><html5>y</html5></html>", true],
      ["<html><htm>y</htm></html>", true],
      ["<html>a < b > c</html>", true],
      ["<html><</html>", true],
      ["<html></html</html>", true],
      ["<html>/html></html>", true],
      ["<html>&lt;html&gt;</html>", true],
    ];

    it.each(inside)("3️⃣.1️⃣ %j → %s", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 4️⃣ INVALID DOCUMENTS
  // ==========================================
  // One row = one invalid text. Why these rows: each one is a document that a looser regex lets through
  // (no anchors, a greedy .*, only one of the two forbidden tags checked inside).
  describe("4️⃣ Invalid documents", () => {
    const invalid = [
      ["<html>x</html><html>y</html>", false],
      ["<html>x</html>\n<html>y</html>", false],
      ["<html>x</html> <html>y</html>", false],
      ["<html>x</html></html>", false],
      ["<html><html>x</html>", false],
      ["<html><html></html></html>", false],
      ["<html>x<html>y</html>z</html>", false],
      ["<html>x</html><html>", false],
      ["</html><html>", false],
      ["</html>x<html>", false],
      ["<html>x", false],
      ["x</html>", false],
      ["<html>", false],
      ["</html>", false],
      ["<html>x</html", false],
      ["<html x</html>", false],
      ["html>x</html>", false],
      ["<<html>x</html>", false],
      ["<html>x</html>>", false],
    ];

    it.each(invalid)("4️⃣.1️⃣ %j → %s", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 5️⃣ OUTSIDE OF THE TAGS AND LOOK-ALIKE TAGS
  // ==========================================
  // One row = one invalid text. Why these rows: only spaces may stand outside of the pair, and only the
  // exact name `html` is the tag.
  describe("5️⃣ Outside and look-alikes", () => {
    const outside = [
      ["text <html>x</html>", false],
      ["<html>x</html> text", false],
      ["<html>x</html>.", false],
      ["- <html>x</html>", false],
      ["<p>x</p><html>y</html>", false],
      ["<html>y</html><p>x</p>", false],
      ["<htmx>x</htmx>", false],
      ["<htmlx>x</html>", false],
      ["<html>x</htmlx>", false],
      ["<html5>x</html5>", false],
      ["<htm>x</htm>", false],
      ["<xhtml>x</xhtml>", false],
      ["<head>x</head>", false],
      ["<body>x</body>", false],
      ["<html/>", false],
      ["<html><html/>", false],
      ["</html>x</html>", false],
    ];

    it.each(outside)("5️⃣.1️⃣ %j → %s", (text, expected) => {
      expect(f(text)).toBe(expected);
    });

    it("5️⃣.2️⃣ should reject an empty text and a text of spaces only", () => {
      expect(f("")).toBe(false);
      expect(f("  \n\t ")).toBe(false);
    });

    it("5️⃣.3️⃣ should reject a text without any tags", () => {
      expect(f("Hello, world!")).toBe(false);
      expect(f("html")).toBe(false);
    });
  });

  // ==========================================
  // 6️⃣ WHOLE PAGES AND THE ANSWER
  // ==========================================
  describe("6️⃣ Whole pages and the answer", () => {
    const page = `
<html>
  <head>
    <title>My page</title>
  </head>
  <body>
    <h1>Hello</h1>
    <p>Some text about html and the <b>web</b>.</p>
  </body>
</html>
`;

    it("6️⃣.1️⃣ should accept a whole page", () => {
      expect(f(page)).toBe(true);
    });

    it("6️⃣.2️⃣ should reject two pages in one file", () => {
      expect(f(page + page)).toBe(false);
    });

    it("6️⃣.3️⃣ should reject a page with a second opening tag in the middle", () => {
      expect(f(page.replace("<body>", "<html><body>"))).toBe(false);
    });

    it("6️⃣.4️⃣ should reject a page with a second closing tag in the middle", () => {
      expect(f(page.replace("<body>", "</html><body>"))).toBe(false);
    });

    it("6️⃣.5️⃣ should answer with the boolean true or false, not with a match", () => {
      expect(solution("<html>x</html>")).toBe(true);
      expect(solution("x")).toBe(false);
    });

    it("6️⃣.6️⃣ should give the same answer when it is called again", () => {
      const text = "<html>x</html>";
      expect(f(text)).toBe(true);
      expect(f(text)).toBe(true);
      expect(f("<html>x</html></html>")).toBe(false);
      expect(f("<html>x</html></html>")).toBe(false);
    });
  });

  // ==========================================
  // 7️⃣ PERFORMANCE
  // ==========================================
  describe("7️⃣ Performance", () => {
    let bigPage;
    let manyDocs;
    let notClosed;
    let brokenClosers;
    let spaceTail;
    let spaceHead;
    let speed;

    beforeAll(() => {
      bigPage = "<html>" + "<p>some text</p>\n".repeat(5000) + "</html>";
      manyDocs = "<html>x</html>".repeat(2500);
      notClosed = "<html>" + "x".repeat(5000);
      brokenClosers = "<html>" + "</html".repeat(1000) + "</html>";
      spaceTail = "<html></html>" + " ".repeat(5000) + "x";
      spaceHead = " ".repeat(5000) + "<html></html>";
      // short texts for the timing test: three valid ones, three invalid ones
      speed = [
        "<html>\n  Hello, world!\n</html>",
        "<html><p>123</p></html>",
        "  <html></html>\n",
        "<html>a</html><html>b</html>",
        "<htmx> Sounds cool? </htmx>",
        "<html>a</html></html>",
      ];
    });

    it("7️⃣.1️⃣ should accept a page of 5 000 lines fast", () => {
      const t0 = Date.now();
      const answer = f(bigPage);
      const elapsed = Date.now() - t0;
      expect(answer).toBe(true);
      expect(elapsed).toBeLessThan(1000);
    });

    it("7️⃣.2️⃣ should reject 2 500 documents in a row fast", () => {
      const t0 = Date.now();
      const answer = f(manyDocs);
      const elapsed = Date.now() - t0;
      expect(answer).toBe(false);
      expect(elapsed).toBeLessThan(1000);
    });

    it("7️⃣.3️⃣ should reject a long document that is not closed fast", () => {
      const t0 = Date.now();
      const answer = f(notClosed);
      const elapsed = Date.now() - t0;
      expect(answer).toBe(false);
      expect(elapsed).toBeLessThan(1000);
    });

    it("7️⃣.4️⃣ should accept a text with 1 000 broken closing tags fast", () => {
      const t0 = Date.now();
      const answer = f(brokenClosers);
      const elapsed = Date.now() - t0;
      expect(answer).toBe(true);
      expect(elapsed).toBeLessThan(1000);
    });

    it("7️⃣.5️⃣ should handle 5 000 spaces around the document fast", () => {
      const t0 = Date.now();
      const answers = [f(spaceTail), f(spaceHead)];
      const elapsed = Date.now() - t0;
      expect(answers).toEqual([false, true]);
      expect(elapsed).toBeLessThan(1000);
    });

    // The timing test: most of the spec's run time is spent here, so STRICT mode compares the player's
    // function with the reference one on exactly this work (20 000 calls on short texts).
    it("7️⃣.6️⃣ should stay fast on a lot of short texts", () => {
      let valid = 0;
      for (let i = 0; i < 3000; i++) {
        for (let j = 0; j < speed.length; j++) {
          if (f(speed[j])) valid++;
        }
      }
      expect(valid).toBe(3000 * 3);
    });
  });
});
