/*
 * Find all lol words like lel lil lal and change them to l*l but don't change lol itself
 */

const r = /l([a-n]|[p-z])l/gi;
const f = (text) => {
  return text.replace(r, 'l*l');
};

/**
 * Сложность: 4 — группа с плоской альтернацией ([a-n]|[p-z]) — обход буквы "o"
 */
module.exports = f;
