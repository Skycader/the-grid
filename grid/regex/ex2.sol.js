/*
 * Remove all Mr. and Mrs.
 */

const f = (txt) => {
  const r = /Mrs?\./g;
  return txt.replace(r, "");
};

module.exports = f;
