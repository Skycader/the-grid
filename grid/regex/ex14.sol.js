/* Given text, such as
 * Follow us on https://twitter.com/123
 * and https://instagram.com/user/123
 *
 * Transform the instances of urls into
 * <a href="https://twitter.com/123">instagram</a>
 */

/** LATEST SOLUTION:
 * 25.05.2026
 *
 */

const f = (text) => {
  const r = /(https?:\/\/)(([\w-]+\.)*)([\w-]+)(\.\w+)((\/[\w.?#=-]+)*)/g;
  return text.replace(r, '<a href="$1$2$4$5$6">$4</a>');
};
