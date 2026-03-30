f = require("./ex15.js");

const valid1 = `
<html>
  Hello, world!
</html>
`;

const invalid1 = `
<html>
Here goes html 1
</html>
<html>
And also in the same file html 2
</html>
`;

const invalid2 = `
<htmx> Sounds cool? </htmx>
`;

const valid2 = `
<html>
<p>123</p>
</html>
`;

const invalid3 = `
<html>Is a lot of fun</html></html>
`;

describe("Regexp 15", () => {
  it("Test case for ex15 #1", () => {
    expect(f(valid1)).toBe(true);
  });
  it("Test case for ex15 #2", () => {
    expect(f(valid2)).toBe(true);
  });
  it("Test case for ex15 #3", () => {
    expect(f(invalid1)).toBe(false);
  });
  it("Test case for ex15 #4", () => {
    expect(f(invalid2)).toBe(false);
  });
  it("Test case for ex15 #5", () => {
    expect(f(invalid3)).toBe(false);
  });
});
