const f = txt => txt.match(/\b(\w)(?:\w*\1)?\b/g)?.length || 0;
module.exports = f;
