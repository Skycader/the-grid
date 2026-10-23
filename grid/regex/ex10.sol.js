const f = (txt) => {
  const r = /\bl([^o])l\b/g;
  return txt.replace(r, (match, middle) => "l" + middle.toUpperCase() + "l");
};
module.exports = f;
