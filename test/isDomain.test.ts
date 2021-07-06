import isDomain from '../src/isDomain';

describe('domain validator', () => {
  it("should pass Apache's DomainValidatorTest#testValidDomains", () => {
    expect(isDomain('apache.org')).toBeTruthy();
    expect(isDomain('www.google.com')).toBeTruthy();

    expect(isDomain('test-domain.com')).toBeTruthy();
    expect(isDomain('test---domain.com')).toBeTruthy();
    expect(isDomain('test-d-o-m-a-i-n.com')).toBeTruthy();
    expect(isDomain('as.uk')).toBeTruthy(); // two-letter domain label

    expect(isDomain('ApAchE.Org')).toBeTruthy(); // case-insensitive

    expect(isDomain('z.com')).toBeTruthy(); // single-character domain label

    expect(isDomain('i.have.an-example.domain.name')).toBeTruthy();
  });

  it("should pass Apache's DomainValidatorTest#testInvalidDomains", () => {
    expect(isDomain('.org')).toBeFalsy(); // bare TLD
    expect(isDomain(' apache.org ')).toBeFalsy(); // domain name with spaces
    expect(isDomain('apa che.org')).toBeFalsy(); // domain name containing spaces
    expect(isDomain('-testdomain.name')).toBeFalsy(); // domain name starting with dash
    expect(isDomain('testdomain-.name')).toBeFalsy(); // domain name ending with dash
    expect(isDomain('---c.com')).toBeFalsy(); // domain name starting with multiple dashes
    expect(isDomain('c--.com')).toBeFalsy(); // domain name ending with multiple dashes
    expect(isDomain('apache.rog')).toBeFalsy(); // domain name with invalid TLD

    expect(isDomain('http://www.apache.org')).toBeFalsy(); // URL
    expect(isDomain(' ')).toBeFalsy(); // Empty string
    expect(isDomain(null)).toBeFalsy(); // null
  });

  it("should pass Apache's DomainValidatorTest#testAllowLocal", () => {
    // Default won't allow local
    expect(isDomain('localhost.localdomain')).toBeFalsy();
    expect(isDomain('localhost')).toBeFalsy();

    // But it may be requested
    expect(isDomain('localhost.localdomain', true)).toBeTruthy();
    expect(isDomain('localhost', true)).toBeTruthy();
    expect(isDomain('hostname', true)).toBeTruthy();
    expect(isDomain('machinename', true)).toBeTruthy();

    // Check the localhost one with a few others
    expect(isDomain('apache.org', true)).toBeTruthy();
    expect(isDomain(' apache.org ', true)).toBeFalsy();
  });

  it("should pass Apache's DomainValidatorTest#testIDN", () => {
    expect(isDomain('www.xn--bcher-kva.ch')).toBeTruthy();

    expect(isDomain('www.b\u00fccher.ch')).toBeTruthy();
    expect(isDomain('xn--d1abbgf6aiiy.xn--p1ai')).toBeTruthy();
    expect(isDomain('президент.рф')).toBeTruthy();
    // expect(isDomain('www.\uFFFD.ch')).toBeFalsy(); // punycode library bug
  });

  it("should pass Apache's DomainValidatorTest#testRFC2396domainlabel", () => {
    expect(isDomain('a.ch')).toBeTruthy();
    expect(isDomain('9.ch')).toBeTruthy();
    expect(isDomain('az.ch')).toBeTruthy();
    expect(isDomain('09.ch')).toBeTruthy();
    expect(isDomain('9-1.ch')).toBeTruthy();
    expect(isDomain('91-.ch')).toBeFalsy();
    expect(isDomain('-.ch')).toBeFalsy();
  });

  it("should pass Apache's DomainValidatorTest#testValidator297", () => {
    expect(isDomain('xn--d1abbgf6aiiy.xn--p1ai')).toBeTruthy();
  });

  it("should pass Apache's DomainValidatorTest#testValidator306", () => {
    const longString =
      'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz0123456789A';

    expect(longString.length).toBe(63);

    expect(isDomain(longString + '.com')).toBeTruthy();
    expect(isDomain(longString + 'x.com')).toBeFalsy();

    const longDomain =
      longString +
      '.' +
      longString +
      '.' +
      longString +
      '.' +
      longString.substring(0, 57);

    expect(longDomain.length).toBe(249);

    expect(isDomain(longDomain + '.com'));
    expect(isDomain(longDomain + 'x.com'));
  });
});
