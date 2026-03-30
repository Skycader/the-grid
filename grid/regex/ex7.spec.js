f = require('./ex7.js');

describe('Regexp', () => {
  it('Test case for ex7', () => {
    expect(f(`The cat and the dog and a rat`)).toBe(
      'a cat and a dog and a rat',
    );
  });
});
