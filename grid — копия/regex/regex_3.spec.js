f = require('./regex_3.js');

describe('Replace Numbers', () => {
  it('single digit', () => {
    expect(f('abc 5 def')).toBe('abc # def');
  });
  it('multi-digit', () => {
    expect(f('price 123 qty 4')).toBe('price # qty #');
  });
  it('no numbers', () => {
    expect(f('hello')).toBe('hello');
  });
  it('mixed', () => {
    expect(f('Room 404: Error 200')).toBe('Room #: Error #');
  });
});
