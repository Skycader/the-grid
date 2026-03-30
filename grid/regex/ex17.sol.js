/**
 * Trim &nbsp; (non-break space) in the given text.
 */

const r = /(&nbsp;){2,}/g;
const f = (text) => {
  return text.replace(r, '&nbsp;');
};
module.exports = f;
