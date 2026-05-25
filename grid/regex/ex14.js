/* Ex14
 * Given text containing one or more URLs, transform each URL into an anchor
 * tag where href is the full URL and link text is the second-level domain.
 *
 * Examples:
 *   "Follow us on https://twitter.com/user/axl" → 'Follow us on <a href="https://twitter.com/user/axl">twitter</a>'
 *   "and https://instagram.com/user/axl" → 'and <a href="https://instagram.com/user/axl">instagram</a>'
 *   "Visit http://example.com" → 'Visit <a href="http://example.com">example</a>'
 *   "Go to https://www.instagram.com/user/axl" → 'Go to <a href="https://www.instagram.com/user/axl">instagram</a>'
 *   "go to https://sub.example.com/path" → 'go to <a href="https://sub.example.com/path">example</a>'
 *   "see https://example.com/some-page" → 'see <a href="https://example.com/some-page">example</a>'
 *   "hello world" → "hello world"
 *   "" → ""
 *
 */

module.exports = f;
