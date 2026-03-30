f = require('./regex_5.js');

describe('Trim Extra Spaces', () => {
  it('collapses inner spaces', () => {
    expect(f('hello   world')).toBe('hello world');
  });
  it('trims leading', () => {
    expect(f('   hi')).toBe('hi');
  });
  it('trims trailing', () => {
    expect(f('hi   ')).toBe('hi');
  });
  it('mixed', () => {
    expect(f('  foo   bar  baz  ')).toBe('foo bar baz');
  });
});
