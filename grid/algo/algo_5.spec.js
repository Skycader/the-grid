f = require('./algo_5.js');

describe('Binary Search', () => {
  it('finds element in middle', () => {
    expect(f([-1, 0, 3, 5, 9, 12], 9)).toBe(4);
  });
  it('target not found → -1', () => {
    expect(f([-1, 0, 3, 5, 9, 12], 2)).toBe(-1);
  });
  it('finds first element', () => {
    expect(f([1, 3, 5, 7], 1)).toBe(0);
  });
  it('finds last element', () => {
    expect(f([1, 3, 5, 7], 7)).toBe(3);
  });
  it('single element array', () => {
    expect(f([5], 5)).toBe(0);
  });
});
