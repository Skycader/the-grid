/* Ex16
 * 🎖CERTIFIED 2026-10-23
 * Count all the comments of a piece of JS code, single line and multi line ones.
 * f(code) returns a number.
 *
 * Example:
 *   "// one\nconst a = 1; /* two *\/"  →  2
 *
 * Scope:
 *   ✓ a single line comment: // to the end of the line; on its own line, after code, after spaces and tabs
 *   ✓ a multi line comment: /* to the first star-slash; on one line or on many; empty, doc-style, with stars inside
 *   ✓ every comment counts once, however much is inside: // in a block comment and /* in a line comment
 *     do not start another comment; block comments do not nest
 *   ✓ several comments on one line, a comment at the very start and at the very end of the code
 *   ✓ a division, a regular expression literal and a lone / or * are not comments
 *   ✓ code without comments and an empty text give 0; the answer is a number
 *   ✓ speed: the timing test (7.6) counts in short pieces of code again and again — the solution is
 *     compared with the reference one by STRICT mode
 *   ✗ not pinned: comment-like text inside strings, template literals and regular expressions
 *     ('http://a.com'), an unclosed block comment that is followed by a line comment, \r alone as a line end
 *
 * Difficulty: ★★★★☆☆☆☆☆☆ (4/10)
 */

const f = require("./ex16.js");

