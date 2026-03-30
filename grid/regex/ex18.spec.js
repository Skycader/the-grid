f = require('./ex18.js');

const text = `
192.168.92.102
1.1.1.1
0.0.0.0
23.23.23.4.
55.16.43.21.56
92.132.46.312.63.46.1.23.5
92.132.46.312.63.46.1.23.5.3456634
92.132.46.312.63.46.1.23.5.345
2.2.2
90.10.20.50.10.23
`;

const text2 = `
0.0.0
1.1.1
`;

describe('it should find all ip addresses', () => {
  it('should find all special ip addresses', () => {
    expect(f(text)).toBe(7);
  });
  it('should return 0 if found none', () => {
    expect(f(text2)).toBe(0);
  });
});
