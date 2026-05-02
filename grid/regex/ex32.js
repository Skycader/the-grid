/*

- Ex 2
- Extract only "clean" targets (wrapped in symbols like #, *, &)
- and ignore targets containing any digits.
- ★Сложность: ★★★☆☆☆☆☆☆ (3/10)  

*/

const r = /(\p{P})([a-z]+)\1/gimu;
const f = (text) => {
  const matches = [...text.matchAll(r)];
  return matches.map((m) => m[2]);
};
module.exports = f;
