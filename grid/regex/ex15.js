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
 * Сложность: ★★★★★★★☆☆☆ (7/10)
 */

const r = /^<html>[\w\n\s\p{P}]*<\/html>$/g; //<-- should not have m flag;
const f = (text) => {
  console.log(`${text} => ${r.test(text)}`);
  return r.test(text.trim());
};

module.exports = f;
