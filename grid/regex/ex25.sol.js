/**
 *
 * Here are 3 tasks for Positive Lookahead and Positive Lookbehind
 * 1) From
 * RHX: $431.41
 * MTG: $651.22
 * RTT: $300.00
 * return regex that makes an array of prices, so is 431.41, 651.22 and 300.00
 *
 * 2) Extract title from html
 * Given <title>Main title</title> return Main title
 *
 * 3) Given url, extract protocol
 * https://instagram.com => https
 * http://google.com => http
 * ftp://files.net => ftp
 */
const r1 = /(?<=\$)[0-9.]+/g;
const r2 = /(?<=<title>)(.*)(?=<\/title)/g;
const r3 = /\b.+(?=:)/g;

module.exports = [r1, r2, r3];

/**
 * Some other solutions
 */

//13.10.2025
const xr1 = /(?<=\$)\d+\.\d+/g;
const xr2 = /(?<=<title>)(?:.*)(?=<\/title>)/g;
const xr3 = /(\w+)(?=:\/\/)/g;
