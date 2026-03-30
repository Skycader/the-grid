const f = require('./ex21.js');
const text = `
aqua astra mom text roar
car level map
`;

const text2 = `
dynomite bobr
`;
describe('test for ex21, testing backreference', () => {
  it('should find and count all the required words', () => {
    expect(f(text)).toBe(6);
  });
  it('should work fine with zero income', () => {
    expect(f(text2)).toBe(0);
  });
});
