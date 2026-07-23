/*
 * Remove all Mr. and Mrs.
 */

const f = (txt) => {
  const r = /Mrs?\./g;
  return txt.replace(r, "");
};

/**
 * Сложность: 2 — квантификатор ? (необязательный символ), групп/якорей нет
 */
module.exports = f;
