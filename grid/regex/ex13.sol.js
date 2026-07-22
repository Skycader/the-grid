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
 * Сложность: 3 = Знания 2 + Жирность 1
 * Знания 2 — только квантификатор {3,4}, групп/альтернации нет
 * Жирность 1 — 20 символов, короткий паттерн
 */
module.exports = f;
