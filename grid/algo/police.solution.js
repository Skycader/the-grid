const f = (suspects, dead) =>
  Object.entries(suspects).find(([suspect, seen]) =>
    dead.every(d => seen.includes(d))
  )?.[0];
