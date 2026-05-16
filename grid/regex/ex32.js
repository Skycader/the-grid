/*

- Ex 32
- Extract only "clean" targets (wrapped in symbols like #, *, &)
- and ignore targets containing any digits.
- #danger! *missile* @fake@ &target# ===> missle fake
- ★Сложность: ★★★☆☆☆☆☆☆ (3/10)  

*/

module.exports = f;
