/*
 * Ex 1
 * Remove all words `cat`
 *
 * A word is a WHOLE word: `cat` must not be glued to letters, digits or `_`.
 * Letter case does not matter. Everything else in the text stays untouched
 * (spaces, punctuation, newlines), so removing a word can leave a double space.
 *
 * Examples:
 *   "There are no cat left. Cat is gone"  →  "There are no  left.  is gone"
 *   "cat"                                 →  ""
 *   "CAT cAt cat"                         →  "  "
 *   "a cat, a cat. (cat) 'cat'"           →  "a , a . () ''"
 *   "cat-food and cat's toy"              →  "-food and 's toy"
 *   "cat/dog"                             →  "/dog"
 *
 * Words that merely CONTAIN `cat` are not touched:
 *   "concatenate category scat cats"      →  "concatenate category scat cats"
 *   "bobcat catty catalog"                →  "bobcat catty catalog"
 *   "cat5 5cat _cat cat_ catcat"          →  "cat5 5cat _cat cat_ catcat"
 *
 * Only the real word goes away:
 *   "scat cat cats"                       →  "scat  cats"
 */

const f = txt => {
  const r = //;
  return;
}

module.exports = f;
