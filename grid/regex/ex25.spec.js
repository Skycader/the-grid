const [r1, r2, r3] = require("./ex25.js");

describe("Running test cases for ex25", () => {
  // ==========================================
  // [1] TASK 1: Extract prices
  // ==========================================
  describe("[1] Task 1 - Price Extraction", () => {
    it("[1.1] Should extract clear numbers from formatted text", () => {
      const text = "\nAGX: $23.50\nTTX: $54.30\nARG: $90.00\n";
      expect(text.match(r1)).toEqual(["23.50", "54.30", "90.00"]);
    });

    it("[1.2] Should handle single digits, large numbers, and no spaces", () => {
      const text = "ABC:$1.00,XYZ:$12345.67";
      expect(text.match(r1)).toEqual(["1.00", "12345.67"]);
    });

    it("[1.3] Should return null if no prices are present", () => {
      const text = "No prices here, just text.";
      expect(text.match(r1)).toBeNull();
    });
  });

  // ==========================================
  // [2] TASK 2: Extract title from HTML
  // ==========================================
  describe("[2] Task 2 - HTML Title Extraction", () => {
    it("[2.1] Should extract standard website title", () => {
      const text = "<title>Website title</title>";
      expect(text.match(r2)).toEqual(["Website title"]);
    });

    it("[2.2] Should handle titles with special characters and spaces", () => {
      const text = "<title> Home - My Blog! @2026 </title>";
      expect(text.match(r2)).toEqual([" Home - My Blog! @2026 "]);
    });

    it("[2.3] Should return an empty string inside array for empty tags", () => {
      const text = "<title></title>";
      expect(text.match(r2)).toEqual([""]);
    });
  });

  // ==========================================
  // [3] TASK 3: Extract URL protocols
  // ==========================================
  describe("[3] Task 3 - Protocol Extraction", () => {
    it("[3.1] Should extract standard protocols from list", () => {
      const text =
        "\n  https://wikipedia.org\n  http://website.ru\n  ftp://aloga.top\n";
      expect(text.match(r3)).toEqual(["https", "http", "ftp"]);
    });

    it("[3.2] Should extract protocols embedded inside inline text", () => {
      const text = "Go to https://google.com or secure ftp://file.server";
      expect(text.match(r3)).toEqual(["https", "ftp"]);
    });

    it("[3.3] Should ignore fake protocols without slashes", () => {
      const text = "http:not-a-link.com web:https";
      expect(text.match(r3)).toBeNull();
    });
  });
});
