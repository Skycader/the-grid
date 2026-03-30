f = require('./ex5.js');

describe('Regexp', () => {
  it('Test case for ex5', () => {
    expect(f(`Jane's cat and Mike's rat and Naomi's dog and Alex's cat and John's dog`)).toBe(
      3,
    );
  });
});
