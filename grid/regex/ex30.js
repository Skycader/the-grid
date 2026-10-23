/**
 * Ex30
 * Among the given text,
 * find all the strings that could be good passwords,
 * that must have capital and lower case, one digit and one of !@#$%^&*
 * Minimal length is 8 symbols
 * Password must NOT have spaces
 * Find all of them
 *
 * f(txt) returns an array of the passwords, in the order of the text ([] when there are none).
 *
 * In short: a password is made of letters A-Z a-z, digits 0-9 and the symbols ! @ # $ % ^ & *; any other
 * character (a space, a comma, a dot, a hyphen, a bracket...) ends it. The password is the whole run of
 * such characters, not a part of it. It is good when the run has at least 8 characters, a capital letter,
 * a lower case letter, a digit and one of the symbols ! @ # $ % ^ & *.
 *
 * Examples:
 *   "My passwords: pass123, Strong#Pass123, weak, P@ssw0rd!"    →  ["Strong#Pass123", "P@ssw0rd!"]
 *   "Password: P@ssw0rd!; another one is Pass#1234."            →  ["P@ssw0rd!", "Pass#1234"]
 *   "XyZ#1234 Abc#1234"                                         →  ["XyZ#1234", "Abc#1234"]
 *   "(Qwerty#123)"                                              →  ["Qwerty#123"]
 *   "P@ss w0rd!, Pass#12 34, Small#1"                           →  []     (a space inside; shorter than 8)
 *   "HelloWorld 12345678! Abcdefg1 Strong-Pass1!"               →  []     (no digit; no letters; no symbol; a hyphen ends the run)
 *   ""                                                          →  []
 */

const f = txt => {
  const r = /sample/;
  return;
};

module.exports = f;
