/*
 * Ex4
 * Find all lol, lal, lil and so on with a dot after them and replace the middle letter with *.
 *
 * A match is: l, one letter, l and a dot (lel. lal. lil. lol. lul.). The middle letter becomes *,
 * the dot stays. Without the dot nothing changes (lol is left alone). Everything else stays untouched.
 *
 * Examples:
 *   "lel. lol lil."      →  "l*l. lol l*l."
 *   "lal. lul. lyl."     →  "l*l. l*l. l*l."
 *   "lol.lol.."          →  "l*l.l*l.."
 *   "lolol."             →  "lol*l."           (only the last l?l. is a match)
 *   "lol lol, lol! lolx" →  unchanged          (no dot right after)
 *   "ll. lool. lo."      →  unchanged          (not one letter between the l)
 */

const f = (text) => {
  const r = /sample/;
  return;
};

module.exports = f;
