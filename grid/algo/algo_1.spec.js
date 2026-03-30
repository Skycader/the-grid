f = require('./algo_1.js');

describe('Two Sum', () => {
  it('[2,7,11,15] target=9 → [0,1]', () => {
    expect(f([2, 7, 11, 15], 9)).toEqual([0, 1]);
  });
  it('[3,2,4] target=6 → [1,2]', () => {
    expect(f([3, 2, 4], 6)).toEqual([1, 2]);
  });
  it('[3,3] target=6 → [0,1]', () => {
    expect(f([3, 3], 6)).toEqual([0, 1]);
  });
  it('negatives', () => {
    expect(f([-1, -2, -3, -4, -5], -8)).toEqual([2, 4]);
  });
});
