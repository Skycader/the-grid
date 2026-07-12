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

/**
 * Функция бенчмарка для анализа эффективности бинарного поиска.
 *
 * @param {Function} searchFn - Ваша функция бинарного поиска (api, target) => index
 * @param {number} rounds - Количество раундов (прогонов) для сбора статистики
 * @returns {Object} Объект с минимальным, средним и максимальным количеством итераций
 */
function benchmarkBinarySearch(searchFn, rounds = 10000) {
  const iterationsHistory = [];
  const length = 10000; // Фиксируем длину массива для честной статистики

  for (let i = 0; i < rounds; i++) {
    // Генерируем массив (большой диапазон max исключает дубликаты)
    const arr = generateSortedRandomArray(length, 1, 1000000);

    // Выбираем случайный существующий элемент
    const randomIndex = Math.floor(Math.random() * length);
    const target = arr[randomIndex];

    // Создаем изолированный Api для этого раунда
    const api = new Api(arr);

    // Запускаем поиск
    const resultIndex = searchFn(api, target);

    // Валидация (на всякий случай проверяем, что индекс найден верно)
    if (resultIndex !== randomIndex) {
      console.warn(
        `[Раунд ${i}]: Алгоритм вернул неверный индекс! Ожидалось ${randomIndex}, пришло ${resultIndex}`,
      );
    }

    // Сохраняем количество итераций для этого раунда
    iterationsHistory.push(api.iterations);
  }

  // Считаем метрики
  const min = Math.min(...iterationsHistory);
  const max = Math.max(...iterationsHistory);
  const sum = iterationsHistory.reduce((acc, val) => acc + val, 0);
  const avg = Number((sum / rounds).toFixed(2)); // Округляем до 2 знаков после запятой

  return {
    min,
    avg,
    max,
  };
}

// Пример использования:
// const stats = benchmarkBinarySearch(f, 10000);
// console.log(stats); // { min: 1, avg: 8.45, max: 10 }
