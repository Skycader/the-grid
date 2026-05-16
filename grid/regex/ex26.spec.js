const r = require("./ex26.js");

const f = (text) => text.match(r) || [];

describe("Running test cases for ex26", () => {
  it("[1] Basic case: separate price and quantities", () => {
    const text = "I paid $30 for 30 apples and 80 oranges";
    expect(f(text)).toEqual(["30", "80"]);
  });

  it("[2] Decimals case: ignore prices with cents, find integer quantities", () => {
    const text = "The price is $10.99 for 5 liters and 2 packs";
    // Игнорируем $10.99 целиком, забираем 5 и 2
    expect(f(text)).toEqual(["5", "2"]);
  });

  it("[3] Large numbers and edge positions", () => {
    const text = "1000 users spent $5000 to buy 200 units";
    expect(f(text)).toEqual(["1000", "200"]);
  });

  it("[4] Price at the end of string", () => {
    const text = "Quantity is 50, price is $10";
    expect(f(text)).toEqual(["50"]);
  });

  it("[5] Only prices in text: should return empty array", () => {
    const text = "Costs are $10, $20 and $30.50";
    expect(f(text)).toEqual([]);
  });

  it("[6] Quantities with nearby symbols: should not be confused", () => {
    const text = "Buy 5 items (ref: 123) for $99 each";
    expect(f(text)).toEqual(["5", "123"]);
  });
});
