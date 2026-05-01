const Api = class {
  #arr = [];
  #reads = 0;
  #writes = 0;

  constructor(arr) {
    // Делаем копию, чтобы тесты были независимыми
    this.#arr = [...arr];
  }

  get(index) {
    if (index < 0 || index >= this.#arr.length) return undefined;
    this.#reads++;
    return this.#arr[index];
  }

  set(index, value) {
    if (index < 0 || index >= this.#arr.length) return;
    this.#writes++;
    this.#arr[index] = value;
  }

  getLength() {
    // В реальных API длина обычно доступна за O(1) и не считается за тяжелую операцию
    return this.#arr.length;
  }

  // Методы для проверки в тестах (не учитываются в статистике)
  get stats() {
    return {
      reads: this.#reads,
      writes: this.#writes,
      total: this.#reads + this.#writes,
    };
  }

  get snapshot() {
    return [...this.#arr];
  }
};

// Подключаем твою функцию
const f = require("./selection-sort.js");

describe("Lvl 2: Selection Sort Saga", () => {
  test("Должен отсортировать перевернутый массив [5, 4, 3, 2, 1]", () => {
    const input = [5, 4, 3, 2, 1];
    const api = new Api(input);

    f(api);

    // 1. Проверка результата
    expect(api.snapshot).toEqual([1, 2, 3, 4, 5]);

    // 2. Проверка алгоритма (Selection Sort делает мало записей)
    // На 5 элементах: 4 прохода, в каждом максимум 1 swap (3 операции записи)
    // Итого записей должно быть <= 12
    expect(api.stats.writes).toBeLessThanOrEqual(15);

    // 3. Проверка сложности (Selection Sort всегда делает ~N^2 сравнений)
    // Для 5 элементов это около 10-20 чтений в циклах
    expect(api.stats.reads).toBeGreaterThan(10);
    expect(api.stats.reads).toBeLessThanOrEqual(30);
  });

  test("Должен корректно работать с уже отсортированным массивом", () => {
    const api = new Api([1, 2, 3]);
    f(api);
    expect(api.snapshot).toEqual([1, 2, 3]);
  });

  test("Должен обрабатывать пустой массив", () => {
    const api = new Api([]);
    f(api);
    expect(api.snapshot).toEqual([]);
  });
});
