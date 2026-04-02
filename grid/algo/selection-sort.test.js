class Api {
  #arr = []; #it = 0;
  constructor(arr) { this.#arr = arr; }
  get(i) { this.#it++; return this.#arr[i]; }
  set(i, v) { this.#it++; this.#arr[i] = v; }
  getLength() { this.#it++; return this.#arr.length; }
  get iterations() { return this.#it; }
}
const f = require("./selection-sort.js");
