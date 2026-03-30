f = require('./regex_2.js');

describe('Extract Emails', () => {
  it('finds one email', () => {
    expect(f('Contact: hello@world.com')).toEqual(['hello@world.com']);
  });
  it('finds multiple', () => {
    expect(f('a@b.com and x@y.org')).toEqual(['a@b.com', 'x@y.org']);
  });
  it('returns empty if none', () => {
    expect(f('no emails here')).toEqual([]);
  });
  it('handles subdomains', () => {
    expect(f('user@mail.example.co.uk ok')).toEqual(['user@mail.example.co.uk']);
  });
});
