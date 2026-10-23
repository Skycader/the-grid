const f = txt => (txt.match(/\b[a-z]{4}'s\s[cr]at\b/gi) || []).length;
module.exports = f;
