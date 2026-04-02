/** 04 feb 2025 */
const f = (api) => {
  const length = api.getLength();
  let sorted = 0;
  let minIndex = 0;

  for (let j = 0; j < length; j++) {
    minIndex = sorted;
    for (let i = sorted; i < length; i++) {
      if (api.get(i) < api.get(minIndex)) minIndex = i;
    }
    swap = [api.get(minIndex), api.get(sorted)];
    api.set(sorted, swap[0]);
    api.set(minIndex, swap[1]);
    sorted++;
  }
};
