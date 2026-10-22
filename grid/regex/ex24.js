/**
 * Ex24
 * Given any telephone number format,
 * transform it into digits only format.
 * +7 987 231 45 23 => 79872314523
 * +7 (987) 231 45-23 => 79872314523
 * etc.
 *
 * In short: f(text) keeps only the digits 0-9, in the same order. Every other character (a plus, a
 * space, a bracket, a hyphen, a dot, a letter, a new line...) is removed.
 *
 * Examples:
 *   "+7 987 231 45 23"            →  "79872314523"
 *   "+7 (987) 231 45-23"          →  "79872314523"
 *   "8 (800) 555-35-35"           →  "88005553535"
 *   "555.123.4567"                →  "5551234567"
 *   "tel: +44 20 7946 0958"       →  "442079460958"
 *   "79872314523"                 →  "79872314523"     (digits only already)
 *   "no digits here"              →  ""
 *   ""                            →  ""
 */

module.exports = f;
