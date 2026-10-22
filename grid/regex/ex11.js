/**
 * Ex11
 * Given a list of bills, one bill per line:
 * 100: $120.10
 * ...
 * 90550: $550.25
 *
 * Count how many bills are more than or equal to $100. f(text) returns the number (0 when there are none).
 *
 * A bill is a line "<id>: $<amount>": the id is digits, then a colon and a space, then $ and the amount.
 * The amount may have a decimal part ($100, $100.50). Leading zeros do not change the value:
 * $0100 is $100. A line that is not a bill is not counted.
 *
 * Examples:
 *   "1: $1.00\n2: $100.00\n3: $550.16"          →  2
 *   "3: $99.99\n4: $100\n5: $100.01"            →  2     (exactly $100 counts, $99.99 does not)
 *   "5: $0100\n6: $00099.99"                    →  1     (zeros in front do not change the value)
 *   "invalid line\n2: $abc\n3: 100.00\n4: $150.00"  →  1  (only the last line is a bill)
 *   ""                                          →  0
 */

module.exports = f;
