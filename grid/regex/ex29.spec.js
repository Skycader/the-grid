const f = require("./ex29.js");

describe(":: Test case EX29 — regex date extraction", () => {
  it("should find valid dates in standard text", () => {
    const text = `
      Alan: 22/04/2001;
      Max: 01/08/2005;
      Rachel: 55/22/3333;
    `;
    const result = ["22/04/2001", "01/08/2005"];
    expect(f(text)).toEqual(result);
  });

  it("should ignore clearly invalid day or month numbers", () => {
    const text = `
      00/01/2020;
      32/12/1999;
      15/13/2020;
      12/00/2000;
      10/10/2010;
    `;
    const result = ["10/10/2010"];
    expect(f(text)).toEqual(result);
  });

  it("should find multiple dates in one line", () => {
    const text = "Dates: 01/01/2000 02/02/2022 33/03/2022 12/12/2012";
    const result = ["01/01/2000", "02/02/2022", "12/12/2012"];
    expect(f(text)).toEqual(result);
  });

  it("should return an empty array if no dates match the pattern", () => {
    const text = "No dates here: 2020/01/01, 1/1/2020, 99/99/9999.";
    expect(f(text)).toEqual([]);
  });

  it("should handle messy spacing and punctuation", () => {
    const text = `
      John:03/03/2003, Mary - 09/09/1999; Tim=30/11/2010!
    `;
    const result = ["03/03/2003", "09/09/1999", "30/11/2010"];
    expect(f(text)).toEqual(result);
  });
});
