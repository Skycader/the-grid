/**
 * Ex20
 * Make all texts within h1, h2, h3 ... h6 tags CAPITAL
 *
 * A heading is an opening tag <h1> ... <h6> and the closing tag of THE SAME level
 * after it: <h3>...</h3>. The text between the tags becomes upper case, the tags
 * stay as they are (lower case) and everything outside of the headings stays untouched.
 * The text of a heading is plain text on one line, without other tags inside.
 *
 * Examples:
 *   "<h1>hello world!</h1>"                         →  "<h1>HELLO WORLD!</h1>"
 *   "<h1>hello</h1>\n<h2>world</h2>"                →  "<h1>HELLO</h1>\n<h2>WORLD</h2>"
 *   "<p>keep me</p><h4>change me</h4> and me"       →  "<p>keep me</p><h4>CHANGE ME</h4> and me"
 *   "<h1>one</h1> and <h2>two</h2>"                 →  "<h1>ONE</h1> and <h2>TWO</h2>"     (text between headings stays)
 *   "<h1>invalid html</h2>"                         →  "<h1>invalid html</h2>"             (the levels differ: not a heading)
 *   "<h1>valid html</h1>\n<h3>invalid html</h6>"    →  "<h1>VALID HTML</h1>\n<h3>invalid html</h6>"
 *   "<h7>x</h7> <header>x</header> <hr>"            →  "<h7>x</h7> <header>x</header> <hr>"  (only h1 ... h6)
 *   "<h2>  sp 4ces, digits 123 & пункт  </h2>"      →  "<h2>  SP 4CES, DIGITS 123 & ПУНКТ  </h2>"
 *   "<h1></h1>"                                     →  "<h1></h1>"
 */

const f = (text) => {
  const r = /sample/;
  return;
};

module.exports = f;
