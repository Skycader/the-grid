/** Task
 * Write a function add that accepts a number and returns a function that accepts the next number,
 * and so on, until it is called without arguments. The call without arguments returns the sum of
 * all the arguments.
 * add(9)(10)() => 19
 *
 * Details:
 *   - the call without arguments ends the chain: it returns a number, not a function
 *   - every call with a number returns a function that can be called again
 *   - 0 is a number like any other (it does not end the chain): add(0)(0)(10)() => 10
 *   - the numbers can be negative or fractional; add() => 0
 *   - every chain has its own sum: two chains started with separate add(...) calls never mix
 *
 * Examples:
 *   add()                   =>  0
 *   add(9)()                =>  9
 *   add(9)(10)()            =>  19
 *   add(4)(4)()             =>  8
 *   add(1)(2)(3)(4)(5)()    =>  15
 *   add(-5)(10)(-3)(7)()    =>  9
 *   add(0)(0)(0)(10)()      =>  10
 *   add(0.5)(0.25)()        =>  0.75
 */

const f = (num) => {
  return;
};

module.exports = f;
