const r = /(\p{P})([a-z]+)\1/gimu;
const f = (text) => {
  const matches = [...text.matchAll(r)];
  return matches.map((m) => m[2]);
};

module.exports = f;

//Sol #2
// const rFull = /([\p{P}])[a-z]+\1/giu; // Ищет симметричные куски: #danger#
// const rClean = /[a-z]+/gi; // Вырезает только буквы

// const f = (text) => {
//   const targets = text.match(rFull) || [];
//   // Очищаем каждый найденный кусок от символов
//   return targets.map((t) => t.match(rClean)[0]);
// };
