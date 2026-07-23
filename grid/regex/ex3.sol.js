/*
 * Replace all possible Google,Goooogle,goooooooooooogle with Yandex
 */

const r = /Gooo*gle/gi;
const f = (text) => {
  return text.replace(r, 'Yandex');
};

/**
 * Сложность: 2 — квантификатор * на одном символе
 */
module.exports = f;
