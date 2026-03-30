/*
 * Find all lol words like lel lil lal and change them to l*l but don't change lol itself
 */

const r = /l([a-n]|[p-z])l/gi;
const f = (text) => {
  return text.replace(r, 'l*l');
};
module.exports = f;
