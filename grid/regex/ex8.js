/*
 * Ex8
 * Check if a message is valid: it should contain xo 2 or 3 times (xoxo or xoxoxo).
 * f(message) returns true or false.
 *
 * The message is valid when it has a word (a part between spaces, tabs or new lines, or the start / the
 * end of the message) that is exactly xoxo or xoxoxo in lower case. A word with one xo, four or more xo,
 * or with other letters glued to the xo, does not count.
 *
 * Examples:
 *   "I love you xoxo"        →  true
 *   "I love you xoxoxo"      →  true
 *   "xoxo"                   →  true
 *   "xoxo and xoxoxo"        →  true
 *   "I love you xo"          →  false          (once)
 *   "I love you xo xo"       →  false          (two words with one xo each)
 *   "xoxoxoxo"               →  false          (four times)
 *   "love xoxox"             →  false          (other letters in the word)
 *   ""                       →  false
 */

const f = (message) => {
  const r = /sample/;
  return;
};

module.exports = f;
