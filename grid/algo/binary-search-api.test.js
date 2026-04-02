class Api {
  #arr = [];
  iterations = 0;
  constructor(arr) { this.#arr = arr; }
  get(index) { this.iterations++; return this.#arr[index]; }
  getLength() { this.iterations++; return this.#arr.length; }
}
const binarySearch = require("./binary-search-api.js");
