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

/**
 * Сложность: 2 — только квантификатор {3,4}, групп/якорей нет
 */
module.exports = f;
