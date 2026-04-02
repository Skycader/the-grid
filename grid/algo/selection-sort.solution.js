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
