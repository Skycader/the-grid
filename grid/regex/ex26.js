/**
 * Ex26
 * In a given text, for example
 * === I paid $30 for 30 apples and 80 oranges ===
 * find the quantities of products, such as 30 and 80
 * and omit the prices
 *
 * A price is a number right after a "$": $30, $5000, $10.99 (the cents are a part of the price).
 * A quantity is any other whole number in the text.
 * Export ONE regex with the `g` flag: it is used as text.match(r) and gives the quantities as
 * strings, in the order of the text (null when there are none). A price must not leak into the
 * answer even partly: no "99" from $10.99, no "234" from $1234.
 *
 * Examples:
 *   "I paid $30 for 30 apples and 80 oranges"       →  ["30", "80"]
 *   "The price is $10.99 for 5 liters and 2 packs"  →  ["5", "2"]
 *   "Quantity is 50, price is $10"                  →  ["50"]
 *   "Buy 5 items (ref: 123) for $99 each"           →  ["5", "123"]
 *   "Costs are $10, $20 and $30.50"                 →  null           (only prices)
 *   "no numbers here"                               →  null
 */

const r = /sample/;

module.exports = r;
