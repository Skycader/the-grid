/*
 * Count how many lines start with The
 */

const r = /^The/gim;
const f = (text) => {
  return text.match(r)?.length || 0;
};

/**
 * Сложность: 3 = Знания 2 + Жирность 1
 * Знания 2 — якорь ^ (с флагом /m это "начало строки", а не только начало текста)
 * Жирность 1 — 4 символа, минимальная длина
 */
module.exports = f;
