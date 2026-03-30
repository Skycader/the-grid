f = require('./ex4.js');

describe('Regexp', () => {
  it('Test case for ex4', () => {
    expect(f('lil. lol lel.')).toBe(
      'l*l. lol l*l.',
    );
  });
});
