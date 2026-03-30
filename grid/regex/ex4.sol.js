/*
 * lel. lol lil. => l*l. lol l*l.
 */

const r = /l.l\./g;
const r2 = /l(o|i)l\./g;
const f = (text) => {
  return text.replace(r, 'l*l.');
};
module.exports = f;
