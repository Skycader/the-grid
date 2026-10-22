const f = (text) => (text.match(/\d+:\s\$0*[1-9]\d{2,3}(?!\d)(?:\.\d+)?/g) || []).length;
module.exports = f;
