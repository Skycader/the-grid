const f = (text) => text.replace(/(?:&nbsp;){2,}/g, "&nbsp;");
module.exports = f;
