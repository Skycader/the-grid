f = require('./algo_3.js');

describe('Valid Palindrome', () => {
  it('classic phrase', () => {
    expect(f('A man, a plan, a canal: Panama')).toBe(true);
  });
  it('not a palindrome', () => {
    expect(f('race a car')).toBe(false);
  });
  it('empty string', () => {
    expect(f('')).toBe(true);
  });
  it('single character', () => {
    expect(f('a')).toBe(true);
  });
  it('numeric palindrome', () => {
    expect(f('12321')).toBe(true);
  });
});
