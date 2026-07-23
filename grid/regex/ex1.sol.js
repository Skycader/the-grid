/*
 * Ex 1
 * Remove all words `cat`
 */

const r =
  /cat/g; /*g means findMany and without means findOne*/
const f = (text) => {
  /*code here */
  return text.replace(r, '');
};

/**
 * Сложность: 1 — голый литерал, никаких метасимволов кроме флага /g
 */
module.exports = f;
