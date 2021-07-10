import isDomain from '../src/isDomain';

describe('domain validator', () => {
  it("should pass Apache's DomainValidatorTest#testValidDomains", async () => {
    expect(isDomain('apache.org')).resolves.toBeTruthy();
    expect(isDomain('www.google.com')).resolves.toBeTruthy();

    expect(isDomain('test-domain.com')).resolves.toBeTruthy();
    expect(isDomain('test---domain.com')).resolves.toBeTruthy();
    expect(isDomain('test-d-o-m-a-i-n.com')).resolves.toBeTruthy();
    expect(isDomain('as.uk')).resolves.toBeTruthy(); // two-letter domain label

    expect(isDomain('ApAchE.Org')).resolves.toBeTruthy(); // case-insensitive

    expect(isDomain('z.com')).resolves.toBeTruthy(); // single-character domain label

    expect(isDomain('i.have.an-example.domain.name')).resolves.toBeTruthy();
  });

  it("should pass Apache's DomainValidatorTest#testInvalidDomains", async () => {
    expect(isDomain('.org')).resolves.toBeFalsy(); // bare TLD
    expect(isDomain(' apache.org ')).resolves.toBeFalsy(); // domain name with spaces
    expect(isDomain('apa che.org')).resolves.toBeFalsy(); // domain name containing spaces
    expect(isDomain('-testdomain.name')).resolves.toBeFalsy(); // domain name starting with dash
    expect(isDomain('testdomain-.name')).resolves.toBeFalsy(); // domain name ending with dash
    expect(isDomain('---c.com')).resolves.toBeFalsy(); // domain name starting with multiple dashes
    expect(isDomain('c--.com')).resolves.toBeFalsy(); // domain name ending with multiple dashes
    expect(isDomain('apache.rog')).resolves.toBeFalsy(); // domain name with invalid TLD

    expect(isDomain('http://www.apache.org')).resolves.toBeFalsy(); // URL
    expect(isDomain(' ')).resolves.toBeFalsy(); // Empty string
    expect(isDomain(null)).resolves.toBeFalsy(); // null
  });

  it("should pass Apache's DomainValidatorTest#testAllowLocal", async () => {
    // Default won't allow local
    expect(isDomain('localhost.localdomain')).resolves.toBeFalsy();
    expect(isDomain('localhost')).resolves.toBeFalsy();

    // But it may be requested
    expect(isDomain('localhost.localdomain', true)).resolves.toBeTruthy();
    expect(isDomain('localhost', true)).resolves.toBeTruthy();
    expect(isDomain('hostname', true)).resolves.toBeTruthy();
    expect(isDomain('machinename', true)).resolves.toBeTruthy();

    // Check the localhost one with a few others
    expect(isDomain('apache.org', true)).resolves.toBeTruthy();
    expect(isDomain(' apache.org ', true)).resolves.toBeFalsy();
  });

  it("should pass Apache's DomainValidatorTest#testIDN", async () => {
    expect(isDomain('www.xn--bcher-kva.ch')).resolves.toBeTruthy();

    expect(isDomain('www.b\u00fccher.ch')).resolves.toBeTruthy();
    expect(isDomain('xn--d1abbgf6aiiy.xn--p1ai')).resolves.toBeTruthy();
    expect(isDomain('президент.рф')).resolves.toBeTruthy();
    expect(isDomain('www.\uFFFD.ch')).resolves.toBeFalsy();
  });

  it("should pass Apache's DomainValidatorTest#testRFC2396domainlabel", async () => {
    expect(isDomain('a.ch')).resolves.toBeTruthy();
    expect(isDomain('9.ch')).resolves.toBeTruthy();
    expect(isDomain('az.ch')).resolves.toBeTruthy();
    expect(isDomain('09.ch')).resolves.toBeTruthy();
    expect(isDomain('9-1.ch')).resolves.toBeTruthy();
    expect(isDomain('91-.ch')).resolves.toBeFalsy();
    expect(isDomain('-.ch')).resolves.toBeFalsy();
  });

  it("should pass Apache's DomainValidatorTest#testValidator297", async () => {
    expect(isDomain('xn--d1abbgf6aiiy.xn--p1ai')).resolves.toBeTruthy();
  });

  it("should pass Apache's DomainValidatorTest#testValidator306", async () => {
    const longString =
      'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz0123456789A';

    expect(longString.length).toBe(63);

    expect(isDomain(longString + '.com')).resolves.toBeTruthy();
    expect(isDomain(longString + 'x.com')).resolves.toBeFalsy();

    const longDomain =
      longString +
      '.' +
      longString +
      '.' +
      longString +
      '.' +
      longString.substring(0, 57);

    expect(longDomain.length).toBe(249);

    expect(isDomain(longDomain + '.com')).resolves.toBeTruthy();
    expect(isDomain(longDomain + 'x.com')).resolves.toBeFalsy();
  });
});
