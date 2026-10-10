const f = (api, target) => {
  let start = 0;
  let end = api.getLength() - 1;

  while (start <= end) {
    const mid = Math.floor((start + end) / 2);
    const val = api.get(mid);
    if (val === target) return mid;
    if (val > target) end = mid - 1;
    else start = mid + 1;
  }

  return -1;
};

module.exports = f;
