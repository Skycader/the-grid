const f = (num) => {
  if (num === undefined) return 0;

  let result = num;

  const next = (num) => {
    if (num === undefined) return result;
    result += num;
    return next;
  };

  return next;
};

module.exports = f;
