/**
 * Ex31
 * Find all the valid HEX color codes in the text. f(text) returns an array of the codes, in the order
 * of the text ([] when there are none).
 * A color can be written as #RGB, #RGBA, #RRGGBB or #RRGGBBAA.
 * The characters are 0-9, a-f, A-F.
 * No letters or digits may follow the code (it must not be a part of a longer word).
 *
 * In short: a code is # and exactly 3, 4, 6 or 8 hex digits, and the next character is not a letter, a
 * digit or "_". The code is returned as it is written, with the #.
 *
 * Examples:
 *   "Colors: #fff, #000000, #F0A, #abcdef, #123456"  →  ["#fff", "#000000", "#F0A", "#abcdef", "#123456"]
 *   "Transparent colors: #ff00ffaa, #f00f"           →  ["#ff00ffaa", "#f00f"]
 *   "Check #abc; then #112233. Also #AABBCCDD!"      →  ["#abc", "#112233", "#AABBCCDD"]
 *   "Invalid: #ff, #12345, #1234567, #gggggg, #z12, #123456789"  →  []
 *   "#abcg #abcdefg"                                 →  []      (a letter right after the code)
 *   ""                                               →  []
 */

module.exports = f;
