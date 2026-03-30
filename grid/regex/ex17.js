/**
 * Ex17
 * Trim &nbsp; (non-break space) in the given text.
 * Сложность: ★★★★★☆☆☆☆☆ (5/10)
 */

const r = //;
const f = (text) => {
  return text.replace(r, "&nbsp;");
};
module.exports = f;
