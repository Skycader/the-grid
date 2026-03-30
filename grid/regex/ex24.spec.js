const f = require("./ex24.js");

describe("Running test cases for ex24", () => {
  it("should transform format 1 to digits only", () => {
    expect(f("+7 923 168 59 41")).toBe("79231685941");
  });

  it("should transform format 2 to digits only", () => {
    expect(f("+7 (923) 168 59-41")).toBe("79231685941");
  });
});
