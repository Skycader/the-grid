/**
 * Ex12
 * Given a list of bills, one bill per line:
 * 100: $120.10
 * ...
 * 90550: $550.25
 *
 * Count how many bills are less than $100. f(txt) returns the number (0 when there are none).
 *
 * A bill is a line "<id>: $<amount>": the id is digits, then a colon and a space, then $ and the amount.
 * The amount may have a decimal part ($50, $50.25). Leading zeros do not change the value:
 * $0050 is $50. A line that is not a bill is not counted.
 *
 * Examples:
 *   "1: $1.00\n2: $100.00\n3: $550.16"          →  1
 *   "3: $99.99\n4: $100\n5: $99"                →  2     ($100 is not less than $100)
 *   "5: $0050\n6: $00099.99\n7: $0100"          →  2     (zeros in front do not change the value)
 *   "invalid line\n2: $abc\n3: 50.00\n4: $15.00"    →  1 (only the last line is a bill)
 *   ""                                          →  0
 */

const f = txt => {
  const r = /sample/;
  return;
};

module.exports = f;
