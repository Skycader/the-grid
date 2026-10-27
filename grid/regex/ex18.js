/**
 * Ex18
 * Count SPECIAL* IP addresses in the given text. f(txt) returns the number (0 when there are none).
 *
 * *A SPECIAL IP ADDRESS LOOKS LIKE: 192.168.92.102...55.34.204
 * THEY ARE PLACED IN A FORM OF LIST, ONE ON A LINE:
 * 192.168.92.102
 * 255.255.255.255
 * ...
 * 1.1.1.1
 * IN SUMMARY, IT CAN BE ANY LENGTH FROM 4 UNITS TO INFINITY.
 * TASK: COUNT THEM ALL.
 *
 * In short: a special IP address is a whole line made of 4 or more numbers separated by single dots.
 * Every number has 1 to 3 digits; the range is not checked (999.999.999.999 is fine). Any other
 * character on the line (a letter, a space, a dot at the end, a text before or after, a port) makes it not special.
 * Lines end with \n or \r\n; a blank line is just a line with nothing special in it.
 *
 * Examples:
 *   "192.168.92.102"                          →  1
 *   "1.1.1.1\n0.0.0.0\n255.255.255.255"       →  3
 *   "55.16.43.21.56"                          →  1     (5 units)
 *   "92.132.46.312.63.46.1.23.5"              →  1     (9 units)
 *   "999.999.999.999"                         →  1     (the range is not checked)
 *   "007.007.007.007"                         →  1     (leading zeros are digits too)
 *   "1.1.1.1\n1.1.1.1"                        →  2     (the same line twice counts twice)
 *   "2.2.2\n0.0.0"                            →  0     (only 3 units)
 *   "23.23.23.4."                             →  0     (a dot at the end)
 *   "1.1.1.12345"                             →  0     (a number of 5 digits; 4 digits is too much too)
 *   "ip: 1.1.1.1"                             →  0     (a text before)
 *   "1.1.1.1 is the address"                  →  0     (a text after)
 *   "1.1.1.1:8080"                            →  0     (a port after the address)
 *   "(1.1.1.1)"  "1.1.1.1;"                   →  0     (brackets, a semicolon)
 *   "1,1,1,1"  "1-1-1-1"  "1:1:1:1"           →  0     (not dots: another separator)
 *   "1.1.1.1 2.2.2.2"                         →  0     (two addresses in one line)
 *   ""                                        →  0
 */

const f = txt => {
  const r = /sample/;
  return;
};

module.exports = f;
