/* Count all comments from the JS code
 *
 * Hint: including both single line and multi line comments.
 *
 */

const r = /(^\/\*[\w\n\s\p{P}]*\*\/$|^\/\/.*$)/gm;

const f = (text) => {
  return text.match(r).length;
};

module.exports = f;
