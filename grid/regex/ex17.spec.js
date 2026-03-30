f = require('./ex17.js');

const code = `
Hello, this&nbsp;is my text
Now that&nbsp;&nbsp;know me well,
we can&nbsp;continue.
`;

const done = `
Hello, this&nbsp;is my text
Now that&nbsp;know me well,
we can&nbsp;continue.
`;

describe('Regexp 17', () => {
  it('Test case for ex17', () => {
    expect(f(code)).toBe(done);
  });
});
