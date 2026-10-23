/**
 * Ex13
 * Given a list of bills, one bill per line:
 * 100: $120.10
 * ...
 * 90550: $550.25
 *
 * Count how many bills are in between $100 and $9999 (both ends count). f(txt) returns the number
 * (0 when there are none).
 *
 * A bill is a line "<id>: $<amount>": the id is digits, then a colon and a space, then $ and the amount.
 * The amount may have a decimal part ($150, $150.25). Leading zeros do not change the value:
 * $0100 is $100. A line that is not a bill is not counted.
 *
 * Examples:
 *   "1: $1.00\n2: $100.00\n3: $550.16"          →  2
 *   "3: $99.99\n4: $100\n5: $9999\n6: $10000"   →  2     ($100 and $9999 count, $99.99 and $10000 do not)
 *   "5: $0100\n6: $00099.99"                    →  1     (zeros in front do not change the value)
 *   "invalid line\n2: $abc\n3: 150.00\n4: $150.00"  →  1 (only the last line is a bill)
 *   ""                                          →  0
 */

const f = txt => {
  const r = /sample/;
  return;
};

module.exports = f;
