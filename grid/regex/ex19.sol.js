/**
 * Make sure the password consist of only ASCII symbols
 */

const f = (password) => {
  const r = /^[A-Za-z0-9_$\-\p{P}]+$/gu;
  return r.test(password);
};

// const f = (password) => {
//   const r = /^[A-Za-z0-9\p{P}$]+$/gu;
//   return r.test(password);
// };

/**
 * Сложность: 3 — якорь ^$; \p{P} — это класс символов (как \w), не отдельная сложность
 */
module.exports = f;
