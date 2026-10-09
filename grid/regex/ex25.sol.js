const r1 = /(?<=\$)\d+\.\d+/g;
const r2 = /(?<=<title>)(?:.*)(?=<\/title>)/g;
const r3 = /(\w+)(?=:\/\/)/g;

module.exports = [r1, r2, r3];
