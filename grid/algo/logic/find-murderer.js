/** Police detective
 *
 * Imagine a police department that investigates several crimes. The police have more urgent work, so they
 * asked you to write a program that finds the criminal from the data they already have.
 *
 * Write f(suspects, deadPeople):
 *   suspects   — an object: the keys are the suspects, the values are arrays of the people that each
 *                suspect saw on the day of the murders
 *   deadPeople — an array with the names of the people the criminal killed
 *
 * The criminal is the one who saw ALL the killed people on that day (and maybe somebody else too — it is
 * not only the killed people). f returns the name of the criminal.
 * If several suspects fit, the first of them in the object is returned; if nobody fits, null.
 * The names are compared exactly (John and john are different people).
 *
 * Example:
 *   const suspects = {
 *     Alex: ["John", "Natalie", "Sergey"],
 *     Sergey: ["John", "Sveta"],
 *     Natalie: ["John", "Sveta", "Sergey"],
 *     Igor: ["John"],
 *   };
 *   const deadPeople = ["John", "Natalie"];
 *   f(suspects, deadPeople)  =>  "Alex"      (the killed people are all among the people he saw)
 *
 *   f({ Alex: ["Sergey"], Igor: ["John", "Natalie"] }, ["John", "Natalie"])  =>  "Igor"
 *   f({ Alex: ["John"], Igor: ["Natalie"] }, ["John", "Natalie"])             =>  null
 *   f({}, ["John"])                                                           =>  null
 */

const f = (suspects, deadPeople) => {
  return;
};

module.exports = f;
