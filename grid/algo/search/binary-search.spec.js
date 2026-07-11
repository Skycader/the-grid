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
    this.iterations++;
    return this.#arr.length;
  }
}

describe("binarySearch: fixed small array", () => {
  // Точечно: выносим объявление, чтобы пересоздавать Api перед каждым тестом
  let api;

  beforeEach(() => {
    api = new Api([1, 2, 3, 10, 11, 20]);
  });

  test("required index 1/2", () => {
    expect(binarySearch(api, 2)).toBe(1);
  });

  test("required iterations 2/2", () => {
    // Точечно: перезапускаем поиск в изолированном счетчике
    binarySearch(api, 2);
    expect(api.iterations).toBeLessThanOrEqual(4);
  });
});

describe("binarySearch: middle target", () => {
  // Точечно: увеличили max до 1 000 000, чтобы рандом не создавал дубликаты.
  // Длину ставим 1001, чтобы индекс 500 был ровно математическим центром: (0 + 1000) / 2 = 500
  const arr = generateSortedRandomArray(1001, 1, 1000000);
  const target = arr[500];
  let api;

  beforeEach(() => {
    api = new Api(arr);
  });

  test("required index 1/2", () => {
    expect(binarySearch(api, target)).toBe(500);
  });

  test("required iterations 2/2", () => {
    binarySearch(api, target);
    expect(api.iterations).toBeLessThanOrEqual(10);
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
