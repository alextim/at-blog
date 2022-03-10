const { formatPhone } = require('../src/index');

describe('formatPhone', () => {
  it('with empty params', () => {
    expect(formatPhone(undefined)).toBe('');
  });
  it('7', () => {
    expect(formatPhone('1234567')).toBe('123-45-67');
  });
  it('10', () => {
    expect(formatPhone('1234567890')).toBe('123 456-78-90');
  });
  it('12', () => {
    expect(formatPhone('123456789012')).toBe('+12 (345) 678-90-12');
  });
});
