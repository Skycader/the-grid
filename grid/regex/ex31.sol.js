const f = txt => txt.match(/#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})\b/gi) || [];
module.exports = f;
