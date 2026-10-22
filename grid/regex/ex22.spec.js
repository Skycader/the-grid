/* Ex22
 * 🎖CERTIFIED 2026-10-23
 * Replace every <b>...</b> pair with BTAG: the tags and everything inside of them.
 * The pair is the exact lower case tags <b> and </b>; the closing tag is the nearest one.
 *
 * Example:
 *   "<b>Hello world</b>\n<b>Hello world and is wrong</b> <b>This</b>\nwow <b>world</b>"
 *     →  "BTAG\nBTAG BTAG\nwow BTAG"
 *
 * Scope:
 *   ✓ one pair, an empty pair, a pair with text, with other tags (<i>, <a href>), with a new line, tabs and
 *     any symbols inside
 *   ✓ several pairs in a text: each pair is replaced on its own, the text between the pairs stays (the
 *     closing tag is the nearest one, so two pairs do not merge into one)
 *   ✓ other tags (<br>, <body>, <bold>, <strong>, <i>) and the upper case <B> are not the pair
 *   ✓ a lonely <b> or </b>, an unclosed pair and a reversed pair (</b>...<b>) are left alone
 *   ✓ the answer is a string; a text without pairs and an empty text are unchanged
 *   ✓ speed: the timing test (6.5) replaces in short texts again and again — the solution is compared
 *     with the reference one by STRICT mode
 *   ✗ not pinned: a <b> inside of a <b> (nested pairs), tags with attributes (<b class="x">) or spaces
 *     (<b >), a pair across a text that has an unclosed <b> before it
 *
 * Difficulty: ★★★★★☆☆☆☆☆ (5/10)
 */

const f = require("./ex22.js");

