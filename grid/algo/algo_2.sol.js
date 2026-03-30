/*
 * Solution: algo_2 — Fibonacci
 * Strategy: iterative, O(n) time, O(1) space
 */
const f = (n) => {
  if (n <= 1) return n;
  let [a, b] = [0, 1];
  for (let i = 2; i <= n; i++) [a, b] = [b, a + b];
  return b;
};

module.exports = f;
