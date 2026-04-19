/**
 * Write regex, that checks if password is trong enough
 * - has at least one upper case letter
 * - has at least one lowercase letter
 * - has at least 3 digits
 * - has special character
 * - has no whitespaces
 * - has length from 12 to 24 symbols
 */

//27.11.2025 00:43
//(?=\S*[A-Z]\S*)(?=\S*[a-z]\S*)(?=\S*[0-9]\S*)(?=\S*[\p{P}\p{S}]\S*)[A-Z-a-z0-9\p{P}\p{S}]{24,256}

const f = (text) => {
  const r =
    /^(?=\S*[A-Z]\S*)(?=\S*[a-z]\S*)(?=(?:\S*[0-9]\S*){3,})(?=\S*[\p{S}\p{P}]\S*)[A-Za-z0-9\p{S}\p{P}]{24,256}$/u;
  return r.test(text);
};

module.exports = f;
