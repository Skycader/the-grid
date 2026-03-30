f = require('./regex_4.js');

describe('camel → snake', () => {
  it('simple', () => {
    expect(f('helloWorld')).toBe('hello_world');
  });
  it('multi humps', () => {
    expect(f('myVariableName')).toBe('my_variable_name');
  });
  it('already snake', () => {
    expect(f('already_snake')).toBe('already_snake');
  });
  it('single word', () => {
    expect(f('hello')).toBe('hello');
  });
  it('acronym', () => {
    expect(f('parseHTML')).toBe('parse_h_t_m_l');
  });
});
