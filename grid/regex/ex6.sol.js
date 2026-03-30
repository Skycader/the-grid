/*
 * remove digits 0-5 and capitals fro ma string
*/

const r = /([A-Z]|[0-5])/g
const f = text => {
  return text.replace(r, '')
}
module.exports = f
