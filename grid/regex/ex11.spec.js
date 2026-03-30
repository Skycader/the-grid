f = require('./ex11.js');

const text = `
1: $1.00
2: $2.00
3: $3.00
10: $25.15
15: $36.19
200: $550.16
500: $680.92
1001: $1000.00
1500: $2000.20
10001: $990.20
`;

const text2 = `
1: $1.00
2: $2.00
3: $3.00
`;
describe('Regexp 11', () => {
  it('Test case for ex11', () => {
    expect(f(text)).toBe(5);
  });
  it('Test case for ex11 test2', () => {
    expect(f(text2)).toBe(0);
  });
});
