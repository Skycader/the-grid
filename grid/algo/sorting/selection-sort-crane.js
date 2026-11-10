/**
 * Selection sort with a harbour crane
 * The array is a row of containers on a quay. Write f(crane): sort the containers in place, ascending,
 * with the selection sort algorithm, using only the controls of the crane.
 *
 * The controls:
 *   crane.scan(index)    → the number on the container in that cell (undefined if the cell is empty)
 *   crane.grab(index)    → the magnet takes the container from that cell; the cell is empty now
 *   crane.put(index)     → puts the container that was grabbed LAST into that (empty) cell
 *   crane.getLength()    → the number of cells in the row (it is free)
 *
 * The magnet holds at most 2 containers. They leave it like in a stack: grab(1) then grab(2), and the
 * first put() releases the container №2, the second one releases the container №1.
 *
 * The algorithm: on every pass find the smallest container of the part that is not sorted yet and put it
 * at the start of that part (one swap per pass). The numbers can be negative, fractional, equal ones.
 *
 * An accident stops the crane at once: a third grab(), grab() from an empty cell, put() with an empty
 * magnet, put() into a cell that is taken, an index outside of the row. The sort() of arrays is forbidden.
 *
 * Requests for n containers:
 *   - grabs: at most 2 * (n - 1), puts: at most 2 * (n - 1) (one swap per pass)
 *   - scans: from n * (n - 1) / 2 to n * (n - 1) + 2 * (n - 1)
 *   - at the end the magnet is empty and every cell is taken
 *
 *   [5, 4, 3, 2, 1]  →  [1, 2, 3, 4, 5]
 *   swap of the cells 0 and 3:  grab(0), grab(3), put(0), put(3)
 *   [-1, 0.5, -3]    →  [-3, -1, 0.5]
 *   [1, 2, 3]        →  [1, 2, 3]   (nothing to move)
 *   []               →  []
 */

const f = (crane) => {
  return;
};

module.exports = f;
