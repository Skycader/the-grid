/* Ex32
 * 🎖CERTIFIED 2026-10-23
 * Extract the "clean" targets of a text: a word of Latin letters wrapped in the SAME punctuation mark on
 * both sides. f(text) returns an array of the words, without the marks.
 *
 * Example:
 *   "#danger! *missile* @fake@ &target# #non_2_valid#"  →  ["missile", "fake"]
 *
 * Scope:
 *   ✓ any ASCII punctuation mark (24 of them: ! " # % & ' ( ) * , - . / : ; ? @ [ \ ] _ { }) and the
 *     non-ASCII ones (§ ¶ ¿ ¡ « » “ ” ‘ ’ „ … • – — 。 、) work as the mark, when it is the same on both sides
 *   ✓ two different marks (#danger!, &target#), the two halves of a bracket pair ((word) [word] {word} «word»)
 *     and a mark on one side only are not a target
 *   ✓ the word is only letters A-Z a-z in any case, at least one; a digit, an underscore, a hyphen, a space, a
 *     dot, an apostrophe or any other character inside makes it not a target; the case is kept in the answer
 *   ✓ several targets: in the order of the text, repeats are kept, on one line, on several lines, next to each other
 *   ✓ [] for a text without targets and for an empty text; the answer is an array of strings
 *   ✓ speed: the timing test (8.5) searches short texts again and again — the solution is compared
 *     with the reference one by STRICT mode
 *   ✗ not pinned: symbols that are not punctuation in Unicode ($ + < = > ^ ` | ~) as the mark, words of other
 *     alphabets (#привет#), a target that shares a mark with the next one (*a*b*), letters glued to the mark
 *     from the outside (x*word*y)
 *
 * Difficulty: ★★★★★☆☆☆☆☆ (5/10)
 */

const f = require("./ex32.js");

