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

const binarySearch = require("./binary-search-api.js");

describe("binarySearch: middle target", () => {
  const api = new Api([1, 2, 3, 10, 11, 20]);

  test("required index 1/2", () => {
    expect(binarySearch(api, 2)).toBe(1);
  });

  test("required iterations 2/2", () => {
    expect(api.iterations).toBeLessThanOrEqual(4);
  });
});

describe("binarySearch: middle target", () => {
  const arr = generateSortedRandomArray(1000, 1, 10000);
  const target = arr[500];
  const api = new Api(arr);

  test("required index 1/2", () => {
    expect(binarySearch(api, target)).toBe(500);
  });

  test("required iterations 2/2", () => {
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
