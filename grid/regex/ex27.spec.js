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

// ... базовые и граничные тесты без изменений ...

// =============== ТЕСТЫ НА ПРОИЗВОДИТЕЛЬНОСТЬ (гарантированно быстрые) ===============
describe("Производительность: ловим катастрофический откат", () => {
  // Эталонные регулярки (оптимальные)
  const r1_opt = /^(?:\D*\d){3}\D*$/;
  const r2_opt = /^(?:\D*\d){0,2}\D*$/;
  const r3_opt = /(?:\D*\d){3}/;

  // 🔥 КРИТИЧЕСКИ ВАЖНО: 70 символов на сегмент — безопасная длина для ЛЮБОГО CPU
  // При 400+ символах — зависание на мощных ПК. При 70 — всегда < 800мс даже для плохих регулярок.
  const segLen = 70;
  const r1_bad =
    "x".repeat(segLen) + "1" + "x".repeat(segLen) + "2" + "x".repeat(segLen); // 2 цифры → должно быть false
  const r2_bad =
    "x".repeat(segLen) +
    "1" +
    "x".repeat(segLen) +
    "2" +
    "x".repeat(segLen) +
    "3" +
    "x".repeat(segLen); // 3 цифры → должно быть false (классический откат!)
  const r3_bad =
    "x".repeat(segLen) + "1" + "x".repeat(segLen) + "2" + "x".repeat(segLen); // 2 цифры → должно быть false

  const measure = (fn, input) => {
    const start = performance.now();
    fn(input);
    return performance.now() - start;
  };

  it("r1: время ≤ 3× от эталона (строка с 2 цифрами, ожидается false)", () => {
    expect(f1(r1_bad)).toBe(false);
    const baseline = measure((t) => r1_opt.test(t), r1_bad);
    const tested = measure(f1, r1_bad);
    expect(tested).toBeLessThanOrEqual(baseline * 3.0);
  }, 1000); // Таймаут 1000 мс — больше не нужно

  it("r2: время ≤ 3× от эталона (строка с 3 цифрами, ожидается false)", () => {
    expect(f2(r2_bad)).toBe(false);
    const baseline = measure((t) => r2_opt.test(t), r2_bad);
    const tested = measure(f2, r2_bad);
    expect(tested).toBeLessThanOrEqual(baseline * 3.0);
  }, 1000);

  it("r3: время ≤ 3× от эталона (строка с 2 цифрами, ожидается false)", () => {
    expect(f3(r3_bad)).toBe(false);
    const baseline = measure((t) => r3_opt.test(t), r3_bad);
    const tested = measure(f3, r3_bad);
    expect(tested).toBeLessThanOrEqual(baseline * 3.0);
  }, 1000);
});
