/*
 * Ex9
 * Count how many lines start with The.
 * f(text) returns the number of lines (0 when there are none).
 *
 * A line starts with The when the three letters The are the very first characters of the line
 * (a space or a tab before them does not count). Lines are separated by \n (or \r\n).
 * A line is counted once, however many times The stands in it.
 *
 * Examples:
 *   "The most important part\nIs to be yourself\nThe world needs us"       →  2
 *   "You may know the The article"                                         →  0     (not at the start)
 *   "The The The"                                                          →  1     (one line)
 *   "The\nThe\nThe"                                                        →  3
 *   "  The cat\n\tThe dog\nA The"                                          →  0     (a space or a tab first)
 *   ""                                                                     →  0
 */

module.exports = f;
