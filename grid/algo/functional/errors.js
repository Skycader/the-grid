/**
 * Given [key: string]: string[] object,
 * render it into array of [key]: string
 * Example:
 * {
 * username: ['cannot be empty', 'minimal length is 3'],
 * password: ['must contain letters']
 * } => [username cannot be empty, ...]
 *
 * Write f(errors): an array of strings, one string per message: the key, a space, the message.
 * The order is the order of the keys of the object, and inside a key the order of its messages.
 * A key with no messages gives nothing; an empty object gives []. The given object is not changed.
 *
 * Loops (for, while) are forbidden: use the methods of arrays and objects.
 *
 * Examples:
 *   { username: ['cannot be empty', 'minimal length is 3'], password: ['must contain letters'] }
 *     =>  ['username cannot be empty', 'username minimal length is 3', 'password must contain letters']
 *   { email: ['is not valid'] }              =>  ['email is not valid']
 *   { name: [], age: ['must be a number'] }  =>  ['age must be a number']
 *   {}                                       =>  []
 */

const f = (errors) => {
  return;
};

module.exports = f;
