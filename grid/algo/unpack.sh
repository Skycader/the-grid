cat > binary-search-api.js << 'E1'
/**
 * Given an API, including methods:
 * api.get(index) => get number by index
 * api.getLength() => get length of arr
 *
 * Write a function that binary searches
 * a required value in a given array
 * with minimal requests.
 *
 * const f = (api, target) => {}
 */

module.exports = f;
E1

cat > binary-search-api.solution.js << 'E2'
const binarySearch = (api, target) => {
  const length = api.getLength();
  let start = 0;
  let end = length - 1;
  while (start <= end) {
    let mid = Math.floor((start + end) / 2);
    let midValue = api.get(mid);
    if (target === midValue) return mid;
    if (target > midValue) start = mid + 1;
    else end = mid - 1;
  }
  return -1;
};
E2

cat > binary-search-api.test.js << 'E3'
class Api {
  #arr = [];
  iterations = 0;
  constructor(arr) { this.#arr = arr; }
  get(index) { this.iterations++; return this.#arr[index]; }
  getLength() { this.iterations++; return this.#arr.length; }
}
const binarySearch = require("./binary-search-api.js");
E3

cat > police.js << 'E4'
/** Напиши решение задачи на javaScript */
module.exports = f;
E4

cat > police.solution.js << 'E5'
const f = (suspects, dead) =>
  Object.entries(suspects).find(([suspect, seen]) =>
    dead.every(d => seen.includes(d))
  )?.[0];
E5

cat > police.test.js << 'E6'
const f = require("./police.js");
E6

cat > selection-sort.js << 'E7'
module.exports = f;
E7

cat > selection-sort.solution.js << 'E8'
const f = (api) => {
  const n = api.getLength();
  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i; j < n; j++) {
      if (api.get(j) < api.get(minIdx)) minIdx = j;
    }
    let temp = api.get(i);
    api.set(i, api.get(minIdx));
    api.set(minIdx, temp);
  }
};
E8

cat > selection-sort.test.js << 'E9'
class Api {
  #arr = []; #it = 0;
  constructor(arr) { this.#arr = arr; }
  get(i) { this.#it++; return this.#arr[i]; }
  set(i, v) { this.#it++; this.#arr[i] = v; }
  getLength() { this.#it++; return this.#arr.length; }
  get iterations() { return this.#it; }
}
const f = require("./selection-sort.js");
E9

cat > write.sh << 'E10'
#!/usr/bin/env bash
> all.txt
for file in *; do
  [[ -f "$file" && "$file" != "all.txt" ]] || continue
  echo "═══════════════════════════════════════════════════════════════" >> all.txt
  echo "Файл: $file" >> all.txt
  echo "═══════════════════════════════════════════════════════════════" >> all.txt
  cat "$file" >> all.txt
  echo "" >> all.txt
done
echo "Готово. Результат записан в all.txt"
E10

chmod +x write.sh

echo "========================================"
echo "✅ Файлы созданы:"
ls -1 *.js write.sh