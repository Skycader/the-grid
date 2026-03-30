const [r1, r2, r3] = require("./ex25.js");

const text1 = `
AGX: $23.50
TTX: $54.30
ARG: $90.00
`;

const f1 = (text) => text.match(r1);

const text2 = "<title>Website title</title>";
const f2 = (text) => text.match(r2);

const text3 = `
  https://wikipedia.org
  http://website.ru
  ftp://aloga.top
`;
const f3 = (text) => text.match(r3);

describe("Running test cases for ex25", () => {
  it("test cast for task 1", () => {
    expect(f1(text1)).toEqual(["23.50", "54.30", "90.00"]);
  });

  it("test case for task 2", () => {
    expect(f2(text2)).toEqual(["Website title"]);
  });

  it("test case for task 3", () => {
    expect(f3(text3)).toEqual(["https", "http", "ftp"]);
  });
});
