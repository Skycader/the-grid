/**
 * Given list of bills:
 * 100: $120.10
 * ...
 * 90550: $550.25
 *
 * Count as many bills are in between $100 and $9999
 */

r = /\d+:\s\$\d{3,4}\.\d+/g;
const f = (text) => {
  return text.match(r).length;
};
module.exports = f;
