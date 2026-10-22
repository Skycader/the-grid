const f = (password) => /^[\x21-\x7E]+$/.test(password);
module.exports = f;
