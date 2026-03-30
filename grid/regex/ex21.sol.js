/**
 * Count words that
 * end with the same letter
 * they start with
 * I.e. aqua, astra, mom, text, roar, etc.
 */

/** 08 08 2025 10:34 */
const f = (text) => text.match(/\b(.)(.*?)\1\b/g)?.length || 0;

const f = (text) => {
  const r = /\b(\w)(\w*)\1\b/gm;
  return text.match(r)?.length || 0;
};

module.exports = f;
