/* Ex30
 * 🎖CERTIFIED 2026-10-23
 * Find all the strings of a text that could be good passwords. f(text) returns an array.
 * A password is a whole run of the characters A-Z a-z 0-9 and ! @ # $ % ^ & *; any other character
 * (a space, a comma, a dot, a hyphen, a bracket...) ends it. It is good when it has at least 8 characters,
 * a capital letter, a lower case letter, a digit and one of ! @ # $ % ^ & *.
 *
 * Example:
 *   "Password: P@ssw0rd!; another one is Pass#1234."  →  ["P@ssw0rd!", "Pass#1234"]
 *
 * Scope:
 *   ✓ each rule on its own: no capital, no lower case letter, no digit, no symbol of the list, shorter than
 *     8 characters — the run is not a password
 *   ✓ the length border: 7 characters is not enough, 8 is; there is no upper limit
 *   ✓ every one of the 8 symbols ! @ # $ % ^ & * counts; the other symbols (- _ + = . , ? ~ ...) are not
 *     in the list and end the run
 *   ✓ the password is the whole run: it is not cut and nothing that stands next to it (punctuation,
 *     brackets, quotes) is taken
 *   ✓ a space, a tab or a new line ends a run; passwords are returned in the order of the text, repeats are kept
 *   ✓ [] for a text without passwords and for an empty text
 *   ✓ speed: the timing test (8.5) searches short texts again and again — the solution is compared
 *     with the reference one by STRICT mode
 *   ✗ not pinned: letters of other alphabets next to a password (ПарольP@ssw0rd1), digits of other scripts
 *
 * Difficulty: ★★★★★★★★★☆ (9/10)
 */

const f = require("./ex30.js");

