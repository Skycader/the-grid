/*
 * Remove all Mr. and Mrs.
 */

const r =
  /Mrs\./g; /*s? means that to find one s is optional*/
const r2 = /(Mr|Mrs)\./g;
const f = (text) => {
  return text.replace(r, '');
};
module.exports = f;
