const f = (api) => {
  const length = api.getLength();

  for (let sorted = 0; sorted < length - 1; sorted++) {
    let minIndex = sorted;
    let minValue = api.get(sorted); // Сохраняем, чтобы меньше читать

    for (let i = sorted + 1; i < length; i++) {
      const currentValue = api.get(i);
      if (currentValue < minValue) {
        minValue = currentValue;
        minIndex = i;
      }
    }

    // Делаем swap только если нашли элемент меньше текущего
    if (minIndex !== sorted) {
      const temp = api.get(sorted);
      api.set(sorted, api.get(minIndex));
      api.set(minIndex, temp);
    }
  }
};
