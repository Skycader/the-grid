const f = require("./ex11.js");

describe("Regexp 11", () => {
  it("[1] Basic case", () => {
    const text = `1: $1.00
2: $2.00
3: $3.00
10: $25.15
15: $36.19
200: $550.16
500: $680.92
1001: $1000.00
1500: $2000.20
10001: $990.20`;
    expect(f(text)).toBe(5);
  });

  it("[2] No values >= 100", () => {
    const text = `1: $1.00
2: $2.00
3: $3.00`;
    expect(f(text)).toBe(0);
  });

  it("[3] Edge case: exactly 100", () => {
    const text = `1: $99.99
2: $100.00
3: $100.01`;
    expect(f(text)).toBe(2);
  });

  it("[4] Leading zeroes should NOT affect value", () => {
    const text = `1: $00100.00
2: $00099.99
3: $0100
4: $0000101.50`;
    expect(f(text)).toBe(3);
  });

  it("[5] Mixed normal and leading zeroes", () => {
    const text = `1: $100
2: $00100
3: $099.99
4: $000
5: $0101`;
    expect(f(text)).toBe(3);
  });

  it("[6] Ignores invalid lines", () => {
    const text = `1: $100.00
invalid line
2: $abc
3: 100.00
4: $150.00`;
    expect(f(text)).toBe(2);
  });

  it("[7] Handles empty input", () => {
    expect(f("")).toBe(0);
  });

  it("[8] Large numbers with leading zeroes", () => {
    const text = `1: $000000100.00
2: $000000099.99
3: $000001000.00`;
    expect(f(text)).toBe(2);
  });
});
