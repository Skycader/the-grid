const f = txt => txt.replace(/<b>[\s\S]*?<\/b>/g, "BTAG");
module.exports = f;
