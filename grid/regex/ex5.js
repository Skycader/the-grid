/*
 * Ex5
 * Find people who own a rat or a cat and whose name is just 4 letters long.
 * f(text) returns how many such people there are in the text (a number, 0 when there are none).
 *
 * One owner is: a name of exactly 4 letters (a whole word), then 's, one space and the pet: the whole
 * word cat or rat. The case of the letters does not matter.
 *
 * Examples:
 *   "Jane's cat and Mike's rat and Naomi's dog and Alex's cat and John's dog"  →  3     (Jane Mike Alex)
 *   "Mike's rat"                                                               →  1
 *   "Naomi's cat, Jon's rat, Maximilian's cat"                                 →  0     (the names are not 4 letters long)
 *   "Jane's dog, Mike's mouse, John's cart, Alex's rattle"                     →  0     (not a cat, not a rat)
 *   "Jane cat, Janes cat, Jane's, cat"                                         →  0     (not the form "Name's pet")
 *   ""                                                                         →  0
 */

module.exports = f;
