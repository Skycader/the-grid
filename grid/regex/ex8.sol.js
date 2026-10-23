const f = txt => /(?:^|\s)(?:xo){2,3}(?:\s|$)/.test(txt);
module.exports = f;
