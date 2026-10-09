const f = (text) => text.match(/\b(\w)(?:\w*\1)?\b/g)?.length || 0;
module.exports = f;
