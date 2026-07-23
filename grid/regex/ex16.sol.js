/* Count all comments from the JS code
 *
 * Hint: including both single line and multi line comments.
 *
 */

const r = /(^\/\*[\w\n\s\p{P}]*\*\/$|^\/\/.*$)/gm;

const f = (text) => {
  return text.match(r).length;
};

/**
 * Сложность: 4 — группа с плоской альтернацией (a|b) для двух видов комментариев;
 *            \p{P} внутри класса не считается отдельной сложностью (это как \w)
 */
module.exports = f;
