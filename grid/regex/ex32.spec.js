f = require("./ex32.js");

describe("Regexp: Target Acquisition System", () => {
  it("[1] Standard scenario: capture clean targets and ignore traps with numbers", () => {
    const input = "#danger# %dummy1% *missile* @fake99@ &intercept& !shadow77!";
    expect(f(input)).toEqual(["danger", "missile", "intercept"]);
  });

  it("[2] Symmetry check: delimiters must be identical", () => {
    // #target! — разные знаки (игнор), @target@ — одинаковые (захват)
    const input = "#danger! *missile* @fake@ &target#";
    expect(f(input)).toEqual(["missile", "fake"]);
  });

  it("[3] Strict filtering: ignore targets with digits in any position", () => {
    // 1abc, abc2, a3bc — все должны быть проигнорированы
    const input = "*1danger* #missile2# @t3rget@ &clean&";
    expect(f(input)).toEqual(["clean"]);
  });

  it("[4] Case sensitivity: should capture both UPPER and lower case", () => {
    const input = "#DANGER# *Missile* &intercept&";
    const result = f(input).map((s) => s.toLowerCase());
    expect(result).toEqual(["danger", "missile", "intercept"]);
  });

  it("[5] Noise resistance: ignore targets with internal spaces or underscores", () => {
    // Регулярка должна искать "чистое" слово [a-z]+
    const input = "#broken target# *target_one* !valid!";
    expect(f(input)).toEqual(["valid"]);
  });

  it("[6] Edge case: empty input or no valid matches", () => {
    expect(f("no targets here")).toEqual([]);
    expect(f("!!! $$$ %123%")).toEqual([]);
    expect(f("")).toEqual([]);
  });

  it("[7] Unicode support: handle various punctuation markers", () => {
    // Если используешь \p{P}, это должно работать
    const input = "§rocket§ ¿alpha¿ ¡bravo!";
    expect(f(input)).toEqual(["rocket", "alpha"]);
  });
});
