/* Given text, such as
 * Follow us on https://twitter.com/123
 * and https://instagram.com/user/123
 *
 * Transform the instances of urls into
 * <a href="https://twitter.com/123">instagram</a>
 */

/** First time attempt yet successful WTF
 * 31.05.2025
 *
 */
const f = (text) => {
  const r = /(https?:\/\/)(\w+)(.com\/*)([\w+\/?]*)/g;
  return text.replace(r, '<a href="$1$2$3$4">$2</a>');
};
