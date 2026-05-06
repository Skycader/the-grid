const f = require("./ex14.js");

describe("Regexp 14 - Detailed analysis", () => {
  // [1] Basic transformation check
  it("[1] should replace standard social media links", () => {
    const input = "Check https://instagram.com";
    const output = 'Check <a href="https://instagram.com">instagram</a>';
    expect(f(input)).toBe(output);
  });

  // [2] Protocol flexibility check
  it("[2] should work correctly with http protocol", () => {
    const input = "Visit http://twitter.com";
    const output = 'Visit <a href="http://twitter.com">twitter</a>';
    expect(f(input)).toBe(output);
  });

  // [3] Multiple links in one line
  it("[3] should handle multiple links in a single line", () => {
    const input = "https://instagram.com and https://twitter.com";
    const output =
      '<a href="https://instagram.com">instagram</a> and <a href="https://twitter.com">twitter</a>';
    expect(f(input)).toBe(output);
  });

  // [4] No links case
  it("[4] should return original text if no links are found", () => {
    const text = "Hello world";
    expect(f(text)).toBe(text);
  });

  // [5] Mixed domains check
  it("[5] should handle unknown domains or different subdomains", () => {
    const input = "Go to https://google.com";
    // Check if your logic allows other domains or only specific ones
    expect(f(input)).toContain('<a href="https://google.com">google</a>');
  });
});