describe(":: Running test case for EX22 (replace <b> tags with BTAG)", () => {
  // ==========================================
  // 1️⃣ BASIC
  // ==========================================
  describe("1️⃣ Basic", () => {
    it("1️⃣.1️⃣ should match the example from the task", () => {
      const text = `
<b>Hello world</b>
<b>Hello world and is wrong</b> <b>This</b>
wow <b>world</b>
`;
      const expected = `
BTAG
BTAG BTAG
wow BTAG
`;
      expect(f(text)).toBe(expected);
    });

    it("1️⃣.2️⃣ should replace one pair together with its text", () => {
      expect(f("<b>Hello world</b>")).toBe("BTAG");
    });

    it("1️⃣.3️⃣ should always return a string", () => {
      expect(typeof f("<b>x</b>")).toBe("string");
      expect(typeof f("")).toBe("string");
    });
  });

  // ==========================================
  // 2️⃣ WHAT IS INSIDE A PAIR
  // ==========================================
  // One row = one text and its answer. Why these rows: everything between the tags goes away with them,
  // however long, however strange.
  describe("2️⃣ What is inside a pair", () => {
    const rows = [
      ["<b></b>", "BTAG"],
      ["<b> </b>", "BTAG"],
      ["<b>x</b>", "BTAG"],
      ["<b>Hello world</b>", "BTAG"],
      ["<b>one <i>two</i> three</b>", "BTAG"],
      ["<b><i>x</i></b>", "BTAG"],
      ['<b><a href="https://a.com">link</a></b>', "BTAG"],
      ["<b>one\ntwo</b>", "BTAG"],
      ["<b>one\r\ntwo\r\nthree</b>", "BTAG"],
      ["<b>\n\n</b>", "BTAG"],
      ["<b>\ttab</b>", "BTAG"],
      ["<b>12345 !@#$%^&*()</b>", "BTAG"],
      ["<b>привет, мир 😀</b>", "BTAG"],
      ["<b>a < b > c</b>", "BTAG"],
      ["<b>BTAG</b>", "BTAG"],
      ["<b><br></b>", "BTAG"],
      ["<b>/b</b>", "BTAG"],
      ["<b></B></b>", "BTAG"],
    ];

    it.each(rows)("2️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 3️⃣ SEVERAL PAIRS
  // ==========================================
  // One row = one text and its answer. Why these rows: the closing tag is the nearest one; a greedy
  // regex takes everything from the first <b> to the last </b> and eats the text between the pairs.
  describe("3️⃣ Several pairs", () => {
    const rows = [
      ["<b>a</b> <b>b</b>", "BTAG BTAG"],
      ["<b>a</b><b>b</b>", "BTAGBTAG"],
      ["<b>a</b> and <b>b</b>", "BTAG and BTAG"],
      ["<b>a</b> x <b>b</b> y <b>c</b>", "BTAG x BTAG y BTAG"],
      ["start <b>a</b> middle <b>b</b> end", "start BTAG middle BTAG end"],
      ["<b>a</b>\n<b>b</b>", "BTAG\nBTAG"],
      ["<b>a</b>\r\ntext\r\n<b>b</b>", "BTAG\r\ntext\r\nBTAG"],
      ["<b>a\nb</b> text <b>c\nd</b>", "BTAG text BTAG"],
      ["<b>a</b> <i>x</i> <b>b</b>", "BTAG <i>x</i> BTAG"],
      ["<p><b>a</b></p>", "<p>BTAG</p>"],
      ["<p>one <b>two</b> three</p>", "<p>one BTAG three</p>"],
      ["<b>a</b><b>b</b><b>c</b><b>d</b>", "BTAGBTAGBTAGBTAG"],
    ];

    it.each(rows)("3️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 4️⃣ NOT THE PAIR
  // ==========================================
  // One row = one text that must stay as it is.
  describe("4️⃣ Not the pair", () => {
    const rows = [
      ["<br>", "<br>"],
      ["<body>x</body>", "<body>x</body>"],
      ["<bold>x</bold>", "<bold>x</bold>"],
      ["<strong>x</strong>", "<strong>x</strong>"],
      ["<i>x</i>", "<i>x</i>"],
      ["<B>x</B>", "<B>x</B>"],
      ["<b/>", "<b/>"],
      ["<b>", "<b>"],
      ["</b>", "</b>"],
      ["<b>x", "<b>x"],
      ["x</b>", "x</b>"],
      ["<b>x</b", "<b>x</b"],
      ["<b>x<b>", "<b>x<b>"],
      ["</b>x<b>", "</b>x<b>"],
      ["b>x</b>", "b>x</b>"],
      ["<b x</b>", "<b x</b>"],
      ["< b>x</b>", "< b>x</b>"],
      ["<b>x< /b>", "<b>x< /b>"],
      ["b", "b"],
      ["BTAG", "BTAG"],
    ];

    it.each(rows)("4️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toBe(expected);
    });

    it("4️⃣.2️⃣ should replace the pair and keep a stray closing tag in front of it", () => {
      expect(f("</b><b>x</b>")).toBe("</b>BTAG");
    });

    it("4️⃣.3️⃣ should replace the pair and keep other tags that look like it", () => {
      expect(f("<br> <b>x</b> <body> <bold>")).toBe("<br> BTAG <body> <bold>");
    });

    it("4️⃣.4️⃣ should replace the pair and keep a lonely closing tag after it", () => {
      expect(f("<b>x</b></b>")).toBe("BTAG</b>");
    });
  });

  // ==========================================
  // 5️⃣ EDGE CASES
  // ==========================================
  describe("5️⃣ Edge cases", () => {
    it("5️⃣.1️⃣ should return an empty string for an empty input", () => {
      expect(f("")).toBe("");
    });

    it("5️⃣.2️⃣ should return the text unchanged when there are no pairs", () => {
      const text = "Hello world. Nothing to replace here.";
      expect(f(text)).toBe(text);
    });

    it("5️⃣.3️⃣ should give the same answer when it is called again", () => {
      expect(f("<b>x</b>")).toBe("BTAG");
      expect(f("<b>x</b>")).toBe("BTAG");
    });
  });

  // ==========================================
  // 6️⃣ PERFORMANCE
  // ==========================================
  describe("6️⃣ Performance", () => {
    let pairs;
    let longInside;
    let unclosed;
    let manyOpen;
    let speed;

    beforeAll(() => {
      pairs = "<b>word</b> ".repeat(5000);
      longInside = "<b>" + "x\n".repeat(2500) + "</b>";
      unclosed = "<b>" + "x".repeat(5000);
      manyOpen = "<b>x".repeat(800);
      speed = [
        "<b>Hello world</b>\n<b>Hello world and is wrong</b> <b>This</b>\nwow <b>world</b>",
        "<b>one <i>two</i> three</b>",
        "<br> <body> <strong>x</strong> <b>",
        "<b>x</b></b>",
        "Hello world",
      ];
    });

    it("6️⃣.1️⃣ should replace 5 000 pairs correctly and fast", () => {
      const t0 = Date.now();
      const result = f(pairs);
      const elapsed = Date.now() - t0;
      expect(result === "BTAG ".repeat(5000)).toBe(true);
      expect(elapsed).toBeLessThan(1000);
    });

    it("6️⃣.2️⃣ should replace a pair with 5 000 characters inside fast", () => {
      const t0 = Date.now();
      const result = f(longInside);
      const elapsed = Date.now() - t0;
      expect(result).toBe("BTAG");
      expect(elapsed).toBeLessThan(1000);
    });

    it("6️⃣.3️⃣ should leave a long unclosed pair as it is, fast", () => {
      const t0 = Date.now();
      const result = f(unclosed);
      const elapsed = Date.now() - t0;
      expect(result === unclosed).toBe(true);
      expect(elapsed).toBeLessThan(1000);
    });

    it("6️⃣.4️⃣ should leave 800 unclosed <b> as they are, fast", () => {
      const t0 = Date.now();
      const result = f(manyOpen);
      const elapsed = Date.now() - t0;
      expect(result === manyOpen).toBe(true);
      expect(elapsed).toBeLessThan(1000);
    });

    // The timing test: most of the spec's run time is spent here, so STRICT mode compares the player's
    // function with the reference one on exactly this work (15 000 replacements in short texts).
    it("6️⃣.5️⃣ should stay fast on a lot of short texts", () => {
      let total = 0;
      for (let i = 0; i < 3000; i++) {
        for (let j = 0; j < speed.length; j++) total += f(speed[j]).length;
      }
      expect(total).toBe(3000 * 80);
    });
  });
});
