const f = txt => (txt.match(/^The/gm) || []).length;
module.exports = f;
