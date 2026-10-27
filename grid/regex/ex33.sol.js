const f = txt => txt.match(/(?<!\S)[a-z]+(?!\S)/gi) || [];
module.exports = f;
