const f = (text) => (text.match(/^(?:\d{1,3}\.){3,}\d{1,3}$/gm) || []).length;
module.exports = f;
