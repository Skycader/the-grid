/* ex15
 * Check if the give text is a valid HTML document
 *
 * VALID:
 * <html>
 * ...
 * </html>
 *
 * INVALID:
 * <html>...</html><html>...</html>
 * <htmx>...</htmx>
 */

const r = /^\s*<html>(?:(?!<\/?html>)[\s\S])*<\/html>\s*$/u;
const f = (text) => {
  return r.test(text.trim());
};

/**
 * Сложность: 8 — tempered greedy token: (?!<\/?html>) проверяется
 *            на КАЖДОЙ итерации (?:...)* , а не один раз — запрещает
 *            встретить ещё один <html>/</html> посередине текста
 */
module.exports = f;
