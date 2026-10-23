/*
 * Ex10
 * Find all lol words like lel lil lal and change them to lEl lIl lAl and so on,
 * but don't change lol itself.
 *
 * A match is a whole word: l, ONE character that is not o, then l (lel, lil, lal, lul ...). In the match
 * the middle letter becomes a CAPITAL one, the two l stay as they are: lel → lEl. lol stays lol.
 * A word is whole when no letter, digit or "_" touches it from either side: lalel, lalal, slalom, lal1
 * are not matches. Everything else stays untouched.
 *
 * Examples:
 *   "lol lal lil lel lol lul"    →  "lol lAl lIl lEl lol lUl"
 *   "lyl lzl lbl"                →  "lYl lZl lBl"
 *   "lal, lel! (lil)"            →  "lAl, lEl! (lIl)"
 *   "l1l l.l l-l"                →  unchanged          (no letter in the middle: nothing to capitalize)
 *   "lol lool ll"                →  unchanged          (lol itself; not one character between the l)
 *   "lalel lalal slalom lal1"    →  unchanged          (not whole words)
 *   ""                           →  ""
 */

const f = (text) => {
  const r = /sample/;
  return;
};

module.exports = f;
