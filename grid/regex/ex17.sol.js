/**
 * Trim &nbsp; (non-break space) in the given text.
 */

const r = /(&nbsp;){2,}/g;
const f = (text) => {
  return text.replace(r, '&nbsp;');
};

/**
 * Сложность: 4 — группа (&nbsp;) нужна, чтобы квантификатор {2,} применялся
 *            к целой последовательности символов, а не к одному символу
 */
module.exports = f;
