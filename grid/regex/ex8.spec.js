f = require('./ex8.js');

describe('Regexp', () => {
  it('Test case for ex8 #1', () => {
    expect(f(`I love you xoxo`)).toBe(
      true,
    );
  });

  it('Test case for ex8 #2', () => {
    expect(f(`I love you xoxoxo`)).toBe(
      true,
    );
  });

  it('Test case for ex8 #3', () => {
    expect(f(`I love you xo`)).toBe(
      false,
    );
  });
});
