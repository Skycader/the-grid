/* Ex14
 * 🎖CERTIFIED 2026-10-23
 * Transform each URL of a text into an anchor <a href="URL">domain</a>, where the link text is the
 * second-level domain (twitter for www.twitter.com).
 * A URL is http:// or https://, a host of at least two names and an optional path.
 *
 * Example:
 *   "Follow us on https://twitter.com/user/axl"
 *     →  'Follow us on <a href="https://twitter.com/user/axl">twitter</a>'
 *
 * Scope:
 *   ✓ http and https; ftp, a bare www.example.com and example.com are not URLs
 *   ✓ subdomains of any depth (www, account, sub.www) never get into the link text
 *   ✓ names with hyphens, digits and "_"; the case of the host is kept in the link text
 *   ✓ paths: several segments, hyphens, a file name (page.html), a query (?q=foo), a fragment (#readme)
 *   ✓ several URLs in a text; a URL at the start and at the end; a URL in brackets or quotes; a comma, an
 *     exclamation mark, a space and a new line end the URL
 *   ✓ everything outside of the URLs stays as it is; a text without URLs and an empty text are unchanged
 *   ✓ the answer is a string
 *   ✓ speed: the timing test (7.6) replaces in short texts again and again — the solution is compared
 *     with the reference one by STRICT mode
 *   ✗ not pinned: a port (:8080), "&" in a query, a dot or "?" right after a path (it is part of the path),
 *     a trailing slash, multi-level TLD (co.uk), IP addresses, upper case protocol (HTTPS://), a URL
 *     glued to a word, percent-encoding
 *
 * Difficulty: ★★★★★★★★☆☆ (8/10)
 */

const f = require("./ex14.js");

// <a href="url">name</a>
const a = (url, name) => `<a href="${url}">${name}</a>`;

