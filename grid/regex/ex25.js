/**
 * Ex25
 * Here are 3 tasks for Positive Lookahead and Positive Lookbehind.
 * Export THREE regular expressions, one per task: module.exports = [r1, r2, r3].
 * Every regex must have the `g` flag and is used as text.match(r).
 *
 * 1) From
 * RHX: $431.41
 * MTG: $651.22
 * RTT: $300.00
 * return regex that makes an array of prices, so is 431.41, 651.22 and 300.00
 * A price is a number with a decimal part glued to the `$`; the `$` itself is
 * not part of the match, and neither is a dot that ends the sentence.
 *
 * 2) Extract title from html
 * Given <title>Main title</title> return Main title
 * The tags are not part of the match. An empty <title></title> gives "".
 *
 * 3) Given url, extract protocol
 * https://instagram.com => https
 * http://google.com => http
 * ftp://files.net => ftp
 * A protocol is the word right before "://" (just "http:" or "web:https" is not one).
 *
 * Examples:
 *   "AGX: $23.50, TTX: $54.30"                  r1 →  ["23.50", "54.30"]
 *   "Total $5.00."                              r1 →  ["5.00"]
 *   "23.50 and 5.00 dollars"                    r1 →  null            (no $, no price)
 *   "<html><title>Home - Blog</title></html>"   r2 →  ["Home - Blog"]
 *   "<title></title>"                           r2 →  [""]
 *   "<title>unfinished"                         r2 →  null
 *   "Go to https://a.com or ftp://b.net"        r3 →  ["https", "ftp"]
 *   "https://a.com/go?to=http://b.com"          r3 →  ["https", "http"]
 *   "http://localhost:8080/x"                   r3 →  ["http"]        (a port is not a protocol)
 *   "Note: web:https"                           r3 →  null
 */

module.exports = [r1, r2, r3];
