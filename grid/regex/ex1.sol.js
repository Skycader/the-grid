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
module.exports = f;
