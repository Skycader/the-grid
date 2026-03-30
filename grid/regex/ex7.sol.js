/*
 * Replace all the and The with a 
*/

const r = /(t|T)he/g
const f = text => {
  return text.replace(r, 'a')
}

module.exports = f
