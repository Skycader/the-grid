const f = require("./ex22.js");
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

describe("running test for ex22", () => {
  it("should repalce all b tags with BTAG", () => {
    expect(f(text)).toBe(expected);
  });
});
