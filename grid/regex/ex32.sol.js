const f = txt => Array.from(txt.matchAll(/(\p{P})([A-Za-z]+)\1/gu), (m) => m[2]);
module.exports = f;
