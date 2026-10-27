/**
 * Ex33
 * Return all the clean words of the text, as an array. f(txt) returns the words in the order they stand in
 * the text ([] when there are none).
 *
 * A word is everything between whitespace (spaces, tabs, new lines). A word is CLEAN when it is made of
 * letters only (a-z, A-Z): a dot, an apostrophe, a hyphen, a digit, a comma or any other sign anywhere
 * inside it, at its start or at its end, makes it not clean. A word is taken whole or not at all: a piece
 * of a bigger word is not a word.
 *
 * Examples:
 *   "drop.me x.x rar. .top si'mple i'm fa-i-lure s8s correct"  →  ["correct"]
 *   "drop.me fail over"                                        →  ["fail", "over"]
 *   "Hello World"                                              →  ["Hello", "World"]
 *   "go go go"                                                 →  ["go", "go", "go"]     (every occurrence)
 *   "a\tb\nc\r\nd"                                             →  ["a", "b", "c", "d"]   (tabs and new lines separate words)
 *   "end. start"                                               →  ["start"]              (a dot at the end)
 *   "cat, dog"                                                 →  ["dog"]                (a comma sticks to the word)
 *   "it's 3.14 ok"                                             →  ["ok"]
 *   "snake_case x2 42"                                         →  []                     (underscore, digits)
 *   "drop.me"                                                  →  []                     (not ["drop", "me"])
 *   ""                                                         →  []
 */

const f = txt => {
  const r = /sample/;
  return;
};

module.exports = f;
