const f = require("./ex19.js");

describe("test for ex19", () => {
  it("should allow only correct ascii password", () => {
    expect(f("asciipassword")).toBe(true);
    expect(f("12345")).toBe(true);
    expect(f("$Raxon123_")).toBe(true);
  });

  it("should allow only correct ascii password with some additional symbols", () => {
    expect(f("ascii-password")).toBe(true);
  });

  it("should not allow non ascii password", () => {
    expect(f("пароль")).toBe(false);
    expect(f("очень!сложный!пароль!")).toBe(false);
    expect(f("мудамуда!")).toBe(false);
  });

  it("should work correctly with wrong passwords", () => {
    expect(f(" $Raxon123_")).toBe(false);
    expect(f(" $Raxon123_ ")).toBe(false);
    expect(f(" $Raxon 123_ ")).toBe(false);
  });
});
