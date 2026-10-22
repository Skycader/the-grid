/* Ex16
 * Count all comments from the JS code: f(code) returns the number of comments (0 when there are none).
 *
 * Hint: including both single line and multi line comments.
 *
 * A single line comment starts with // and goes to the end of the line.
 * A multi line comment starts with /* and ends with the first star-slash after it (it may take one
 * line or many; block comments do not nest). A comment may stand on a line of its own, after the
 * code, or after spaces and tabs. Every comment counts once, whatever is inside of it.
 *
 * Examples:
 *   "// one"                                   →  1
 *   "const a = 1; // note"                     →  1
 *   "/* one *\/ /* two *\/"                      →  2
 *   "/*\n many\n lines\n*\/"                    →  1
 *   "/* a // b *\/"                            →  1     (the // is inside of the block comment)
 *   "// a /* b"                                →  1     (the /* is inside of the line comment)
 *   "const half = a / b; const r = /ab+c/g;"   →  0     (a division and a regular expression are not comments)
 *   ""                                         →  0
 */

module.exports = f;
