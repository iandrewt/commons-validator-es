import toASCII from '../../src/helpers/toASCII';

describe('toASCII', () => {
  it('should convert unicode to punycode', async () => {
    expect(toASCII('www.b\u00fccher.ch')).resolves.toBe('www.xn--bcher-kva.ch');
    expect(toASCII('президент.рф')).resolves.toBe('xn--d1abbgf6aiiy.xn--p1ai');
    expect(toASCII('www.\uFFFD.ch')).resolves.toBe('');
  });
});
