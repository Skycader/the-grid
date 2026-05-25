/* Ex14
 * Given text containing one or more URLs, such as:
 *   Follow us on https://twitter.com/user/axl
 *   and https://instagram.com/user/axl
 *
 * Transform each URL into an anchor tag where:
 *   - href contains the full URL (protocol + domain + path)
 *   - link text is the second-level domain name only
 *
 * Example:
 *   https://twitter.com/user/axl  →  <a href="https://twitter.com/user/axl">twitter</a>
 *
 * Scope:
 *   ✓ http and https protocols
 *   ✓ subdomains (www, account, sub, etc.)
 *   ✓ paths with hyphens
 *   ✗ query strings (?key=value)  — known limitation
 *   ✗ fragments (#section)        — known limitation
 *   ✗ paths with extensions       — known limitation
 *   ✗ multi-level TLD (co.uk)     — requires Public Suffix List, out of scope
 *
 * Сложность: ★★★★★★★★☆☆ (8/10)
 */

const f = require("./ex14.js");

describe("Regexp 14 - URL to anchor", () => {
  // --- Базовые ---

  test("[1] стандартная ссылка на соцсеть", () => {
    expect(f("Check https://instagram.com")).toBe(
      'Check <a href="https://instagram.com">instagram</a>',
    );
  });

  test("[2] twitter с путём", () => {
    expect(f("Follow us on https://twitter.com/user/axl")).toBe(
      'Follow us on <a href="https://twitter.com/user/axl">twitter</a>',
    );
  });

  test("[3] instagram с путём", () => {
    expect(f("and https://instagram.com/user/axl")).toBe(
      'and <a href="https://instagram.com/user/axl">instagram</a>',
    );
  });

  test("[4] два url в одном тексте", () => {
    expect(
      f(
        "Follow us on https://twitter.com/user/axl and https://instagram.com/user/axl",
      ),
    ).toBe(
      'Follow us on <a href="https://twitter.com/user/axl">twitter</a> and <a href="https://instagram.com/user/axl">instagram</a>',
    );
  });

  // --- Протокол ---

  test("[5] https протокол", () => {
    expect(f("Visit https://twitter.com")).toBe(
      'Visit <a href="https://twitter.com">twitter</a>',
    );
  });

  test("[6] http без s", () => {
    expect(f("Visit http://twitter.com")).toBe(
      'Visit <a href="http://twitter.com">twitter</a>',
    );
  });

  test("[7] http с путём", () => {
    expect(f("visit http://example.com/page")).toBe(
      'visit <a href="http://example.com/page">example</a>',
    );
  });

  // --- Субдомены ---

  test("[8] www субдомен не попадает в текст ссылки", () => {
    expect(f("Go to https://www.instagram.com/user/axl")).toBe(
      'Go to <a href="https://www.instagram.com/user/axl">instagram</a>',
    );
  });

  test("[9] произвольный субдомен", () => {
    expect(f("go to https://sub.example.com/path")).toBe(
      'go to <a href="https://sub.example.com/path">example</a>',
    );
  });

  test("[10] вложенный субдомен (account.google.com)", () => {
    expect(f("Go to https://account.google.com")).toContain(
      '<a href="https://account.google.com">google</a>',
    );
  });

  // --- Путь ---

  test("[11] дефис в пути", () => {
    expect(f("see https://example.com/some-page")).toBe(
      'see <a href="https://example.com/some-page">example</a>',
    );
  });

  test("[12] дефис в домене", () => {
    expect(f("Visit https://my-site.com")).toBe(
      'Visit <a href="https://my-site.com">my-site</a>',
    );
  });

  // --- Прочее ---

  test("[13] текст без url не меняется", () => {
    expect(f("hello world")).toBe("hello world");
  });

  test("[14] пустая строка", () => {
    expect(f("")).toBe("");
  });

  // --- Известные ограничения (ожидается падение) ---

  test("[15] query string — known limitation", () => {
    expect(f("Search https://twitter.com/search?q=foo")).toBe(
      'Search <a href="https://twitter.com/search?q=foo">twitter</a>',
    );
  });

  test("[16] fragment — known limitation", () => {
    expect(f("See https://github.com/user/repo#readme")).toBe(
      'See <a href="https://github.com/user/repo#readme">github</a>',
    );
  });

  test("[17] путь с расширением — known limitation", () => {
    expect(f("Docs at https://example.com/page.html")).toBe(
      'Docs at <a href="https://example.com/page.html">example</a>',
    );
  });

  test("[18] два субдомена — href сломан", () => {
    expect(f("https://sub.www.twitter.com/path")).toBe(
      '<a href="https://sub.www.twitter.com/path">twitter</a>',
    );
  });
});
