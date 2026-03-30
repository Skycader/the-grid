f = require('./algo_4.js');

describe('Max Subarray', () => {
  it('standard case', () => {
    expect(f([-2, 1, -3, 4, -1, 2, 1, -5, 4])).toBe(6);
  });
  it('all positive', () => {
    expect(f([1, 2, 3, 4])).toBe(10);
  });
  it('all negative — returns least negative', () => {
    expect(f([-3, -1, -2])).toBe(-1);
  });
  it('single element', () => {
    expect(f([42])).toBe(42);
  });
});
