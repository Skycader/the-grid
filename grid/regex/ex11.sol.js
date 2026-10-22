const f = (text) => (text.match(/\d+:\s\$0*[1-9]\d{2,}(?:\.\d+)?/g) || []).length;
module.exports = f;
