const f = (api) => {
  const length = api.getLength();

  for (let sorted = 0; sorted < length - 1; sorted++) {
    let minIndex = sorted;
    let minValue = api.get(sorted);

    for (let i = sorted + 1; i < length; i++) {
      const currentValue = api.get(i);
      if (currentValue < minValue) {
        minValue = currentValue;
        minIndex = i;
      }
    }

    if (minIndex !== sorted) {
      api.set(minIndex, api.get(sorted));
      api.set(sorted, minValue);
    }
  }
};

module.exports = f;
