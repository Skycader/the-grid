const r = require("./ex28.js");

const f = (text) => r.test(text);

describe("Running test cases for ex25", () => {
  it("...running test case #1", () => {
    expect(f("$MySup3erHard0Pass0wor0d")).toBe(true);
  });

  it("...running test case #2", () => {
    expect(f("MySuperHardPassword")).toBe(false);
  });

  it("...running test case #3", () => {
    expect(f("$mysuperhardpassword")).toBe(false);
  });

  it("...running test case #4", () => {
    expect(f("$$$MMMoney")).toBe(false);
  });

  it("...running test case #5", () => {
    expect(f("$TooShort3000")).toBe(false);
  });

  it("...running test case #6", () => {
    expect(f("$SpaceBarsAre Forbidden")).toBe(false);
  });
});
