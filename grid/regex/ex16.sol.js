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
 * Сложность: 7 = Знания 5 + Жирность 2
 * Знания 5 — символьный класс \p{P} (Unicode-свойство)
 * Жирность 2 — 35 символов, на границе коротких/средних
 */
module.exports = f;
