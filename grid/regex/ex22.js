/**
 * Ex22
 * Replace all <b> tags
 * to BTAG
 *
<b>Hello world</b>
<b>Hello world and is wrong</b> <b>This</b>
wow <b>world</b>
===>
BTAG
BTAG BTAG
wow BTAG
 *
 * In short: every <b>...</b> pair, together with everything inside of it (text, other tags, new lines),
 * is replaced with BTAG. The pair is the exact tags <b> and </b> in lower case, the closing tag is the
 * nearest one. Everything outside of the pairs stays as it is.
 *
 * Examples:
 *   "<b>Hello world</b>"                  →  "BTAG"
 *   "<b>a</b> and <b>b</b>"               →  "BTAG and BTAG"
 *   "<b></b>"                             →  "BTAG"
 *   "<b>one <i>two</i> three</b>"         →  "BTAG"          (other tags inside)
 *   "<b>one\ntwo</b>"                     →  "BTAG"          (a new line inside)
 *   "<br> <body> <strong>x</strong> <b>"  →  unchanged       (not the <b>...</b> pair)
 *   ""                                    →  ""
 */

const f = txt => {
  const r = /sample/;
  return;
};

module.exports = f;
