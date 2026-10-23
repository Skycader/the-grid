/* ex15
 * Check if the given text is a valid HTML document: f(txt) returns true or false.
 *
 * A valid document is ONE <html> ... </html> pair: the text starts with <html> and ends with
 * </html> (spaces and new lines around them are fine) and there is no other <html> or </html>
 * inside. What is inside (any text, other tags, new lines) does not matter.
 * The tags are written exactly <html> and </html>: lower case, without attributes.
 *
 * VALID:
 * <html>
 * ...
 * </html>
 *
 * INVALID:
 * <html>...</html><html>...</html>
 * <htmx>...</htmx>
 *
 * Examples:
 *   "<html>\n  Hello, world!\n</html>"     →  true
 *   "<html><p>123</p></html>"              →  true
 *   "  <html></html>\n"                    →  true            (spaces and new lines around are fine)
 *   "<html>html</html>"                    →  true            (the word is not a tag)
 *   "<html>a</html><html>b</html>"         →  false           (two documents)
 *   "<html>a</html></html>"                →  false           (an extra closing tag)
 *   "<html><html>a</html>"                 →  false           (an extra opening tag)
 *   "<htmx> Sounds cool? </htmx>"          →  false
 *   "text <html>a</html>"                  →  false           (something outside of the tags)
 *   "<html>a"                              →  false           (not closed)
 *   ""                                     →  false
 */

const f = txt => {
  const r = /sample/;
  return;
};

module.exports = f;
