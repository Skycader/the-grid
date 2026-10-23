/* Ex14
 * Given text containing one or more URLs, transform each URL into an anchor
 * tag where href is the full URL and link text is the second-level domain.
 *
 * A URL is: the protocol http:// or https://, a host and an optional path.
 *   - host: names made of letters, digits, "_" and "-" separated by dots, at least two of them.
 *     The last name is the top-level domain (com), the one before it is the second-level
 *     domain (twitter in www.twitter.com) — it is the link text. The names before them are subdomains.
 *   - path: any number of /segments; a segment is made of letters, digits and the symbols _ . ? # =
 *     and - (so ?q=foo, #readme and page.html belong to the path)
 *   - the URL ends at the first character that cannot be in it (a space, a comma, a bracket, a quote,
 *     an exclamation mark...). Everything else in the text stays as it is.
 * The result is <a href="URL">domain</a> for every URL.
 *
 * Examples:
 *
 * [1]  "Follow us on https://twitter.com/user/axl"
 *      → 'Follow us on <a href="https://twitter.com/user/axl">twitter</a>'
 *
 * [2]  "Visit http://example.com"
 *      → 'Visit <a href="http://example.com">example</a>'
 *
 * [3]  "Go to https://www.instagram.com/user/axl"
 *      → 'Go to <a href="https://www.instagram.com/user/axl">instagram</a>'
 *
 * [4]  "go to https://sub.example.com/path"
 *      → 'go to <a href="https://sub.example.com/path">example</a>'
 *
 * [5]  "https://sub.www.twitter.com/path"
 *      → '<a href="https://sub.www.twitter.com/path">twitter</a>'
 *
 * [6]  "Visit https://my-site.com"
 *      → 'Visit <a href="https://my-site.com">my-site</a>'
 *
 * [7]  "Search https://twitter.com/search?q=foo"
 *      → 'Search <a href="https://twitter.com/search?q=foo">twitter</a>'
 *
 * [8]  "See https://github.com/user/repo#readme"
 *      → 'See <a href="https://github.com/user/repo#readme">github</a>'
 *
 * [9]  "Docs at https://example.com/page.html"
 *      → 'Docs at <a href="https://example.com/page.html">example</a>'
 *
 * [10] "(https://a.com), https://b.org!"
 *      → '(<a href="https://a.com">a</a>), <a href="https://b.org">b</a>!'
 *
 * [11] "ftp://example.com www.example.com example.com"
 *      → "ftp://example.com www.example.com example.com"      (no http / https: not a URL)
 *
 * [12] "hello world"
 *      → "hello world"
 *
 * [13] ""
 *      → ""
 */

const f = txt => {
  const r = /sample/;
  return;
};

module.exports = f;
