/**
 * @jest-environment jsdom
 */

import { toASCII } from '../../../src/helpers/browser/toASCII';

describe('toASCII', () => {
  it('should convert unicode to punycode', () => {
    expect(toASCII('www.b\u00fccher.ch')).toBe('www.xn--bcher-kva.ch');
    expect(toASCII('президент.рф')).toBe('xn--d1abbgf6aiiy.xn--p1ai');
    expect(toASCII('www.\uFFFD.ch')).toBe('');
  });
});
