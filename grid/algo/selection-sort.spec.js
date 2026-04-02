class Api {
  #arr = [];
  #iterations = 0;
  constructor(arr) {
    this.#arr = arr;
  }

  get(index) {
    this.#iterations++;
    return this.#arr[index];
  }

  set(index, value) {
    this.#iterations++;
    this.#arr[index] = value;
  }

  getLength() {
    this.#iterations++;
    return this.#arr.length;
  }

  getArray() {
    this.#iterations += this.#arr.length;
    return this.#arr;
  }

  get iterations() {
    return this.#iterations;
  }

  get isSorted() {
    for (let i = 0; i < this.#arr.length - 1; i++) {
      if (this.#arr[i] > this.#arr[i + 1]) {
        return false;
      }
    }
    return true;
  }
}

const f = require("./selection-sort.js");

describe("::Running tests for selection sort...", () => {
  const array = new Api([5, 4, 3, 2, 1]);
  f(array);

  it("should sort array within given time", () => {
    expect(array.iterations).toBeLessThanOrEqual(51);
  });

  it("should sort array", () => {
    console.log(
      `Результат работы функции: `,
      array.getArray(),
      ` ожидается [1,2,3,4,5]`,
    );
    expect(array.getArray()).toEqual([1, 2, 3, 4, 5]);
  });
});
