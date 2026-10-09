/**
 * Ex27
 * Write regex to test if there is
 * 1) exactly 3 digits in a given string
 * 2) less than 3 digits in a given string
 * 3) 3 or more digits in a given string
 *
 * Export THREE regular expressions: module.exports = [r1, r2, r3].
 * They are used as r.test(text) on the WHOLE string: digits can be anywhere, the rest
 * can be anything (letters, spaces, punctuation, new lines, any language).
 *
 * Examples (digits are 0-9):
 *   "has_1_exact_2_ly_3_digits"   r1 → true    r2 → false   r3 → true
 *   "1234"                        r1 → false   r2 → false   r3 → true
 *   "12"                          r1 → false   r2 → true    r3 → false
 *   ""                            r1 → false   r2 → true    r3 → false
 *   "a1b2c3d"                     r1 → true    r2 → false   r3 → true
 *   "1\n2\n3"                     r1 → true    r2 → false   r3 → true
 */

module.exports = [r1, r2, r3];
