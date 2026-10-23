const f = txt => (txt.match(/^(?:\d{1,3}\.){3,}\d{1,3}$/gm) || []).length;
module.exports = f;
