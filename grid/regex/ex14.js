/* Ex14
 * Given text containing one or more URLs, transform each URL into an anchor
 * tag where href is the full URL and link text is the second-level domain.
 *
 * Examples:
 *
 * [1]  "Follow us on https://twitter.com/user/axl"
 *      → 'Follow us on <a href="https://twitter.com/user/axl">twitter</a>'
 *
 * [2]  "and https://instagram.com/user/axl"
 *      → 'and <a href="https://instagram.com/user/axl">instagram</a>'
 *
 * [3]  "Visit http://example.com"
 *      → 'Visit <a href="http://example.com">example</a>'
 *
 * [4]  "Go to https://www.instagram.com/user/axl"
 *      → 'Go to <a href="https://www.instagram.com/user/axl">instagram</a>'
 *
 * [5]  "go to https://sub.example.com/path"
 *      → 'go to <a href="https://sub.example.com/path">example</a>'
 *
 * [6]  "see https://example.com/some-page"
 *      → 'see <a href="https://example.com/some-page">example</a>'
 *
 * [7]  "Check https://instagram.com"
 *      → 'Check <a href="https://instagram.com">instagram</a>'
 *
 * [8]  "Visit https://twitter.com"
 *      → 'Visit <a href="https://twitter.com">twitter</a>'
 *
 * [9]  "visit http://example.com/page"
 *      → 'visit <a href="http://example.com/page">example</a>'
 *
 * [10] "Go to https://account.google.com"
 *      → 'Go to <a href="https://account.google.com">google</a>'
 *
 * [11] "Visit https://my-site.com"
 *      → 'Visit <a href="https://my-site.com">my-site</a>'
 *
 * [12] "hello world"
 *      → "hello world"
 *
 * [13] ""
 *      → ""
 *
 * Known limitations (still should pass):
 *
 * [14] "Search https://twitter.com/search?q=foo"
 *      → 'Search <a href="https://twitter.com/search?q=foo">twitter</a>'
 *
 * [15] "See https://github.com/user/repo#readme"
 *      → 'See <a href="https://github.com/user/repo#readme">github</a>'
 *
 * [16] "Docs at https://example.com/page.html"
 *      → 'Docs at <a href="https://example.com/page.html">example</a>'
 *
 * [17] "https://sub.www.twitter.com/path"
 *      → '<a href="https://sub.www.twitter.com/path">twitter</a>'
 */

module.exports = f;
