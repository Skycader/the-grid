const f = txt => txt.replace(/<(h[1-6])>(.*?)<\/\1>/g, (match, tag, content) => `<${tag}>${content.toUpperCase()}</${tag}>`);
module.exports = f;
