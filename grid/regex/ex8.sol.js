const f = (text) => /(?:^|\s)(?:xo){2,3}(?:\s|$)/.test(text);
module.exports = f;
