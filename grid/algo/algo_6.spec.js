f = require('./algo_6.js');

describe('Valid Brackets', () => {
  it('empty string', () => {
    expect(f('')).toBe(true);
  });
  it('simple pair ()', () => {
    expect(f('()')).toBe(true);
  });
  it('all bracket types', () => {
    expect(f('()[]{}')).toBe(true);
  });
  it('nested brackets', () => {
    expect(f('{[()]}')).toBe(true);
  });
  it('wrong order', () => {
    expect(f('{[}]')).toBe(false);
  });
  it('unclosed bracket', () => {
    expect(f('(((')).toBe(false);
  });
});
