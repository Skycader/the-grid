f = require("./ex9.js");

describe("Regexp", () => {
  it("Test case for ex9", () => {
    expect(
      f(
        `The most imprtant part\nIs to be yourself\nA true hero doesn't wear a cape\nThe world needs us\nYou may know the The article`,
      ),
    ).toBe(2);
  });
});
