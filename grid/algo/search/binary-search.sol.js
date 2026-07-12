/**
 * Эталонная функция
 * 12.07.2026
 */

const f = (api, target) => {
  const length = api.getLength();
  let start = 0;
  let end = length - 1;
  let mid = 0;
  let val = 0;

  while (start <= end) {
    mid = Math.floor((start + end) / 2);
    val = api.get(mid);
    if (val === target) {
      return mid;
    }
    if (val > target) {
      end = mid - 1;
      continue;
    }
    if (val < target) {
      start = mid + 1;
    }
  }

  return -1;
};

/**
 * 20 jan 2025
 */
// const f = (api, target) => {
//   const length = api.getLength();
//   let start = 0;
//   let end = length - 1;
//   let mid = 0;
//   let val = 0;

//   while (start <= end) {
//     mid = Math.floor((start + end) / 2);
//     val = api.get(mid);
//     if (val === target) {
//       return mid;
//     }
//     if (val > target) {
//       end = mid - 1;
//     }
//     if (val < target) {
//       start = mid + 1;
//     }
//   }

//   return -1;
// };
