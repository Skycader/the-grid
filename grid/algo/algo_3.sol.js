/*
 * Solution: algo_3 — Valid Palindrome
 */
const f = (s) => {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  return clean === clean.split('').reverse().join('');
};

module.exports = f;
