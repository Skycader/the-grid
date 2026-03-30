const r = require("./ex26.js");

const text = "I paid $30 for 30 apples and 80 oranges";
const f = (text) => text.match(r);

describe("Running test cases for ex25", () => {
  it("test cast for task 1", () => {
    expect(f(text)).toEqual(["30", "80"]);
  });
});
