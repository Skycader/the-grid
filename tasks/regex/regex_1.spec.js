f = require("./regex_1.js");
describe("Remove cat", () => {
  it("removes lowercase cat", () => {
    expect(f("There is a cat here")).toBe("There is a  here");
  });
  it("removes uppercase Cat", () => {
    expect(f("Cat is gone")).toBe(" is gone");
  });
  it("full sentence", () => {
    expect(f("There are no cat left. Cat is gone")).toBe(
      "There are no  left.  is gone",
    );
  });
  it("no cats — unchanged", () => {
    expect(f("Hello world")).toBe("Hello world");
  });
});
