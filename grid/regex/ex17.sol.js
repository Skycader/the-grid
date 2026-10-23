const f = txt => txt.replace(/(?:&nbsp;){2,}/g, "&nbsp;");
module.exports = f;
