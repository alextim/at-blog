const { compString } = require('../src/lib/comparators');

describe('test compString', () => {
  it('a > b', () => {
    expect(compString('b', 'a')).toBe(1);
  });
  it('a == b', () => {
    expect(compString('a', 'a')).toBe(0);
  });

  it('a < b', () => {
    expect(compString('a', 'b')).toBe(-1);
  });
});
