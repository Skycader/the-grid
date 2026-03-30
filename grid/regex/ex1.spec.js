f = require('./ex1.js');

describe('Regexp', () => {
  it('Test case for ex1', () => {
    expect(f('There are no cat left. Cat is gone')).toBe(
      'There are no  left.  is gone',
    );
  });
});
