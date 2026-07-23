/*
 * lel. lol lil. => l*l. lol l*l.
 */

const r = /l.l\./g;
const r2 = /l(o|i)l\./g;
const f = (text) => {
  return text.replace(r, 'l*l.');
};

/**
 * Сложность: 1 — только `.` (любой символ), групп/классов/якорей нет
 * (r2 с группой-альтернацией существует, но в f не используется)
 */
module.exports = f;
