f = require('./ex10.js');

describe('Regexp 10', () => {
  it('Test case for ex10', () => {
    expect(f('lol lal lil lel lol lul')).toBe(
      'lol l*l l*l l*l lol l*l',
    );
  });
});
