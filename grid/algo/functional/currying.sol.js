/**
 * Solution of 19 june 2024 22:17
 *
 *
 */

const f = (num) => {
  if (num === undefined) return 0;

  let result = 0 + num;

  const f2 = (num) => {
    if (num === undefined) return result;
    result += num;
    return f2;
  };

  return f2;
};
