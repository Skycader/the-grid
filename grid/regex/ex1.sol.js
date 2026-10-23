const f = txt => {
  const r = /\bcat\b/gi;
  return txt.replace(r, "");
};

module.exports = f;
