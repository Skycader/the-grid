const f = (txt) => {
  const r = /\bl[^o]l\b/g;
  return txt.replace(r, 'l*l');
};
module.exports = f;
