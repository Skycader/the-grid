const f = (code) => (code.match(/\/\/.*|\/\*[\s\S]*?\*\//g) || []).length;
module.exports = f;