describe(":: Running test case for EX32 (clean targets)", () => {
  // ==========================================
  // 1️⃣ BASIC
  // ==========================================
  describe("1️⃣ Basic", () => {
    it("1️⃣.1️⃣ should match the example from the task", () => {
      expect(f("#danger! *missile* @fake@ &target# #non_2_valid#")).toEqual(["missile", "fake"]);
    });

    it("1️⃣.2️⃣ should capture clean targets and ignore traps with numbers", () => {
      expect(f("#danger# %dummy1% *missile* @fake99@ &intercept& !shadow77!")).toEqual(["danger", "missile", "intercept"]);
    });

    it("1️⃣.3️⃣ should ignore targets with digits in any position", () => {
      expect(f("*1danger* #missile2# @t3rget@ &clean&")).toEqual(["clean"]);
    });

    it("1️⃣.4️⃣ should ignore targets with internal spaces or underscores", () => {
      expect(f("#broken target# *target_one* !valid!")).toEqual(["valid"]);
    });

    it("1️⃣.5️⃣ should return an array of strings", () => {
      const found = f("*word*");
      expect(Array.isArray(found)).toBe(true);
      expect(typeof found[0]).toBe("string");
    });
  });

  // ==========================================
  // 2️⃣ THE ASCII MARKS
  // ==========================================
  // One row = one word in one kind of mark. Why these rows: all 24 ASCII punctuation marks. The marks
  // such as _ and - are the traps of a class like [^\w\s].
  describe("2️⃣ The ASCII marks", () => {
    const marks = "!\"#%&'()*,-./:;?@[\\]_{}".split("").map((m) => [`${m}word${m}`, ["word"]]);

    it.each(marks)("2️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toEqual(expected);
    });
  });

  // ==========================================
  // 3️⃣ THE NON-ASCII MARKS
  // ==========================================
  // One row = one word in one kind of mark. Why these rows: all the punctuation of Unicode counts.
  describe("3️⃣ The non-ASCII marks", () => {
    const marks = ["§", "¶", "¿", "¡", "«", "»", "“", "”", "‘", "’", "„", "…", "•", "–", "—", "。", "、"].map((m) => [`${m}rocket${m}`, ["rocket"]]);

    it.each(marks)("3️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toEqual(expected);
    });

    it("3️⃣.2️⃣ should handle various punctuation markers in one text", () => {
      expect(f("§rocket§ ¿alpha¿ ¡bravo!")).toEqual(["rocket", "alpha"]);
    });
  });

  // ==========================================
  // 4️⃣ THE MARKS MUST BE THE SAME
  // ==========================================
  // One row = one text that has no target. Why these rows: two different marks, the halves of a bracket pair,
  // a mark on one side only.
  describe("4️⃣ The marks must be the same", () => {
    const rows = [
      ["#danger!", []],
      ["&target#", []],
      ["!word?", []],
      ["*word#", []],
      ["(word)", []],
      ["[word]", []],
      ["{word}", []],
      ["«word»", []],
      ["“word”", []],
      ["‘word’", []],
      ["¿word?", []],
      ["¡word!", []],
      ["*word", []],
      ["word*", []],
      ["*word ", []],
      [" word*", []],
      ["word", []],
      ["*", []],
      ["**", []],
      ["*word* #word", ["word"]],
    ];

    it.each(rows)("4️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toEqual(expected);
    });

    it("4️⃣.2️⃣ should find the symmetric target and skip the others in one text", () => {
      expect(f("#danger! *missile* @fake@ &target#")).toEqual(["missile", "fake"]);
    });
  });

  // ==========================================
  // 5️⃣ THE WORD
  // ==========================================
  // One row = one text and what is found. Why these rows: only letters, any case, at least one; every other
  // character inside the marks spoils the target.
  describe("5️⃣ The word", () => {
    const rows = [
      ["*danger*", ["danger"]],
      ["*DANGER*", ["DANGER"]],
      ["*Missile*", ["Missile"]],
      ["*aBcDeF*", ["aBcDeF"]],
      ["*a*", ["a"]],
      ["*Z*", ["Z"]],
      ["*abcdefghijklmnopqrstuvwxyz*", ["abcdefghijklmnopqrstuvwxyz"]],
      ["*ABCDEFGHIJKLMNOPQRSTUVWXYZ*", ["ABCDEFGHIJKLMNOPQRSTUVWXYZ"]],
      ["*word1*", []],
      ["*1word*", []],
      ["*wo2rd*", []],
      ["*123*", []],
      ["*0*", []],
      ["*non_2_valid*", []],
      ["*non_valid*", []],
      ["*_word*", []],
      ["*word_*", []],
      ["*two-words*", []],
      ["*two words*", []],
      ["* word*", []],
      ["*word *", []],
      ["*it's*", []],
      ["*a.b*", []],
      ["*a,b*", []],
      ["*a\tb*", []],
      ["*a\nb*", []],
      ["*wo$rd*", []],
      ["*wo+rd*", []],
      ["*wo@rd*", []],
      ["**", []],
      ["***", []],
    ];

    it.each(rows)("5️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toEqual(expected);
    });
  });

  // ==========================================
  // 6️⃣ SEVERAL TARGETS
  // ==========================================
  describe("6️⃣ Several targets", () => {
    it("6️⃣.1️⃣ should find ALL the targets, not just the first one", () => {
      expect(f("*a* *b* *c*")).toEqual(["a", "b", "c"]);
    });

    it("6️⃣.2️⃣ should keep the order of the text", () => {
      expect(f("#zulu# *alpha* @mike@")).toEqual(["zulu", "alpha", "mike"]);
    });

    it("6️⃣.3️⃣ should keep the repeats", () => {
      expect(f("*a* *a* #a#")).toEqual(["a", "a", "a"]);
    });

    it("6️⃣.4️⃣ should find targets that stand next to each other", () => {
      expect(f("*a**b*")).toEqual(["a", "b"]);
      expect(f("*a*,*b*")).toEqual(["a", "b"]);
    });

    it("6️⃣.5️⃣ should find targets on several lines", () => {
      expect(f("*a*\n#b#\r\n@c@\t&d&")).toEqual(["a", "b", "c", "d"]);
    });

    it("6️⃣.6️⃣ should find targets of different marks in a sentence", () => {
      expect(f("The enemy has #danger# and *missile* and [no] things, but 'fake' ones too.")).toEqual(["danger", "missile", "fake"]);
    });

    it("6️⃣.7️⃣ should find a target at the very start and at the very end", () => {
      expect(f("*first* in the middle *last*")).toEqual(["first", "last"]);
    });

    it("6️⃣.8️⃣ should pick the clean targets among the dirty ones", () => {
      expect(f("*ok* *n0* #bad! *ok2* @good@ _no_ -yes-")).toEqual(["ok", "good", "no", "yes"]);
    });
  });

  // ==========================================
  // 7️⃣ EDGE CASES
  // ==========================================
  describe("7️⃣ Edge cases", () => {
    it("7️⃣.1️⃣ should return [] for an empty text", () => {
      expect(f("")).toEqual([]);
    });

    it("7️⃣.2️⃣ should return [] for a text without targets", () => {
      expect(f("no targets here")).toEqual([]);
      expect(f("!!! $$$ %123%")).toEqual([]);
      expect(f("  \n\t ")).toEqual([]);
    });

    it("7️⃣.3️⃣ should return an array, not null, when nothing is found", () => {
      expect(Array.isArray(f("nothing"))).toBe(true);
    });

    it("7️⃣.4️⃣ should give the same answer when it is called again", () => {
      expect(f("*a* #b#")).toEqual(["a", "b"]);
      expect(f("*a* #b#")).toEqual(["a", "b"]);
      expect(f("none")).toEqual([]);
      expect(f("*a* #b#")).toEqual(["a", "b"]);
    });
  });

  // ==========================================
  // 8️⃣ PERFORMANCE
  // ==========================================
  describe("8️⃣ Performance", () => {
    let many;
    let unclosed;
    let longWord;
    let noise;
    let speed;

    beforeAll(() => {
      many = "*word* ".repeat(2500);
      unclosed = "*" + "a".repeat(5000);
      longWord = "*" + "a".repeat(5000) + "*";
      noise = "!@#%&".repeat(1000);
      speed = [
        "#danger! *missile* @fake@ &target# #non_2_valid#",
        "#danger# %dummy1% *missile* @fake99@ &intercept& !shadow77!",
        "§rocket§ ¿alpha¿ ¡bravo!",
        "#broken target# *target_one* #two-words# (word) [word]",
        "Hello world",
      ];
    });

    it("8️⃣.1️⃣ should find 2 500 targets correctly and fast", () => {
      const t0 = Date.now();
      const found = f(many);
      const elapsed = Date.now() - t0;
      expect(found.filter((w) => w !== "word").slice(0, 2)).toEqual([]);
      expect(found.length).toBe(2500);
      expect(elapsed).toBeLessThan(1000);
    });

    it("8️⃣.2️⃣ should reject a long word without the closing mark fast", () => {
      const t0 = Date.now();
      const found = f(unclosed);
      const elapsed = Date.now() - t0;
      expect(found).toEqual([]);
      expect(elapsed).toBeLessThan(1000);
    });

    it("8️⃣.3️⃣ should take a target of 5 000 letters fast", () => {
      const t0 = Date.now();
      const found = f(longWord);
      const elapsed = Date.now() - t0;
      expect(found.length).toBe(1);
      expect(found[0].length).toBe(5000);
      expect(elapsed).toBeLessThan(1000);
    });

    it("8️⃣.4️⃣ should handle a long noise of marks fast", () => {
      const t0 = Date.now();
      const found = f(noise);
      const elapsed = Date.now() - t0;
      expect(found).toEqual([]);
      expect(elapsed).toBeLessThan(1000);
    });

    // The timing test: most of the spec's run time is spent here, so STRICT mode compares the player's
    // function with the reference one on exactly this work (3 000 searches in short texts).
    it("8️⃣.5️⃣ should stay fast on a lot of short texts", () => {
      let total = 0;
      for (let i = 0; i < 600; i++) {
        for (let j = 0; j < speed.length; j++) total += f(speed[j]).length;
      }
      expect(total).toBe(600 * 7);
    });
  });
});
