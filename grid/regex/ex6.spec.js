f = require('./ex6.js');

describe('Regexp', () => {
  it('Test case for ex6', () => {
    expect(f(`THEstring1234567890`)).toBe(
      'string6789',
    );
  });
});
