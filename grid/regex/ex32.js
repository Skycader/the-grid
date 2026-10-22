/*

- Ex 32
- Extract only "clean" targets (wrapped in symbols like #, *, &)
- Support all possible punctuation symbols
- Allow only letters -> Digits or any other symbol are PROHIBITED
- #danger! *missile* @fake@ &target# #non_2_valid# ===> missile fake

f(text) returns an array of the targets, in the order of the text ([] when there are none).

In short: a target is a word of Latin letters (A-Z a-z, any case) that has the SAME punctuation mark
right before it and right after it: *missile*, @fake@, §rocket§. Punctuation is any punctuation mark,
also non-ASCII ones (§ ¿ ¡ « » “ ”). The word is returned without the marks. A digit, an underscore, a space,
a hyphen or any other symbol inside the marks makes it not a target; so do two different marks (#danger!,
&target#), also the two halves of a bracket pair ((word) [word] {word} «word»).

Examples:
  "#danger! *missile* @fake@ &target# #non_2_valid#"              →  ["missile", "fake"]
  "#danger# %dummy1% *missile* @fake99@ &intercept& !shadow77!"   →  ["danger", "missile", "intercept"]
  "§rocket§ ¿alpha¿ ¡bravo!"                                      →  ["rocket", "alpha"]
  "#DANGER# *Missile*"                                            →  ["DANGER", "Missile"]
  "#broken target# *target_one* #two-words# (word) [word]"        →  []
  ""                                                              →  []
*/

module.exports = f;
