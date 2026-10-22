/* Ex3
 * 🎖CERTIFIED 2026-10-23
 * Replace every Google, Goooogle, goooooooooooogle with Yandex.
 * The name is a G, two or more o, then "gle"; the case does not matter.
 *
 * Example:
 *   "Google Gooooooogle Gogle goooooooooooogle Yandex Googl"  →  "Yandex Yandex Gogle Yandex Yandex Googl"
 *
 * Scope:
 *   ✓ two or more o: Google, Gooogle, Goooooooooogle (one o is not the name)
 *   ✓ every case: google, GOOGLE, GoOgLe
 *   ✓ every occurrence in a text, not only the first; punctuation, new lines and tabs around stay as they are
 *   ✓ look-alikes are left alone (Gogle, Go gle, Googl, Goog1e, Cyrillic о instead of o)
 *   ✓ the answer is a string; a text without the name and an empty text stay as they are
 *   ✓ speed: the timing test (7.4) replaces in short texts again and again — the solution is compared
 *     with the reference one by STRICT mode
 *   ✗ not pinned: the name glued to other letters (MyGoogle, Googled)
 *
 * Difficulty: ★★☆☆☆☆☆☆☆☆ (2/10)
 */

const f = require("./ex3.js");

describe(":: Running test case for EX3 (replace Google with Yandex)", () => {
  // ==========================================
  // 1️⃣ BASIC
  // ==========================================
  describe("1️⃣ Basic", () => {
    it("1️⃣.1️⃣ should match the example from the task", () => {
      expect(f("Google Gooooooogle Gogle goooooooooooogle Yandex Googl")).toBe("Yandex Yandex Gogle Yandex Yandex Googl");
    });

    it("1️⃣.2️⃣ should replace the name when it is the whole text", () => {
      expect(f("Google")).toBe("Yandex");
    });

    it("1️⃣.3️⃣ should always return a string", () => {
      expect(typeof f("Google")).toBe("string");
      expect(typeof f("")).toBe("string");
    });
  });

  // ==========================================
  // 2️⃣ THE NUMBER OF o
  // ==========================================
  // One row = one text and its answer. Why these rows: two o is the minimum, there is no maximum.
  describe("2️⃣ The number of o", () => {
    const rows = [
      ["Google", "Yandex"],
      ["Gooogle", "Yandex"],
      ["Goooogle", "Yandex"],
      ["Gooooooooogle", "Yandex"],
      ["goooooooooooogle", "Yandex"],
      ["Gogle", "Gogle"],
      ["Ggle", "Ggle"],
      ["Googl", "Googl"],
      ["Gooogl", "Gooogl"],
      ["oogle", "oogle"],
      ["Goole", "Goole"],
      ["Goolge", "Goolge"],
    ];

    it.each(rows)("2️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 3️⃣ CASE
  // ==========================================
  // One row = one text and its answer. Why these rows: the name is found in any case, a regex without
  // the `i` flag only knows Google.
  describe("3️⃣ Case", () => {
    const rows = [
      ["google", "Yandex"],
      ["GOOGLE", "Yandex"],
      ["GoOgLe", "Yandex"],
      ["gOOGLE", "Yandex"],
      ["GooGLE", "Yandex"],
      ["goooogle", "Yandex"],
      ["GOOOOGLE", "Yandex"],
      ["Yandex", "Yandex"],
      ["yandex", "yandex"],
    ];

    it.each(rows)("3️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 4️⃣ SEVERAL NAMES AND THE SURROUNDINGS
  // ==========================================
  describe("4️⃣ Several names and the surroundings", () => {
    it("4️⃣.1️⃣ should replace ALL the names, not just the first one", () => {
      expect(f("Google Google Google")).toBe("Yandex Yandex Yandex");
    });

    it("4️⃣.2️⃣ should replace the names of different length and case in one text", () => {
      expect(f("Google, Goooogle; GOOOGLE! google?")).toBe("Yandex, Yandex; Yandex! Yandex?");
    });

    it("4️⃣.3️⃣ should keep the punctuation around the name", () => {
      expect(f("(Google) 'Google' \"Google\" Google.com")).toBe("(Yandex) 'Yandex' \"Yandex\" Yandex.com");
    });

    it("4️⃣.4️⃣ should keep new lines and tabs", () => {
      expect(f("Google\nGoogle\tGoogle\r\nGoogle")).toBe("Yandex\nYandex\tYandex\r\nYandex");
    });

    it("4️⃣.5️⃣ should replace the name at the very start and the very end", () => {
      expect(f("Google is not Gooogle")).toBe("Yandex is not Yandex");
    });

    it("4️⃣.6️⃣ should keep the rest of a sentence", () => {
      expect(f("Search in GOOGLE, not in Bing")).toBe("Search in Yandex, not in Bing");
    });
  });

  // ==========================================
  // 5️⃣ LOOK-ALIKES
  // ==========================================
  // One row = one text that must stay as it is.
  describe("5️⃣ Look-alikes", () => {
    const rows = [
      ["Gogle", "Gogle"],
      ["Go gle", "Go gle"],
      ["Goo gle", "Goo gle"],
      ["Go-ogle", "Go-ogle"],
      ["Gxogle", "Gxogle"],
      ["G ogle", "G ogle"],
      ["Go0gle", "Go0gle"],
      ["Goog1e", "Goog1e"],
      ["Googie", "Googie"],
      ["Gооgle", "Gооgle"], // Cyrillic «о»
      ["Bing", "Bing"],
      ["gle", "gle"],
      ["oooogle", "oooogle"],
    ];

    it.each(rows)("5️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 6️⃣ EDGE CASES
  // ==========================================
  describe("6️⃣ Edge cases", () => {
    it("6️⃣.1️⃣ should return an empty string for an empty input", () => {
      expect(f("")).toBe("");
    });

    it("6️⃣.2️⃣ should return the text unchanged when there is no name", () => {
      const text = "Hello world. Nothing to replace here.";
      expect(f(text)).toBe(text);
    });

    it("6️⃣.3️⃣ should give the same answer when it is called again", () => {
      expect(f("Google")).toBe("Yandex");
      expect(f("Google")).toBe("Yandex");
    });
  });

  // ==========================================
  // 7️⃣ PERFORMANCE
  // ==========================================
  describe("7️⃣ Performance", () => {
    let names;
    let longName;
    let noEnd;
    let speed;

    beforeAll(() => {
      names = "Google ".repeat(5000);
      longName = "G" + "o".repeat(5000) + "gle";
      noEnd = "Go".repeat(2500) + "G" + "o".repeat(2500);
      speed = ["Google Gooooooogle Gogle goooooooooooogle Yandex Googl", "Search in GOOGLE, not in Bing", "google.com", "Gogle Go gle Googl", "Hello world"];
    });

    it("7️⃣.1️⃣ should replace 5 000 names correctly and fast", () => {
      const t0 = Date.now();
      const result = f(names);
      const elapsed = Date.now() - t0;
      expect(result).toBe("Yandex ".repeat(5000));
      expect(elapsed).toBeLessThan(1000);
    });

    it("7️⃣.2️⃣ should replace a name of 5 000 o fast", () => {
      const t0 = Date.now();
      const result = f(longName);
      const elapsed = Date.now() - t0;
      expect(result).toBe("Yandex");
      expect(elapsed).toBeLessThan(1000);
    });

    it("7️⃣.3️⃣ should leave a long text of o without the ending as it is, fast", () => {
      const t0 = Date.now();
      const result = f(noEnd);
      const elapsed = Date.now() - t0;
      expect(result === noEnd).toBe(true);
      expect(elapsed).toBeLessThan(1000);
    });

    // The timing test: most of the spec's run time is spent here, so STRICT mode compares the player's
    // function with the reference one on exactly this work (about 15 000 replacements in short texts).
    it("7️⃣.4️⃣ should stay fast on a lot of short texts", () => {
      let total = 0;
      for (let i = 0; i < 3000; i++) {
        for (let j = 0; j < speed.length; j++) total += f(speed[j]).length;
      }
      expect(total).toBe(3000 * 107);
    });
  });
});
