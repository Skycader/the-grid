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

module.exports =
  /(?=(?:.*[A-Z]))(?=(?:.*[a-z]))(?=(?:.*[0-9]){3,})(?=(?:.*[\p{S}\p{P}]))(?!(?:.*\s)).{24,256}/gu;
module.exports =
  /^(?=.*[A-Z])(?=.*[a-z])(?=(?:.*\d){3,})(?=.*[\p{S}\p{P}])(?!.*\s)[A-Za-z0-9\p{S}\p{P}]{14,256}/u;
module.exports =
  /(?=\S*[A-Za-z0-9\p{S}\p{P}]\S*)(?=\S*[A-Z]\S*)(?=\S*[a-z]\S*)(?=\S*[0-9]\S*)(?=\S*[\p{S}\p{P}]\S*)(?!.*\s.*).{24,256}/u;
