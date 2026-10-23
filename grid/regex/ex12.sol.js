const f = txt => (txt.match(/\d+:\s\$0*\d{1,2}(?!\d)(?:\.\d+)?/g) || []).length;
module.exports = f;
