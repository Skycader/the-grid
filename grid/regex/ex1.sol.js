/*
 * Ex 1
 * Remove all words `cat`
 */

const r =
  /cat/gi; /*g means findMany and without means findOne; i = case-insensitive (spec has "Cat")*/
const f = (text) => {
  /*code here */
  return text.replace(r, '');
};

/**
 * Сложность: 1 — голый литерал, никаких метасимволов кроме флагов /gi
 */
module.exports = f;
