const [r1, r2, r3] = require("./ex27.js");

const f1 = (text) => r1.test(text);
const f2 = (text) => r2.test(text);
const f3 = (text) => r3.test(text);

// =============== БАЗОВЫЕ ТЕСТЫ ===============
describe("Базовые тесты для ex27", () => {
  it("ровно 3 цифры", () => {
    expect(f1("has_1_exact_2_ly_3_digits")).toBe(true);
    expect(f1("1234")).toBe(false);
    expect(f1("has_1_notex2act_2_ly_3_dig_4_its")).toBe(false);
  });

  it("меньше 3 цифр", () => {
    expect(f2("1234")).toBe(false);
    expect(f2("12")).toBe(true);
    expect(f2("has1_less_than_2_digits")).toBe(true);
    expect(f2("has1_not_4_less_than_2_di_4gits")).toBe(false);
  });

  it("3 или более цифр", () => {
    expect(f3("h_1_as_mo_2_re_than_3_digits_4")).toBe(true);
    expect(f3("has_1_exact_2_ly_3_digits")).toBe(true);
    expect(f3("1452")).toBe(true);
    expect(f3("12")).toBe(false);
  });
});

// =============== ГРАНИЧНЫЕ СЛУЧАИ ===============
describe("Граничные случаи", () => {
  it("r1: ровно 3 цифры — крайние значения", () => {
    expect(f1("")).toBe(false);
    expect(f1("abc")).toBe(false);
    expect(f1("a1b")).toBe(false);
    expect(f1("a1b2c")).toBe(false);
    expect(f1("123")).toBe(true);
    expect(f1("000")).toBe(true);
    expect(f1("a1!b2@c3#")).toBe(true);
    expect(f1("1234")).toBe(false);
    expect(f1("a1b2c3d")).toBe(true);
    expect(f1("a1b2c3d4")).toBe(false);
  });

  it("r2: меньше 3 цифр — крайние значения", () => {
    expect(f2("")).toBe(true);
    expect(f2("!!!")).toBe(true);
    expect(f2("0")).toBe(true);
    expect(f2("99")).toBe(true);
    expect(f2("a9b")).toBe(true);
    expect(f2("x1y2z")).toBe(true);
    expect(f2("123")).toBe(false);
    expect(f2("000")).toBe(false);
    expect(f2("a1b2c3")).toBe(false);
    expect(f2("1 2")).toBe(true);
  });

  it("r3: 3+ цифр — крайние значения", () => {
    expect(f3("")).toBe(false);
    expect(f3("ab")).toBe(false);
    expect(f3("7")).toBe(false);
    expect(f3("55")).toBe(false);
    expect(f3("000")).toBe(true);
    expect(f3("9999")).toBe(true);
    expect(f3("a5b6c7")).toBe(true);
    expect(f3("1a2b3c4d")).toBe(true);
    expect(f3("!!!123!!!")).toBe(true);
    expect(f3("1 2 3")).toBe(true);
    expect(f3("1".repeat(100))).toBe(true);
  });
});

// =============== ТЕСТЫ НА КАТАСТРОФИЧЕСКИЙ ОТКАТ ===============
describe("Проверка на устойчивость к ReDoS", () => {
  // Генерируем длинную строку из букв, которая НЕ заканчивается цифрой
  // Плохая регулярка с вложенными повторами будет проверять все комбинации
  // пробелов/букв перед тем как сдаться.
  const longEvilString = "a".repeat(10000) + "!";

  it("r1: не зависает на длинных строках без нужного числа цифр", () => {
    // Проверяем 2 цифры в начале и бесконечный хвост
    // Если регулярка использует (.*)* — здесь будет вис
    expect(f1("1a2" + "b".repeat(5000))).toBe(false);
    expect(f1(longEvilString)).toBe(false);
  });

  it("r2: не виснет, если цифр слишком много в конце длинной строки", () => {
    // Создаем строку, где много повторов букв и цифры в самом конце
    // Это заставляет движок делать много откатов, если группы пересекаются
    const manyDigitsAtEnd = "abc".repeat(3000) + "12345";
    expect(f2(manyDigitsAtEnd)).toBe(false);
  });

  it("r3: быстро находит совпадение в начале огромной строки", () => {
    // Даже если строка — миллион символов, r3 должна найти "123" мгновенно
    const giantString = "123" + "x".repeat(100000);
    expect(f3(giantString)).toBe(true);
  });

  it("r1 & r2: исключаем 'ловушку пересечения' (\d* против \D*)", () => {
    // Тест на "амбивалентность": когда движок не знает, какой звездочке отдать символ
    const trickyPattern = "1 2 " + " ".repeat(5000) + " 3";
    // r1: ровно 3 (true)
    // r2: меньше 3 (false)
    expect(f1(trickyPattern)).toBe(true);
    expect(f2(trickyPattern)).toBe(false);
  });
});
