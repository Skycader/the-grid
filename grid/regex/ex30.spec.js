const f = require("./ex30.js");

describe(":: Running test case for EX30", () => {
  it("1️⃣ should find all the correct passwords in the text", () => {
    const text =
      "My passwords: pass123, Strong#Pass123, weak, StrongPass123#, P@ssw0rd!, HelloWorld, 12345678!, aB3#4567, passWORD123#, #Qwerty123, Small#1, SHORT#1a";

    const result = f(text);

    expect(result).toEqual([
      "Strong#Pass123",
      "StrongPass123#",
      "P@ssw0rd!",
      "aB3#4567",
      "passWORD123#",
      "#Qwerty123",
      "SHORT#1a",
    ]);
  });

  it("2️⃣ should not match words that lack a required character type", () => {
    const invalids = [
      "passwords", // нет цифры и спецсимвола
      "pass123", // нет заглавной буквы и спецсимвола
      "StrongPass", // нет цифры и спецсимвола
      "12345678", // нет букв
      "!!!!!!!!", // нет букв и цифр
      "Abcdefgh", // нет цифры и спецсимвола
      "Abcdefg1", // нет спецсимвола
    ];

    for (const word of invalids) {
      const res = f(word);
      expect(res).toEqual([]);
    }
  });

  it("3️⃣ should correctly handle multiple valid passwords in one line", () => {
    const text = "Try these: XyZ#1234 Abc#1234 Strong#Pass123";
    const result = f(text);
    expect(result).toEqual(["XyZ#1234", "Abc#1234", "Strong#Pass123"]);
  });

  it("4️⃣ should handle punctuation and boundaries correctly", () => {
    const text = "Password: P@ssw0rd!; another one is Pass#1234.";
    const result = f(text);
    expect(result).toEqual(["P@ssw0rd!", "Pass#1234"]);
  });

  it("5️⃣ should not cross spaces or punctuation boundaries", () => {
    const text = "Invalid combos: P@ss w0rd!, Pass#12 34, Stron gPass1";
    const result = f(text);
    expect(result).toEqual([]); // ни одно невалидное не должно совпасть
  });

  it("6️⃣ should return an empty array when no matches found", () => {
    const text = "noValidPasswordsHere!";
    const result = f(text);
    expect(result).toEqual([]);
  });
});
