const f = (suspects, deadPeople) => {
  for (const [suspect, seenPeople] of Object.entries(suspects)) {
    if (deadPeople.every((deadMan) => seenPeople.includes(deadMan))) return suspect;
  }

  return null;
};

module.exports = f;
