const f = (text) => {
  const r =
    /\bcat\b/gi; /*\b = word boundary (whole word only: not scat, cats, cat5, _cat); g = all matches, not only the first; i = case-insensitive (spec has "Cat")*/
  return text.replace(r, "");
};

module.exports = f;