describe(":: Running test case for EX16 (count JS comments)", () => {
  // ==========================================
  // 1️⃣ BASIC
  // ==========================================
  describe("1️⃣ Basic", () => {
    it("1️⃣.1️⃣ should match the example from the task code", () => {
      const code = `
/*
Importing many
many many things
*/

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


/*
Async function to bootstrap nestjs app
*/

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

//Choosing port for app
  await app.listen(3000);
}

//Bootstrapping app
bootstrap();
`;
      expect(f(code)).toBe(4);
    });

    it("1️⃣.2️⃣ should count a single line comment", () => {
      expect(f("// one")).toBe(1);
    });

    it("1️⃣.3️⃣ should count a multi line comment", () => {
      expect(f("/* one */")).toBe(1);
    });

    it("1️⃣.4️⃣ should always return a number", () => {
      expect(typeof f("// one")).toBe("number");
      expect(typeof f("")).toBe("number");
    });
  });

  // ==========================================
  // 2️⃣ SINGLE LINE COMMENTS
  // ==========================================
  // One row = one piece of code and the number of comments.
  describe("2️⃣ Single line comments", () => {
    const rows = [
      ["// one", 1],
      ["//one", 1],
      ["//", 1],
      ["///", 1],
      ["////////", 1],
      ["// one // two", 1],
      ["  // one", 1],
      ["\t// one", 1],
      ["const a = 1; // note", 1],
      ["const a = 1;// note", 1],
      ["// a\n// b", 2],
      ["// a\n// b\n// c", 3],
      ["// a\n\n// b\n\n\n// c", 3],
      ["// a\r\n// b\r\n", 2],
      ["x // a\ny // b\nz", 2],
      ["// /* not a block", 1],
      ["// */ not the end", 1],
      ["// // //", 1],
    ];

    it.each(rows)("2️⃣.1️⃣ %j → %j", (code, expected) => {
      expect(f(code)).toBe(expected);
    });
  });

  // ==========================================
  // 3️⃣ MULTI LINE COMMENTS
  // ==========================================
  // One row = one piece of code and the number of comments.
  describe("3️⃣ Multi line comments", () => {
    const rows = [
      ["/* one */", 1],
      ["/*one*/", 1],
      ["/**/", 1],
      ["/***/", 1],
      ["/** doc */", 1],
      ["/*\n many\n lines\n*/", 1],
      ["/*\r\n many\r\n lines\r\n*/", 1],
      ["/*\n * one\n * two\n */", 1],
      ["/* a // b */", 1],
      ["/* a\n// b\n*/", 1],
      ["/* 'quotes' \"here\" `too` */", 1],
      ["/* unicode: привет, мир 😀 */", 1],
      ["/* a * b / c */", 1],
      ["/* a /* b */ c */", 1],
      ["  /* one */", 1],
      ["const a = /* inside */ 1;", 1],
      ["foo(/* a */ 1, /* b */ 2)", 2],
      ["/* one */ /* two */", 2],
      ["/* one */\n/* two */\n/* three */", 3],
      ["/*/ star-slash inside */", 1],
    ];

    it.each(rows)("3️⃣.1️⃣ %j → %j", (code, expected) => {
      expect(f(code)).toBe(expected);
    });
  });

  // ==========================================
  // 4️⃣ BOTH KINDS TOGETHER
  // ==========================================
  describe("4️⃣ Both kinds together", () => {
    it("4️⃣.1️⃣ should count single line and multi line comments in one code", () => {
      expect(f("// one\n/* two */\n// three")).toBe(3);
    });

    it("4️⃣.2️⃣ should count a block comment and a line comment on one line", () => {
      expect(f("/* a */ // b")).toBe(2);
      expect(f("a /* b */ c // d")).toBe(2);
    });

    it("4️⃣.3️⃣ should count a comment that follows code and one that stands alone", () => {
      expect(f("const a = 1; // note\n/* about b */\nconst b = 2; /* inline */")).toBe(3);
    });

    it("4️⃣.4️⃣ should count a comment at the very start and at the very end", () => {
      expect(f("// first\ncode();\n// last")).toBe(2);
      expect(f("/* first */code();/* last */")).toBe(2);
    });

    it("4️⃣.5️⃣ should NOT count the // of a line comment that is inside of a block comment", () => {
      expect(f("/*\n// a\n// b\n// c\n*/")).toBe(1);
    });

    it("4️⃣.6️⃣ should NOT count the /* of a block comment that is inside of a line comment", () => {
      expect(f("// a /* b */ c")).toBe(1);
    });

    it("4️⃣.7️⃣ should stop a block comment at the first star-slash", () => {
      expect(f("/* a */ b */ // c")).toBe(2);
    });

    it("4️⃣.8️⃣ should count comments of a bigger piece of code", () => {
      const code = [
        "/**",
        " * Adds two numbers.",
        " */",
        "function add(a, b) {",
        "  // sum",
        "  return a + b; // result",
        "}",
        "",
        "/* usage */",
        "add(1, 2);",
      ].join("\n");
      expect(f(code)).toBe(4);
    });
  });

  // ==========================================
  // 5️⃣ NOT COMMENTS
  // ==========================================
  // One row = one piece of code without comments. Why these rows: a single slash or star is not a comment;
  // a regular expression literal and a division are code.
  describe("5️⃣ Not comments", () => {
    const rows = [
      ["const a = 1;", 0],
      ["const half = a / b;", 0],
      ["x = a / b / c;", 0],
      ["const r = /ab+c/g;", 0],
      ["const r = /a|b/;", 0],
      ["const s = a * b;", 0],
      ["a * /b/ * c", 0],
      ["a / * b", 0],
      ["a * / b", 0],
      ["/", 0],
      ["*", 0],
      ["*/", 0],
      ["/ /", 0],
      ["a /b/ c", 0],
      ["/* unclosed", 0],
      ["/* unclosed\nconst a = 1;", 0],
    ];

    it.each(rows)("5️⃣.1️⃣ %j → %j", (code, expected) => {
      expect(f(code)).toBe(expected);
    });
  });

  // ==========================================
  // 6️⃣ EDGE CASES
  // ==========================================
  describe("6️⃣ Edge cases", () => {
    it("6️⃣.1️⃣ should return 0 for an empty text", () => {
      expect(f("")).toBe(0);
    });

    it("6️⃣.2️⃣ should return 0 for a text of spaces and new lines", () => {
      expect(f("  \n\t\n ")).toBe(0);
    });

    it("6️⃣.3️⃣ should return 0 for code without comments", () => {
      expect(f("import x from 'x';\nexport default function () { return 1; }\n")).toBe(0);
    });

    it("6️⃣.4️⃣ should give the same answer when it is called again", () => {
      expect(f("// a\n/* b */")).toBe(2);
      expect(f("// a\n/* b */")).toBe(2);
      expect(f("none")).toBe(0);
      expect(f("// a\n/* b */")).toBe(2);
    });
  });

  // ==========================================
  // 7️⃣ PERFORMANCE
  // ==========================================
  describe("7️⃣ Performance", () => {
    let lines;
    let blocks;
    let longBlock;
    let unclosed;
    let slashes;
    let divisions;
    let speed;

    beforeAll(() => {
      lines = "x = 1; // note\n".repeat(5000);
      blocks = "/* note */ x = 1;\n".repeat(2500);
      longBlock = "/*" + "x".repeat(5000) + "*/";
      unclosed = "/*" + "x".repeat(5000);
      slashes = "/".repeat(5000);
      divisions = "a / b ".repeat(2500);
      speed = [
        "// one\nconst a = 1; /* two */",
        "/*\n many\n lines\n*/",
        "const half = a / b; const r = /ab+c/g;",
        "a /* b */ c // d",
        "/* a /* b */ c */",
        "const a = 1;",
      ];
    });

    it("7️⃣.1️⃣ should count 5 000 line comments correctly and fast", () => {
      const t0 = Date.now();
      const count = f(lines);
      const elapsed = Date.now() - t0;
      expect(count).toBe(5000);
      expect(elapsed).toBeLessThan(1000);
    });

    it("7️⃣.2️⃣ should count 2 500 block comments correctly and fast", () => {
      const t0 = Date.now();
      const count = f(blocks);
      const elapsed = Date.now() - t0;
      expect(count).toBe(2500);
      expect(elapsed).toBeLessThan(1000);
    });

    it("7️⃣.3️⃣ should count a block comment of 5 000 characters once, fast", () => {
      const t0 = Date.now();
      const count = f(longBlock);
      const elapsed = Date.now() - t0;
      expect(count).toBe(1);
      expect(elapsed).toBeLessThan(1000);
    });

    it("7️⃣.4️⃣ should count an unclosed block comment as 0, fast", () => {
      const t0 = Date.now();
      const count = f(unclosed);
      const elapsed = Date.now() - t0;
      expect(count).toBe(0);
      expect(elapsed).toBeLessThan(1000);
    });

    it("7️⃣.5️⃣ should handle a line of 5 000 slashes and 2 500 divisions fast", () => {
      const t0 = Date.now();
      const counts = [f(slashes), f(divisions)];
      const elapsed = Date.now() - t0;
      expect(counts).toEqual([1, 0]);
      expect(elapsed).toBeLessThan(1000);
    });

    // The timing test: most of the spec's run time is spent here, so STRICT mode compares the player's
    // function with the reference one on exactly this work (18 000 counts in short pieces of code).
    it("7️⃣.6️⃣ should stay fast on a lot of short pieces of code", () => {
      let total = 0;
      for (let i = 0; i < 3000; i++) {
        for (let j = 0; j < speed.length; j++) total += f(speed[j]);
      }
      expect(total).toBe(3000 * 6);
    });
  });
});
