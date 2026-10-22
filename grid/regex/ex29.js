/**
 * Ex29
 * Make a function f(text) that finds all the correct dates in format DD/MM/YYYY
 * and returns them as an array of strings, in the order of the text ([] when there are none).
 *
 * A correct date is: day 01-31, "/", month 01-12, "/", a year of four digits. The day and the month
 * have two digits. A date is a whole word: a letter or a digit glued to it (a01/01/2000,
 * 01/01/20001) makes it not a date. Only the ranges of the day and the month are checked, not the
 * length of the month or leap years.
 *
 * Examples:
 *   "Alan: 22/04/2001; Max: 01/08/2005; Rachel: 55/22/3333;"   →  ["22/04/2001", "01/08/2005"]
 *   "Dates: 01/01/2000 02/02/2022 33/03/2022 12/12/2012"       →  ["01/01/2000", "02/02/2022", "12/12/2012"]
 *   "John:03/03/2003, Tim=30/11/2010!"                         →  ["03/03/2003", "30/11/2010"]
 *   "Last day: 31/12/9999."                                    →  ["31/12/9999"]
 *   "00/01/2020 32/12/1999 15/13/2020 12/00/2000"              →  []            (day or month out of range)
 *   "1/1/2020 2020/01/01 01-01-2020"                           →  []            (another format)
 *   "x01/01/2000 01/01/20001"                                  →  []            (glued to a letter / a digit)
 *   ""                                                         →  []
 */

module.exports = f;
