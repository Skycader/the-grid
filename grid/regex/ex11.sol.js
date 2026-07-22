/**
 * Given list of bills:
 * 100: $120.10
 * ...
 * 90550: $550.25
 *
 * Count as many bills are more than $100
 */

const f = (text) => {
  const r = /\d+:\s\$0*[1-9]\d{2,}(\.\d+)*/gm;
  return text.match(r)?.length || 0;
};

/**
 * Сложность: 4 = Знания 3 + Жирность 1
 * Знания 3 — есть группа (\.\d+)* поверх классов/квантификаторов
 * Жирность 1 — 29 символов, короткий паттерн
 */
module.exports = f;
