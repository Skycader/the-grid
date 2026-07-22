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
 * Сложность: 3 = Знания 2 + Жирность 1
 * Знания 2 — только квантификатор {0,2}, групп/альтернации нет
 * Жирность 1 — 20 символов, короткий паттерн
 */
module.exports = f;
