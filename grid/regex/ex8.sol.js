/*
 * Check if a message is valid: it should contain xo 2 or 3 times (xoxo or xoxoxo)
*/

const r = /(^|\s)(xo){2,3}(\s|$)/
const f = (text) => {
  return Boolean(text.match(r));
}

/**
 * Сложность: 4 — группы с плоской альтернацией (^|\s), (\s|$) вокруг {2,3}
 */
module.exports = f
