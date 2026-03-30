/*
 * Solution: regex_1 — Remove "cat"
 */
const r = /cat/gi;

const f = (text) => text.replace(r, '');

module.exports = f;
