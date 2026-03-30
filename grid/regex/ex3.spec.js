f = require("./ex3.js");

describe("Regexp", () => {
  it("Test case for ex3", () => {
    expect(f("Google Gooooooogle Gogle goooooooooooogle Yandex Googl")).toBe(
      "Yandex Yandex Gogle Yandex Yandex Googl",
    );
  });
});
