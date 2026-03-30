const f = require("./ex31.js");

describe(":: Running test case for EX31 (#RGB HEX Colors)", () => {
  it("1️⃣ should find standard 3 and 6 digit HEX codes", () => {
    const text = "Colors: #fff, #000000, #F0A, #abcdef, #123456";
    const result = f(text);
    expect(result).toEqual(["#fff", "#000000", "#F0A", "#abcdef", "#123456"]);
  });

  it("2️⃣ should find HEX codes with alpha channel (4 and 8 digits)", () => {
    const text = "Transparent colors: #ff00ffaa, #f00f";
    const result = f(text);
    expect(result).toEqual(["#ff00ffaa", "#f00f"]);
  });

  it("3️⃣ should not match invalid HEX strings", () => {
    const text = "Invalid: #ff, #12345, #1234567, #gggggg, #z12, #123456789";
    const result = f(text);
    expect(result).toEqual([]);
  });

  it("4️⃣ should respect boundaries (no partial matches inside words)", () => {
    const text = "Example: id#abc, width:100#fff, my#color#is#f00";
    // Здесь #abc и #fff не должны захватиться, если они прилипли к буквам
    // (зависит от логики \b, в данном случае ожидаем чистые совпадения)
    const result = f(text);
    expect(result).toEqual(["#abc", "#fff", "#f00"]);
  });

  it("5️⃣ should pick multiple codes from a sentence with punctuation", () => {
    const text = "Check #abc; then #112233. Also #AABBCCDD!";
    const result = f(text);
    expect(result).toEqual(["#abc", "#112233", "#AABBCCDD"]);
  });

  it("6️⃣ should be case-insensitive", () => {
    const text = "Mixed: #aBc, #Def0, #1a2B3c";
    const result = f(text);
    expect(result).toEqual(["#aBc", "#Def0", "#1a2B3c"]);
  });
});
