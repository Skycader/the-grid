r = require("./ex23.js");

console.log(r);

const f = (text) => {
  return text.replace(r, "l*l");
};
describe("Regexp 10", () => {
  it("Test case for ex10", () => {
    expect(f("lol lal lil lel lol lul")).toBe("lol l*l l*l l*l lol l*l");
  });
});
