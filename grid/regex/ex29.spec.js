/* Ex29
 * 🎖CERTIFIED 2026-10-22
 * Find all the correct dates in format DD/MM/YYYY: f(text) returns them as an array of strings,
 * in the order of the text.
 * A correct date: day 01-31, month 01-12 (two digits each), a year of four digits, "/" between.
 *
 * Example:
 *   "Alan: 22/04/2001; Max: 01/08/2005; Rachel: 55/22/3333;"  →  ["22/04/2001", "01/08/2005"]
 *
 * Scope:
 *   ✓ every day 01-31 is accepted and 00, 32-99 are not; every month 01-12 is accepted and 00, 13-99 are not
 *   ✓ two digits for the day and the month ("1/1/2020" is not a date), four digits for the year
 *   ✓ only "/" separates: "-", ".", a space, a backslash and the order YYYY/MM/DD are not the format
 *   ✓ a date is a whole word: a letter or a digit glued to it makes it not a date
 *   ✓ punctuation, brackets, quotes, tabs and new lines around a date are fine
 *   ✓ several dates in a text (one line, several lines): in order, repeats are kept, wrong ones skipped
 *   ✓ the answer is an array of strings, [] (not null) when there are none, the same when called again
 *   ✓ speed: the timing test (8.6) searches short texts again and again — the solution is compared
 *     with the reference one by STRICT mode
 *   ✗ not pinned: the length of the month and leap years (31/02/2001, 29/02/2001), the year 0000,
 *     a date glued by "/" to other numbers (01/01/2000/12), letters of other scripts around a date
 *
 * Difficulty: ★★★★★★☆☆☆☆ (6/10)
 */

const solution = require("./ex29.js");

// null is turned into [], so a function that returns null for "nothing found" is caught once, by the
// test of the empty answer (7.4), and does not turn every other test red
const f = (text) => solution(text) || [];

// "DD/05/2020" for every day / "15/MM/2020" for every month: one row = one text and its answer
const dayRows = (days, ok) => days.map((d) => [`${d}/05/2020`, ok ? [`${d}/05/2020`] : []]);
const monthRows = (months, ok) => months.map((m) => [`15/${m}/2020`, ok ? [`15/${m}/2020`] : []]);

