const compString = require('../src/gatsby/helpers/compString')

describe('test compString', () => {
  it('a > b', () => {
    expect(compString('b', 'a')).toEqual(1);
  });
  it('a == b', () => {
    expect(compString('a', 'a')).toEqual(0);
  });

  it('a < b', () => {
    expect(compString('a', 'b')).toEqual(-1);
  });
});