describe(":: Running test case for EX14 (URL to anchor)", () => {
  // ==========================================
  // 1️⃣ BASIC
  // ==========================================
  describe("1️⃣ Basic", () => {
    it("1️⃣.1️⃣ should match the example from the task", () => {
      expect(f("Follow us on https://twitter.com/user/axl")).toBe('Follow us on <a href="https://twitter.com/user/axl">twitter</a>');
    });

    it("1️⃣.2️⃣ should transform a URL without a path", () => {
      expect(f("Check https://instagram.com")).toBe('Check <a href="https://instagram.com">instagram</a>');
    });

    it("1️⃣.3️⃣ should transform two URLs of one text", () => {
      expect(f("Follow us on https://twitter.com/user/axl and https://instagram.com/user/axl")).toBe(
        'Follow us on <a href="https://twitter.com/user/axl">twitter</a> and <a href="https://instagram.com/user/axl">instagram</a>',
      );
    });

    it("1️⃣.4️⃣ should always return a string", () => {
      expect(typeof f("https://a.com")).toBe("string");
      expect(typeof f("")).toBe("string");
    });
  });

  // ==========================================
  // 2️⃣ THE PROTOCOL
  // ==========================================
  // One row = one text and its answer. Why these rows: only http and https; a regex that takes any
  // "word://" or a bare host would link ftp and www.
  describe("2️⃣ The protocol", () => {
    const rows = [
      ["http://example.com", a("http://example.com", "example")],
      ["https://example.com", a("https://example.com", "example")],
      ["Visit http://twitter.com", "Visit " + a("http://twitter.com", "twitter")],
      ["visit http://example.com/page", "visit " + a("http://example.com/page", "example")],
      ["ftp://example.com", "ftp://example.com"],
      ["file://example.com", "file://example.com"],
      ["www.example.com", "www.example.com"],
      ["example.com", "example.com"],
      ["//example.com", "//example.com"],
      ["http:/example.com", "http:/example.com"],
      ["https//example.com", "https//example.com"],
      ["https:example.com", "https:example.com"],
      ["mailto:me@example.com", "mailto:me@example.com"],
      ["https://", "https://"],
    ];

    it.each(rows)("2️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 3️⃣ THE HOST
  // ==========================================
  // One row = one URL and its answer. Why these rows: the link text is the name right before the
  // top-level domain, whatever stands before it; the host needs at least two names.
  describe("3️⃣ The host", () => {
    const rows = [
      ["https://instagram.com", a("https://instagram.com", "instagram")],
      ["https://www.instagram.com/user/axl", a("https://www.instagram.com/user/axl", "instagram")],
      ["https://sub.example.com/path", a("https://sub.example.com/path", "example")],
      ["https://account.google.com", a("https://account.google.com", "google")],
      ["https://sub.www.twitter.com/path", a("https://sub.www.twitter.com/path", "twitter")],
      ["https://a.b.c.d.example.com", a("https://a.b.c.d.example.com", "example")],
      ["https://my-site.com", a("https://my-site.com", "my-site")],
      ["https://www.my-site.org/a", a("https://www.my-site.org/a", "my-site")],
      ["https://site42.org", a("https://site42.org", "site42")],
      ["https://42site.org", a("https://42site.org", "42site")],
      ["https://my_site.net", a("https://my_site.net", "my_site")],
      ["https://Example.com", a("https://Example.com", "Example")],
      ["https://WWW.EXAMPLE.COM", a("https://WWW.EXAMPLE.COM", "EXAMPLE")],
      ["https://x.io", a("https://x.io", "x")],
      ["https://example.technology", a("https://example.technology", "example")],
      ["https://localhost", "https://localhost"],
      ["https://com", "https://com"],
    ];

    it.each(rows)("3️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 4️⃣ THE PATH
  // ==========================================
  // One row = one URL and its answer. Why these rows: the whole path belongs to href, with its hyphens,
  // dots, query and fragment; the link text is still only the domain.
  describe("4️⃣ The path", () => {
    const rows = [
      ["https://twitter.com/user/axl", a("https://twitter.com/user/axl", "twitter")],
      ["https://example.com/page", a("https://example.com/page", "example")],
      ["https://example.com/a/b/c/d/e", a("https://example.com/a/b/c/d/e", "example")],
      ["https://example.com/some-page", a("https://example.com/some-page", "example")],
      ["https://example.com/some_page", a("https://example.com/some_page", "example")],
      ["https://example.com/page.html", a("https://example.com/page.html", "example")],
      ["https://example.com/file.tar.gz", a("https://example.com/file.tar.gz", "example")],
      ["https://twitter.com/search?q=foo", a("https://twitter.com/search?q=foo", "twitter")],
      ["https://github.com/user/repo#readme", a("https://github.com/user/repo#readme", "github")],
      ["https://example.com/a?b=c#d", a("https://example.com/a?b=c#d", "example")],
      ["https://example.com/UPPER/Case_1", a("https://example.com/UPPER/Case_1", "example")],
      ["https://example.com/2026/10/23", a("https://example.com/2026/10/23", "example")],
      ["https://example.com/a-b_c.d", a("https://example.com/a-b_c.d", "example")],
    ];

    it.each(rows)("4️⃣.1️⃣ %j → %j", (text, expected) => {
      expect(f(text)).toBe(expected);
    });
  });

  // ==========================================
  // 5️⃣ SEVERAL URLS AND THE SURROUNDINGS
  // ==========================================
  describe("5️⃣ Several URLs and the surroundings", () => {
    it("5️⃣.1️⃣ should transform ALL the URLs, not just the first one", () => {
      expect(f("https://a.com https://b.com https://c.com")).toBe(a("https://a.com", "a") + " " + a("https://b.com", "b") + " " + a("https://c.com", "c"));
    });

    it("5️⃣.2️⃣ should transform URLs on several lines", () => {
      expect(f("https://a.com/x\nhttps://b.org\r\nhttp://c.net/y")).toBe(
        a("https://a.com/x", "a") + "\n" + a("https://b.org", "b") + "\r\n" + a("http://c.net/y", "c"),
      );
    });

    it("5️⃣.3️⃣ should end a URL at a comma", () => {
      expect(f("see https://a.com/x, then https://b.org/y, done")).toBe("see " + a("https://a.com/x", "a") + ", then " + a("https://b.org/y", "b") + ", done");
    });

    it("5️⃣.4️⃣ should leave brackets, quotes and an exclamation mark outside of the link", () => {
      expect(f("(https://a.com/x) [https://b.org] \"https://c.net\" 'https://d.io/z' https://e.com!")).toBe(
        "(" + a("https://a.com/x", "a") + ") [" + a("https://b.org", "b") + '] "' + a("https://c.net", "c") + "\" '" + a("https://d.io/z", "d") + "' " + a("https://e.com", "e") + "!",
      );
    });

    it("5️⃣.5️⃣ should leave a dot that ends a sentence after a URL without a path outside of the link", () => {
      expect(f("Visit https://example.com. Then go home.")).toBe("Visit " + a("https://example.com", "example") + ". Then go home.");
    });

    it("5️⃣.6️⃣ should leave a colon and a semicolon after the host outside of the link", () => {
      expect(f("Site: https://a.com; mirror: https://b.org")).toBe("Site: " + a("https://a.com", "a") + "; mirror: " + a("https://b.org", "b"));
    });

    it("5️⃣.7️⃣ should transform the same URL every time it stands in the text", () => {
      expect(f("https://a.com and https://a.com")).toBe(a("https://a.com", "a") + " and " + a("https://a.com", "a"));
    });

    it("5️⃣.8️⃣ should transform a URL at the very start and at the very end", () => {
      expect(f("https://a.com in the middle https://b.org")).toBe(a("https://a.com", "a") + " in the middle " + a("https://b.org", "b"));
    });

    it("5️⃣.9️⃣ should keep the text around the URLs as it is", () => {
      expect(f("  Hello,\tworld!  https://a.com/x  Bye.  ")).toBe("  Hello,\tworld!  " + a("https://a.com/x", "a") + "  Bye.  ");
    });

    it("5️⃣.1️⃣0️⃣ should transform http and https URLs of different shapes in one text", () => {
      const text = "http://a.com https://www.b-b.org/p?q=1 https://c.d.e.net/x#y";
      expect(f(text)).toBe(a("http://a.com", "a") + " " + a("https://www.b-b.org/p?q=1", "b-b") + " " + a("https://c.d.e.net/x#y", "e"));
    });

    it("5️⃣.1️⃣1️⃣ should transform the URLs and keep the words that look like them", () => {
      expect(f("example.com www.example.com https://example.com ftp://example.com")).toBe("example.com www.example.com " + a("https://example.com", "example") + " ftp://example.com");
    });
  });

  // ==========================================
  // 6️⃣ EDGE CASES
  // ==========================================
  describe("6️⃣ Edge cases", () => {
    it("6️⃣.1️⃣ should return an empty string for an empty input", () => {
      expect(f("")).toBe("");
    });

    it("6️⃣.2️⃣ should return the text unchanged when there are no URLs", () => {
      expect(f("hello world")).toBe("hello world");
      const text = "Hello world. Nothing to link here, only words: 1, 2, 3.";
      expect(f(text)).toBe(text);
    });

    it("6️⃣.3️⃣ should return a text of spaces and new lines unchanged", () => {
      expect(f("  \n\t ")).toBe("  \n\t ");
    });

    it("6️⃣.4️⃣ should not transform the same text twice", () => {
      const once = f("https://a.com/x");
      expect(once).toBe(a("https://a.com/x", "a"));
      expect(f("https://a.com/x")).toBe(once);
    });
  });

  // ==========================================
  // 7️⃣ PERFORMANCE
  // ==========================================
  describe("7️⃣ Performance", () => {
    let urls;
    let longPath;
    let longHost;
    let oneName;
    let noUrls;
    let speed;

    beforeAll(() => {
      urls = "see https://www.example.com/a/b?c=d ".repeat(2000);
      longPath = "https://example.com" + "/a-b".repeat(2000);
      longHost = "https://" + "sub.".repeat(1000) + "example.com";
      oneName = "https://" + "a".repeat(3000);
      noUrls = "http: ".repeat(3000);
      speed = [
        "Follow us on https://twitter.com/user/axl",
        "go to https://sub.example.com/path",
        "(https://a.com), https://b.org!",
        "ftp://example.com www.example.com example.com",
        "Search https://twitter.com/search?q=foo and https://github.com/user/repo#readme",
        "hello world",
      ];
    });

    it("7️⃣.1️⃣ should transform 2 000 URLs correctly and fast", () => {
      const t0 = Date.now();
      const result = f(urls);
      const elapsed = Date.now() - t0;
      expect(result === ("see " + a("https://www.example.com/a/b?c=d", "example") + " ").repeat(2000)).toBe(true);
      expect(elapsed).toBeLessThan(1000);
    });

    it("7️⃣.2️⃣ should transform a URL with a path of 8 000 characters fast", () => {
      const t0 = Date.now();
      const result = f(longPath);
      const elapsed = Date.now() - t0;
      expect(result === a(longPath, "example")).toBe(true);
      expect(elapsed).toBeLessThan(1000);
    });

    it("7️⃣.3️⃣ should transform a URL with 1 000 subdomains fast", () => {
      const t0 = Date.now();
      const result = f(longHost);
      const elapsed = Date.now() - t0;
      expect(result === a(longHost, "example")).toBe(true);
      expect(elapsed).toBeLessThan(1000);
    });

    it("7️⃣.4️⃣ should leave a host of one very long name unchanged, fast", () => {
      const t0 = Date.now();
      const result = f(oneName);
      const elapsed = Date.now() - t0;
      expect(result === oneName).toBe(true);
      expect(elapsed).toBeLessThan(1000);
    });

    it("7️⃣.5️⃣ should leave a long text without URLs unchanged, fast", () => {
      const t0 = Date.now();
      const result = f(noUrls);
      const elapsed = Date.now() - t0;
      expect(result === noUrls).toBe(true);
      expect(elapsed).toBeLessThan(1000);
    });

    // The timing test: most of the spec's run time is spent here, so STRICT mode compares the player's
    // function with the reference one on exactly this work (6 000 replacements in short texts).
    it("7️⃣.6️⃣ should stay fast on a lot of short texts", () => {
      let total = 0;
      for (let i = 0; i < 1000; i++) {
        for (let j = 0; j < speed.length; j++) total += f(speed[j]).length;
      }
      expect(total).toBe(1000 * 360);
    });
  });
});