describe(":: Running test case for EX30 (find the passwords)", () => {
  // ==========================================
  // 1️⃣ BASIC
  // ==========================================
  describe("1️⃣ Basic", () => {
    it("1️⃣.1️⃣ should find all the correct passwords in the text", () => {
      const text =
        "My passwords: pass123, Strong#Pass123, weak, StrongPass123#, P@ssw0rd!, HelloWorld, 12345678!, aB3#4567, passWORD123#, #Qwerty123, Small#1, SHORT#1a";
      expect(f(text)).toEqual(["Strong#Pass123", "StrongPass123#", "P@ssw0rd!", "aB3#4567", "passWORD123#", "#Qwerty123", "SHORT#1a"]);
    });

    it("1️⃣.2️⃣ should find several passwords in one line", () => {
      expect(f("Try these: XyZ#1234 Abc#1234 Strong#Pass123")).toEqual(["XyZ#1234", "Abc#1234", "Strong#Pass123"]);
    });

    it("1️⃣.3️⃣ should handle punctuation and boundaries correctly", () => {
      expect(f("Password: P@ssw0rd!; another one is Pass#1234.")).toEqual(["P@ssw0rd!", "Pass#1234"]);
    });

    it("1️⃣.4️⃣ should return an array of strings", () => {
      const found = f("P@ssw0rd!");
      expect(Array.isArray(found)).toBe(true);
      expect(typeof found[0]).toBe("string");
    });
  });

  // ==========================================
  // 2️⃣ ONE RULE BROKEN AT A TIME
  // ==========================================
  // One row = one word and what is found in it. Why these rows: each one breaks exactly one rule (or none),
  // so a regex that forgets one lookahead is caught by its own row.
  describe("2️⃣ One rule broken at a time", () => {
    const rows = [
      ["Abcdef1!", ["Abcdef1!"]], // everything is fine
      ["abcdef1!", []], // no capital
      ["ABCDEF1!", []], // no lower case
      ["Abcdefg!", []], // no digit
      ["Abcdefg1", []], // no symbol
      ["12345678", []],
      ["!!!!!!!!", []],
      ["Abcdefgh", []],
      ["abcdefgh", []],
      ["ABCDEFGH", []],
      ["passwords", []],
      ["StrongPass", []],
      ["pass123", []],
      ["12345678!", []],
      ["Abc1!", []],
      ["1!Aa1!Aa", ["1!Aa1!Aa"]],
      ["aA1!aA1!", ["aA1!aA1!"]],
      ["!1aA!1aA", ["!1aA!1aA"]],
    ];

    it.each(rows)("2️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toEqual(expected);
    });
  });

  // ==========================================
  // 3️⃣ THE LENGTH
  // ==========================================
  // One row = one word and what is found in it. Why these rows: 8 is the least that is enough.
  describe("3️⃣ The length", () => {
    const rows = [
      ["Aa1!", []],
      ["Aa1!x", []],
      ["Aa1!xx", []],
      ["Aa1!xxx", []],
      ["Aa1!xxxx", ["Aa1!xxxx"]],
      ["Aa1!xxxxx", ["Aa1!xxxxx"]],
      ["Aa1!xxxxxxxxxxxxxxxx", ["Aa1!xxxxxxxxxxxxxxxx"]],
      ["Small#1", []],
      ["SHORT#1a", ["SHORT#1a"]],
    ];

    it.each(rows)("3️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toEqual(expected);
    });

    it("3️⃣.2️⃣ should take a very long password as one", () => {
      const long = "Aa1!" + "x".repeat(996);
      expect(f(long)).toEqual([long]);
    });
  });

  // ==========================================
  // 4️⃣ THE SYMBOLS
  // ==========================================
  // One row = one word and what is found in it. Why these rows: each of the 8 symbols is the only symbol of
  // the password; the other symbols are not in the list.
  describe("4️⃣ The symbols", () => {
    const listed = "!@#$%^&*".split("").map((s) => [`Abcdef1${s}`, [`Abcdef1${s}`]]);
    const others = "-_+=.,?~`'\"/\\:;()[]{}<>|".split("").map((s) => [`Abcdef1${s}`, []]);

    it.each(listed)("4️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toEqual(expected);
    });

    it.each(others)("4️⃣.2️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toEqual(expected);
    });

    it("4️⃣.3️⃣ should NOT take a hyphen or an underscore for a part of a password", () => {
      expect(f("Strong-Pass1!")).toEqual([]);
      expect(f("Strong_Pass1!")).toEqual([]);
    });
  });

  // ==========================================
  // 5️⃣ BOUNDARIES
  // ==========================================
  // One row = one text and what is found in it. Why these rows: the password is the whole run, without the
  // punctuation next to it.
  describe("5️⃣ Boundaries", () => {
    const rows = [
      ["(P@ssw0rd!)", ["P@ssw0rd!"]],
      ["[P@ssw0rd!]", ["P@ssw0rd!"]],
      ['"P@ssw0rd!"', ["P@ssw0rd!"]],
      ["'P@ssw0rd!'", ["P@ssw0rd!"]],
      ["P@ssw0rd!.", ["P@ssw0rd!"]],
      ["P@ssw0rd!,", ["P@ssw0rd!"]],
      ["P@ssw0rd!;", ["P@ssw0rd!"]],
      ["pass: P@ssw0rd!", ["P@ssw0rd!"]],
      ["pass=P@ssw0rd!", ["P@ssw0rd!"]],
      ["pass-P@ssw0rd!", ["P@ssw0rd!"]],
      ["x\tP@ssw0rd!\ty", ["P@ssw0rd!"]],
      ["x\nP@ssw0rd!\ny", ["P@ssw0rd!"]],
      ["x\r\nP@ssw0rd!\r\ny", ["P@ssw0rd!"]],
      ["P@ssw0rd!,Pass#1234", ["P@ssw0rd!", "Pass#1234"]],
      ["P@ssw0rd!-Pass#1234", ["P@ssw0rd!", "Pass#1234"]],
      ["P@ssw0rd! Pass#1234", ["P@ssw0rd!", "Pass#1234"]],
      ["Pass#1234 Pass#1234", ["Pass#1234", "Pass#1234"]],
      ["Abcdefgh1,!", []], // the symbol stands after the comma: it is not in the run
      ["Abcdefgh!,1", []], // the digit stands after the comma
      ["abcdefgh1!,A", []], // the capital stands after the comma
      ["1!,Abcdefgh", []],
    ];

    it.each(rows)("5️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toEqual(expected);
    });
  });

  // ==========================================
  // 6️⃣ SPACES
  // ==========================================
  // One row = one text that has no password: a space cuts what would be a password into short pieces.
  describe("6️⃣ Spaces", () => {
    const rows = [
      ["P@ss w0rd!", []],
      ["Pass#12 34", []],
      ["Stron gPass1", []],
      ["P@ssw0 rd!", []],
      ["Pass #1234", []],
      ["Pass# 1234", []],
      ["Pass#1234 ", ["Pass#1234"]],
      [" Pass#1234", ["Pass#1234"]],
      ["Aa1! xxxxxxxx", []],
      ["A a 1 ! x x x x x x x x", []],
      ["Pass\t#1234", []],
      ["Pass\n#1234", []],
    ];

    it.each(rows)("6️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toEqual(expected);
    });

    it("6️⃣.2️⃣ should not cross spaces or punctuation boundaries", () => {
      expect(f("Invalid combos: P@ss w0rd!, Pass#12 34, Stron gPass1")).toEqual([]);
    });
  });

  // ==========================================
  // 7️⃣ SEVERAL PASSWORDS AND THE ANSWER
  // ==========================================
  describe("7️⃣ Several passwords and the answer", () => {
    it("7️⃣.1️⃣ should keep the order of the text", () => {
      expect(f("zZ9!zzzz aA1@aaaa mM5#mmmm")).toEqual(["zZ9!zzzz", "aA1@aaaa", "mM5#mmmm"]);
    });

    it("7️⃣.2️⃣ should find passwords on several lines", () => {
      expect(f("login: a\npass: Abcdef1!\nlogin: b\npass: Qwerty1@")).toEqual(["Abcdef1!", "Qwerty1@"]);
    });

    it("7️⃣.3️⃣ should return [] for a text without passwords", () => {
      expect(f("noValidPasswordsHere!")).toEqual([]);
      expect(f("Just a sentence, nothing special: 123.")).toEqual([]);
    });

    it("7️⃣.4️⃣ should return [] for an empty text and for spaces", () => {
      expect(f("")).toEqual([]);
      expect(f("   \n\t ")).toEqual([]);
    });

    it("7️⃣.5️⃣ should return an array, not null, when nothing is found", () => {
      expect(Array.isArray(f("nothing"))).toBe(true);
    });

    it("7️⃣.6️⃣ should give the same answer when it is called again", () => {
      const text = "P@ssw0rd! and Pass#1234";
      expect(f(text)).toEqual(["P@ssw0rd!", "Pass#1234"]);
      expect(f(text)).toEqual(["P@ssw0rd!", "Pass#1234"]);
      expect(f("none")).toEqual([]);
      expect(f(text)).toEqual(["P@ssw0rd!", "Pass#1234"]);
    });
  });

  // ==========================================
  // 8️⃣ PERFORMANCE
  // ==========================================
  describe("8️⃣ Performance", () => {
    let many;
    let longPassword;
    let longWeak;
    let nearMiss;
    let speed;

    beforeAll(() => {
      many = "P@ssw0rd! ".repeat(2000);
      longPassword = "Aa1!" + "x".repeat(4996);
      longWeak = "a1!" + "x".repeat(4997);
      nearMiss = "Abcdefg1 ".repeat(2000);
      speed = [
        "My passwords: pass123, Strong#Pass123, weak, P@ssw0rd!",
        "Password: P@ssw0rd!; another one is Pass#1234.",
        "XyZ#1234 Abc#1234",
        "P@ss w0rd!, Pass#12 34, Small#1",
        "HelloWorld 12345678! Abcdefg1 Strong-Pass1!",
        "Hello world",
      ];
    });

    it("8️⃣.1️⃣ should find 2 000 passwords correctly and fast", () => {
      const t0 = Date.now();
      const found = f(many);
      const elapsed = Date.now() - t0;
      expect(found.filter((p) => p !== "P@ssw0rd!").slice(0, 2)).toEqual([]);
      expect(found.length).toBe(2000);
      expect(elapsed).toBeLessThan(1000);
    });

    it("8️⃣.2️⃣ should take a password of 5 000 characters as one, fast", () => {
      const t0 = Date.now();
      const found = f(longPassword);
      const elapsed = Date.now() - t0;
      expect(found.length).toBe(1);
      expect(found[0].length).toBe(5000);
      expect(elapsed).toBeLessThan(1000);
    });

    it("8️⃣.3️⃣ should reject a long word without a capital fast", () => {
      const t0 = Date.now();
      const found = f(longWeak);
      const elapsed = Date.now() - t0;
      expect(found).toEqual([]);
      expect(elapsed).toBeLessThan(1000);
    });

    it("8️⃣.4️⃣ should reject 2 000 words that miss a symbol fast", () => {
      const t0 = Date.now();
      const found = f(nearMiss);
      const elapsed = Date.now() - t0;
      expect(found).toEqual([]);
      expect(elapsed).toBeLessThan(1000);
    });

    // The timing test: most of the spec's run time is spent here, so STRICT mode compares the player's
    // function with the reference one on exactly this work (6 000 searches in short texts).
    it("8️⃣.5️⃣ should stay fast on a lot of short texts", () => {
      let total = 0;
      for (let i = 0; i < 1000; i++) {
        for (let j = 0; j < speed.length; j++) total += f(speed[j]).length;
      }
      expect(total).toBe(1000 * 6);
    });
  });
});
