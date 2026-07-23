/*
 * Count how many lines start with The
 */

const r = /^The/gim;
const f = (text) => {
  return text.match(r)?.length || 0;
};

/**
 * Сложность: 3 — якорь ^ (с флагом /m это "начало строки", а не только начало текста)
 */
module.exports = f;
