const f = (text) => (text.match(/^The/gm) || []).length;
module.exports = f;
