const f = (text) => {
  const r = /\b(0[1-9]|1\d|2\d|3[0-1])\/(0[1-9]|1[0-2])\/\d{4}\b/g;
  return text.match(r) || [];
};

module.exports = f;
