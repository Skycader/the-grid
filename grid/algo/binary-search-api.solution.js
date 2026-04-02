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
