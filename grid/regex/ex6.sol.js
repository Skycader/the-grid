/*
 * remove digits 0-5 and capitals fro ma string
*/

const r = /([A-Z]|[0-5])/g
const f = text => {
  return text.replace(r, '')
}

/**
 * Сложность: 4 = Знания 3 + Жирность 1
 * Знания 3 — группа с альтернацией (a|b): [A-Z] или [0-5]
 * Жирность 1 — 13 символов, короткий паттерн
 */
module.exports = f
