f = require('./ex2.js');

describe('Regexp', () => {
  it('Test case for ex2', () => {
    expect(f('Mr. and Mrs. Lucky')).toBe(' and  Lucky');
  });
});
