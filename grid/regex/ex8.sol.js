/*
 * Check if a message is valid: it should contain xo 2 or 3 times (xoxo or xoxoxo)
*/

const r = /(^|\s)(xo){2,3}(\s|$)/
const f = (text) => {
  return Boolean(text.match(r));
}

/**
 * Сложность: 4 = Знания 3 + Жирность 1
 * Знания 3 — группы с альтернацией (^|\s) и (\s|$) вокруг квантификатора {2,3}
 * Жирность 1 — 21 символ, короткий паттерн
 */
module.exports = f
