const f = (suspects, deadPeople) => {
  for (let [suspect, seenPeople] of Object.entries(suspects)) {
    if (deadPeople.every((deadMan) => seenPeople.includes(deadMan)))
      return suspect;
  }

  return null;
};
