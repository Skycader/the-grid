/**
 * Given list of bills:
 * 100: $120.10
 * ...
 * 90550: $550.25
 *
 * Count as many bills are less than $100
 */

r = /\d+:\s\$\d{0,2}\.\d+/g;
const f = (text) => {
  return text.match(r).length;
};

/**
 * Сложность: 2 — только квантификатор {0,2}, групп/якорей нет
 */
module.exports = f;
