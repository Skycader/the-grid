const r = /^\s*<html>(?:(?!<\/?html>)[\s\S])*<\/html>\s*$/u;
const f = txt => r.test(txt);
module.exports = f;
