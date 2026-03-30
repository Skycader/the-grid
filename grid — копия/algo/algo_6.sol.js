/*
 * Solution: algo_6 — Valid Brackets
 * Strategy: stack, O(n) time, O(n) space
 */
const f = (s) => {
  const pairs = { ')': '(', ']': '[', '}': '{' };
  const stack = [];
  for (const c of s) {
    if ('([{'.includes(c)) stack.push(c);
    else if (stack.pop() !== pairs[c]) return false;
  }
  return stack.length === 0;
};

module.exports = f;
