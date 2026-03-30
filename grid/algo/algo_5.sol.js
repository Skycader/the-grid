/*
 * Solution: algo_5 — Binary Search
 * Strategy: classic two-pointer approach, O(log n)
 */
const f = (nums, target) => {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
};

module.exports = f;
