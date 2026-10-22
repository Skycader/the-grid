const r = /^\s*<html>(?:(?!<\/?html>)[\s\S])*<\/html>\s*$/u;
const f = (text) => r.test(text);
module.exports = f;