describe(":: Running test case for EX29 (dates DD/MM/YYYY)", () => {
  // ==========================================
  // 1️⃣ BASIC
  // ==========================================
  describe("1️⃣ Basic", () => {
    it("1️⃣.1️⃣ should match the example from the task", () => {
      const text = `
      Alan: 22/04/2001;
      Max: 01/08/2005;
      Rachel: 55/22/3333;
    `;
      expect(f(text)).toEqual(["22/04/2001", "01/08/2005"]);
    });

    it("1️⃣.2️⃣ should find several dates in one line", () => {
      expect(f("Dates: 01/01/2000 02/02/2022 33/03/2022 12/12/2012")).toEqual(["01/01/2000", "02/02/2022", "12/12/2012"]);
    });

    it("1️⃣.3️⃣ should return the whole dates as strings, not the parts of them", () => {
      const found = f("on 15/06/2024 we met");
      expect(found).toEqual(["15/06/2024"]);
      expect(typeof found[0]).toBe("string");
    });
  });

  // ==========================================
  // 2️⃣ DAYS
  // ==========================================
  // One row = one text with a day. Why these rows: the first and the last day of every ten (01, 09, 10, 19,
  // 20, 29, 30, 31) catch a day range that is off by one; 00 and 32-99 must stay out.
  describe("2️⃣ Days", () => {
    const valid = dayRows(["01", "02", "09", "10", "11", "19", "20", "21", "29", "30", "31"], true);
    const invalid = dayRows(["00", "32", "33", "39", "40", "49", "50", "55", "60", "90", "99"], false);

    it.each(valid)("2️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toEqual(expected);
    });

    it.each(invalid)("2️⃣.2️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toEqual(expected);
    });
  });

  // ==========================================
  // 3️⃣ MONTHS
  // ==========================================
  // One row = one text with a month. Why these rows: 09 / 10 and 12 / 13 are the edges of the month ranges.
  describe("3️⃣ Months", () => {
    const valid = monthRows(["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"], true);
    const invalid = monthRows(["00", "13", "14", "19", "20", "30", "31", "99"], false);

    it.each(valid)("3️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toEqual(expected);
    });

    it.each(invalid)("3️⃣.2️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toEqual(expected);
    });
  });

  // ==========================================
  // 4️⃣ YEARS AND THE FORMAT
  // ==========================================
  // One row = one text and its answer. Why these rows: the year has exactly four digits, the day and the
  // month exactly two, the separator is "/" and the order is DD/MM/YYYY.
  describe("4️⃣ Years and the format", () => {
    const formats = [
      ["01/01/1000", ["01/01/1000"]],
      ["01/01/1970", ["01/01/1970"]],
      ["31/12/9999", ["31/12/9999"]],
      ["01/01/20", []],
      ["01/01/200", []],
      ["01/01/20000", []],
      ["01/01/", []],
      ["1/1/2020", []],
      ["1/01/2020", []],
      ["01/1/2020", []],
      ["001/01/2020", []],
      ["01/001/2020", []],
      ["2020/01/01", []],
      ["2020/31/12", []],
      ["01-01-2000", []],
      ["01.01.2000", []],
      ["01 01 2000", []],
      ["01\\01\\2000", []],
      ["01/01-2000", []],
      ["01-01/2000", []],
      ["01012000", []],
      ["//", []],
    ];

    it.each(formats)("4️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toEqual(expected);
    });
  });

  // ==========================================
  // 5️⃣ WHAT STANDS AROUND A DATE
  // ==========================================
  // One row = one text and its answer. Why these rows: a date is a whole word. Punctuation and spaces around
  // it are fine; a letter, a digit or "_" glued to it make it not a date (a regex without the word boundaries
  // finds a date inside "101/01/2000" and "01/01/20001").
  describe("5️⃣ Around a date", () => {
    const around = [
      ["(01/01/2000)", ["01/01/2000"]],
      ["[01/01/2000]", ["01/01/2000"]],
      ['"01/01/2000"', ["01/01/2000"]],
      ["01/01/2000.", ["01/01/2000"]],
      ["01/01/2000,", ["01/01/2000"]],
      ["01/01/2000;", ["01/01/2000"]],
      ["John:03/03/2003", ["03/03/2003"]],
      ["Tim=30/11/2010!", ["30/11/2010"]],
      ["date-01/01/2000", ["01/01/2000"]],
      ["\t01/01/2000\t", ["01/01/2000"]],
      ["\n01/01/2000\n", ["01/01/2000"]],
      ["\r\n01/01/2000\r\n", ["01/01/2000"]],
      ["a01/01/2000", []],
      ["01/01/2000a", []],
      ["x01/01/2000y", []],
      ["_01/01/2000", []],
      ["01/01/2000_", []],
      ["101/01/2000", []],
      ["01/01/20001", []],
      ["1201/01/2000", []],
      ["01/01/200012", []],
    ];

    it.each(around)("5️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toEqual(expected);
    });
  });

  // ==========================================
  // 6️⃣ SEVERAL DATES IN A TEXT
  // ==========================================
  describe("6️⃣ Several dates", () => {
    it("6️⃣.1️⃣ should skip the wrong dates and keep the right ones", () => {
      const text = `
      00/01/2020;
      32/12/1999;
      15/13/2020;
      12/00/2000;
      10/10/2010;
    `;
      expect(f(text)).toEqual(["10/10/2010"]);
    });

    it("6️⃣.2️⃣ should find dates with messy spacing and punctuation", () => {
      const text = `
      John:03/03/2003, Mary - 09/09/1999; Tim=30/11/2010!
    `;
      expect(f(text)).toEqual(["03/03/2003", "09/09/1999", "30/11/2010"]);
    });

    it("6️⃣.3️⃣ should keep the order of the text, not the order of the dates", () => {
      expect(f("31/12/2020 01/01/2000 15/06/1999")).toEqual(["31/12/2020", "01/01/2000", "15/06/1999"]);
    });

    it("6️⃣.4️⃣ should keep the repeats", () => {
      expect(f("01/01/2000, 01/01/2000 and 01/01/2000")).toEqual(["01/01/2000", "01/01/2000", "01/01/2000"]);
    });

    it("6️⃣.5️⃣ should find dates that are separated by one punctuation mark only", () => {
      expect(f("01/01/2000,02/02/2002;03/03/2003.04/04/2004")).toEqual(["01/01/2000", "02/02/2002", "03/03/2003", "04/04/2004"]);
    });

    it("6️⃣.6️⃣ should find dates on several lines", () => {
      expect(f("start: 01/02/2003\nend: 04/05/2006\r\nlast:\t07/08/2009")).toEqual(["01/02/2003", "04/05/2006", "07/08/2009"]);
    });

    it("6️⃣.7️⃣ should find the right dates among wrong ones of every kind", () => {
      const text = "1/1/2020 | 99/99/9999 | 2020/01/01 | 05/05/2005 | 01-01-2001 | a07/07/2007 | 12/12/2012 | 31/13/2013";
      expect(f(text)).toEqual(["05/05/2005", "12/12/2012"]);
    });
  });

  // ==========================================
  // 7️⃣ EDGE CASES AND THE ANSWER
  // ==========================================
  describe("7️⃣ Edge cases and the answer", () => {
    it("7️⃣.1️⃣ should return an empty array for an empty text", () => {
      expect(f("")).toEqual([]);
    });

    it("7️⃣.2️⃣ should return an empty array for a text without dates", () => {
      expect(f("No dates here: 2020/01/01, 1/1/2020, 99/99/9999.")).toEqual([]);
      expect(f("  \n\t ")).toEqual([]);
      expect(f("just words / and / slashes")).toEqual([]);
    });

    it("7️⃣.3️⃣ should return an array", () => {
      expect(Array.isArray(solution("01/01/2000"))).toBe(true);
      expect(Array.isArray(solution("x"))).toBe(true);
    });

    it("7️⃣.4️⃣ should return an empty array, not null, when nothing is found", () => {
      expect(solution("no dates")).toEqual([]);
    });

    it("7️⃣.5️⃣ should give the same answer when it is called again", () => {
      const text = "01/01/2000 and 02/02/2002";
      expect(f(text)).toEqual(["01/01/2000", "02/02/2002"]);
      expect(f(text)).toEqual(["01/01/2000", "02/02/2002"]);
      expect(f("none")).toEqual([]);
      expect(f(text)).toEqual(["01/01/2000", "02/02/2002"]);
    });
  });

  // ==========================================
  // 8️⃣ PERFORMANCE
  // ==========================================
  describe("8️⃣ Performance", () => {
    let dates;
    let wrongDates;
    let digits;
    let slashes;
    let glued;
    let speed;

    beforeAll(() => {
      dates = "15/06/2024 ".repeat(5000);
      wrongDates = "99/99/9999 ".repeat(5000);
      digits = "1".repeat(5000);
      slashes = "12/".repeat(1700);
      glued = "a01/01/2000 ".repeat(4000);
      // short texts for the timing test: right dates, wrong dates, no dates
      speed = [
        "Alan: 22/04/2001; Max: 01/08/2005; Rachel: 55/22/3333;",
        "Dates: 01/01/2000 02/02/2022 33/03/2022 12/12/2012",
        "John:03/03/2003, Mary - 09/09/1999; Tim=30/11/2010!",
        "00/01/2020 32/12/1999 15/13/2020 12/00/2000",
        "1/1/2020 2020/01/01 01-01-2020 x01/01/2000",
        "No dates here, only words and numbers like 2024 and 31/12",
      ];
    });

    it("8️⃣.1️⃣ should find 5 000 dates correctly and fast", () => {
      const t0 = Date.now();
      const found = f(dates);
      const elapsed = Date.now() - t0;
      // not toEqual(the whole array): a row cuts long values. The first wrong items are shown instead.
      expect(found.filter((d) => d !== "15/06/2024").slice(0, 2)).toEqual([]);
      expect(found.length).toBe(5000);
      expect(elapsed).toBeLessThan(1000);
    });

    it("8️⃣.2️⃣ should reject 5 000 wrong dates fast", () => {
      const t0 = Date.now();
      const found = f(wrongDates);
      const elapsed = Date.now() - t0;
      expect(found).toEqual([]);
      expect(elapsed).toBeLessThan(1000);
    });

    it("8️⃣.3️⃣ should handle a number of 5 000 digits fast", () => {
      const t0 = Date.now();
      const found = f(digits);
      const elapsed = Date.now() - t0;
      expect(found).toEqual([]);
      expect(elapsed).toBeLessThan(1000);
    });

    it("8️⃣.4️⃣ should handle a long text of slashes fast", () => {
      const t0 = Date.now();
      const found = f(slashes);
      const elapsed = Date.now() - t0;
      expect(found).toEqual([]);
      expect(elapsed).toBeLessThan(1000);
    });

    it("8️⃣.5️⃣ should reject 4 000 dates glued to a letter fast", () => {
      const t0 = Date.now();
      const found = f(glued);
      const elapsed = Date.now() - t0;
      expect(found).toEqual([]);
      expect(elapsed).toBeLessThan(1000);
    });

    // The timing test: most of the spec's run time is spent here, so STRICT mode compares the player's
    // function with the reference one on exactly this work (about 18 000 searches in short texts).
    it("8️⃣.6️⃣ should stay fast on a lot of short texts", () => {
      let total = 0;
      for (let i = 0; i < 3000; i++) {
        for (let j = 0; j < speed.length; j++) {
          total += f(speed[j]).length;
        }
      }
      expect(total).toBe(3000 * 8);
    });
  });
});
