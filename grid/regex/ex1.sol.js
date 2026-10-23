const f = (text) => {
  const r = /\bcat\b/gi;
  return text.replace(r, "");
};

module.exports = f;
