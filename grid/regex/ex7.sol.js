/*
 * Replace all the and The with a 
*/

const r = /(t|T)he/g
const f = text => {
  return text.replace(r, 'a')
}

/**
 * Сложность: 4 = Знания 3 + Жирность 1
 * Знания 3 — группа с альтернацией (t|T)
 * Жирность 1 — 7 символов, короткий паттерн
 */
module.exports = f
