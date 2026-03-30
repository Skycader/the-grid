/*
 * Solution: regex_4 — camelCase → snake_case
 */
const f = (str) =>
  str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');

module.exports = f;
