/*
 * Solution: regex_3 — Replace Numbers
 */
const r = /\d+/g;

const f = (text) => text.replace(r, '#');

module.exports = f;
