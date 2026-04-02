const f = require("./police.js");

const testCase = {
  suspects: {
    Алексей: ["Иван", "Наталья", "Сергей"],
    Сергей: ["Иван", "Света"],
    Наталья: ["Иван", "Света", "Сергей"],
    Игорь: ["Иван", "Наталья"],
  },
  deadPeople: ["Иван", "Наталья"],
  suspects2: {
    Алексей: ["Сергей"],
    Сергей: ["Иван", "Света"],
    Наталья: ["Света", "Сергей", "Иван", "Наталья"],
    Игорь: ["Иван", "Наталья"],
  },
};

const testCase2 = {
  suspects: {
    Алексей: ["Иван", "Наталья", "Сергей", "Игорь"],
    Сергей: ["Иван", "Света"],
    Наталья: ["Иван", "Света", "Сергей"],
    Игорь: ["Иван", "Наталья"],
  },
  deadPeople: ["Иван", "Наталья"],
};

describe(":: Police Department Test Case #1", () => {
  it("should find the criminal", () => {
    expect(f(testCase.suspects, testCase.deadPeople)).toBe("Алексей");
  });
  it("should find the other criminal", () => {
    expect(f(testCase.suspects2, testCase.deadPeople)).toBe("Наталья");
  });
});

describe(":: Police Department Test Case #2", () => {
  it("should find the criminal", () => {
    expect(f(testCase2.suspects, testCase.deadPeople)).toBe("Алексей");
  });
});
