/*
 * Ex6
 * Remove the digits 0-5 and the capital letters from a string.
 *
 * The capital letters are the Latin A-Z. The digits 6-9, the lower case letters, spaces, punctuation
 * and everything else stay as they are.
 *
 * Examples:
 *   "THEstring1234567890"    →  "string6789"
 *   "Hello, World 2026!"     →  "ello, orld 6!"
 *   "abc 678 xyz"            →  "abc 678 xyz"       (nothing to remove)
 *   "ABC012345"              →  ""
 *   "@[/:"                   →  "@[/:"              (the neighbours of A-Z and 0-9 in the ASCII table stay)
 *   ""                       →  ""
 */

module.exports = f;
