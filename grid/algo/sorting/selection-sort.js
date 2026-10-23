/**
 * Selection sort through an API
 * Write a sorting function that uses the selection sort algorithm and works only through the API:
 * f(api) sorts the array behind the API in place, in ascending order.
 *
 * The API:
 *   api.get(index)         → the item at that index
 *   api.set(index, value)  → puts the value at that index
 *   api.getLength()        → the length of the array (it is free)
 *
 * The algorithm: on every pass find the smallest item of the part that is not sorted yet and put it
 * at the start of that part (one swap per pass). The items are numbers: negative, fractional, equal ones.
 *
 * Requests: every api.get() and api.set() is counted. For an array of n items:
 *   - writes: at most 2 * (n - 1)   (one swap per pass)
 *   - reads: at least n * (n - 1) / 2 (every pass looks at the rest of the array) and at most
 *     n * (n - 1) + 2 * (n - 1)
 *   - an index outside of the array must never be asked for or written
 * The sort() of arrays is forbidden.
 *
 *   n = 5, [5, 4, 3, 2, 1]  →  [1, 2, 3, 4, 5]    10 to 28 reads, up to 8 writes
 *   [3, 1, 2]               →  [1, 2, 3]
 *   [2, 2, 1]               →  [1, 2, 2]
 *   [-1, 0.5, -3]           →  [-3, -1, 0.5]
 *   [1, 2, 3]               →  [1, 2, 3]
 *   [7]                     →  [7]
 *   []                      →  []
 */

const f = (api) => {
  return;
};

module.exports = f;
