const f = (text) => text.replace(/<b>[\s\S]*?<\/b>/g, "BTAG");
module.exports = f;
