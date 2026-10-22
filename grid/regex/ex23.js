/*
 * Ex23
 * Find all words like lel lil lal but not lol itself
 * Export r
 * NOTE: use exclude marker for regexp
 *
 * Export ONE regex r with the `g` flag; it is used as text.replace(r, "l*l"), so every found word
 * becomes l*l.
 *
 * A word is: l, one letter that is not o, l — as a whole word (separated from the other
 * letters, digits and "_" by spaces, punctuation, the start or the end of the text).
 * lol is not changed. The middle must be a letter: l1l, l.l and "l l" are not words.
 *
 * Examples (the text after text.replace(r, "l*l")):
 *   "lol lal lil lel lol lul"      →  "lol l*l l*l l*l lol l*l"
 *   "lyl, (lzl) lbl."              →  "l*l, (l*l) l*l."
 *   "lol lolol lalal slalom"       →  unchanged           (lol; not whole words)
 *   "l1l l.l l l ll lool"          →  unchanged           (not one letter between the l)
 *   ""                             →  ""
 */

module.exports = r;
