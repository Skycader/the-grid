/*
 * Ex10
 * Find all lol words like lel lil lal and change them to l*l but don't change lol itself.
 *
 * A match is: l, one lower case letter and l. When the middle letter is anything but o, the match
 * becomes l*l; lol stays lol. Everything else stays untouched.
 * The middle must be a letter: l1l, l.l and "l l" are not matches.
 *
 * Examples:
 *   "lol lal lil lel lol lul"    →  "lol l*l l*l l*l lol l*l"
 *   "lyl lzl lbl"                →  "l*l l*l l*l"
 *   "lol lool ll l1l l.l l l"    →  unchanged          (lol itself; not one letter between the l)
 *   "lolal"                      →  "lol*l"            (only the last l?l is a match)
 *   "lal, lel! (lil)"            →  "l*l, l*l! (l*l)"
 *   ""                           →  ""
 */

module.exports = f;
