/*
 * Ex10
 * Find all lol words like lel lil lal and change them to l*l but don't change lol itself.
 *
 * A match is a whole word: l, ONE character that is not o, then l (lel, lil, lal, lul, l1l, l.l ...).
 * The match becomes l*l; lol stays lol. A word is whole when no letter, digit or "_" touches it from
 * either side: lalel, lalal, slalom, lal1 are not matches. Everything else stays untouched.
 *
 * Examples:
 *   "lol lal lil lel lol lul"    →  "lol l*l l*l l*l lol l*l"
 *   "lyl lzl lbl"                →  "l*l l*l l*l"
 *   "l1l l.l l-l"                →  "l*l l*l l*l"      (any character but o in the middle)
 *   "lal, lel! (lil)"            →  "l*l, l*l! (l*l)"
 *   "lol lool ll"                →  unchanged          (lol itself; not one character between the l)
 *   "lalel lalal slalom lal1"    →  unchanged          (not whole words)
 *   ""                           →  ""
 */

module.exports = f;
