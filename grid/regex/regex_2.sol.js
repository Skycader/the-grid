/*
 * Solution: regex_2 — Extract Emails
 */
const r = /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g;

const f = (text) => text.match(r) || [];

module.exports = f;
