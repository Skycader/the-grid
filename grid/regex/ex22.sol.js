/**
 *
 * Replace all texts within <b></b> tags
 * to BTAG
 */

/** 16 MAY 2024 18:34 */
const f = (text) => {
  const r = /<b>[\w\W]*?<\/b>/g;
  return text.replace(r, "BTAG");
};

const f = (text) => {
  const r = /<b>.*?<\/b>/gm;
  return text.replace(r, "BTAG");
};

module.exports = f;
