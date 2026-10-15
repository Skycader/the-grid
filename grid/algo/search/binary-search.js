/**
 * Binary Search
 * Find a number in a sorted array through an API, with the minimal number of requests.
 *
 * The API:
 *   api.get(index)   → the number at that index
 *   api.getLength()  → the length of the array
 *
 * The array is sorted in ascending order and has no duplicates. The numbers can be
 * negative or fractional, and the array can be empty.
 *
 * Write f(api, target): the index of target in the array, or -1 when it is not there.
 *
 * Requests: every api.get() is counted, api.getLength() is free. One search may take
 * at most floor(log2(n)) + 1 requests (n is the length of the array), whether the target
 * is found or not, and an index outside of the array must never be asked for.
 *
 *   n = 1 → 1 request     n = 7 → 3     n = 8 → 4     n = 1000 → 10     n = 1024 → 11
 *
 * Examples (array, target → result):
 *   [1, 2, 3, 10, 11, 20],  2   →  1
 *   [1, 2, 3, 10, 11, 20],  20  →  5      (the last element)
 *   [1, 2, 3, 10, 11, 20],  4   →  -1     (between two elements)
 *   [1, 2, 3, 10, 11, 20],  0   →  -1     (below the smallest)
 *   [1, 2, 3, 10, 11, 20],  21  →  -1     (above the biggest)
 *   [42],                   42  →  0
 *   [42],                   7   →  -1
 *   [],                     5   →  -1     (no requests at all)
 *   [-9, -4, 0, 3, 8],      -4  →  1
 *   [0.1, 0.25, 0.5, 1.75], 0.5 →  2
 */

const f = (api, target) => {
  return;
};

module.exports = f;
