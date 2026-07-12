const binarySearch = require("./alg1.js");

class Api {
  #arr = [];
  iterations = 0;
  constructor(arr) {
    this.#arr = arr;
  }

  get(index) {
    this.iterations++;
    return this.#arr[index];
  }

  getLength() {
    return this.#arr.length;
  }
}

describe("binarySearch: fixed small array", () => {
  let api;

  beforeEach(() => {
    // Сбрасываем Api перед каждым тестом, чтобы очистить iterations
    api = new Api([1, 2, 3, 10, 11, 20]);
  });

  test("required index 1/2", () => {
    expect(binarySearch(api, 2)).toBe(1);
  });

  test("required iterations 2/2", () => {
    binarySearch(api, 2);
    expect(api.iterations).toBeLessThanOrEqual(4);
  });
});

describe("binarySearch: middle target", () => {
  const length = 1000;
  // Точечно: диапазон до 1 000 000 сводит шанс дубликатов к нулю, защищая тест на индекс
  const arr = generateSortedRandomArray(length, 1, 1000000);

  // Точечно: выбираем случайный индекс вместо жестко зашитого 500
  const randomIndex = Math.floor(Math.random() * length);
  const target = arr[randomIndex];

  let api;

  beforeEach(() => {
    // Пересоздаем Api перед каждым тест-кейсом
    api = new Api(arr);
  });

  test("required index 1/2", () => {
    expect(binarySearch(api, target)).toBe(randomIndex);
  });

  test("required iterations 2/2", () => {
    binarySearch(api, target);
    // Для 1000 элементов худший случай — 10 итераций. Подходит под любой randomIndex
    expect(api.iterations).toBeLessThanOrEqual(10);
  });
});

describe("binarySearch: middle target (stress test)", () => {
  // Запускаем стресс-тест на 100 итераций, чтобы гарантированно поймать 11-й шаг
  const STRESS_RUNS = 100;

  test("should find target at correct index and within 10 iterations across multiple random arrays", () => {
    for (let i = 0; i < STRESS_RUNS; i++) {
      const length = 1000;
      // Каждый раз генерируем новый массив, чтобы проверить разные комбинации индексов
      const arr = generateSortedRandomArray(length, 1, 1000000);

      const randomIndex = Math.floor(Math.random() * length);
      const target = arr[randomIndex];

      const api = new Api(arr);

      // 1. Проверяем корректность индекса
      expect(binarySearch(api, target)).toBe(randomIndex);

      // 2. Проверяем строгое ограничение по итерациям (для 1000 элементов максимум 10)
      // Если ваш код делает 11 шагов, этот ассерт точно упадет на одном из 100 прогонов
      expect(api.iterations).toBeLessThanOrEqual(10);
    }
  });
});

//Dependencies
//####################################################

function generateSortedRandomArray(length, min, max) {
  // Генерируем массив случайных чисел
  const randomArray = Array.from(
    { length },
    () => Math.floor(Math.random() * (max - min + 1)) + min,
  );

  // Сортируем массив
  const sortedArray = randomArray.sort((a, b) => a - b);

  return sortedArray;
}
