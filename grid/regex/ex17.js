/**
 * Ex17
 * Trim &nbsp; (non-break space) in the given text.
 *
 * Every run of two or more &nbsp; in a row becomes one &nbsp;. A single &nbsp; and everything else
 * stay as they are. &nbsp; is the entity exactly as written here (lower case, with the ampersand and
 * the semicolon); a space or any other character between two &nbsp; breaks the run.
 *
 * Examples:
 *   "Now that&nbsp;&nbsp;know me well"        →  "Now that&nbsp;know me well"
 *   "a&nbsp;&nbsp;&nbsp;&nbsp;b"              →  "a&nbsp;b"
 *   "a&nbsp;b&nbsp;&nbsp;c&nbsp;&nbsp;&nbsp;d"  →  "a&nbsp;b&nbsp;c&nbsp;d"
 *   "this&nbsp;is"                            →  "this&nbsp;is"            (a single one stays)
 *   "a&nbsp; &nbsp;b"                         →  "a&nbsp; &nbsp;b"         (a space between: not a run)
 *   "&nbsp&nbsp; &amp;nbsp;&amp;nbsp;"        →  unchanged                 (not the entity)
 *   ""                                        →  ""
 */

const f = (text) => {
  const r = /sample/;
  return;
};

module.exports = f;
