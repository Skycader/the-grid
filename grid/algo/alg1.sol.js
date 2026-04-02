/**
 * Эталонная функция
 * 20 jan 2025
 */
const binarySearch = (api, target) => {
  const length = api.getLength();

  let start = 0;
  let end = length;

  while (start < end) {
    let middle = Math.floor((start + end) / 2);
    let middleElement = api.get(middle);
    if (target > middleElement) {
      start = middle + 1;
    }

    if (target < middleElement) {
      end = middle - 1;
    }

    if (target === middleElement) {
      return middle;
    }
  }

  return -1;
};
