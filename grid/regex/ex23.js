/*
 * Ex23
 * Find all lol words like lel lil lal, but not lol itself.
 * Export r
 * NOTE: use exclude marker for regexp
 *
 * Export ONE regex r with the `g` flag; it is used as text.replace(r, "l*l"), so every found word
 * becomes l*l.
 *
 * A word is: l, ONE character that is not o, then l — as a whole word (separated from the other
 * letters, digits and "_" by spaces, punctuation, the start or the end of the text).
 * lol is not changed; lalel, lalal and slalom are not words.
 *
 * Examples (the text after text.replace(r, "l*l")):
 *   "lol lal lil lel lol lul"      →  "lol l*l l*l l*l lol l*l"
 *   "lyl, (lzl) lbl."              →  "l*l, (l*l) l*l."
 *   "l1l l.l l-l"                  →  "l*l l*l l*l"      (any character but o in the middle)
 *   "lol lool ll"                  →  unchanged           (lol itself; not one character between the l)
 *   "lalel lalal slalom lal1"      →  unchanged           (not whole words)
 *   ""                             →  ""
 */

const r = /sample/;

module.exports = r;
