/*
 * Solution: algo_4 — Maximum Subarray
 * Strategy: Kadane's algorithm, O(n) time, O(1) space
 */
const f = (nums) => {
  let max = nums[0];
  let cur = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]);
    max = Math.max(max, cur);
  }
  return max;
};

module.exports = f;
