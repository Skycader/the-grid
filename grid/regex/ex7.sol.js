/*
 * Replace all the and The with a 
*/

const r = /(t|T)he/g
const f = text => {
  return text.replace(r, 'a')
}

/**
 * Сложность: 4 — группа с плоской альтернацией (t|T)
 */
module.exports = f
