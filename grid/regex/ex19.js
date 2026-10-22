/**
 * Ex19
 * Make sure the password consist of only ASCII symbols,
 * which is A-Z a-z 0-9 all special symbols including $
 *
 * Input: password only
 * Output: boolean
 *
 * In short: every character of the password is a printable ASCII character, from ! to ~ in the ASCII
 * table (letters, digits and the 32 special symbols). A space, a tab, a new line, a control character and
 * every character outside of ASCII (é, пароль, —, «», 😀, a non-breaking space) make the password invalid.
 * An empty password is invalid.
 *
 * Examples:
 *   "asciipassword"        →  true
 *   "$Raxon123_"           →  true
 *   "P@ss-w0rd!~+=<>|^`"   →  true      (special symbols)
 *   "пароль"               →  false
 *   "pass word"            →  false     (a space)
 *   "pass—word"            →  false     (a long dash is not ASCII)
 *   ""                     →  false
 */

module.exports = f;
