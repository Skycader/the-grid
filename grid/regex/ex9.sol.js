/*
 * Count how many lines start with The
*/

const r = /^The/gmi
const f = (text) => {
  return text.match(r).length
}
module.exports = f
