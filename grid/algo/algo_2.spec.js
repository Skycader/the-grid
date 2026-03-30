f = require('./algo_2.js');

describe('Fibonacci', () => {
  it('fib(0) = 0',  () => { expect(f(0)).toBe(0); });
  it('fib(1) = 1',  () => { expect(f(1)).toBe(1); });
  it('fib(6) = 8',  () => { expect(f(6)).toBe(8); });
  it('fib(10) = 55', () => { expect(f(10)).toBe(55); });
  it('fib(20) = 6765', () => { expect(f(20)).toBe(6765); });
  it('fib(30) = 832040 (perf test)', () => { expect(f(30)).toBe(832040); });
});
