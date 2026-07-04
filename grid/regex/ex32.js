/*

- Ex 32
- Extract only "clean" targets (wrapped in symbols like #, *, &)
- Support all possible punctuaiton symbols
- Allow only letters -> Digits or any other symbol are PROHIBITED
- #danger! *missile* @fake@ &target# #non_2_valid# ===> missle fake  
*/

module.exports = f;
